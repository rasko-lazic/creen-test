<template>
  <div class="army">
    <div>
      <p class="army__name">{{ army.name }}</p>
      <p>Status: {{ armyStatus }}</p>
    </div>
    <div class="army__info">
      <p>Current army size: {{ army.current_size }}</p>
      <p>Strategy: {{ army.strategy }}</p>
      <p v-if="army.reloading">Reloading!</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Army',
    props: {
      army: {
        type: Object,
        required: true
      }
    },
    computed: {
      armyStatus() {
        return this.army.current_size > 0 ? 'Active' : 'Defeated'
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .army {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid blue;

    &__name {
      font-size: 14px;
      font-weight: 600;
    }

    &__info {
      font-size: 14px;
    }
  }
</style>
