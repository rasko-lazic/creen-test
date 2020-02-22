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
export const deleteBattle = ({commit}, {battleId}) => {
  Vue.prototype.$http.delete(`/battles/${battleId}`)
    .then(() => commit('REMOVE_BATTLE', {battleId}))
    .catch(() => null)
}
export const runAttack = ({commit, getters, dispatch}, {battle}) => {
  if (battle.armies.length >= 5) {
    const attacker = getters.getAttacker(battle)
    Vue.prototype.$http.put(`/armies/${attacker.id}/attack`)
      .then(({data: attackLog}) => console.log(attackLog))
  } else {
    dispatch('showError', {error: {message: 'You need more armies for a battle.'}})
  }
}

/*
 * **********************************
 * Army actions
 * **********************************
 */
export const addArmy = ({commit}, {army, battleId}) => {
  Vue.prototype.$http.post('/armies', {battle_id: battleId, ...army})
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
