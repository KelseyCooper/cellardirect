export function fetchCustomers() {
  // const { verb, path, params } = requestFields;

  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
  console.log(data, 'data');

  //TODO finish this reducer
  return {
    type: 'DELETE_CUSTOMER',
    payload: {
      data
    },
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


function requestErrorAction(requestError) {
  return {
    type: 'REQUEST_ERROR',
    payload: {
      requestError,
    },
  }
}
