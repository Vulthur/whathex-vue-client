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
        :style="{
          left: `${cell.x * cellHeight}px`,
          top: cell.x % 2 == 0 ? `${cell.y * cellWidth}px` : `${(cell.y * cellWidth) + (cellWidth / 2)}px`,
        }"
        :fill="getHexagoneColor(cell.soil)"
        viewBox="0 0 120 104" :width="cellWidth" :height="cellHeight"
        id="test">
      <use xlink:href="#hexagone" :stroke="selected ? 'black' : ''"/>
      <template v-if="cell.building">
        <circle cx="60" cy="52" r="20" fill="black"/>
        <text x="50%"
            y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            fill="white">
          {{ cell.building.name.charAt(0) }}
        </text>
      </template>
      <!-- TODO UNITS VISUAL -->
    </svg>
  </div>
</template>

<script>
import { EventBus } from "../index"
import { getHexagoneColor } from '../common'

export default {
  name: "cell",
  props: {
    cell: Object,
    cellWidth: Number,
    cellHeight: Number,
    selected: Boolean
  },
  methods: {
    getHexagoneColor (soil) {
      return getHexagoneColor(soil)
    },
    selectCell () {
      EventBus.$emit("select-cell", this.cell)
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