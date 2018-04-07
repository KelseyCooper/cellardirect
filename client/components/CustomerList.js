import React from 'react'

const CustomerList = props => {
  const { customers } = props
  console.log(customers, ' customerlist');

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Total Bottles Paid to be shipped</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(customer => (
          <tr key={customer.id}>
            <td> {customer.id} </td>
            <td> {customer.first_name} </td>
            <td> {customer.last_name} </td>
            <td> {customer.address} </td>
            <td> {customer.bottles_purchased} </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
