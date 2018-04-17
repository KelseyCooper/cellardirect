import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Customers from '../containers/Customers'
import Shipping from '../containers/Shipping'

import { Button } from '@shopify/polaris'

class Home extends Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button>Customer List</Button>
          </Link>

          <Link to="/shipping" style={{ textDecoration: 'none' }}>
            <Button>Shipping Rates</Button>
          </Link>
          <br />
          <br />
          <Route exact path="/" component={Shipping} />
          <Route path="/shipping" component={Customers} />
        </div>
      </Router>
    )
  }
}

export default Home
