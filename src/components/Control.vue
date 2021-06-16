<template>
  <div id="controls">
    <template v-if="currentCell">
      <div id="soil"
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
      <div id="building" v-if="building">
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
            <div class="property">
              <button @click="remove()">DESTRUCT</button>
            </div>
          </div>
        </div>
      </div>
      <div id="buidable" v-if="buildables.length">
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
      <!-- Units -->
      <div class="units" v-if="militaries[gameData.ally_id] || militaries[gameData.enemy_id]">
        <div id="header-name">MILITARY</div>
        <div class="properties">
          <div class="column-props">
            <div class="title-property">ALLY</div>
            <template v-for="(unit, index) in militaries[gameData.ally_id]">
              <div :class="{'ally-unit-selected' : isUnitSelected(unit)}"
                  class="property unit ally-unit"
                  :key="`military-ally-${index}`"
                  @click="toggleUnit(unit)">
                {{ unit.name }} : {{ unit.pv }}/{{ unit.max_pv }}
              </div>
            </template>
          </div>
          <div class="column-props" v-if="militaries[gameData.enemy_id]">
            <div class="title-property">ENEMY</div>
            <div class="property unit" v-for="(unit, index) in militaries[gameData.enemy_id]" :key="`military-enemy-${index}`">
              {{ unit.name }} : {{ unit.pv }} / {{ unit.max_pv }}
            </div>
          </div>
        </div>
      </div>
      <div class="units" v-if="civilians[gameData.ally_id] || civilians[gameData.enemy_id]">
        <div id="header-name">CIVILIAN</div>
        <div class="properties">
          <div class="column-props">
            <div class="title-property">ALLY</div>
            <template v-for="(unit, index) in civilians[gameData.ally_id]">
              <div :class="{'ally-unit-selected' : isUnitSelected(unit)}"
                  class="property unit ally-unit"
                  :key="`civilian-ally-${index}`"
                  @click="toggleUnit(unit)">
                {{ unit.name }}
              </div>
            </template>
          </div>
          <div class="column-props" v-if="civilians[gameData.enemy_id]">
            <div class="title-property">ENEMY</div>
            <div class="property unit" v-for="(unit, index) in civilians[gameData.enemy_id]" :key="`civilian-enemy-${index}`">
              {{ unit.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getHexagoneColor } from '../common'
import { EventBus } from "../index"

export default {
  name: "controls",
  props: {
    currentCell: Object,
    stocks: Object,
    gameData: Object,
    allyId: String,
    enemyId: String,
    socket: Object,
    selectedUnits: Array
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
    },
    remove () {
      this.socket.emit("action", {
        "kind": "REMOVE_BUILDING",
        "uuid": this.gameData.uuid,
        "cell_id": this.currentCell.index
      })
    },
    isUnitSelected (unit) {
      return this.selectedUnits.find(u => u.uuid == unit.uuid)
    },
    toggleUnit (unit) {
      EventBus.$emit('add-unit-selection', unit)
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

<style lang="scss" scoped>
  #controls {
    width: 100%;
    height: 15vh;
    background-color: burlywood;
    display: flex;
    align-items: center;
  }

  #soil, #building, #buidable, .units {
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2px;
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;
    background: darkseagreen;
    border-color: darkseagreen;
  }
  #header-name {
    min-height: 10%;
    font-size: 10px;
  }
  .column-props {
    padding: 0 3px;
    overflow-y: auto;
    height: 100%;
  }
  .properties {
    height: 80%;
    font-size: 8px;
    display: flex;
    flex-wrap: wrap;
  }
  .property button {
    font-size: 8px;
    margin-bottom: 2px;
    width: 100%;
  }
  .property {
    display: flex;
    margin-right: 2px;
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
  .unit {
    font-size: 7px;
  }
  .ally-unit {
    background: gainsboro;
    border: 1px solid gray;
    padding: 2px;
    margin-top: 1px;
    border-radius: 1px;
    cursor: pointer;
  }
  .ally-unit:hover {
    background: khaki;
  }
  .ally-unit-selected {
    background: lightcoral;
  }
</style>