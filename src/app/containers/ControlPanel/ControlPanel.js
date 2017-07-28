
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'

class ControlPanel extends Component {
  _onChatPress = () => {
    const { closeDrawer, navigator } = this.props
    navigator.push({
      title: 'Matches'
    })
    closeDrawer()
  }

  _onStorePress = () => {
    const { closeDrawer, navigator } = this.props
    navigator.push({
      title: 'Store'
    })
    closeDrawer()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
            tintColor={"#F8F8F8"}
          />
        <View style={styles.content}>
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
          <View style={styles.version}>
            <Text style={styles.versionText}>
              v1.2
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const PADDING = 15

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  content: {
    flex: 1
  },
  menuItem: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD'
  },
  menuItemText: {
    fontSize: 18,
    color: '#606060',
    fontWeight: '500'
  },
  version: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: PADDING,
    marginBottom: PADDING
  },
  versionText: {
    alignSelf: 'flex-end',
    color: '#909090'
  }
})

export default ControlPanel