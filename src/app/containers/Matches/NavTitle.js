
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { getImageWithChaId } from './profileImageMap'

export default class NavTitle extends React.Component {
  render() {
    const { character } = this.props
    const { cha_id, first_name } = character
    return (
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={getImageWithChaId(cha_id)}
        />
        <Text style={styles.name}>
          {first_name}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
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
