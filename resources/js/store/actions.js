import Vue from 'vue'

/*
 * **********************************
 * Initial data fetch
 * **********************************
 */
export const getBattles = ({commit}) => {
  Vue.prototype.$http.get('/battles')
    .then(({data: battles}) => commit('SET_BATTLES', {battles}))
    .catch(() => null)
}
export const getAttackLogs = ({commit}, battle) => {
  Vue.prototype.$http.get(`/battles/${battle.id}`)
    .then(({data: attackLogs}) => commit('SET_ATTACK_LOGS', {battle, attackLogs}))
    .catch(() => null)
}

/*
 * **********************************
 * Battle actions
 * **********************************
 */
export const createBattle = ({commit}) => {
  Vue.prototype.$http.post('/battles')
    .then(({data: battle}) => commit('ADD_BATTLE', {battle}))
    .catch(() => null)
}
export const resetBattle = ({commit}, {battleId}) => {
  Vue.prototype.$http.put(`/battles/${battleId}/reset`)
    .then(({data: battle}) => commit('UPDATE_BATTLE', {battle}))
    .catch(() => null)
}
export const deleteBattle = ({commit}, {battleId}) => {
  Vue.prototype.$http.delete(`/battles/${battleId}`)
    .then(() => commit('REMOVE_BATTLE', {battleId}))
    .catch(() => null)
}
export const startBattle = ({state, commit, getters, dispatch}, battle) => {
  !battle.isAutomatic && commit('SET_BATTLE_IS_AUTOMATIC', {battle, value: true})

  dispatch('runAttack', {battle})
    .then(() => {
      battle.isAutomatic && dispatch('startBattle', battle)
    })
    .catch(() => dispatch('pauseBattle', battle))
}
export const pauseBattle = ({commit, dispatch}, battle) => {
  commit('SET_BATTLE_IS_AUTOMATIC', {battle, value: false})
}
export const runAttack = ({commit, getters, dispatch}, {battle}) => new Promise((resolve, reject) => {
  commit('SET_BATTLE_IS_DISABLED', {battle, value: true})

  const attacker = getters.getAttacker(battle)
  if (attacker && getters.getUndefeatedArmies(battle).length > 1) {
    Vue.prototype.$http.put(`/armies/${attacker.id}/attack`)
      .then(({data: attackLog}) => {
        commit('UPDATE_ARMY', {army: attackLog.defender})
        commit('ADD_ATTACK_LOG', {battle, attackLog})
        resolve()
        commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
      })
      .catch(() => commit('SET_BATTLE_IS_DISABLED', {battle, value: false}))
      .catch(() => reject())
  } else {
    commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
    reject()
  }
})

/*
 * **********************************
 * Army actions
 * **********************************
 */
export const addArmy = ({state, getters, commit}, {army, battleId}) => {
  // We need to get ordinal number for new army
  const battle = state.battles.find(b => b.id === battleId)
  let ordinalNumber = battle.armies.length + 1
  if (battle.attack_logs.length > 1) {
    ordinalNumber = getters.getAttacker(battle).ordinal_number
  }

  Vue.prototype.$http.post('/armies', {battle_id: battleId, ordinal_number: ordinalNumber, ...army})
    .then(({data: army}) => commit('ADD_ARMY', {army}))
    .catch(() => null)
}

/*
 * **********************************
 * App maintenance
 * **********************************
 */
export const showError = ({commit}, {error}) => {
  commit('SET_ERROR_VISIBILITY', true)
  commit('SET_ERROR_MESSAGE', {message: error.message})
  setTimeout(() => {
    commit('SET_ERROR_VISIBILITY', false)
    commit('SET_ERROR_MESSAGE', {message: ''})
  }, 10000)
}
