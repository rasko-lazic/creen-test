export default {
  /*
   * **********************************
   * Battle mutations
   * **********************************
   */
  ['SET_BATTLES'] (state, {battles}) {
    state.battles = battles
  },
  ['ADD_BATTLE'] (state, {battle}) {
    state.battles.push(battle)
  },
  ['UPDATE_BATTLE'] (state, {battle}) {
    const battleIndex = state.battles.findIndex(b => b.id === battle.id)
    state.battles.splice(battleIndex, 1, battle)
  },
  ['REMOVE_BATTLE'] (state, {battleId}) {
    state.battles = state.battles.filter(b => b.id !== battleId)
  },

  /*
   * **********************************
   * Army mutations
   * **********************************
   */
  ['ADD_ARMY'] (state, {army}) {
    let battle = state.battles.find(b => b.id === army.battle_id)
    battle.armies.splice(army.ordinal_number - 1, 0, army)
  },
  ['UPDATE_ARMY'] (state, {army}) {
    let battle = state.battles.find(b => b.id === army.battle_id)
    const armyIndex = battle.armies.findIndex(a => a.id === army.id)
    battle.armies.splice(armyIndex, 1, army)
  },

  /*
   * **********************************
   * Attack log mutations
   * **********************************
   */
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



