import React from 'react'
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'

import { fetchProducts, formatProducts, productBuy, initRestorePurchases } from '../../actions/store' // platform specific
import { tryPurchaseMatches } from '../../actions/matches'
import HamburgerButton from '../../components/Nav/HamburgerButton'
import Title from '../../components/Nav/Title'

import { LIGHT_BLUE, LIGHT_PURPLE, TINDER_COLOR } from '../../lib/colors'

class StoreSections extends React.Component {
  _onJumpPress = (key) => {
    const { dispatch } = this.props
    dispatch(productBuy(key))
  }

  _onMatchPress = (key) => {
    const { dispatch } = this.props
    dispatch(tryPurchaseMatches(key))
  }

  _onRestorePress = () => {
    const { dispatch } = this.props
    dispatch(initRestorePurchases())
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(fetchProducts())
  }

  _onPressPrivacyPolicy() {
    const { navigator } = this.props

    navigator.push({
      title: 'Web'
    })
  }

  _onAlertSubscriptionInfo() {
    Alert.alert(
      'Wing Unlimited',
      `• You can subscribe for unlimited access to Wing content.\n
      • Wing offers weekly, monthly, and yearly subscriptions.\n
      • You'll be able to access unlimited chats for the duration of your subscription.\n
      • Payment will be charged to iTunes Account at confirmation of purchase.\n
      • Subscription automatically renews unless auto-review is turned off at least 24-hours before the end of the current period.`
    )
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

  _renderUnlimitedProductImage = (key) => {
    const imageQuantityMap = {
      'com.heywing.unlimited.week.1': 1,
      'com.heywing.unlimited.month.1': 2,
      'com.heywing.unlimited.year.1': 3
    }
    const times = imageQuantityMap[key]
    const timesArr = Array(times).fill(0)

    return (
      <View style={styles.productImageContainer}>
        {timesArr.map((val, ind) => {
          return (
            <Image
              source={require('./joanCircle.png')}
              style={styles.productCircleImage}
              key={ind}
            />
          )
        })}
      </View>
    )
  }

  _renderUnlimitedSection = (WIDTH) => {
    const { h, w } = Dimensions.get('window')
    const width = WIDTH || w
    return (
      <View style={[styles.section, {width}]}>
        <View style={[styles.sectionHeader, styles.redBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Join Wing Unlimited!
          </Text>
          <Text style={styles.sectionHeaderTextSub}>
            Get All the Matches & No Waits
          </Text>
        </View>
        <View>
          {this.props.products && this.props.products.unlimitedProducts.map((prod) => {
            return (
              <TouchableOpacity key={prod.key} onPress={() => {this._onJumpPress(prod.key)}}>
                <View style={[styles.productButton, styles.redBackground]}>
                  {this._renderUnlimitedProductImage(prod.key)}
                  <Text style={styles.productButtonText}>
                    {prod.shortTitle} for {prod.priceString}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View>
          <TouchableOpacity onPress={() => {this._onRestorePress()}}>
            <Text style={styles.restoreText} >
              I'm already in Wing Unlimited
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderSubscriptionActive = () => {
    return (
      <View style={[styles.section]}>
        <View style={[styles.sectionHeader, styles.redBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Wing Unlimited
          </Text>
          <Text style={styles.sectionHeaderTextSub}>
            You are subscribed!
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textSubscription}>
            New chats are released on a monthly basis. You now have full access to the chats! And best of all you never have to wait.
          </Text>
          <Text style={styles.textSubscription}>
            If you would like to change your subscription, you must do so within your iTunes / Apple ID configuration.
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { isSubscribed, MODAL_WIDTH_LENGTH } = this.props
    const content = isSubscribed ? this._renderSubscriptionActive() : this._renderUnlimitedSection(MODAL_WIDTH_LENGTH)
    return (
      <View>
        {content}
        <View style={styles.policies}>
          <TouchableOpacity onPress={this._onPressPrivacyPolicy.bind(this)}>
            <Text style={[styles.policyText, styles.policyLeft]}>
              Privacy Policy & Terms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onAlertSubscriptionInfo.bind(this)}>
            <Text style={styles.policyText}>
              Subscription Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = function(state) {
  const { inventory, store } = state
  const { liveProducts } = store
  const isSubscribed = inventory.subscription.enabled
  return {
    isSubscribed,
    products: formatProducts(liveProducts)
  }
}

export const ConStoreSections = connect(mapStateToProps)(StoreSections)

export class Store extends React.Component {
  _onLeftButtonPress() {
    this.props.openDrawer()
  }


  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<HamburgerButton onHamPress={this._onLeftButtonPress.bind(this)} />}
          tintColor={"#F8F8F8"}
          title={<Title text={"Store"} />}
        />
        <ConStoreSections {...this.props}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    marginBottom: 16
  },
  sectionHeader: {
    alignItems: 'center',
    padding: 15
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
    marginBottom: 5,
    fontSize: 24,
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
  productImageContainer: {
    flexDirection: 'row',
    marginRight: 8
  },
  productCircleImage: {
    marginTop: 3,
    marginLeft: -20,
    width: 30,
    height: 30
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
    fontSize: 16,
    fontWeight: '600'
  },
  keyImageSmall: {
    width: 30,
    height: 30,
    marginLeft: 4,
    marginTop: 3
  },
  restoreText: {
    marginTop: 20,
    color: '#444',
    textAlign: 'center'
  },
  textContainer: {
    padding: 15
  },
  textSubscription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333'
  },
  policies: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0
  },
  policyText: {
    fontSize: 9,
    color: '#555',
    bottom: 0
  },
  policyLeft: {
    marginRight: 20
  }
})

