import React from 'react'
import {
  Image,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
const { InAppUtils } = NativeModules

import { LIGHT_PURPLE, TINDER_COLOR } from '../../lib/colors'

export default class Store extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      jumpProducts: [
        {
          key: 'com.heywing.wingjumps.3',
          text: '3 Jumps for $0.99'
        },
        {
          key: 'com.heywing.wingjumps.7',
          text: '7 Jumps for $1.99'
        },
        {
          key: 'com.heywing.wingjumps.18',
          text: '18 Jumps for $4.99'
        },
      ],
      keyProducts: [
        {
          key: 'com.heywing.wingkeys.3',
          text: '3 Keys for $2.99'
        }
      ]
    }
  }


  leftButtonConfig = {
    title: '≡',
    tintColor: 'black',
    handler: () => this._onLeftButtonPress()
  }

  _onLeftButtonPress() {
    this.props.openDrawer()
  }

  _onJumpPress = (key) => {
    console.log('key', key)
  }

  _onKeyPress = (key) => {
    console.log('key', key)
  }

  componentWillMount() {
    var products = [
      'com.heywing.wingkeys.3',
    ];
    // InAppUtils.loadProducts(products, (error, products) => {
    //   console.log('products', products);
    //   console.log('error', error);
    // });
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
        {this.state.jumpProducts.map((prod) => {
          return (
            <TouchableOpacity key={prod.key} onPress={this._onJumpPress(prod.key)}>
              <View style={[styles.productButton, styles.jumpButton]}>
                <Text style={styles.productButtonText}>
                  {prod.text}
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
        <View style={[styles.sectionHeader, styles.redBackground]}>
          <Text style={styles.sectionHeaderTextMain}>
            Keys
          </Text>
          <Image
            source={require('./keysCircle.png')}
            style={styles.circleImage}
          />
          <Text style={styles.sectionHeaderTextSub}>
            Unlock new matches
          </Text>
        </View>
        {this.state.keyProducts.map((prod) => {
          return (
            <TouchableOpacity key={prod.key} onPress={this._onKeyPress(prod.key)}>
              <View style={[styles.productButton, styles.keyButton]}>
                <Text style={styles.productButtonText}>
                  {prod.text}
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
          leftButton={this.leftButtonConfig}
          tintColor={"#F8F8F8"}
          title={{title: "Store"}}
        />
        {this._renderJumpsSection()}
        {this._renderKeysSection()}
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
  redBackground: {
    backgroundColor: TINDER_COLOR
  },
  sectionHeaderTextMain: {
    marginLeft: 10,
    marginRight: 15,
    fontSize: 32,
    fontWeight: '600',
    color: 'white'
  },
  sectionHeaderTextSub: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  },
  circleImage: {
    width: 44,
    height: 44
  },
  productButton: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center'
  },
  jumpButton: {
    backgroundColor: LIGHT_PURPLE
  },
  productButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  keyButton: {
    backgroundColor: TINDER_COLOR
  }
})
