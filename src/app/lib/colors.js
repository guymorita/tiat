
import {
  StyleSheet
} from 'react-native'

export const TINDER_COLOR = '#EC736B'
const IMESSAGE_COLOR = '#2D75FA'

export const LIGHT_BLUE = '#60B9F9'
export const BABY_BLUE = '#D0E2F4'
export const LIGHT_GRAY = '#F0F0F0'
export const LIGHT_PURPLE = '#5E38B8'

export const getBackgroundStyle = (platform) => {
  switch(platform) {
    case 'tinder':
      return styles.backgroundTinder
    case 'iMessage':
      return styles.backgroundiMessage
  }
}

export const getBackgroundColor = (platform) => {
  switch(platform) {
    case 'tinder':
      return TINDER_COLOR
    case 'iMessage':
      return IMESSAGE_COLOR
  }
}

const styles = StyleSheet.create({
  backgroundTinder: {
    backgroundColor: TINDER_COLOR,
  },
  backgroundiMessage: {
    backgroundColor: IMESSAGE_COLOR
  }
})