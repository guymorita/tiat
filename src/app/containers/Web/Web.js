import React from 'react'
import {
  StyleSheet,
  View,
  WebView
} from 'react-native'

import NavigationBar from 'react-native-navbar'
import BackButton from '../../components/Nav/BackButton'

export default class Web extends React.Component {
  _onBackPress() {
    const { navigator } = this.props
    navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<BackButton onBackPress={this._onBackPress.bind(this)} />}
          tintColor={"#F8F8F8"}
        />
        <WebView
          source={{uri: 'http://www.heywing.com/privacy.html'}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
