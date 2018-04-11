import React, { Component } from 'react'
import { Page, Provider } from '@shopify/polaris'

import Customers from './containers/Customers'

class App extends Component {
  render() {
    const { apiKey, shopOrigin } = window
    const CustomLinkComponent = ({ children, url, ...rest }) => {
      return (
        <a
          {...rest}
        >
          {children}
        </a>
      )
    }

    return (
      <Provider
        shopOrigin={shopOrigin}
        apiKey={apiKey}
        linkComponent={CustomLinkComponent}
      >
        <Page
          title="Cellar Direct Custom Shipping"
          secondaryActions={[
            { content: 'Customers', url: '#' },
            { content: 'Shipping Rates', url: '#' },
          ]}
        >
          <Customers />
        </Page>
      </Provider>
    )
  }
}

export default App
