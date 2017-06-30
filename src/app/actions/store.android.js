

import InAppBilling from 'react-native-billing'

import * as store from './storeShare'

export const RECEIVE_ANDROID_PRODUCTS = 'RECEIVE_ANDROID_PRODUCTS'
const FETCH_ANDROID_PRODUCTS = 'FETCH_ANDROID_PRODUCTS'
export const PRODUCT_ANDROID_BUY_SUCCESS = 'PRODUCT_ANDROID_BUY_SUCCESS'
const PRODUCT_ANDROID_BUY_TRY = 'PRODUCT_ANDROID_BUY_TRY'

export { SKIP, MORE_MATCHES } from './storeShare'

function productBuyTry(key) {
  return {
    type: PRODUCT_ANDROID_BUY_TRY,
    key
  }
}

function productBuySuccess(response) {
  return {
    type: PRODUCT_ANDROID_BUY_SUCCESS,
    response
  }
}

export function productBuy(key, success, fail) {
  return (dispatch) => {
    dispatch(productBuyTry(key))
    InAppBilling.close()
    .then(() => InAppBilling.open())
    .then(() => InAppBilling.purchase(key))
    .then((details) => {
      // console.log("You purchased: ", details)
      dispatch(productBuySuccess(details))
      dispatch(store.routeProduct(key))
      return InAppBilling.close()
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

function receiveAndroidProducts(products) {
  return {
    type: RECEIVE_ANDROID_PRODUCTS,
    products
  }
}

function _fetchAndroidProducts() {
  return {
    type: FETCH_ANDROID_PRODUCTS
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
    dispatch(_fetchAndroidProducts())
    InAppBilling.open()
      .then(() => {
        return InAppBilling.getProductDetailsArray(prodList)
      }).then((products) => {
        if (products) {
          dispatch(receiveAndroidProducts(products))
          return InAppBilling.close()
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

function getProduct(product) {
  const { currency, description, isSubscription, priceText, priceValue, productId, title } = product
  const trimTitle = title.replace(/\([^)]*\)/, '').trim()
  return {
    key: productId,
    price: priceValue,
    title: trimTitle,
    description,
    currencySymbol: currency,
    priceString: priceText,
    isSubscription
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
