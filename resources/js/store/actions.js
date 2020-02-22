import Vue from 'vue'

/*
 * **********************************
 * Initial data fetch
 * **********************************
 */
export const getBattles = ({commit}) => {
  Vue.prototype.$http.get('/battles').then(({data: battles}) => commit('SET_BATTLES', {battles}))
}
