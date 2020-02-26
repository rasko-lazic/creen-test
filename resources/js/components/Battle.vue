<template>
  <div class="battle">
    <div class="battle__title">
      <h3>Battle {{ battle.id }}</h3>
      <div>
        <div>
          <button v-if="battle.isAutomatic" @click="pauseBattle(battle)">Pause battle</button>
          <button v-else :disabled="battle.isDisabled || winnerExists" @click="startBattle(battle)">Start battle</button>
          <button @click="resetBattle({battleId: battle.id})">Restart battle</button>
          <button @click="deleteBattle({battleId: battle.id})">Delete battle</button>
        </div>
        <div>
          <button :disabled="battle.isDisabled || winnerExists" @click="runAttack({battle})">Attack</button>
          <button v-show="!armyFormIsVisible" @click="armyFormIsVisible = true">Add army</button>
          <button @click="addRandomArmy">Add random army</button>
        </div>
      </div>
    </div>
    <army v-for="army in battle.armies" :key="army.id" :army="army" :battle="battle"></army>
    <div v-if="armyFormIsVisible" class="army-form">
      <input class="army-form__input" title="Name" placeholder="Name" type="text" v-model="newArmy.name" />
      <input class="army-form__input" title="Size" placeholder="Size" type="number" min="80" max="100" v-model="newArmy.size" />
      <select class="army-form__input" title="Strategy" v-model="newArmy.strategy">
        <option value="Random">Random</option>
        <option value="Weakest">Weakest</option>
        <option value="Strongest">Strongest</option>
      </select>
      <button :disabled="!formIsValid" @click="callAddArmy">Save</button>
      <button @click="hideArmyForm">Cancel</button>
    </div>

    <attack-logger :attack-logs="battle.attack_logs"></attack-logger>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {getRandomInt} from '../helpers'
  import Army from './Army'
  import AttackLogger from './AttackLogger'

  export default {
    name: 'Battle',
    props: {
      battle: {
        type: Object,
        required: true
      }
    },
    components: {
      Army,
      AttackLogger
    },
    data() {
      return {
        armyFormIsVisible: false,
        newArmy: {
          name: '',
          size: '',
          strategy: null
        }
      }
    },
    computed: {
      formIsValid() {
        return this.newArmy.name.trim().length > 0 &&
          this.newArmy.size >= 80 && this.newArmy.size <= 100 &&
          this.newArmy.strategy
      },
      winnerExists() {
        return this.getUndefeatedArmies(this.battle).length === 1
      },
      ...mapGetters([
        'getUndefeatedArmies'
      ])
    },
    methods: {
      hideArmyForm() {
        this.armyFormIsVisible = false
        this.newArmy = {
          name: '',
          size: '',
          strategy: ''
        }
      },
      addRandomArmy() {
        this.addArmy({
          newArmy: {
            name: `Division_${getRandomInt(100, 999)}`,
            size: getRandomInt(80, 100),
            strategy: ['Random', 'Weakest', 'Strongest'][getRandomInt(0, 2)]
          },
          battleId: this.battle.id
        })
      },
      callAddArmy() {
        this.addArmy({newArmy: this.newArmy, battleId: this.battle.id})
        this.hideArmyForm()
      },
      ...mapActions([
        'addArmy',
        'runAttack',
        'startBattle',
        'pauseBattle',
        'resetBattle',
        'deleteBattle',
        'getAttackLogs',
      ])
    },
    created() {
      this.getAttackLogs(this.battle)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .battle {
    width: 30%;
    min-width: 400px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid black;

    &__title {
      display: flex;
      justify-content: space-between;
    }

    .army-form {
      margin-top: 15px;

      &__input {
        box-sizing: border-box;
        max-width: 126px;
        min-height: 22px;
      }
    }
  }
</style>
