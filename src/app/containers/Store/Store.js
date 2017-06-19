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
import HamburgerButton from '../../components/Nav/HamburgerButton'
import Title from '../../components/Nav/Title'

import { LIGHT_BLUE, LIGHT_PURPLE, TINDER_COLOR } from '../../lib/colors'

class Store extends React.Component {
  _onLeftButtonPress() {
    this.props.openDrawer()
  }

  _onJumpPress = (key) => {
    const { dispatch } = this.props
    dispatch(productBuy(key))
  }

  _onMatchPress = (key) => {
    const { dispatch } = this.props
    dispatch(tryPurchaseMatches(key))
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
            Skips
          </Text>
          <Image
            source={require('./jumpCircle.png')}
            style={styles.circleImage}
          />
          <Text style={styles.sectionHeaderTextSub}>
            Skip the waits
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
        {this.props.products && this.props.products.matchProducts.map((prod) => {
          return (
            <TouchableOpacity key={prod.key} onPress={() => {this._onMatchPress(prod.key)}}>
              <View style={[styles.productButton, styles.redBackground]}>
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

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<HamburgerButton onHamPress={this._onLeftButtonPress.bind(this)} />}
          tintColor={"#F8F8F8"}
          title={<Title text={"Store"} />}
        />
        <ScrollView>
          {this._renderJumpsSection()}
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
    marginTop: 6,
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
