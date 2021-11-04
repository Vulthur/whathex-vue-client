<template>
  <div id="selected-units">
    <div class="unit" v-for="unit in selectedUnits" 
      :key="unit.uuid"
      @click="removeUnit(unit)"
      >
        {{ unit.name }}<template v-if="unit.pv"> : {{ unit.pv }}/{{ unit.max_pv }}</template>
    </div>
    <div id="controls" v-if="selectedUnits.length > 0">
      <button @click="removeAll">Clear</button>
      <button @click="stopUnits">Stop</button>
    </div>
    <div id="groups">
      <template v-for="(group, index) in groups">
        <div @click="selectUnits(group)" class="group" v-if="group.length" :key="index"> {{ index }} </div>
      </template>
    </div>
  </div>
</template>

<script>

import { EventBus } from "../index"

export default {
name: "selectedUnits",
  props: {
    selectedUnits: Array,
    gameData: Object,
    socket: Object,
    groups: Object,
    indexAction: Number,
  },
  methods: {
    removeAll () {
      EventBus.$emit('clear-unit-selection')
    },
    removeUnit (unit) {
      EventBus.$emit('remove-unit-selection', unit)
    },
    stopUnits () {
      EventBus.$emit('stop-selected-unit')
      EventBus.$emit('increment-index-action')
    },
    selectUnits (group) {
      EventBus.$emit('clear-unit-selection')
      EventBus.$emit(
        'add-units-selection',
        group
      )
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
  #selected-units {
    position: fixed;
    bottom: 19vh;
    right: 0;
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 10%;
  }
  .unit {
    font-size: 7px;
    border: 1px solid gray;
    padding: 2px;
    margin-top: 5px;
    border-radius: 1px;
    cursor: pointer;
    width: 80%;
    background: lightcoral;
  }
  .unit:hover {
    background: khaki;
  }
  #controls {
    margin-top: 5px;
    display: flex;
  }
  #controls > * {
    font-size: 8px;
    margin: 2px;
  }
  #groups {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .group {
    font-size: 7px;
    border: 1px solid gray;
    padding: 5px;
    margin: 5px;
    border-radius: 2px;
    cursor: pointer;
    background: lightslategrey;
  }
</style>