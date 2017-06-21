
export function fetchProducts() {
  return (dispatch) => {
    return {type: 'test'}
  }
}

function getProduct(product) {
  return {
    key: 1,
    price: 1,
    currencySymbol: '$',
    priceString: '$1',
    description: '',
    title: 'test'
  }
}


export function formatProducts(products) {
  return {
    jumpProducts: [getProduct('hello')],
    matchProducts: [getProduct('hello')]
  }
}
