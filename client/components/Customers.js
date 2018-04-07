import React, { Component } from 'react'
import CustomerList from './CustomerList'
import {
  Page,
  Card,
  ResourceList,
  FilterType,
  Pagination,
  Provider,
} from '@shopify/polaris';

import BasicListItem from './BasicListItem';

class CustomersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    }
  }
  
  componentDidMount() {
    this.props.fetchCustomers()
  }
  render() {
    const { customers } = this.props
    let customerList = customers || [];
    // console.log(customerList);
    

    return (
      <div>
        <CustomerList customers={customerList}/>
        <Card title="Blog posts">
            <ResourceList
              resourceName={{singular: 'post', plural: 'posts'}}
              items={[
                {
                  title: 'How to Get Value from Wireframes',
                  secondaryContent: 'by Jonathan Mangrove',
                  tertiaryContent: 'Today, 7:14pm',
                },
                {
                  title: 'The Best Design Systems of 2017',
                  secondaryContent: 'by Stephanie Xie',
                  tertiaryContent: 'Dec 28, 2017, 4:21pm',
                }
              ]}
              renderItem={(item) => <BasicListItem {...item} />}
            />
          </Card>
      </div>
    )
  }
}

export default CustomersComponent
