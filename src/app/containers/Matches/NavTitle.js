
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { getImageWithChaId } from './profileImageMap'

export default class NavTitle extends React.Component {
  render() {
    const { character, onPress } = this.props
    const { cha_id, first_name } = character
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Image
            style={styles.profileImage}
            source={getImageWithChaId(cha_id)}
          />
          <Text style={styles.name}>
            {first_name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  name: {
    fontSize: 16,
    fontWeight: '500'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  }
})
