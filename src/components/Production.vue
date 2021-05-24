<template>
  <div id="production" v-if="currentCell">
    <div @click="cancelBuilding" id="build" class="product" v-if="currentCell.in_progress_building">
      {{ currentCell.progession_build }} : {{ currentCell.in_progress_building.name }}
    </div>
    <div id="units" v-if="building">
      <div class="product" @click="cancelProduct(index)" v-for="(product, index) in building.production_queue" :key="index">
        {{ product.name }}
        <template v-if="index === 0 && building.production_current">
          : {{ building.production_current }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "production",
  props: {
    currentCell: Object,
    socket: Object,
    gameData: Object
  },
  methods: {
    cancelBuilding () {
      this.socket.emit("action", {
        "kind": "CANCEL_BUILDING",
        "uuid": this.gameData.uuid,
        "cell_id": this.currentCell.index
      })
    },
    cancelProduct (index) {
      this.socket.emit("action", {
        "kind": "CANCEL_PRODUCT",
        "uuid": this.gameData.uuid,
        "index": index,
        "cell_id": this.currentCell.index
      })
    }
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