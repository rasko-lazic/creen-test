<template>
  <div class="full-height">
    <div class="battle-simulator">
      <h1 class="battle-simulator__title">Battle simulator</h1>
      <button @click="createBattle">Create a new battle</button>
      <div class="battle-container">
        <battle v-for="battle in battles" :key="battle.id" :battle="battle"></battle>
      </div>
    </div>
    <p v-if="errorIsVisible" class="error-container">{{ errorMessage }}</p>
    <div class="legend">
      <p>Legend</p>
      <p class="legend__caption legend__caption_blue">Stand-by army</p>
      <p class="legend__caption legend__caption_red">Attacking army</p>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import Battle from './components/Battle'

  export default {
    components: {
      Battle
    },
    computed: {
      ...mapState({
        errorIsVisible: state => state.error.visibility,
        errorMessage: state => state.error.message,
        battles: state => state.battles
      })
    },
    methods: {
      ...mapActions([
        'getBattles',
        'createBattle'
      ])
    },
    created() {
      this.getBattles()
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .battle-simulator {
    color: #2c3e50;
    text-align: center;

    &__title {
      padding: 30px;
      color: #2c3e50;
      font-size: 24px;
      font-weight: bold;
    }

    .battle-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 40px 20px;
      text-align: left;
    }
  }

  .error-container {
    bottom: 0;
    position: fixed;
    width: 100%;
    padding: 10px 20px;
    background-color: darkred;
    color: white;
    font-size: 14px;
    text-align: center;
  }

  .legend {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px;
    border: 1px solid black;

    &__caption {
      margin-top: 10px;
      font-size: 14px;
      padding: 2px 4px;
      border: 1px solid;

      &_blue {
        border-color: blue;
      }
      &_red {
        border-color: red;
      }
    }
  }
</style>
