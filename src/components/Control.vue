<template>
  <div id="controls">
    <template v-if="currentCell && currentCell.soil && gameData">
      <!-- SOIL -->
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
      <!-- BUILDING -->
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
      <!-- BUILDABLE -->
      <div id="buidables" v-if="buildables.length && currentCell.owner === gameData.ally_id">
        <div id="header-name">BUILDABLES</div>
        <div class="properties">
          <div class="column-props productibles">
            <div class="property productible" v-for="(buildable, index) in buildables" :key="`buildable-${index}`">
              <button @click="build(buildable)"
                :disabled="!canBuild(buildable)">{{ `${buildable.toUpperCase()}` }}</button>
            </div>
          </div>
        </div>
      </div>
      <!-- PRODUCTS -->
      <div id="productibles" v-if="productibles && Object.keys(productibles).length && currentCell.owner === gameData.ally_id">
        <div id="header-name">PRODUCTIBLES</div>
        <div class="properties">
          <div class="column-props productibles">
              <div class="property productible" v-for="(product, index) in building.productibles" :key="`product-${index}`">
              <button @click="produce(product)"
                :disabled="!canProduce(product)">{{ `${product.toUpperCase()}` }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- MILITARY -->
      <div class="units" 
          v-if="(militaries[gameData.ally_id] && militaries[gameData.ally_id].length) 
            || (militaries[gameData.enemy_id] && militaries[gameData.enemy_id].length)"
      >
        <div id="header-name">MILITARY</div>
        <div class="properties">
          <div class="column-props" v-if="(militaries[gameData.ally_id] && militaries[gameData.ally_id].length)">
            <div class="title-property">ALLY</div>
            <draggable v-model="militaries[gameData.ally_id]" @end="orderUnit">
              <template v-for="(unit, index) in militaries[gameData.ally_id]">
                <div :class="{'ally-unit-selected' : isUnitSelected(unit)}"
                    class="property unit ally-unit"
                    :key="`military-ally-${index}`"
                    @click="toggleUnit(unit)">
                  {{ unit.name }} : {{ unit.pv }}/{{ unit.max_pv }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="column-props" v-if="militaries[gameData.enemy_id] && militaries[gameData.enemy_id].length">
            <div class="title-property">ENEMY</div>
            <div class="property unit" v-for="(unit, index) in militaries[gameData.enemy_id]" :key="`military-enemy-${index}`">
              {{ unit.name }} : {{ unit.pv }} / {{ unit.max_pv }}
            </div>
          </div>
        </div>
      </div>
      <!-- CIVILIAN -->
      <div class="units"
        v-if="(civilians[gameData.ally_id] && civilians[gameData.ally_id].length)
          || (civilians[gameData.enemy_id] && civilians[gameData.enemy_id].length)"
      >
        <div id="header-name">CIVILIAN</div>
        <div class="properties">
          <div class="column-props" v-if="(civilians[gameData.ally_id] && civilians[gameData.ally_id].length)">
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
          <div class="column-props" v-if="(civilians[gameData.enemy_id] && civilians[gameData.enemy_id].length)">
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
import draggable from 'vuedraggable'

export default {
  name: "controls",
  props: {
    currentCell: Object,
    stocks: Object,
    gameData: Object,
    allyId: String,
    enemyId: String,
    socket: Object,
    selectedUnits: Array,
    indexAction: Number,
  },
  components: {
    draggable,
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
        "index": this.indexAction,
        "kind": "ADD_BUILDING",
        "uuid": this.gameData.uuid,
        "building_uid": building,
        "cell_id": this.currentCell.index
      })
      EventBus.$emit('increment-index-action')
    },
    produce (product) {
      this.socket.emit("action", {
        "index": this.indexAction,
        "kind": "ADD_PRODUCT",
        "uuid": this.gameData.uuid,
        "product_id": product,
        "cell_id": this.currentCell.index
      })
      EventBus.$emit('increment-index-action')
    },
    remove () {
      this.socket.emit("action", {
        "index": this.indexAction,
        "kind": "REMOVE_BUILDING",
        "uuid": this.gameData.uuid,
        "cell_id": this.currentCell.index
      })
      EventBus.$emit('increment-index-action')
    },
    orderUnit () {
      if (!this.militaries[this.gameData.ally_id] || !this.militaries[this.gameData.ally_id].length) {
        return
      }
      this.socket.emit("action", {
        "index": this.indexAction,
        "kind": "ORDER",
        "uuid": this.gameData.uuid,
        "cell_id": this.currentCell.index,
        "unit_uuids": this.militaries[this.gameData.ally_id].map(u => u.uuid)
      })
      EventBus.$emit('increment-index-action')
    },
    isUnitSelected (unit) {
      return this.selectedUnits.find(u => u.uuid == unit.uuid)
    },
    toggleUnit (unit) {
      EventBus.$emit('add-unit-selection', unit)
    },
  },
  computed: {
    soil () {
      return this.currentCell.soil
    },
    building () {
      return this.currentCell.building
    },
    productibles () {
      return this.currentCell.building ? this.currentCell.building.productibles : null
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
    height: 15vh;
    background-color: burlywood;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    padding: 5px;
    border-radius: 0 5px 0 0;
  }

  #soil, #building, #buidables, .units, #productibles {
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
  #buidables, #productibles {
    max-width: 102px;
  }
  #header-name {
    min-height: 10%;
    font-size: 10px;
  }
  .column-props {
    padding: 0 3px;
    height: 100%;
    overflow-y: auto;
  }
  .properties {
    height: 80%;
    font-size: 8px;
    display: flex;
    flex-wrap: wrap;
  }
  .property button {
    font-size: 8px;
    margin-top: 2px;
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
  .productibles {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow-y: auto;
    margin-top: 2px;
  }
  .productible {
    width: 30px;
    height: 30px;
    word-break: break-all;
  }
  .productible button {
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