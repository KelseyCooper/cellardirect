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

export function updateVerb(verb) {
  return {
    type: 'UPDATE_VERB',
    payload: {
      verb,
    },
  }
}

export function updatePath(path) {
  return {
    type: 'UPDATE_PATH',
    payload: {
      path,
    },
  }
}

export function updateParams(params) {
  return {
    type: 'UPDATE_PARAMS',
    payload: {
      params,
    },
  }
}

export function sendRequest(requestFields) {
  const { verb, path, params } = requestFields

  const fetchOptions = {
    method: verb,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }

  if (verb !== 'GET') {
    fetchOptions['body'] = params
  }

  return dispatch => {
    dispatch(requestStartAction())

    return fetch(`/api${path}`, fetchOptions)
      .then(response => response.json())
      .then(json => dispatch(requestCompleteAction(json)))
      .catch(error => {
        dispatch(requestErrorAction(error))
      })
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

function requestCompleteAction(json) {
  const responseBody = JSON.stringify(json, null, 2)

  return {
    type: 'REQUEST_COMPLETE',
    payload: {
      responseBody,
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
