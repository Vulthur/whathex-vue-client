<template>
  <div id="app" tabindex="0"
      @keyup.space="goToCapital()">
    <header-bar v-if="playerData"
      :stocks="playerData.stocks"
    ></header-bar>
    <div id="game" v-if="playerData">
      <div id="central">
        <board
          :mappedCells="playerData.mapped_cells"
          :capital="playerData.capital"
          :selectedUnits="selectedUnits"
          :currentCell="currentCell"
          :gameData="gameData"
        ></board>
        <production
          :currentCell="currentCell"
          :gameData="gameData"
          :socket="socket">
        </production>
        <selected-units
          :selectedUnits="selectedUnits"
          :gameData="gameData"
          :socket="socket">
        </selected-units>
        <control
          :stocks="playerData.stocks"
          :gameData="gameData"
          :socket="socket"
          :currentCell="currentCell"
          :selectedUnits="selectedUnits">
        </control>
      </div>
      <!-- <side-bar :currentCell=currentCell></side-bar> -->
    </div>
    <div id="connection" v-else>
      <span id="title">WHATHEX</span>
      <button v-if="!message" type="button" class="button-menu" @click="connect()">CONNECT</button>
      <template v-if="message">
        <button v-if="!waiting" type="button" class="button-menu" @click="play()">PLAY</button>
        <span id="message">{{ message }}</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
    font-family: Helvetica;
    font-weight: 900;
    user-select: none;
    color: white;
  }
  #game {
    display: flex;
  }
  #central {
    width: 100vw;
    height: 100vh;
  }
  #connection {
    width: 100vw;
    height: 100vh;
    background-color: aquamarine;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  #title {
    font-size: 150px;
    margin-bottom: 2%;
  }
  #message {
    font-size: 30px;
  }
  .button-menu {
    width: 150px;
    height: 50px;
    margin-bottom: 1%;
  }
  button {
    cursor: pointer;
    border-radius: 5px;
    background: cornflowerblue;
    border: 1px solid rgb(5, 114, 107);
    font-family: Helvetica;
    font-weight: 900;
    color: white;
  }
  button:hover:enabled {
    background: rgb(67, 123, 228);
  }
  button:disabled {
    background: rgb(145, 162, 193);
    cursor: default;
  }
  button:focus {
    outline:0;
  }
</style>

<script>
  import data from "../data"
  import gameData from "../gameData"
  import { EventBus } from "../index"
  import Vue from 'vue'

  import HeaderBar from "./HeaderBar.vue"
  import Board from "./Board.vue"
  import Control from "./Control.vue"
  import SideBar from "./SideBar.vue"
  import Production from "./Production.vue"
  import SelectedUnits from "./SelectedUnits.vue"
  
  import io from 'socket.io-client'

  export default {
    name: "app",
    components: {
      HeaderBar,
      Board,
      Control,
      SideBar,
      Production,
      SelectedUnits
    },
    data() {
      return {
        playerData: null, //data,
        gameData: null, //gameData,
        currentCell: null,
        socket: null,
        connected: false,
        waiting: false,
        message: '',
        selectedUnits: []
      }
    },
    methods: {
      connect () {
        this.socket = io("ws://localhost:8765/")
        this.message = "CONNECTING ..."
        this.socket.on('connect', () => {
          this.connected = true
        })
        this.socket.on('connect_error', () => {
          this.message = "ERROR CANNOT JOIN THE SERVER"
        })
        this.socket.on('disconnect', () => {
          this.message = "ERROR CANNOT JOIN THE SERVER"
          this.waiting = false
          this.connected = false
        })
        this.socket.on('connected', (event) => {
          this.message = event.message
        })
        this.socket.on('waiting', (event) => {
          this.waiting = true
          this.message = event.message
        })
        this.socket.on('player', (data) => {
          this.playerData = data
          if (this.currentCell && this.currentCell.soil) {
            this.currentCell = this.playerData.mapped_cells.find(cell => cell.index === this.currentCell.index) 
          }
          for (let [index, unit] of this.selectedUnits.entries()) {
            let foundIndex = -1
            for (const cell of this.playerData.mapped_cells) {
              if (cell.military_units[this.gameData.ally_id]) {
                foundIndex = cell.military_units[this.gameData.ally_id].findIndex(u => u.uuid === unit.uuid)
                if (foundIndex !== -1) {
                  Vue.set(this.selectedUnits, index, cell.military_units[this.gameData.ally_id][foundIndex])
                  break
                }
              }
              if (cell.civilian_units[this.gameData.ally_id]) {
                foundIndex = cell.civilian_units[this.gameData.ally_id].findIndex(u => u.uuid === unit.uuid)
                if (foundIndex !== -1) {
                  Vue.set(this.selectedUnits, index, cell.civilian_units[this.gameData.ally_id][foundIndex])
                  break
                }
              }
            }
            if (foundIndex === -1) {
              this.selectedUnits.splice(foundIndex, 1)
            }
          }
        })
        this.socket.on('game-data', (data) => {
          this.gameData = data
          this.$nextTick(() => {
            EventBus.$emit('go-to-capital')
          });
        })
      },
      play () {
        if (this.socket) {
          this.socket.emit("play", "play")
        }
      },
      goToCapital () {
        EventBus.$emit('go-to-capital')
      },
    },
    created () {
      EventBus.$on('select-cell', cell => {
        this.currentCell = cell
      })
      EventBus.$on('remove-unit-selection', unit => {
        let index = this.selectedUnits.findIndex(u => u.uuid === unit.uuid)
        if (index !== -1) {
          this.selectedUnits.splice(index, 1)
        }
      })
      EventBus.$on('clear-unit-selection', () => {
        this.selectedUnits = []
      })
      EventBus.$on("move-units", (cell) => {
        console.log(cell)
        if (!this.playerData || !this.selectedUnits) {
          return
        }
        this.socket.emit("action", {
          "kind": "MOVE",
          "uuid": this.gameData.uuid,
          "cell_id": cell.index,
          "unit_uuids": this.selectedUnits.map(u => u.uuid)
        })
      })
      EventBus.$on('add-unit-selection', (unit) => {
        const index = this.selectedUnits.findIndex(u => u.uuid === unit.uuid)
        if (index === -1) {
          this.selectedUnits.push(unit)
        } else {
          this.selectedUnits.splice(index, 1)
        }
      }) 
    },
  }
</script>
