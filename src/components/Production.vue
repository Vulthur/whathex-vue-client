<template>
  <div id="production" v-if="currentCell">
    <div id="build" v-if="currentCell.in_progress_building">
      {{ progession_build }} : {{ in_progress_building }}
    </div>
    <div id="units" v-if="building">
      <div class="product" v-for="(product, index) in building.production_queue" :key="index">
        <template v-if="index === 1">
          {{ product.name }} : {{ production_current }}
        </template>
        <template v-else>
          {{ product.name }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "production",
  props: {
    currentCell: Object
  },
  computed: {
    building () {
      return this.currentCell.building
    },
  }
}
</script>

<style lang="scss">
  #production {
    position: fixed;
    bottom: 19vh;
    margin-left: 5px;
  }
  #units {
    display: flex;
  }
  #build {
    display: flex;
    margin-bottom: 5px;
  }
  #build > * {
    border-radius: 5px;
    background: gold;
    padding: 4px;
    cursor: pointer;
  }
  #build > *:hover {
    background: rgb(211, 181, 11);
  }
  .product {
    border-radius: 5px;
    background: crimson;
    padding: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  .product:hover {
    background: rgb(172, 17, 48);
  }
</style>