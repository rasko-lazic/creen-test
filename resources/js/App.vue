<template>
  <div class="battle-simulator">
    <h3 class="battle-simulator__title">Battle simulator</h3>
    <div class="battle-simulator">
      <button @click="">Create a new battle</button>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    methods: {
      ...mapActions([
        'getBattles'
      ])
    },
    created() {
      this.getBattles()
    }
  }
</script>

<style type="text/scss" lang="scss">
  .battle-simulator {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    &__title {
      padding: 20px;
      color: #2c3e50;
      font-weight: bold;
    }
  }
</style>
