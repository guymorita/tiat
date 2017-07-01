
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { formatProducts } from '../../actions/store' // platform specific
import { tryPurchaseMatches } from '../../actions/matches'

import { TINDER_COLOR } from '../../lib/colors'

class Purchase extends Component {
  _onMatchPress = (key) => {
    const { dispatch } = this.props
    dispatch(tryPurchaseMatches(key))
  }

  render() {
    return (
      <View>
        <TouchableOpacity key={prod.key} onPress={() => {this._onMatchPress(prod.key)}}>
          <View style={[styles.productButton, styles.redBackground]}>
            <Text style={styles.productButtonText}>
              {prod.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  redBackground: {
    backgroundColor: TINDER_COLOR
  },
  productButton: {
    margin: 16,
    marginBottom: 20,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  productButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  }
})


const mapStateToProps = function(state) {
  const { store } = state
  const { liveProducts } = store
  return {
    products: formatProducts(liveProducts)
  }
}

export default connect(mapStateToProps)(Purchase)
