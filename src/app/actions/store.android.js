

import InAppBilling from 'react-native-billing'

export const RECEIVE_ANDROID_PRODUCTS = 'RECEIVE_ANDROID_PRODUCTS'
export const FETCH_ANDROID_PRODUCTS = 'FETCH_ANDROID_PRODUCTS'
const MORE_MATCHES = 'MORE_MATCHES'
const SKIP = 'SKIP'

export function productBuy(key, success, fail) {
  return (dispatch) => {
    InAppBilling.close()
    .then(() => InAppBilling.open())
    .then(() => InAppBilling.purchase('android.test.purchased'))
    .then((details) => {
      console.log("You purchased: ", details)
      InAppBilling.close()
      return {type: 'PURCHASE'}
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
    type: MORE_MATCHES,
    quantity: 1
  },
  {
    key: 'com.heywing.skips.3',
    type: SKIP,
    quantity: 3
  },
  {
    key: 'com.heywing.skips.7',
    type: SKIP,
    quantity: 7
  }
]

// function findProduct(key) {
//   return requestProducts.find((prod) => {return prod.key === key})
// }

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
