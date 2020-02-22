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
    battle.armies.push(army)
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



