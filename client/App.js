import React, { Component} from 'react';
import { Page } from '@shopify/polaris';
import { EmbeddedApp } from '@shopify/polaris/embedded';

import ApiConsole from './components/ApiConsole'
import Customers from './containers/Customers'

class App extends Component {
  render() {
    const { apiKey, shopOrigin } = window;

    return (
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey}>
        <Page
          title="My application"
          breadcrumbs={[{ content: 'Home', url: '/foo' }]}
          primaryAction={{ content: 'Add something' }}
        >
          <ApiConsole />
          <Customers />
        </Page>
      </EmbeddedApp>
    );
  }
}

export default App;
