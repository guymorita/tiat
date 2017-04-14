
import {
  AlertIOS,
  NativeModules,
} from 'react-native'
const { InAppUtils } = NativeModules

import {
  inventoryChange
} from './inventory'

const FETCH_IOS_PRODUCTS = 'FETCH_IOS_PRODUCTS'
export const RECEIVE_IOS_PRODUCTS = 'RECEIVE_IOS_PRODUCTS'
const PRODUCT_IOS_BUY_TRY = 'PRODUCT_IOS_BUY_TRY'
export const PRODUCT_IOS_BUY_SUCCESS = 'PRODUCT_IOS_BUY_SUCCESS'

export const JUMP = 'JUMP'
export const KEY = 'KEY'

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


export function productBuy(key) {
  return (dispatch, getState) => {
    dispatch(productBuyTry(key))
    InAppUtils.purchaseProduct(key, (error, response) => {
    // NOTE for v3.0: User can cancel the payment which will be availble as error object here.
      if(response && response.productIdentifier) {
        dispatch(productBuySuccess(response))
        const prod = findProduct(key)
        dispatch(inventoryChange(prod))
        AlertIOS.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
        //unlock store here.
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
    key: 'com.heywing.wingkeys.3',
    type: KEY,
    quantity: 3
  },
  {
    key: 'com.heywing.wingjumps.3',
    type: JUMP,
    quantity: 3
  },
  {
    key: 'com.heywing.wingjumps.7',
    type: JUMP,
    quantity: 7
  },
  {
    key: 'com.heywing.wingjumps.18',
    type: JUMP,
    quantity: 18
  }
]

function findProduct(key) {
  return requestProducts.find((prod) => {return prod.key === key})
}

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
  const isJump = (prod) => {return prod.title.includes("Jump")}
  filteredProds = products.filter(isJump)
  filteredProds.sort(priceLowToHigh)
  return filteredProds.map((prod) => {return getProduct(prod)})
}

function getKeyProducts(products) {
  const isKey = (prod) => {return prod.title.includes("Key")}
  filteredProds = products.filter(isKey)
  filteredProds.sort(priceLowToHigh)
  return filteredProds.map((prod) => {return getProduct(prod)})
}

export function formatProducts(products) {
  return {
    jumpProducts: getJumpProducts(products),
    keyProducts: getKeyProducts(products)
  }
}
