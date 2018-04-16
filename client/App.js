import React, { Component } from 'react'
import { Page, AppProvider } from '@shopify/polaris'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './components/Home'

class App extends React.Component {
  render() {
    const { apiKey, shopOrigin } = window

    return (
      <AppProvider
      shopOrigin={shopOrigin}
      apiKey={apiKey}
      >
        <Page
          title="Cellar Direct Custom Shipping"
        >       
        <Home />   
        </Page>
      </AppProvider>
    )
  }
}

export default App
