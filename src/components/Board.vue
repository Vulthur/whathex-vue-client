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
        <template v-for="(cell) in emptyCells">
          <empty-cell :key="cell.index"
            :selected="currentCell && cell.index === currentCell.index"
            :cellWidth="width"
            :cellHeight="height"
            :offset="offset"
            :cell="cell">
          </empty-cell>
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
        <!-- PATH CELL -->
        <template v-if="showPath">
          <template v-for="cell in pathCell">
            <path-cell :key="`path-${cell.x}-${cell.y}`"
              :cellWidth="width"
              :cellHeight="height"
              :offset="offset"
              :cell="cell">
            </path-cell>
          </template>
          <template v-for="(unit, indexUnit) in selectedUnits">
            <template v-for="(destination, indexDestination) in [...unit.destinations].reverse()">
              <svg :key="`${indexUnit}-${indexDestination}`"
                  version="1.1"
                  class="destination"
                  viewBox="0 0 20 20" :width="20" :height="20"
                  :style="{
                    left: `${destination.x * height + offset + height / 2}px`,
                    top: destination.x % 2 == 0
                      ? `${destination.y * width + (width / 2) + offset}px` 
                      : `${(destination.y * width) + width + offset}px`,
                  }">
                <circle cx="50%" cy="50%" r="10" fill="#AA0011"/>
                <text x="50%"
                    y="50%"
                    dominant-baseline="middle"
                    text-anchor="middle"
                    fill="white"
                    font-size="9px">
                  {{ indexDestination }}
                </text>
              </svg>
            </template>
          </template>
        </template>
      </div>
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
import PathCell from "./PathCell"
import { EventBus } from "../index"

export default {
  name: "board",
  components: {
    Cell,
    EmptyCell,
    MappedCell,
    PathCell
  },
  props: {
    gameData: Object,
    showPath: Boolean,
    capital: Object,
    mappedCells: Array,
    emptyCells: Array,
    pathCell: Array,
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

<style lang="scss" scoped>
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
  .destination {
    position: absolute;
  }
  .line {
    stroke: crimson;
    stroke-width: 2;
  }
</style>