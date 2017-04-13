

export const INTRO_FINISHED = 'INTRO_FINISHED'
export const OPEN_DRAWER = 'OPEN_DRAWER'
export const CLOSE_DRAWER = 'CLOSE_DRAWER'

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