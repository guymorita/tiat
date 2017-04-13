
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'

export default class ControlPanel extends Component {
  _onChatPress = () => {
    const { navigator } = this.props
    navigator.push({
      title: 'Matches'
    })
  }

  _onStorePress = () => {
    const { navigator } = this.props
    navigator.push({
      title: 'Store'
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
            leftButton={this.leftButtonConfig}
            rightButton={__DEV__ ? this.devButtonConfig : this.blankButtonConfig}
            tintColor={"#F8F8F8"}
            title={{title: "Wing"}}
          />
        <View>
          <TouchableOpacity onPress={this._onChatPress.bind(this)}>
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>
                Chats
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onStorePress.bind(this)}>
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>
                Store
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  sectionHeader: {
    marginLeft: 20,
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff'
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD'
  },
  menuItemText: {
    fontSize: 18,
    color: '#606060',
    fontWeight: '500'
  }
})
