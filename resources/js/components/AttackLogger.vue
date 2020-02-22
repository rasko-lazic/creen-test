<template>
  <div class="attack-logger">

  </div>
</template>

<script>
  export default {
    name: 'AttackLogger',
    props: {
      attackLogs: {
        type: Array,
        required: true
      }
    },
    created() {
      // getAttackLogs()
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .attack-logger {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid green;
  }
</style>
