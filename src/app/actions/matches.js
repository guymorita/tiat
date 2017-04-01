
export const FIND_MATCHES_TO_SHOW = 'FIND_MATCHES_TO_SHOW'

function findMatchesToShow(matches) {
  return {
    type: FIND_MATCHES_TO_SHOW,
    matches
  }
}

export function findMatches(matchesAll, matchQueue) {
  return (dispatch, getState) => {
    const { current_day } = matchQueue
    const { queue } = current_day
    const filteredMatchQueue = queue.map((match) => { return match.key })
    // FIX filter matches with incomplete timer out

    const matchIncluded = match => filteredMatchQueue.includes(match.key)
    const matchesToShow = matchesAll.filter(matchIncluded)
    return dispatch(findMatchesToShow(matchesToShow))
  }
}