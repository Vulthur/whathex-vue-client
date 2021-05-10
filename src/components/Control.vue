<template>
  <div id="controls">
    <div id="soil" 
        v-if="currentCell"
        :style="{
          'border-color': getHexagoneColor(currentCell.soil)
        }">
      <div id="header-name">{{ soil.name.toUpperCase() }}</div>
      <div class="properties">
        <div class="property">
          <span>MOVE SPEED :</span>
          <span>{{ soil.move_speed || "ø" }}</span>
        </div>
        <div class="property">
          <span>BONUS ATTACK :</span>
          <span>{{ soil.bonus_attack }}</span>
        </div>
        <div class="property">
          <span>BONUS DEFENSE :</span>
          <span>{{ soil.bonus_defense }}</span>
        </div>
        <div class="property">
          <span>BONUS VISION :</span>
          <span>{{ soil.bonus_vision }}</span>
        </div>
        <div class="property">
          <span>BONUS RETREAT :</span>
          <span>{{ soil.bonus_retrait }}</span>
        </div>
        <div class="property">
          <span>CAN SEE IN :</span>
          <span>{{ soil.can_see_in }}</span>
        </div>
        <div class="property">
          <span>CAN SEE BEHIND :</span>
          <span>{{ soil.can_see_behind }}</span>
        </div>
        <div class="property">
          <span>MULTIPLIER :</span>
          <span>{{ soil.multiplier }}</span>
        </div>
        <div class="break-property"></div>
        <div class="property" v-if="Object.keys(soil.incomes).length">
          <span class="title-property">INCOMES</span>
        </div>
        <div class="property" v-for="(income, key, index) in soil.incomes" :key="`soil-income-${index}`">
          <span>{{ `${key.toUpperCase()} :` }}</span>
          <span>{{ `${income.value}` }}</span>
        </div>
        <div class="property" v-if="Object.keys(soil.resources).length">
          <span class="title-property">RESSOURCES</span>
        </div>
        <div class="property" v-for="(ressource, key, index) in soil.resources" :key="`ressource-${index}`">
          <span>{{ `${key.toUpperCase()} :` }}</span>
          <span>{{ `${ressource.value}` }}</span>
        </div>
      </div>
    </div>
    <!-- TODO -->
    <div id="building" 
        v-if="currentCell && building">
      <div id="header-name">{{ building.name.toUpperCase() }}</div>
      <div class="properties">
        <div class="property">
          <span>MOVE SPEED :</span>
          <span>{{ building.move_speed || "ø" }}</span>
        </div>
        <div class="property">
          <span>BONUS ATTACK :</span>
          <span>{{ building.bonus_attack }}</span>
        </div>
        <div class="property">
          <span>BONUS DEFENSE :</span>
          <span>{{ building.bonus_defense }}</span>
        </div>
        <div class="property">
          <span>BONUS VISION :</span>
          <span>{{ building.bonus_vision }}</span>
        </div>
        <div class="property">
          <span>BONUS RETREAT :</span>
          <span>{{ building.bonus_retrait }}</span>
        </div>
        <div class="property">
          <span>CAN SEE IN :</span>
          <span>{{ building.can_see_in }}</span>
        </div>
        <div class="property">
          <span>CAN SEE BEHIND :</span>
          <span>{{ building.can_see_behind }}</span>
        </div>
        <div class="property">
          <span>PRODUCTION VALUE :</span>
          <span>{{ building.production_value }}</span>
        </div>
        <div class="break-property"></div>
        <div class="property" v-if="Object.keys(building.productibles).length">
          <span class="title-property">PRODUCTIBLES</span>
        </div>
        <div class="property" v-for="(product, index) in building.productibles" :key="`product-${index}`">
          <button>{{ `${product.toUpperCase()}` }}</button>
        </div>
        <div class="break-property"></div>
        <div class="property" v-if="Object.keys(building.incomes).length">
          <span class="title-property">INCOMES</span>
        </div>
        <div class="property" v-for="(income, key, index) in building.incomes" :key="`build-income-${index}`">
          <span>{{ `${key.toUpperCase()} :` }}</span>
          <span>{{ `${income.value}` }}</span>
        </div>
        <div class="property" v-if="Object.keys(building.incomes).length">
          <span>INCOMES</span>
        </div>
        <div class="property" v-for="(income, key, index) in building.incomes" :key="`building-income-${index}`">
          <span>{{ `${key.toUpperCase()} :` }}</span>
          <span>{{ `${income.value}` }}</span>
        </div>
      </div>
    </div>
    <div id="buidable"
        v-if="currentCell && buildables.length">
      <div id="header-name">BUILDABLES</div>
      <div class="properties">
        <div class="property" v-for="(buildable, index) in buildables" :key="`buildable-${index}`">
          <button @click="build(buildable)"
            :disabled="!canBuild(buildable)">{{ `${buildable.toUpperCase()}` }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHexagoneColor } from '../common'

export default {
  name: "controls",
  props: {
    currentCell: Object,
    stocks: Object,
    gameData: Object,
    socket: Object
  },
  methods: {
    getHexagoneColor (soil) {
      return getHexagoneColor(soil)
    },
    canBuild (buildable) {
      for (let ressource in this.gameData.buildables[buildable].cost) {
        this.gameData.buildables[buildable].cost[ressource]
        if (this.gameData.buildables[buildable].cost[ressource].value > this.stocks[ressource].value) {
          return false
        }
      }
      return true
    },
    build (building) {
      this.socket.emit("action", {
        "kind": "ADD_BUILDING",
        "uuid": this.gameData.uuid,
        "building_uid": building,
        "cell_id": this.currentCell.index
      })
    }
  },
  computed: {
    soil () {
      return this.currentCell.soil
    },
    building () {
      return this.currentCell.building
    },
    buildables () {
      return this.currentCell.soil.buildables
    }
  }
}
</script>

<style lang="scss">
  #controls {
    width: 100%;
    height: 18vh;
    background-color: burlywood;
    display: flex;
    align-items: center;
  }
  #soil, #building, #buidable {
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 5px;
    border-width: 5px;
    border-style: solid;
    background: darkseagreen;
    border-color: darkseagreen;
    width: 30%;
  }
  #header-name {
    height: 20%;
    font-size: 15px;
  }
  .properties {
    height: 80%;
    font-size: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 80%;
  }
  .property button {
    font-size: 10px;
    margin-bottom: 2px;
  }
  .property {
    display: flex;
    margin: 0 2px;
    justify-content: space-between;
  }
  .title-property {
    margin: 4px;
    text-align: center;
    width: 100%;
  }
  .break-property {
    flex-basis: 100%;
  }
</style>