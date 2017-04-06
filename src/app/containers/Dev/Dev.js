
import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import moment from 'moment'

import { advanceDateDay } from '../../actions/date'
import { findMatches, tryAdvanceMatchQueue } from '../../actions/matches'
import { perStore } from '../../platform/Client'

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
    const { activeChats, currentMatches, dispatch, matchQueue } = this.props
    dispatch(advanceDateDay())
    dispatch(tryAdvanceMatchQueue())
    dispatch(findMatches(currentMatches, matchQueue, activeChats))
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
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text>
              Modified Date Opened
            </Text>
          </View>
          <View style={styles.col2}>
            <Text>
              {moment.unix(date.opened_today.modified).format("MM-DD-YYYY")}
            </Text>
          </View>
        </View>
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    marginTop: 10,
    marginBottom: 10
  },
  headerText: {
    fontSize: 20
  }
})

const mapStateToProps = function(state) {
  const { activeChats, currentMatches, date, matchQueue } = state
  return {
    activeChats,
    currentMatches,
    date,
    matchQueue
  }
}

export default connect(mapStateToProps)(Dev)
