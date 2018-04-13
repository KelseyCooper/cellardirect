import React, { Component } from 'react'
import { Page, AppProvider } from '@shopify/polaris'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Customers from './containers/Customers'

import AdapterLink from './lib/AdapterLink'



class App extends Component {
  render() {
    const { apiKey, shopOrigin } = window
    const CustomLinkComponent = ({ children, url, ...rest }) => {
      return <a {...rest}>{children}</a>
    }

    return (
      <AppProvider
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
      </AppProvider>
    )
  }
}

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
)

export default App
