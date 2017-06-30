
import {
  NativeModules
} from 'react-native'
const { InAppUtils } = NativeModules

import * as store from './storeShare'

export const RECEIVE_IOS_PRODUCTS = 'RECEIVE_IOS_PRODUCTS'
const FETCH_IOS_PRODUCTS = 'FETCH_IOS_PRODUCTS'

export const PRODUCT_IOS_BUY_SUCCESS = 'PRODUCT_IOS_BUY_SUCCESS'
const PRODUCT_IOS_BUY_TRY = 'PRODUCT_IOS_BUY_TRY'

export { SKIP, MORE_MATCHES } from './storeShare'

function productBuyTry(key) {
  return {
    type: PRODUCT_IOS_BUY_TRY,
    key
  }
}

function productBuySuccess(response) {
  return {
    type: PRODUCT_IOS_BUY_SUCCESS,
    response
  }
}

export function productBuy(key, success, fail) {
  return (dispatch) => {
    dispatch(productBuyTry(key))
    InAppUtils.purchaseProduct(key, (error, response) => {
      if (error) console.log("error", error)
      // NOTE for v3.0: User can cancel the payment which will be availble as error object here.
      if(response && response.productIdentifier) {
        dispatch(productBuySuccess(response))
        dispatch(store.routeProduct(key))
      }
    });
  }
}

function receiveIOSProducts(products) {
  return {
    type: RECEIVE_IOS_PRODUCTS,
    products
  }
}

function _fetchIOSProducts() {
  return {
    type: FETCH_IOS_PRODUCTS
  }
}

const requestProducts = [
  {
    key: 'com.heywing.matches.more',
    type: store.MORE_MATCHES,
    quantity: 1
  },
  {
    key: 'com.heywing.skips.3',
    type: store.SKIP,
    quantity: 3
  },
  {
    key: 'com.heywing.skips.7',
    type: store.SKIP,
    quantity: 7
  }
]

export function fetchProducts() {
  return (dispatch, getState) => {
    const prodList = requestProducts.map((prod) => {return prod.key})
    dispatch(_fetchIOSProducts())
    InAppUtils.loadProducts(prodList, (error, products) => {
      if (error) {
        console.log("Error", error)
      }
      if (products) {
        dispatch(receiveIOSProducts(products))
      }
    });
  }
}

function getProduct(product) {
  const { identifier, price, currencySymbol, priceString, description, title } = product
  return {
    key: identifier,
    price,
    currencySymbol,
    priceString,
    description,
    title
  }
}

const priceLowToHigh = (a, b) => { return a.price - b.price }

function getJumpProducts(products) {
  const isJump = (prod) => {return prod.title.includes("Skip")}
  filteredProds = products.filter(isJump)
  filteredProds.sort(priceLowToHigh)
  return filteredProds.map((prod) => {return getProduct(prod)})
}

function getMatchProducts(products) {
  const isJump = (prod) => {return prod.title.includes("Matches")}
  filteredProds = products.filter(isJump)
  filteredProds.sort(priceLowToHigh)
  return filteredProds.map((prod) => {return getProduct(prod)})
}

export function formatProducts(products) {
  return {
    jumpProducts: getJumpProducts(products),
    matchProducts: getMatchProducts(products)
  }
}
