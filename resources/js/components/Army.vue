<template>
  <div class="army" :class="{army_attacker: isAttacker}">
    <div>
      <p class="army__name">{{ army.name }}</p>
      <p>Status: {{ armyStatus }}</p>
    </div>
    <div class="army__info">
      <p>Current army size: {{ army.current_size }}</p>
      <p>Strategy: {{ army.strategy }}</p>
      <p v-if="army.reloading">Reloading!</p>
    </div>
    <div v-if="isWinner" class="army__winner-overlay">Winner</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Army',
    props: {
      army: {
        type: Object,
        required: true
      },
      battle: {
        type: Object,
        required: true
      }
    },
    computed: {
      armyStatus() {
        return this.army.current_size > 0 ? 'Active' : 'Defeated'
      },
      isAttacker() {
        // Attacker shouldn't be marked if he is the winner
        return this.getUndefeatedArmies(this.battle).length > 1 && this.getAttacker(this.battle).id === this.army.id
      },
      isWinner() {
        const undefeatedArmies = this.getUndefeatedArmies(this.battle)

        return this.battle.armies.length > 5 && undefeatedArmies.length === 1 && undefeatedArmies[0].id === this.army.id
      },
      ...mapGetters([
        'getAttacker',
        'getUndefeatedArmies'
      ])
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .army {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid blue;

    &_attacker {
      border: 1px solid red;
    }

    &__name {
      font-size: 14px;
      font-weight: 600;
    }
    &__info {
      font-size: 14px;
    }
    &__winner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      padding-top: 12px;
      background-color: white;
      color: green;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      box-sizing: border-box;
    }
  }
</style>
