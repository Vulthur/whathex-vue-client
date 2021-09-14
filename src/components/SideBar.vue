<template>
  <div id="side-bar">
    <div id="cell" v-if="currentCell">
      {{ currentCell.soil.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "side-bar",
  props: {
    currentCell: Object
  }
}
</script>

<style lang="scss" scoped>
  #side-bar {
    width: 20vw;
    height: 100vh;
    background: #93ea8b;
  }
</style>