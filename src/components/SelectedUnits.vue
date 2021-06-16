<template>
  <div id="selected-units">
    <div class="unit" v-for="unit in selectedUnits" 
      :key="unit.uuid"
      @dblclick="removeUnit(unit)"
      >
        {{ unit.name }}<template v-if="unit.pv"> : {{ unit.pv }}/{{ unit.max_pv }}</template>
    </div>
    <div id="controls" v-if="selectedUnits.length > 0">
      <button @click="removeAll">Clear</button>
      <button @click="stopUnits">Stop</button>
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
  },
  methods: {
    removeAll () {
      EventBus.$emit('clear-unit-selection')
    },
    removeUnit (unit) {
      EventBus.$emit('remove-unit-selection', unit)
    },
    stopUnits () {
      this.socket.emit("action", {
        "kind": "STOP",
        "uuid": this.gameData.uuid,
        "unit_uuids": this.selectedUnits.map(u => u.uuid)
      })
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
    background: gainsboro;
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
  }
</style>