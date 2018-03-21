import React, { Component } from 'react'
import CustomerList from './CustomerList'

class CustomersComponent extends Component {
  componentDidMount() {
    this.props.fetchCustomers()
  }
  render() {
    const { customers } = this.props
    let customerList = customers.customers || [];
    // console.log(customerList);
    

    return (
      <div>
        <CustomerList customers={customerList}/>
      </div>
    )
  }
}

export default CustomersComponent
