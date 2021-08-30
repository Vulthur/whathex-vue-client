<template>
  <div>
    <div id="model-hexa">
      <svg version="1.1"
        id="hexagone"
        xmlns="http://www.w3.org/2000/svg" >
          <path
              d="M0 51.96152422706631L30 0L90 0L120 51.96152422706631L90 103.92304845413263L30 103.92304845413263Z">
          </path>
      </svg>
    </div>
    <svg class="hexagones"
        @click="selectCell()"
        @contextmenu.prevent.exact="moveUnit()"
        @contextmenu.ctrl.prevent.exact="addMoveUnit()"
        :style="{
          left: `${cell.x * cellHeight + offset}px`,
          top: cell.x % 2 == 0 ? `${cell.y * cellWidth + offset}px` : `${(cell.y * cellWidth) + (cellWidth / 2) + offset}px`,
        }"
        fill="#00000044"
        viewBox="0 0 120 104" :width="cellWidth" :height="cellHeight"
        id="test">
      <use xlink:href="#hexagone" :stroke="selected ? 'black' : ''"/>  
      <text x="50%"
          y="20%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="white"
          font-size="9px">
        {{ cell.index }}
      </text>
    </svg>
  </div>
</template>

<script>
import { EventBus } from "../index"

export default {
  name: "empty-cell",
  props: {
    cellWidth: Number,
    cellHeight: Number,
    selected: Boolean,
    cell: Object,
    offset: Number
  },
  methods: {
    selectCell () {
      EventBus.$emit("select-cell", this.cell)
    },
    moveUnit () {
      EventBus.$emit("move-units", this.cell)
    },
    addMoveUnit () {
      EventBus.$emit("add-move-units", this.cell)
    }
  }
}
</script>

<style lang="scss">
  .hexagones {
    position: absolute;
  }
  #model-hexa {
    display: none;
  }
</style>