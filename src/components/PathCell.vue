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
        :style="{
          left: `${cell.x * cellHeight + offset}px`,
          top: cell.x % 2 == 0 ? `${cell.y * cellWidth + offset}px` : `${(cell.y * cellWidth) + (cellWidth / 2) + offset}px`,
        }"
        fill="#00000000"
        viewBox="0 0 120 104" :width="cellWidth" :height="cellHeight" stroke="red"
        id="test">
      <use xlink:href="#hexagone"/> 
    </svg>
  </div>
</template>

<script>

export default {
  name: "empty-cell",
  props: {
    cellWidth: Number,
    cellHeight: Number,
    cell: Object,
    offset: Number
  },
}
</script>

<style lang="scss" scoped>
  .hexagones {
    position: absolute;
    pointer-events: none;
  }
  #model-hexa {
    display: none;
  }
</style>