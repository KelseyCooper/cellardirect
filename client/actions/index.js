export function fetchCustomers(filters) {
  console.log('the filters in the action are ', filters)
  const bodyData = JSON.stringify(filters)
  console.log('the filters after turning them to json ', bodyData)

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

export function submitformvalues(form) {
  let finalObject = {}
  for (let key in form) {
    console.log(form[key])
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
      .then((response) => dispatch(requestCompleteDeleteCustomersAction(data)))
      .catch((error) => {
        dispatch(requestErrorAction(error))
      })
  }

  return {
    type: 'FIX_LATER',
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
  // const responseBody = JSON.stringify(json, null, 2)

  return {
    type: 'REQUEST_CUSTOMERS_COMPLETE',
    payload: {
      response,
    },
  }
}

function requestCompleteDeleteCustomersAction(data) {
  console.log(data, ' is the payload')

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
