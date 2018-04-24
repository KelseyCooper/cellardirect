// Gets all customers from the server, then updates redux store
export function fetchCustomers(filters) {
  const bodyData = JSON.stringify(filters)

  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyData,
  }

  return (dispatch) => {
    dispatch(requestStartAction())

    return fetch(`/customer-list`, fetchOptions)
      .then((response) => response.json())
      .then((json) => dispatch(requestCompleteCustomersAction(json)))
      .catch((error) => {
        dispatch(requestErrorAction(error))
      })
  }
}

// Gets shipping rates from the server, then updates redux store
export function fetchRates() {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }

  return (dispatch) => {
    dispatch(requestStartAction())

    return fetch(`/fetch-shipping-rates`, fetchOptions)
      .then((response) => response.json())
      .then((json) => dispatch(requestCompleteFetchRates(json)))
      .catch((error) => {
        dispatch(requestErrorAction(error))
      })
  }
}

// Sends an array of id's to the server to delete customers, then removes them from store.
export function deleteCustomers(data) {
  const ids = { data }
  const bodyData = JSON.stringify(ids)

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyData,
  }

  return (dispatch) => {
    dispatch(requestStartAction())

    return fetch(`/delete-customers`, options)
      .then((response) => dispatch(requestCompleteDeleteCustomersAction(data)))
      .catch((error) => {
        dispatch(requestErrorAction(error))
      })
  }

  return {
    type: 'DELETE_CUSTOMERS',
    payload: {
      data,
    },
  }
}

// Used when a new shipping rates are submitted
// Splits the string given into an array, removes spaces and splits on commas, also removed any empty "" indexes
function splitTheString(CommaSepStr) {
  var ResultArray = []

  if (CommaSepStr != null) {
    const noSpaces = CommaSepStr.replace(/\s+/g, '')

    const SplitChars = ','
    if (noSpaces.indexOf(SplitChars) >= 0) {
      ResultArray = noSpaces.split(SplitChars)
    } else {
      ResultArray = noSpaces.split()
    }
  }

  for (let i = 0; i < ResultArray.length; i++) {
    if (ResultArray[i] === '') {
      ResultArray.splice([i])
    }
  }

  return ResultArray
}

// Submits new shippign rates to the server, then updates redux store.
export function submitformvalues(form) {
  let finalObject = {}

  for (let key in form) {
    const splitArray = splitTheString(form[key])
    finalObject[key] = splitArray
  }

  const bodyData = JSON.stringify(finalObject)

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyData,
  }

  return (dispatch) => {
    dispatch(requestStartAction())

    return fetch(`/update-shipping-rates`, options)
      .then((response) => response.json())
      .then((json) => dispatch(requestCompleteShippingAction(json)))
      .catch((error) => {
        dispatch(requestErrorAction(error))
      })
  }
}

export function setAppliedFilters(filters) {
  return {
    type: 'SET_APPLIED_FILTERS',
    payload: {
      filters,
    },
  }
}

export function setSearchValue(values) {
  return {
    type: 'SET_SEARCH_VALUES',
    payload: {
      values,
    },
  }
}

export function handleSelectionChangeState(items) {
  return {
    type: 'UPDATE_SELECTED_ITEMS',
    payload: {
      items,
    },
  }
}

export function setFormValues(values) {
  return {
    type: 'SET_FORM_VALUES',
    payload: {
      values,
    },
  }
}

export function handleShippingFormChange(field, value) {
  return {
    type: 'UPDATE_SELECTED_FORM',
    payload: {
      field,
      value,
    },
  }
}

function requestStartAction() {
  return {
    type: 'REQUEST_START',
    payload: {},
  }
}

function requestCompleteCustomersAction(response) {
  return {
    type: 'REQUEST_CUSTOMERS_COMPLETE',
    payload: {
      response,
    },
  }
}

function requestCompleteFetchRates(rates) {
  return {
    type: 'FETCH_SHIPPING_RATES_COMPLETE',
    payload: {
      rates,
    },
  }
}

function requestCompleteShippingAction(shippingData) {
  return {
    type: 'SET_SHIPPING_RATES_COMPLETE',
    payload: {
      shippingData,
    },
  }
}

function requestCompleteDeleteCustomersAction(data) {
  return {
    type: 'DELETE_CUSTOMERS_COMPLETE',
    payload: {
      data,
    },
  }
}

function requestErrorAction(requestError) {
  return {
    type: 'REQUEST_ERROR',
    payload: {
      requestError,
    },
  }
}
