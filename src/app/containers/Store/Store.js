import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { fetchProducts, formatProducts, productBuy } from '../../actions/store' // platform specific
import { tryPurchaseMatches } from '../../actions/matches'

import { LIGHT_BLUE, LIGHT_PURPLE, TINDER_COLOR } from '../../lib/colors'

class Store extends React.Component {
  leftButtonConfig = {
    title: '≡',
    tintColor: 'black',
    handler: () => this._onLeftButtonPress()
  }

  _onLeftButtonPress() {
    this.props.openDrawer()
  }

  _onJumpPress = (key) => {
    const { dispatch } = this.props
    dispatch(productBuy(key))
  }

  _onKeyPress = (key) => {
    const { dispatch } = this.props
    dispatch(productBuy(key))
  }

  _onMatchPress = () => {
    const { dispatch } = this.props
    dispatch(tryPurchaseMatches())
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(fetchProducts())
  }

  _renderJumpsSection = () => {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.purpleBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Jumps
          </Text>
          <Image
            source={require('./jumpCircle.png')}
            style={styles.circleImage}
          />
          <Text style={styles.sectionHeaderTextSub}>
            Skip the wait
          </Text>
        </View>
        {this.props.products && this.props.products.jumpProducts.map((prod) => {
          return (
            <TouchableOpacity key={prod.key} onPress={() => {this._onJumpPress(prod.key)}}>
              <View style={[styles.productButton, styles.purpleBackground]}>
                <Text style={styles.productButtonText}>
                  {prod.title} for {prod.priceString}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

    );
  }

  _renderKeysSection = () => {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.blueBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Keys
          </Text>
          <Image
            source={require('./keyCircle.png')}
            style={styles.circleImage}
          />
          <Text style={styles.sectionHeaderTextSub}>
            Unlock new matches
          </Text>
        </View>
        {this.props.products && this.props.products.keyProducts.map((prod) => {
          return (
            <TouchableOpacity key={prod.key} onPress={() => {this._onKeyPress(prod.key)}}>
              <View style={[styles.productButton, styles.blueBackground]}>
                <Text style={styles.productButtonText}>
                  {prod.title} for {prod.priceString}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    );
  }

  _renderMatchesSection = () => {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.redBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Matches
          </Text>
          <Image
            source={require('./joanCircle.png')}
            style={styles.circleImage}
          />
          <Text style={styles.sectionHeaderTextSub}>
          </Text>
        </View>
        <TouchableOpacity onPress={() => {this._onMatchPress()}}>
          <View style={[styles.productButton, styles.redBackground]}>
            <Text style={styles.productButtonText}>
              New Matches for 2
            </Text>
            <Image
              source={require('./keyCircleSmall.png')}
              style={styles.keyImageSmall}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: "Store"}}
        />
        <ScrollView>
          {this._renderJumpsSection()}
          {this._renderKeysSection()}
          {this._renderMatchesSection()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  purpleBackground: {
    backgroundColor: LIGHT_PURPLE
  },
  blueBackground: {
    backgroundColor: LIGHT_BLUE
  },
  redBackground: {
    backgroundColor: TINDER_COLOR
  },
  sectionHeaderTextMain: {
    marginLeft: 10,
    fontSize: 28,
    fontWeight: '600',
    color: 'white'
  },
  sectionHeaderTextSub: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  },
  circleImage: {
    marginLeft: 12,
    marginRight: 12,
    width: 44,
    height: 44
  },
  productButton: {
    margin: 16,
    marginBottom: 0,
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
  },
  keyImageSmall: {
    width: 30,
    height: 30,
    marginLeft: 4,
    marginTop: 3
  }
})

const mapStateToProps = function(state) {
  const { store } = state
  const { liveProducts } = store
  return {
    products: formatProducts(liveProducts)
  }
}

export default connect(mapStateToProps)(Store)
