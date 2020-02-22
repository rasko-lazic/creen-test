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
  commit('SET_ERROR_MESSAGE', {message: error.data.message})
  setTimeout(() => {
    commit('SET_ERROR_VISIBILITY', false)
    commit('SET_ERROR_MESSAGE', {message: ''})
  }, 10000)
}
