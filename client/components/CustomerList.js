import React from 'react';
import {
  Card,
  ResourceList,
  TextStyle,
  Avatar,
  Button,
  VisuallyHidden,
  ExceptionList,
  Truncate,
} from '@shopify/polaris';

const CustomerList = props => {
  // console.log(props.customers);
  const { customers } = props

  return (
    <div>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>ID</th>
          <th>Order Count</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(customer => (
          <tr key={customer.id}>
            <td> {customer.first_name} </td>
            <td> {customer.last_name} </td>
            <td> {customer.id} </td>
            <td> {customer.orders_count} </td>
          </tr>
        ))}
      </tbody>
    </div>
  )
}

export default CustomerList