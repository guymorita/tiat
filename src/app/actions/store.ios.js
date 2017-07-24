
import parallel from 'async/parallel'
import {
  Alert,
  NativeModules
} from 'react-native'
const { InAppUtils } = NativeModules
import iapReceiptValidator from 'iap-receipt-validator'

import * as store from './storeShare'

import {
  dateNow
} from './date'

import {
  toggleSubscription
} from './inventory'

import {
  subscriptionBuy
} from './analytics'

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

export function productBuy(prod) {
  return (dispatch, getState) => {
    const state = getState()
    const { user } = state
    const { key, price, currencySymbol} = prod
    dispatch(productBuyTry(key))
    InAppUtils.purchaseProduct(key, (error, response) => {
      if (error) console.log("error", error)
      // NOTE for v3.0: User can cancel the payment which will be availble as error object here.
      if(response && response.productIdentifier) {
        subscriptionBuy(user.id, key, price, currencySymbol)
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

export const requestProducts = [
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
  },
  {
    key: 'com.heywing.unlimited.week.1',
    type: store.UNLIMITED,
    quantity: 1
  },
  {
    key: 'com.heywing.unlimited.month.1',
    type: store.UNLIMITED,
    quantity: 1
  },
  {
    key: 'com.heywing.unlimited.year.1',
    type: store.UNLIMITED,
    quantity: 1
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

function mapProduct(product) {
  const { identifier, price, currencySymbol, priceString, description, title } = product
  return {
    key: identifier,
    price,
    currencySymbol,
    priceString,
    description,
    title,
    shortTitle: title
  }
}

function mapProducts(products) {
  return products.map((product) => { return mapProduct(product) })
}

const priceLowToHigh = (a, b) => { return a.price - b.price }

function getTypeProducts(products, str) {
  const isType = (prod) => {return prod.key.includes(str)}
  filteredProds = products.filter(isType)
  filteredProds.sort(priceLowToHigh)
  return filteredProds
}

export function formatProducts(products) {
  const mappedProducts = mapProducts(products)
  const unlimitedProducts = getTypeProducts(mappedProducts, "unlimited")
  return {
    jumpProducts: getTypeProducts(mappedProducts, "skips"),
    matchProducts: getTypeProducts(mappedProducts, "match"),
    unlimitedProducts: unlimitedProducts.map((prod) => {
      prod.shortTitle = prod.title.replace(" of Wing Unlimited", "")
      return prod
    })
  }
}

// SUBSCRIPTIONS

const wPass = 'ceef46f6e2ee44be9c2a4a521019fc47'
let production = false // use sandbox or production url for validation
if (process.env.NODE_ENV === 'production') {
  production = true
}
const validateReceipt = iapReceiptValidator(wPass, production)

const anyReceiptValid = (receipts) => {
  let anyValid = false
  receipts.forEach((r) => {
    const expDate = Number(r.latest_receipt_info.expires_date)/1000
    const isActive =  expDate > dateNow()
    if (isActive) anyValid = true
  })
  return anyValid
}

const mapValidatorToReceipts = (transReceipts) => {
  return transReceipts.map((receipt) => {
    return (cb) => {
      return validateReceipt(receipt).then((data) => {
        cb(null, data)
      }).catch((err) => {
        console.log(err.valid, err.error, err.message)
        cb(null, null)
      })
    }
  })
}

export function checkSubscription() {
  return (dispatch, getState) => {
    const state = getState()
    const { receipts } = state.store
    const subReceipts = receipts.filter((r) => { return r.productIdentifier.includes('unlimited')})
    const subTransReceipts = subReceipts.map((receipt) => { return receipt.transactionReceipt })

    transReceiptsCb = mapValidatorToReceipts(subTransReceipts)

    parallel(
      transReceiptsCb,
      (err, receiptRes) => {
        const cleanReceiptRes = receiptRes.filter((r) => { return r })
        const anyValid = anyReceiptValid(cleanReceiptRes)

        dispatch(toggleSubscription(anyValid))
      }
    )
  }
}

// RESTORE

function restorePurchases(receipts) {
  return {
    type: store.RESTORE_PURCHASES,
    receipts
  }
}

export function initRestorePurchases() {
  return (dispatch) => {
    InAppUtils.restorePurchases((error, response)=> {
    if(error) {
        Alert.alert('itunes Error', 'Could not connect to itunes store.')
    } else {
        if (response.length === 0) {
          Alert.alert('No Purchases', "We didn't find any purchases to restore.")
          return
        }

        dispatch(restorePurchases(response))
        dispatch(checkSubscription())
        Alert.alert('Restore Successful', 'Successfully restored all your purchases.')
      }
    })
  }
}
