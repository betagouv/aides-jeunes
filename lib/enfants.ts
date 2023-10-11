/*
 *   this function verify that all questions have been answered for every child
 *   by checking that the last question sets through individuBlockFactory regarding
 *   a child (enfant_a_charge) has been answered
 */
export function childStepsComplete(situation) {
  if (situation.enfants) {
    return situation.enfants?.every(
      (enfant) => Object.keys(enfant.enfant_a_charge).length
    )
  }
  return false
}
export function getIncompleteChildId(situation) {
  return situation.enfants?.find(
    (enfant) => Object.keys(enfant.enfant_a_charge).length === 0
  ).id
}
