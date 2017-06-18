

export const INTRO_FINISHED = 'INTRO_FINISHED'
export const OPEN_DRAWER = 'OPEN_DRAWER'
export const CLOSE_DRAWER = 'CLOSE_DRAWER'
export const NOTIF_NEW_MATCHES_DAILY = 'NOTIF_NEW_MATCHES_DAILY'

export function introFinished() {
  return {
    type: INTRO_FINISHED
  }
}

export function openDrawer() {
  return {
    type: OPEN_DRAWER
  }
}

export function closeDrawer() {
  return {
    type: CLOSE_DRAWER
  }
}

export function notifNewMatchesDaily() {
  return {
    type: NOTIF_NEW_MATCHES_DAILY
  }
}
