import React from 'react'
import {
  NativeModules,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
const { InAppUtils } = NativeModules

export default class Store extends React.Component {
  componentWillMount() {
    var products = [
      'com.heywing.wingkeys.3',
    ];
    InAppUtils.loadProducts(products, (error, products) => {
      console.log('products', products);
      console.log('error', error);
    });
  }

  render() {
    return (
      <View>
        <Text>
          Store
        </Text>
      </View>
    );
  }
}