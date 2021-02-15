<template>
  <div id="app" tabindex="0"
      @keyup.space="goToCapital()">
    <header-bar
      :stocks="data.stocks"
    ></header-bar>
    <div id="game" v-if="data">
      <div id="central">
        <board
          :mappedCells="data.mapped_cells"
          :capital="data.capital"
          :currentCell=currentCell
          :map="map"
        ></board>
        <production
          :currentCell=currentCell>
        </production>
        <control
          :currentCell=currentCell>
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
  button:hover {
    background: rgb(67, 123, 228);
  }
  button:focus {
    outline:0;
  }
</style>

<script>
  import data from "../data"
  import { EventBus } from "../index"

  import HeaderBar from "./HeaderBar.vue"
  import Board from "./Board.vue"
  import Control from "./Control.vue"
  import SideBar from "./SideBar.vue"
  import Production from "./Production.vue"
  
  import io from 'socket.io-client'

  export default {
    name: "app",
    components: {
      HeaderBar,
      Board,
      Control,
      SideBar,
      Production
    },
    data() {
      return {
        data: data,
        map: {
          x: 20,
          y: 20,
        },
        currentCell: null,
        socket: null,
        connected: false,
        waiting: false,
        message: ''
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
          this.data = data
        })
      },
      play () {
        if (this.socket) {
          this.socket.emit("play", "play")
        }
      },
      goToCapital () {
        EventBus.$emit('go-to-capital')
      }
    },
    created () {
      EventBus.$on('select-cell', cell => {
        this.currentCell = cell
      })
    },
  }
</script>
