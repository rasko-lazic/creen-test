export const getAttacker = state => battle => {
  // There is no next attacker if battle can't start or if it's completed
  if (battle.armies.length < 5 || battle.armies.filter(a => a.current_size > 0).length < 2) {
    return false
  }

  let attackerIndex = 0;
  const lastArmyIndex = battle.armies.length - 1
  // If this is the first attack in battle, or if the last attacker was last army in array, we return first army in array
  if (battle.attack_logs.length !== 0) {
    const lastAttackLog = battle.attack_logs[battle.attack_logs.length - 1]
    let previousAttackerIndex = battle.armies.findIndex(a => a.id === lastAttackLog.attacker_id)
    attackerIndex = previousAttackerIndex === lastArmyIndex ? 0 : previousAttackerIndex

    do {
      attackerIndex = attackerIndex === lastArmyIndex ? 0 : attackerIndex + 1
    } while (battle.armies[attackerIndex].current_size === 0)
  }

  return battle.armies[attackerIndex]
}
