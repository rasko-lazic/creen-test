import Vue from 'vue'

/*
 * **********************************
 * Initial data fetch
 * **********************************
 */
export const getBattles = async ({commit}) => {
  try {
    let {data: battles} = await Vue.prototype.$http.get('/battles')
    commit('SET_BATTLES', {battles})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}
export const getAttackLogs = async ({commit}, battle) => {
  try {
    let {data: attackLogs} = await Vue.prototype.$http.get(`/battles/${battle.id}`)
    commit('SET_ATTACK_LOGS', {battle, attackLogs})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}

/*
 * **********************************
 * Battle actions
 * **********************************
 */
export const createBattle = async ({commit}) => {
  try {
    let {data: battle} = await Vue.prototype.$http.post('/battles')
    commit('ADD_BATTLE', {battle})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}
export const deleteBattle = async ({commit, getters, dispatch}, {battleId}) => {
  // Battle is stopped if it's currently in auto mode
  let battle = getters.getBattleById(battleId)
  battle.isAutomatic && dispatch('pauseBattle', battle)

  try {
    await Vue.prototype.$http.delete(`/battles/${battleId}`)
    commit('REMOVE_BATTLE', {battleId})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}
export const resetBattle = async ({commit, getters, dispatch}, {battleId}) => {
  // Battle is stopped if it's currently in auto mode
  let battle = getters.getBattleById(battleId)
  battle.isAutomatic && dispatch('pauseBattle', battle)

  try {
    let {data: battle} = await Vue.prototype.$http.put(`/battles/${battleId}/reset`)
    commit('UPDATE_BATTLE', {battle})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}
export const startBattle = ({state, commit, getters, dispatch}, battle) => {
  // Since the action will be called again, isAutomatic should be set only if it's needed
  !battle.isAutomatic && commit('SET_BATTLE_IS_AUTOMATIC', {battle, value: true})

  dispatch('runAttack', {battle})
    // Check if battle is still in automatic mode after the attack request is resolved
    .then(() => battle.isAutomatic && dispatch('startBattle', battle))
    // If the attack wasn't completed for any reason, auto mode is terminated
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

  // Check if valid attacker exists
  if (attacker && getters.getUndefeatedArmies(battle).length > 1) {
    if (attacker.reloadPromise) {
      // If attacker is currently reloading wait until reload is complete before firing an attack
      attacker.reloadPromise.then(battleIsAutomatic => {
        // If the battle stopped being in auto mode during the wait for reloadPromise, the attack is halted
        // and battle isn't disabled any more
        if (battleIsAutomatic) {
          // Attacker getter is used instead of attacker object just in case new army was added
          // while we were waiting for reloadPromise to resolve
          dispatch('fireAttack', {battle, armyId: getters.getAttacker(battle).id, resolve, reject})
            .finally(() => commit('SET_BATTLE_IS_DISABLED', {battle, value: false}))
        } else {
          commit('SET_BATTLE_IS_DISABLED', {battle, value: false})
        }
      })
    } else {
      // If there is no reloadPromise, just fire the attack normally
      dispatch('fireAttack', {battle, armyId: attacker.id, resolve, reject})
        .finally(() => commit('SET_BATTLE_IS_DISABLED', {battle, value: false}))
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
      // Updating current_size of defender with fresh backend data
      commit('UPDATE_ARMY_SIZE', {battle, armyId: attackLog.defender.id, currentSize: attackLog.defender.current_size})
      commit('ADD_ATTACK_LOG', {battle, attackLog})
      dispatch('startReload', {battle, armyId: attackLog.attacker_id})
      resolve()
    })
    .catch(reject)
}

/*
 * **********************************
 * Army actions
 * **********************************
 */
export const addArmy = async ({state, getters, commit}, {newArmy, battleId}) => {
  // We need to get ordinal number for new army
  const battle = getters.getBattleById(battleId)
  let ordinalNumber = battle.armies.length + 1
  if (battle.attack_logs.length > 1) {
    ordinalNumber = getters.getAttacker(battle).ordinal_number
  }

  try {
    let {data: army} = await Vue.prototype.$http.post('/armies', {
      battle_id: battleId,
      ordinal_number: ordinalNumber,
      ...newArmy
    })
    commit('ADD_ARMY', {army})
  } catch (e) {
    // Error is parsed in axios interceptor
  }
}
export const startReload = ({state, commit}, {battle, armyId}) => {
  let army = battle.armies.find(a => a.id === armyId)
  // Store promise that resolves once reloading is done in army object
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      commit('SET_ARMY_RELOAD_PROMISE', {army, promise: null})
      resolve(battle.isAutomatic)
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
