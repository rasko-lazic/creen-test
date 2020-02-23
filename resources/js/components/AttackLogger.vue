<template>
  <div v-if="attackLogs.length > 0" class="attack-logger">
    <h4 class="attack-logger__title">Attack logs</h4>
    <p v-for="log in attackLogs" :key="log.id" class="attack-logger__log">
      {{ `${moment(log.created_at, 'x').format('HH:mm:ss.SSS')} - ${getParsedLogCaption(log)}` }}
    </p>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'AttackLogger',
    props: {
      attackLogs: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        moment
      }
    },
    methods: {
      getParsedLogCaption(log) {
        if (log.damage > 0) {
          let caption = `Army ${log.attacker.name} attacked army ${log.defender.name} for ${log.damage} damage. `
          caption += log.defender_defeated ? `Army ${log.defender.name} was defeated. ` : ''
          caption += log.attacker_victorious ? `Army ${log.attacker.name} is victorious. ` : ''
          return caption
        } else {
          return `Army ${log.attacker.name} attempted an attack on army ${log.defender.name} and they failed.`
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .attack-logger {
    max-height: 150px;
    margin-top: 20px;
    padding: 10px;
    border: 1px solid green;
    overflow: auto;

    &__title {
      margin-bottom: 10px;
    }
    &__log {
      font-size: 14px;
    }
  }
</style>
