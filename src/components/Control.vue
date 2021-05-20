<template>
  <div id="controls">
    <div id="soil" 
        v-if="currentCell"
        :style="{
          'border-color': getHexagoneColor(currentCell.soil)
        }">
      <div id="header-name">{{ soil.name.toUpperCase() }}</div>
      <div class="properties">
        <div class="column-props">
          <div class="property">
            <span>MS</span>
            <span>{{ soil.move_speed || "ø" }}</span>
          </div>
          <div class="property">
            <span>BA</span>
            <span>{{ soil.bonus_attack }}</span>
          </div>
          <div class="property">
            <span>BD</span>
            <span>{{ soil.bonus_defense }}</span>
          </div>
          <div class="property">
            <span>BV</span>
            <span>{{ soil.bonus_vision }}</span>
          </div>
          <div class="property">
            <span>BR</span>
            <span>{{ soil.bonus_retrait }}</span>
          </div>
          <div class="property">
            <span>CSI</span>
            <span>{{ soil.can_see_in }}</span>
          </div>
          <div class="property">
            <span>CSB</span>
            <span>{{ soil.can_see_behind }}</span>
          </div>
          <div class="property">
            <span>M</span>
            <span>{{ soil.multiplier }}</span>
          </div>
        </div>
        <div class="column-props">
          <div class="property" v-if="Object.keys(soil.incomes).length">
            <span class="title-property">INCOMES</span>
          </div>
          <div class="property" v-for="(income, key, index) in soil.incomes" :key="`soil-income-${index}`">
            <span>{{ `${key[0].toUpperCase()}` }}</span>
            <span>{{ `${income.value}` }}</span>
          </div>
          <div class="property" v-if="Object.keys(soil.resources).length">
            <span class="title-property">RESSOURCES</span>
          </div>
          <div class="property" v-for="(ressource, key, index) in soil.resources" :key="`ressource-${index}`">
            <span>{{ `${key[0].toUpperCase()}` }}</span>
            <span>{{ `${ressource.value}` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="building" 
        v-if="currentCell && building">
      <div id="header-name">{{ building.name.toUpperCase() }}</div>
      <div class="properties">
        <div class="column-props">
          <div class="property">
            <span>MS</span>
            <span>{{ building.move_speed || "ø" }}</span>
          </div>
          <div class="property">
            <span>BA</span>
            <span>{{ building.bonus_attack }}</span>
          </div>
          <div class="property">
            <span>BD</span>
            <span>{{ building.bonus_defense }}</span>
          </div>
          <div class="property">
            <span>BV</span>
            <span>{{ building.bonus_vision }}</span>
          </div>
          <div class="property">
            <span>BR</span>
            <span>{{ building.bonus_retrait }}</span>
          </div>
          <div class="property">
            <span>CSI</span>
            <span>{{ building.can_see_in }}</span>
          </div>
          <div class="property">
            <span>CSB</span>
            <span>{{ building.can_see_behind }}</span>
          </div>
          <div class="property">
            <span>PV</span>
            <span>{{ building.production_value }}</span>
          </div>
        </div>
        <div class="column-props">
          <div class="property" v-if="Object.keys(building.productibles).length">
            <span class="title-property">PRODUCTIBLES</span>
          </div>
          <div class="property" v-for="(product, index) in building.productibles" :key="`product-${index}`">
            <button @click="produce(product)"
              :disabled="!canProduce(product)">{{ `${product.toUpperCase()}` }}</button>
          </div>
        </div>
        <div class="column-props">
          <div class="property" v-if="Object.keys(building.incomes).length">
            <span class="title-property">INCOMES</span>
          </div>
          <div class="property" v-for="(income, key, index) in building.incomes" :key="`building-income-${index}`">
            <span>{{ `${key[0].toUpperCase()}` }}</span>
            <span>{{ `${income.value}` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="buidable"
        v-if="currentCell && buildables.length">
      <div id="header-name">BUILDABLES</div>
      <div class="properties">
        <div class="column-props">
          <div class="property" v-for="(buildable, index) in buildables" :key="`buildable-${index}`">
            <button @click="build(buildable)"
              :disabled="!canBuild(buildable)">{{ `${buildable.toUpperCase()}` }}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- TODO UNITS BY PLAYER -->
    <div id="buidable"
        v-if="currentCell && buildables.length">
      <div id="header-name">MILITARY UNITS</div>
      <div class="properties">
        <div class="column-props">
          <div>ALLY</div>
          <div class="property" v-for="(units, index) in militaries[gameData.ally_id]" :key="`units-ally-${index}`">
            {{ units.name }} - {{ units.pv }}
          </div>
        </div>
        <div class="column-props">
          <div>ENEMY</div>
          <div class="property" v-for="(units, index) in militaries[enemy_id]" :key="`units-enemy-${index}`">
            {{ units.name }} - {{ units.pv }}
          </div>
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
    allyId: String,
    enemyId: String,
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
    canProduce (product) {
      for (let ressource in this.gameData.productibles[product].cost) {
        this.gameData.productibles[product].cost[ressource]
        if (this.gameData.productibles[product].cost[ressource].value > this.stocks[ressource].value) {
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
    },
    produce (product) {
      this.socket.emit("action", {
        "kind": "ADD_PRODUCT",
        "uuid": this.gameData.uuid,
        "product_id": product,
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
    },
    militaries () {
      return this.currentCell.military_units
    },
    civilians () {
      return this.currentCell.civilian_units
    }
  }
}
</script>

<style lang="scss">
  #controls {
    width: 100%;
    height: 15vh;
    background-color: burlywood;
    display: flex;
    align-items: center;
  }
  #soil, #building, #buidable {
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 5px;
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;
    background: darkseagreen;
    border-color: darkseagreen;
  }
  #header-name {
    height: 20%;
    font-size: 12px;
  }
  .column-props {
    padding: 0 10px;
  }
  .properties {
    height: 80%;
    font-size: 10px;
    display: flex;
    flex-wrap: wrap;
  }
  .property button {
    font-size: 10px;
    margin-bottom: 2px;
    width: 100%;
  }
  .property {
    display: flex;
    margin: 0 2px;
    justify-content: space-between;
  }
  .property > * {
    padding: 0 2px;
  }
  .title-property {
    margin-bottom: 4px;
    text-align: center;
    width: 100%;
  }
</style>