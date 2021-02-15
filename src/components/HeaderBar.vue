<template>
  <div id="header">
    <div id="stocks">
      <div v-for="(stock, key, index) in stocks" :key="index" class="stock">
        {{ key }} : {{ stock }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "header-bar",
    props: {
      stocks: Object
    }
}
</script>

<style lang="scss">
  #header {
    width: 27vw;
    height: 3.5vh;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 1;
  }
  #stocks {
    width: 100%;
  }
  #stocks {
    background-color: rgb(50, 102, 104);
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    border-radius: 0 0 5px 0;
  }
  .stock {
    font-size: 11px;
    border-radius: 2px;
    background-color: coral;
    padding: 3px;
    color: white;
    letter-spacing: -0.005rem;
    text-transform: uppercase;
  }
</style>