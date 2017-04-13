
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { connect } from 'react-redux'

export default class ControlPanel extends Component {
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
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>
              Chats
            </Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>
              Store
            </Text>
          </View>
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
