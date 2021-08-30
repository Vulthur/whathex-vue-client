<template>
  <div id="board" >
    <div id="map"
        ref="map"
        @wheel="zooming">
      <div v-if="gameData" id="cells"
          ref="cells"
          :style="{
            width: `${gameData.width * height + (offset * 2)}px`,
            height: `${gameData.height * width + (offset * 2) + (width / 2)}px`,
          }">
        <!-- DEFAULT CELL -->
        <template v-for="(i, indexI) in gameData.height">
          <template v-for="(j, indexJ) in gameData.width">
            <empty-cell :key="`${i}-${j}`"
              :selected="currentCell && (indexJ + (indexI * gameData.width)) === currentCell.index"
              :cellWidth="width"
              :cellHeight="height"
              :offset="offset"
            :cell="{x: indexJ, y: indexI, index: indexJ + (indexI * gameData.width)}">
            </empty-cell>
          </template>
        </template>
        <!-- Vision CELL -->
        <template v-for="cell in visionCells">
          <cell :key="cell.id"
            :selected="currentCell && cell.index === currentCell.index"
            :gameData="gameData"
            :cellWidth="width"
  	        :cellHeight="height"
            :offset="offset"
            :cell="cell">
          </cell>
        </template>
        <!-- MAPPED CELL -->
        <template v-for="cell in mappedCells">
          <mapped-cell :key="cell.id"
            :selected="currentCell && cell.index === currentCell.index"
            :gameData="gameData"
            :cellWidth="width"
  	        :cellHeight="height"
            :offset="offset"
            :cell="cell">
          </mapped-cell>
        </template>
      </div>
      <template v-for="(unit, indexUnit) in selectedUnits">
        <template v-for="(destination, indexDestination) in unit.destinations">
          <svg :key="`${indexUnit}-${indexDestination}`"
              version="1.1"
              class="lines"
              :style="{
                left: `${unit.cell.x * height}px`,
                top: unit.cell.x % 2 == 0 ? `${unit.cell.y * width}px` : `${(unit.cell.y * width) + (width / 2)}px`,
              }">
            <circle r="10" fill="red"/>
          </svg>
        </template>
      </template>
    </div>
    <div class="border"
      @mouseenter="enterBorder('TOP')"
      @mouseleave="leaveBorder('TOP')"
      :style="{
        top: 0,
        width: '100%',
        height: borderSize,
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('BOTTOM')"
      @mouseleave="leaveBorder('BOTTOM')"
      :style="{
        bottom: 0,
        width: '100%',
        height: borderSize,
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('LEFT')"
      @mouseleave="leaveBorder('LEFT')"
      :style="{
        top: 0,
        left: 0,
        width: borderSize,
        height: '100%',
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('RIGHT')"
      @mouseleave="leaveBorder('RIGHT')"
      :style="{
        top: 0,
        right: 0,
        width: borderSize,
        height: '100%',
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('RIGHT-BOTTOM')"
      @mouseleave="leaveBorder('RIGHT-BOTTOM')"
      :style="{
        bottom: 0,
        right: 0,
        width: borderSize,
        height: borderSize,
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('LEFT-BOTTOM')"
      @mouseleave="leaveBorder('LEFT-BOTTOM')"
      :style="{
        bottom: 0,
        left: 0,
        width: borderSize,
        height: borderSize,
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('RIGHT-TOP')"
      @mouseleave="leaveBorder('RIGHT-TOP')"
      :style="{
        top: 0,
        right: 0,
        width: borderSize,
        height: borderSize,
      }"
    ></div>
    <div class="border"
      @mouseenter="enterBorder('LEFT-TOP')"
      @mouseleave="leaveBorder('LEFT-TOP')"
      :style="{
        top: 0,
        left: 0,
        width: borderSize,
        height: borderSize,
      }"
    ></div>
  </div>
</template>

<script>

import Cell from "./Cell"
import EmptyCell from "./EmptyCell"
import MappedCell from "./MappedCell"
import { EventBus } from "../index"

export default {
  name: "board",
  components: {
    Cell,
    EmptyCell,
    MappedCell
  },
  props: {
    gameData: Object,
    capital: Object,
    mappedCells: Array,
    visionCells: Array,
    currentCell: Object,
    selectedUnits: Array
  },
  data () {
    return {
      cellWidth: 120,
      cellHeight: 104,
      moveSpeed: 15,
      zoom: 1.0,
      stepZoom: 0.05,
      offset: 50,
      borderSize: '10px',
      border: {
        'TOP': false,
        'BOTTOM': false,
        'LEFT': false,
        'RIGHT': false,
        'RIGHT-BOTTOM': false,
        'LEFT-BOTTOM': false,
        'RIGHT-TOP': false,
        'LEFT-TOP': false,
      },
    }
  },
  methods: {
    enterBorder (direction) {
      this.border[direction] = true
    },
    leaveBorder (direction) {
      this.border[direction] = false
    },
    moveMap () {
      if (this.border['TOP']) {
        this.$refs.map.scrollTop -= this.moveSpeed
      }
      if (this.border['BOTTOM']) {
        this.$refs.map.scrollTop += this.moveSpeed
      }
      if (this.border['LEFT']) {
        this.$refs.map.scrollLeft -= this.moveSpeed
      }
      if (this.border['RIGHT']) {
        this.$refs.map.scrollLeft += this.moveSpeed
      }
      if (this.border['RIGHT-BOTTOM']) {
        this.$refs.map.scrollLeft += this.moveSpeed
        this.$refs.map.scrollTop += this.moveSpeed
      }
      if (this.border['LEFT-BOTTOM']) {
        this.$refs.map.scrollLeft -= this.moveSpeed
        this.$refs.map.scrollTop += this.moveSpeed
      }
      if (this.border['RIGHT-TOP']) {
        this.$refs.map.scrollLeft += this.moveSpeed
        this.$refs.map.scrollTop -= this.moveSpeed
      }
      if (this.border['LEFT-TOP']) {
        this.$refs.map.scrollLeft -= this.moveSpeed
        this.$refs.map.scrollTop -= this.moveSpeed
      }
      window.requestAnimationFrame(this.moveMap)
    },
    zooming (event) {
      if (event.deltaY > 0 && this.zoom - this.stepZoom > 0.5) {
        this.zoom -= this.stepZoom
      }
      if (event.deltaY < 0 && this.zoom + this.stepZoom < 2) {
        this.zoom += this.stepZoom
      }
      this.goToCell(this.currentCell)
    },
    goToCapital () {
      this.goToCell(this.capital)
    },
    goToCell (cell) {
      if (!this.$refs.map) {
        return
      }
      this.$refs.map.scrollLeft = cell.x * this.height - (window.innerWidth / 2) - this.offset
      this.$refs.map.scrollTop = cell.x % 2 == 0 
        ? cell.y * this.width - (window.innerHeight / 2) + this.offset
        : (cell.y * this.width) + (this.width / 2) - (window.innerHeight / 2) - this.offset
      EventBus.$emit("select-cell", cell)
    },
  },
  computed: {
    width () {
      return Math.floor(this.cellWidth * this.zoom)
    },
    height () {
      return Math.floor(this.cellHeight * this.zoom)
    }
  },
  mounted () {
    window.requestAnimationFrame(this.moveMap)
    EventBus.$on('go-to-capital', () => {
      this.goToCapital()
    })
    EventBus.$on('enter-border', (direction) => {
      this.enterBorder(direction)
    })   
    EventBus.$on('leave-border', (direction) => {
      this.leaveBorder(direction)
    })   
    EventBus.$on('go-to-cell', () => {
      if (this.currentCell) {
        this.goToCell(this.currentCell)
      }
    })   
    this.goToCapital()
  },
}
</script>

<style lang="scss">
  #board {
    width: 100%;
    height: 100vh;
    background-color: aquamarine;
    position: relative;
  }
  #map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: url("../assets/images/bg-pattern.png");
    cursor: pointer;
  }
  #cells {
    background-image: url("../assets/images/bg-pattern.png");
    transform-origin: center;
  }
  .border {
    background-color: transparent;
    position: fixed;
    z-index: 2;
  }
  .lines {
    position: absolute;
  }
  .line {
    stroke: crimson;
    stroke-width: 2;
  }
</style>