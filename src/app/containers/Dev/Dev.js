
import React from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import moment from 'moment'

import { findMatches } from '../../actions/matches'
import { invJumpsAdd, invKeysAdd } from '../../actions/inventory'
import { LIGHT_GRAY } from '../../lib/colors'
import { perStore } from '../../../Client'

class Dev extends React.Component {
  leftButtonConfig = {
    title: 'Back',
    tintColor: 'black',
    handler: () => this._onBackPress(),
  }

  _onBackPress = () => {
    const { navigator } = this.props
    navigator.pop()
  }

  _onAdvanceDayPress = () => {
    const { activeChats, currentMatches, dispatch } = this.props

    // TODO advance stuff
  }

  _onAddJumpsPress = () => {
    const { dispatch } = this.props
    dispatch(invJumpsAdd(3))
  }

  _onAddKeysPress = () => {
    const { dispatch } = this.props
    dispatch(invKeysAdd(3))
  }

  _onPurgePress = () => {
    perStore.purge()
    alert('Data purged, force stop the app, and restart')
  }

  render() {
    const { date } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: 'Dev'}}
        />
        <ScrollView>
          <View style={styles.section}>
            <View style={[styles.row, styles.header]}>
              <View style={styles.col1}>
                <Text style={styles.headerText}>
                  Dates
                </Text>
              </View>
              <View style={styles.col2}>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text>
                  Date First Opened
                </Text>
              </View>
              <View style={styles.col2}>
                <Text>
                  {moment.unix(date.first_open.actual).format("MM-DD-YYYY")}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text>
                  Actual Date Last Opened
                </Text>
              </View>
              <View style={styles.col2}>
                <Text>
                  {moment.unix(date.opened_today.actual).format("MM-DD-YYYY")}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text>
                  Date Opened Change
                </Text>
              </View>
              <View style={styles.col2}>
                <Text>
                  {String(date.opened_today.change_day)}
                </Text>
                <Button
                  onPress={this._onAdvanceDayPress}
                  title="Advance Day"
                  color="#841584"
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={[styles.row, styles.header]}>
              <View style={styles.col1}>
                <Text style={styles.headerText}>
                  Data
                </Text>
              </View>
              <View style={styles.col2}>
                <Button
                  onPress={this._onPurgePress}
                  title="Purge"
                  color="#841584"
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={[styles.row, styles.header]}>
              <View style={styles.col1}>
                <Text style={styles.headerText}>
                  Inventory
                </Text>
              </View>
              <View style={styles.col2}>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text>
                  Jumps
                </Text>
              </View>
              <View style={styles.col2}>
                <Button
                  onPress={this._onAddJumpsPress}
                  title="Add 3 Jumps"
                  color="#841584"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text>
                  Keys
                </Text>
              </View>
              <View style={styles.col2}>
                <Button
                  onPress={this._onAddKeysPress}
                  title="Add 3 Keys"
                  color="#841584"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row'
  },
  col1: {
    flex: 0.7,
    marginLeft: 10
  },
  col2: {
    flex: 0.3
  },
  header: {
    backgroundColor: LIGHT_GRAY,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD'
  },
  headerText: {
    fontSize: 20,
  }
})

const mapStateToProps = function(state) {
  const { activeChats, currentMatches, date } = state
  return {
    activeChats,
    currentMatches,
    date
  }
}

export default connect(mapStateToProps)(Dev)
