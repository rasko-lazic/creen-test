<template>
  <div class="battle">
    <div class="battle__title">
      <h3>Battle {{ battle.id }}</h3>
      <div>
        <button v-show="!armyFormIsVisible" @click="armyFormIsVisible = true">Add army</button>
        <button @click="deleteBattle({battleId: battle.id})">Delete</button>
      </div>
    </div>
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
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'Battle',
    props: {
      battle: {
        type: Object,
        required: true
      }
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
      }
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
      callAddArmy() {
        this.addArmy({army: this.newArmy, battleId: this.battle.id})
        this.hideArmyForm()
      },
      ...mapActions([
        'deleteBattle',
        'addArmy'
      ])
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
        max-width: 130px;
        min-height: 22px;
      }
      button:disabled {
        opacity: .4;
      }
    }
  }
</style>
