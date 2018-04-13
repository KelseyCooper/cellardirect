export function fetchCustomers(filters) {
  console.log('the filters in the action are ', filters);
  const bodyData = JSON.stringify(filters)
  console.log('the filters after turning them to json ', bodyData);
  
  
  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyData
  }

  return dispatch => {
    dispatch(requestStartAction())

    return fetch(`/customer-list`, fetchOptions)
      .then(response => response.json())
      .then(json => dispatch(requestCompleteCustomersAction(json)))
      .catch(error => {
        dispatch(requestErrorAction(error))
      })
  }
}


// const fetchOptions = {
//   method: verb,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
//   credentials: 'include',
// }

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
    body: bodyData
  }

  return dispatch => {
    dispatch(requestStartAction())

    return fetch(`/delete-customers`, options)
      .then(response => dispatch(requestCompleteDeleteCustomersAction(data)))
      .catch(error => {
        dispatch(requestErrorAction(error))
      })
  }

  //TODO finish this reducer
  return {
    type: 'DELETE_CUSTOMERS',
    payload: {
      data
    },
  } 
}

export function setAppliedFilters(filters) {
  return {
    type: 'SET_APPLIED_FILTERS',
    payload: {
      filters
    },
  }
}

export function setSearchValue(values) {
  return {
    type: 'SET_SEARCH_VALUES',
    payload: {
      values
    }
  }
}

export function handleSelectionChangeState(items) {
  return {
    type: 'UPDATE_SELECTED_ITEMS',
    payload: {
      items
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
console.log(data, ' is the payload');

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
