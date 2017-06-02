
import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'
import { getImageWithChaId } from './profileImageMap'

class Profile extends React.Component {
  leftButtonConfig = {
    title: 'Back',
    tintColor: 'black',
    handler: () => this._onBackPress(),
  }

  _onBackPress() {
    const { navigator } = this.props
    navigator.pop()
  }

  render() {
    const { characters, curChat } = this.props
    const { cha_id } = curChat
    const char = characters.find((cha) => { return cha.cha_id === cha_id})

    if (!char) return (<View></View>)

    const { age, distance_in_miles, first_name, raw_bio, school } = char

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: `${first_name}`}}
        />

        <View style={styles.image_container}>
          <Image
            resizeMode="cover"
            style={styles.image_main}
            source={getImageWithChaId(cha_id)}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.line_first}>
            <Text style={[styles.text_name, styles.text_first_line]}>
              {first_name},
            </Text>
            <Text style={styles.text_first_line}>
              {age}
            </Text>
          </View>
          <Text style={styles.text_school}>
            {school}
          </Text>
          <Text>
            {raw_bio}
          </Text>

        </View>
      </View>
    )
  }
}

const { height, width } = Dimensions.get('window')

const IMAGE_RELATIVE_SIZE = 0.75
const IMAGE_SIZE = width * IMAGE_RELATIVE_SIZE

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image_container: {
    alignItems: 'center'
  },
  image_main: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginTop: 20,
    marginBottom: 10
  },
  content: {
    padding: 30
  },
  line_first: {
    flexDirection: 'row'
  },
  text_first_line: {
    fontSize: 18,
    marginBottom: 5
  },
  text_name: {
    fontWeight: '600',
    marginRight: 5
  },
  text_school: {
    marginBottom: 30
  }
})

const mapStateToProps = (state) => {
  const { characters, currentChat } = state
  return {
    characters,
    curChat: currentChat
  }
}

export default connect(mapStateToProps)(Profile)
