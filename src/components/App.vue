<template>
  <div id="app" tabindex="0"
      @contextmenu.prevent
      @keyup.ctrl.space.exact="goToCapital()"
      @keyup.space.exact="goToCell"
      @keyup.80.exact="toggleShowPath"
      @keydown.ctrl.65.exact.prevent="addAllUnit()"
      @keydown.ctrl.shift.65.exact.prevent="addAllMilititariesUnit()"
      @keydown.shift.alt.65.exact.prevent="addAllCiviliansUnit()"
      @keydown.ctrl.49.exact.prevent="groupUnit(1)"
      @keydown.ctrl.50.exact.prevent="groupUnit(2)"
      @keydown.ctrl.51.exact.prevent="groupUnit(3)"
      @keydown.ctrl.52.exact.prevent="groupUnit(4)"
      @keydown.ctrl.53.exact.prevent="groupUnit(5)"
      @keydown.ctrl.54.exact.prevent="groupUnit(6)"
      @keydown.ctrl.55.exact.prevent="groupUnit(7)"
      @keydown.ctrl.56.exact.prevent="groupUnit(8)"
      @keydown.ctrl.shift.49.exact.prevent="clearGroupUnit(1)"
      @keydown.ctrl.shift.50.exact.prevent="clearGroupUnit(2)"
      @keydown.ctrl.shift.51.exact.prevent="clearGroupUnit(3)"
      @keydown.ctrl.shift.52.exact.prevent="clearGroupUnit(4)"
      @keydown.ctrl.shift.53.exact.prevent="clearGroupUnit(5)"
      @keydown.ctrl.shift.54.exact.prevent="clearGroupUnit(6)"
      @keydown.ctrl.shift.55.exact.prevent="clearGroupUnit(7)"
      @keydown.ctrl.shift.56.exact.prevent="clearGroupUnit(8)"
      @keydown.49.exact.prevent="selectGroup(1)"
      @keydown.50.exact.prevent="selectGroup(2)"
      @keydown.51.exact.prevent="selectGroup(3)"
      @keydown.52.exact.prevent="selectGroup(4)"
      @keydown.53.exact.prevent="selectGroup(5)"
      @keydown.54.exact.prevent="selectGroup(6)"
      @keydown.55.exact.prevent="selectGroup(7)"
      @keydown.56.exact.prevent="selectGroup(8)"
      @keydown.enter.exact="moveUnit()"
      @keydown.backspace.exact="clearSelectedUnits()"
      @keydown.shift.backspace.exact="stopSelectedUnit()"
      @keydown.up.exact="enterBorder('TOP')"
      @keyup.up.exact="leaveBorder('TOP')"
      @keydown.left.exact="enterBorder('LEFT')"
      @keyup.left.exact="leaveBorder('LEFT')"
      @keydown.right.exact="enterBorder('RIGHT')"
      @keyup.right.exact="leaveBorder('RIGHT')"
      @keydown.down.exact="enterBorder('BOTTOM')"
      @keyup.down.exact="leaveBorder('BOTTOM')"
      @keydown.ctrl.up.exact="moveCurrentCell('TOP')"
      @keydown.ctrl.left.exact="moveCurrentCell('LEFT')"
      @keydown.ctrl.right.exact="moveCurrentCell('RIGHT')"
      @keydown.ctrl.down.exact="moveCurrentCell('BOTTOM')">
    <header-bar v-if="playerData"
      :stocks="playerData.stocks"
    ></header-bar>
    <div id="game" v-if="playerData">
      <div id="central">
        <board
          :mappedCells="playerData.mapped_cells"
          :visionCells="playerData.vision_cells"
          :capital="playerData.capital"
          :selectedUnits="selectedUnits"
          :currentCell="currentCell"
          :showPath="showPath"
          :pathCell="pathCell"
          :gameData="gameData"
        ></board>
        <production
          :currentCell="currentCell"
          :gameData="gameData"
          :socket="socket"
          :indexAction="indexAction">
        </production>
        <selected-units
          :selectedUnits="selectedUnits"
          :gameData="gameData"
          :groups="groups"
          :socket="socket"
          :indexAction="indexAction">
        </selected-units>
        <control
          v-if="currentCell && currentCell.soil"
          :stocks="playerData.stocks"
          :gameData="gameData"
          :socket="socket"
          :currentCell="currentCell"
          :selectedUnits="selectedUnits"
          :indexAction="indexAction">
        </control>
      </div>
      <!-- <side-bar :currentCell=currentCell></side-bar> -->
    </div>
    <div id="connection" v-else>
      <span class="title">WHATHEX</span>
      <button v-if="!message" type="button" class="button-menu" @click="connect()">CONNECT</button>
      <template v-if="message">
        <button v-if="!waiting && connected" type="button" class="button-menu" @click="play()">PLAY</button>
        <span class="message">{{ message }}</span>
      </template>
    </div>
    <div id="disconnected" v-if="!connected && playerData && !winner">
      <span class="title">DISCONNECTED</span>
      <span class="message">RECONNECTION ATTEMPT {{ currentAttempt }}/{{ attemptMax }}</span>
    </div>
    <div id="winner" v-if="winner">
      <span class="title" v-if="winner.id === gameData.ally_id">WIN</span>
      <span class="title" v-else>LOOSE</span>
      <button type="button" class="button-menu" @click="connect()">PLAY AGAIN</button>
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
  #connection, #disconnected, #winner {
    width: 100vw;
    height: 100vh;
    background-color: aquamarine;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  #disconnected, #winner {
    position: absolute;
    background: #00000044;
    top: 0;
    word-break: break-word;
    text-align: center;
  }
  .title {
    font-size: 150px;
    margin-bottom: 2%;
  }
  .message {
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
        attemptMax: 10,
        currentAttempt: 0,
        waiting: false,
        message: '',
        selectedUnits: [],
        indexAction: 0,
        groups: {
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
          "7": [],
          "8": [],
        },
        winner: null,
        showPath: true,
        pathCell: [],
      }
    },
    methods: {
      async connect () {
        this.connected = false
        this.playerData = null
        this.winner = null
        this.currentAttempt = 0
        this.waiting = false
        this.message = ''

        this.socket = await io("ws://localhost:8765/", {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 1000,
          reconnectionAttempts: this.attemptMax,
        })
        this.message = "CONNECTING ..."
        this.socket.on('connect', () => {
          this.connected = true
          this.playerData = null
          this.winner = null
          this.currentAttempt = 0
        })
        this.socket.on('connect_error', () => {
          this.message = "ERROR CANNOT JOIN THE SERVER"
          this.currentAttempt++
          if (this.currentAttempt >= this.attemptMax) {
            location.reload()
          }
        })
        this.socket.on('disconnect', () => {
          this.connected = false
        })
        this.socket.on('connected', (event) => {
          this.message = event.message
        })
        this.socket.on('reconnect', (event) => {
          this.connected = true
          this.currentAttempt = 0
        })
        this.socket.on("reconnect_failed", () => {
          location.reload()
        });
        this.socket.on("reconnect_attempt", (attempt) => {
          this.currentAttempt = attempt
        });
        this.socket.on('waiting', (event) => {
          this.waiting = true
          this.message = event.message
        })
        this.socket.on('winner', (data) => {
          console.log(data)
          this.winner = data
        })
        this.socket.on('player', (data) => {
          // Reset index action
          this.indexAction = 0

          // refresh data of the game
          this.playerData = data

          // refresh the current cell
          if (this.currentCell && this.currentCell.soil) {
            this.currentCell = this.knowCells.find(cell => cell.index === this.currentCell.index) 
          }
          // refresh the selected unit
          for (let [index, unit] of this.selectedUnits.entries()) {
            let foundIndex = -1
            for (const cell of this.playerData.vision_cells) {
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
          this.winner = null
        }
      },
      goToCapital () {
        EventBus.$emit('go-to-capital')
      },
      goToCell() {
        EventBus.$emit('go-to-cell')
      },
      toggleShowPath() {
        this.showPath = !this.showPath
      },
      addAllUnit () {
        if(!this.currentCell) {
          return
        }
        let militaries = !this.currentCell.military_units || !this.currentCell.military_units[this.gameData.ally_id]
            ? []
            : this.currentCell.military_units[this.gameData.ally_id]
        let civilians = !this.currentCell.civilian_units || !this.currentCell.civilian_units[this.gameData.ally_id]
            ? []
            : this.currentCell.civilian_units[this.gameData.ally_id]
        
        EventBus.$emit(
          'add-units-selection',
          militaries.concat(civilians)
        )
      },
      addAllMilititariesUnit () {
        if(!this.currentCell) {
          return
        }
        let militaries = !this.currentCell.military_units || !this.currentCell.military_units[this.gameData.ally_id]
            ? []
            : this.currentCell.military_units[this.gameData.ally_id]
        
        EventBus.$emit(
          'add-units-selection',
          militaries
        )
      },
      addAllCiviliansUnit () {
        if(!this.currentCell) {
          return
        }
        let civilians = !this.currentCell.civilian_units || !this.currentCell.civilian_units[this.gameData.ally_id]
            ? []
            : this.currentCell.civilian_units[this.gameData.ally_id]
        
        EventBus.$emit(
          'add-units-selection',
          civilians
        )
      },
      moveCurrentCell (direction) {
        if (!this.currentCell) {
          return
        }
        let x = this.currentCell.index % this.gameData.width
        let y = parseInt(this.currentCell.index / this.gameData.height)
        switch (direction) {
          case 'TOP':
            if (y - 1 < 0) {
              return
            }
            y--
            break
          case 'BOTTOM':
            if (y + 1 > this.gameData.height - 1) {
              return
            }
            y++
            break
          case 'LEFT':
            if (x - 1 < 0) {
              return
            }
            x--
            break
          case 'RIGHT':
            if (x + 1 > this.gameData.width - 1) {
              return
            }
            x++
            break
        }
        let cell = this.knowCells.find(c => c.index === x + (y * this.gameData.width)) 
        if (cell) {
          this.currentCell = cell
        } else {
          this.currentCell =  {x: x, y: y, index: x + (y * this.gameData.width)}
        }
      },
      clearSelectedUnits () {
        this.selectedUnits = []
      },
      stopSelectedUnit () {
        this.socket.emit("action", {
          "index": this.indexAction,
          "kind": "STOP",
          "uuid": this.gameData.uuid,
          "unit_uuids": this.selectedUnits.map(u => u.uuid)
        })
      },
      addUnitToGroup (group) {
        if (this.groups[group] === undefined) {
          return
        }
        for(let unit of this.selectedUnits) {
          if (this.groups[group].findIndex(u => u === unit) === -1) {
            this.groups[group].push(unit)
          }
        }
      },
      groupUnit (group) {
        if (this.groups[group] === undefined) {
          return
        }
        this.groups[group] = this.selectedUnits
      },
      clearGroupUnit (group) {
        if (this.groups[group] === undefined) {
          return
        }
        this.groups[group] = []
      },
      selectGroup (group) {
        if (this.groups[group] === undefined && this.groups[group].length) {
          return
        }
        this.selectedUnits = this.groups[group]
      },
      enterBorder (direction) {
        EventBus.$emit('enter-border', direction)
      },
      leaveBorder (direction) {
        EventBus.$emit('leave-border', direction)
      },
      moveUnit () {
        EventBus.$emit("move-units", this.currentCell)
      },
      getCell(x, y) {
        return this.knowCells.find(c => c.x === x && c.y === y) ||
          { x: x, y: y, index: x + (y * this.gameData.width) }
      },
      getAccessibleCell(cell) {
        let cells = []

        // NORTH
        if (cell.y > 0 && cell.y < this.gameData.height) {
          cells.push(this.getCell(cell.x, cell.y - 1))
        }
        // NORTH WEAST
        if (cell.y > 0 && cell.y < this.gameData.height &&
              cell.x > 0 && cell.x < this.gameData.width) {
          cells.push(this.getCell(cell.x - 1, cell.y - 1))
        }
        // ODD
        if (x % 2 == 0) {
          // NORTH EAST
          // if (cell.y > 0 && cell.y < this.gameData.height &&
          //       cell.x > 0 && cell.x < this.gameData.width) {
          //   cells.push(this.getCell(cell.x + 1, cell.y - 1))
          // }
          // NORTH WEAST
          if (cell.y > 0 && cell.y < this.gameData.height &&
                cell.x > 0 && cell.x < this.gameData.width) {
            cells.push(this.getCell(cell.x - 1, cell.y - 1))
          }
        // EVEN
        } else {
          // NORTH EAST
          // if (cell.y > 0 && cell.y < this.gameData.height &&
          //       cell.x > 0 && cell.x < this.gameData.width) {
          //   cells.push(this.getCell(cell.x + 1, cell.y - 1))
          // }
          // NORTH WEAST
          if (cell.y > 0 && cell.y < this.gameData.height &&
                cell.x > 0 && cell.x < this.gameData.width) {
            cells.push(this.getCell(cell.x - 1, cell.y - 1))
          }
        }
        // SOUTH
        if (cell.y >= 0 && cell.y < this.gameData.height - 1) {
          cells.push(this.getCell(cell.x, cell.y + 1))
        }
        // SOUTH WEAST
        if (cell.y > 0 && cell.y < this.gameData.height) {
          cells.push(this.getCell(cell.x - 1, cell.y + 1))
        }
        // SOUTH EAST
        if (cell.y > 0 && cell.y < this.gameData.height) {
          cells.push(this.getCell(cell.x + 1, cell.y + 1))
        }
        return cells
      }
    },
    computed: {
      knowCells () {
        return this.playerData.vision_cells.concat(this.playerData.mapped_cells)
      }
    },
    watch: {
      selectedUnits: function (val) {
        this.pathCell = []
        for(const units of this.selectedUnits) {
          for (let i = 0; i < units.destinations.length; i++) {
            let cell = units.destinations[i]
            if (!this.pathCell.find(c => c.x === cell.x && c.y === cell.y)) {
              this.pathCell.push(cell)
            }
            console.log(this.getAccessibleCell(cell))
            this.pathCell = this.pathCell.concat(this.getAccessibleCell(cell))
          }
        }
      },
    },
    async created () {
      EventBus.$on('select-cell', cell => {
        this.currentCell = cell
      })
      EventBus.$on('remove-unit-selection', unit => {
        let index = this.selectedUnits.findIndex(u => u.uuid === unit.uuid)
        if (index !== -1) {
          this.selectedUnits.splice(index, 1)
        }
      })
      EventBus.$on('stop-selected-unit', () => {
        this.stopSelectedUnit()
      })
      EventBus.$on('clear-unit-selection', () => {
        this.clearSelectedUnits()
      })
      EventBus.$on("move-units", (cell) => {
        if (!this.playerData || !this.selectedUnits) {
          return
        }
        this.socket.emit("action", {
          "index": this.indexAction,
          "kind": "MOVE",
          "uuid": this.gameData.uuid,
          "cell_id": cell.index,
          "unit_uuids": this.selectedUnits.map(u => u.uuid)
        })
        this.indexAction++
      })
      EventBus.$on("add-move-units", (cell) => {
        if (!this.playerData || !this.selectedUnits) {
          return
        }
        this.socket.emit("action", {
          "index": this.indexAction,
          "kind": "ADD_MOVE",
          "uuid": this.gameData.uuid,
          "cell_id": cell.index,
          "unit_uuids": this.selectedUnits.map(u => u.uuid)
        })
        this.indexAction++
      })
      EventBus.$on('add-unit-selection', (unit) => {
        const index = this.selectedUnits.findIndex(u => u.uuid === unit.uuid)
        if (index === -1) {
          this.selectedUnits.push(unit)
        } else {
          this.selectedUnits.splice(index, 1)
        }
      })
      EventBus.$on('add-units-selection', (units) => {
        for(let unit of units) {
          const index = this.selectedUnits.findIndex(u => u.uuid === unit.uuid)
          if (index === -1) {
            this.selectedUnits.push(unit)
          }
        }
      })
      EventBus.$on('increment-index-action', () => {
        this.indexAction++
      })
      await this.connect()
      await this.play()
    }
  }
</script>
