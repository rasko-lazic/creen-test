import Vue from 'vue'

export default {
  /*
   * **********************************
   * Battle mutations
   * **********************************
   */
  ['SET_BATTLES'] (state, {battles}) {
    Vue.set(state, 'battles', battles.map(battle => generateBattleObject(battle)))
  },
  ['ADD_BATTLE'] (state, {battle}) {
    battle = generateBattleObject(battle)
    state.battles.push(battle)
  },
  ['UPDATE_BATTLE'] (state, {battle}) {
    const battleIndex = state.battles.findIndex(b => b.id === battle.id)
    battle = generateBattleObject(battle)

    battleIndex > -1 && state.battles.splice(battleIndex, 1, battle)
  },
  ['REMOVE_BATTLE'] (state, {battleId}) {
    state.battles = state.battles.filter(b => b.id !== battleId)
  },
  ['SET_BATTLE_IS_DISABLED'] (state, {battle, value}) {
    Vue.set(battle, 'isDisabled', value)
  },
  ['SET_BATTLE_IS_AUTOMATIC'] (state, {battle, value}) {
    Vue.set(battle, 'isAutomatic', value)
  },

  /*
   * **********************************
   * Army mutations
   * **********************************
   */
  ['ADD_ARMY'] (state, {army}) {
    let battle = state.battles.find(b => b.id === army.battle_id)
    battle.armies.splice(army.ordinal_number - 1, 0, generateArmyObject(army))
  },
  ['UPDATE_ARMY_SIZE'] (state, {battle, armyId, currentSize}) {
    let army = battle.armies.find(a => a.id === armyId)
    // Clear reload promise if army is defeated
    currentSize === 0 && Vue.set(army, 'reloadPromise', null)
    Vue.set(army, 'current_size', currentSize)
  },
  ['SET_ARMY_RELOAD_PROMISE'] (state, {army, promise}) {
    Vue.set(army, 'reloadPromise', promise)
  },

  /*
   * **********************************
   * Attack log mutations
   * **********************************
   */
  ['SET_ATTACK_LOGS'] (state, {battle, attackLogs}) {
    Vue.set(battle, 'attack_logs', attackLogs)
  },
  ['ADD_ATTACK_LOG'] (state, {battle, attackLog}) {
    battle.attack_logs.push(attackLog)
  },

  /*
   * **********************************
   * App maintenance
   * **********************************
   */
  ['SET_ERROR_VISIBILITY'] (state, visibility) {
    state.error.visibility = visibility
  },
  ['SET_ERROR_MESSAGE'] (state, {message}) {
    state.error.message = message
  }
}

export const generateBattleObject = battle => {
  return {
    ...battle,
    armies: battle.armies.map(army => generateArmyObject(army)),
    isDisabled: false,
    isAutomatic: false
  }
}
export const generateArmyObject = army => {
  return {
    ...army,
    reloadPromise: null
  }
}



