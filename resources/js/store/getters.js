export const getAttacker = state => battle => {
  let attackerIndex = 0;
  // if this is the first attack in battle, or if the last attacker was last army in array, we return first army in array
  if (battle.attack_logs.length !== 0) {
    const lastAttackLog = battle.attack_logs[battle.attack_logs - 1]
    const lastAttackerIndex = battle.armies.findIndex(a => a.id === lastAttackLog.attacker_id)

    attackerIndex = lastAttackerIndex === battle.armies.length - 1 ? 0 : lastAttackerIndex + 1
  }

  return battle.armies[attackerIndex]
}
