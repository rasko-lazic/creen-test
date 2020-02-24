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
export const resetBattle = ({commit, getters}, {battleId}) => {
  // Battle is stopped if it's currently in auto mode
  let battle = getters.getBattleById(battleId)
  battle.isAutomatic && commit('SET_BATTLE_IS_AUTOMATIC', {battle, value: false })

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
      // Check if battle is still in automatic mode after the attack request is resolved
      battle.isAutomatic && dispatch('startBattle', battle)
    })
    .catch(() => dispatch('pauseBattle', battle))
}
export const pauseBattle = ({commit, dispatch}, battle) => {
  commit('SET_BATTLE_IS_AUTOMATIC', {battle, value: false})
}

/*
 * **********************************
 * Attack actions
 * **********************************
 */
export const runAttack = ({commit, getters, dispatch}, {battle}) => new Promise((resolve, reject) => {
  // Disable battle so it can't take any attack commands until attack is resolved
  commit('SET_BATTLE_IS_DISABLED', {battle, value: true})

  const attacker = getters.getAttacker(battle)
  if (attacker && getters.getUndefeatedArmies(battle).length > 1) {
    if (attacker.reloadPromise) {
      // If attacker is currently reloading wait until reload is complete before firing an attack
      attacker.reloadPromise.then(() => {
        dispatch('fireAttack', {battle, armyId: attacker.id, resolve, reject})
      })
    } else {
      dispatch('fireAttack', {battle, armyId: attacker.id, resolve, reject})
    }
  } else {
    // If there are no available attackers or if a winner is decided cancel the attack
    commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
    reject()
  }
})
export const fireAttack = ({commit, dispatch}, {battle, armyId, resolve, reject}) => {
  Vue.prototype.$http.put(`/armies/${armyId}/attack`)
    .then(({data: attackLog}) => {
      // Updating current_size with fresh backend data
      commit('UPDATE_ARMY_SIZE', {battle, armyId: attackLog.defender.id, currentSize: attackLog.defender.current_size})
      commit('ADD_ATTACK_LOG', {battle, attackLog})
      dispatch('startReload', {battle, armyId: attackLog.attacker_id})
      commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
      resolve()
    })
    .catch(() => {
      commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
      reject()
    })
}

/*
 * **********************************
 * Army actions
 * **********************************
 */
export const addArmy = ({state, getters, commit}, {army, battleId}) => {
  // We need to get ordinal number for new army
  const battle = getters.getBattleById(battleId)
  let ordinalNumber = battle.armies.length + 1
  if (battle.attack_logs.length > 1) {
    ordinalNumber = getters.getAttacker(battle).ordinal_number
  }

  Vue.prototype.$http.post('/armies', {battle_id: battleId, ordinal_number: ordinalNumber, ...army})
    .then(({data: army}) => commit('ADD_ARMY', {army}))
    .catch(() => null)
}
export const startReload = ({state, commit}, {battle, armyId}) => {
  let army = battle.armies.find(a => a.id === armyId)
  // Store promise that resolves once reload is complete in army object
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      commit('SET_ARMY_RELOAD_PROMISE', {army, promise: null})
      resolve()
    }, army.current_size * state.reloadIntervalPerUnit)
  })

  commit('SET_ARMY_RELOAD_PROMISE', {army, promise})
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
