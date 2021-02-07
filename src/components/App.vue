<template>
  <div id="test">
    <h1>{{ message }}</h1>
  </div>
</template>

<style>
  #test {
    color: blue;
  }
</style>

<script>
  export default {
    data() {
      return {
        message: 'Hello Vue !'
      }
    }
  };
</script>
