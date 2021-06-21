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
        @contextmenu.prevent="moveUnit()"
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
      <!-- Ally -->
      <template v-if="militaries[gameData.ally_id] && militaries[gameData.ally_id].length">
        <circle cx="75%" cy="75%" r="10" fill="blue"/>
        <text x="75%"
            y="75%"
            class="units-circle">
          {{ militaries[gameData.ally_id].length }}
        </text>
      </template>     
      <template v-if="civilians[gameData.ally_id] && civilians[gameData.ally_id].length">
        <circle cx="25%" cy="75%" r="10" fill="blue"/>
        <text x="25%"
            y="75%"
            class="units-circle">
          {{ civilians[gameData.ally_id].length }}
        </text>
      </template>     
      <!-- Enemy -->
      <template v-if="militaries[gameData.enemy_id] && militaries[gameData.enemy_id].length">
        <circle cx="75%" cy="25%" r="10" fill="red"/>
        <text x="75%"
            y="25%"
            class="units-circle">
          {{ militaries[gameData.enemy_id].length }}
        </text>
      </template>     
      <template v-if="civilians[gameData.enemy_id] && civilians[gameData.enemy_id].length">
        <circle cx="25%" cy="25%" r="10" fill="red"/>
        <text x="25%"
            y="25%"
            class="units-circle">
          {{ civilians[gameData.enemy_id].length }}
        </text>
      </template>     
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
    selected: Boolean,
    gameData: Object,
  },
  methods: {
    getHexagoneColor (soil) {
      return getHexagoneColor(soil)
    },
    selectCell () {
      EventBus.$emit("select-cell", this.cell)
    },
    moveUnit () {
      EventBus.$emit("move-units", this.cell)
    }
  },
  computed: {
    militaries () {
      return this.cell.military_units
    },
    civilians () {
      return this.cell.civilian_units
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
  .units-circle {
    text-anchor: middle;
    fill: white;
    font-size: 10px;
    dominant-baseline: middle;
  }
</style>