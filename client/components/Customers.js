import React, { Component } from 'react'
import CustomerList from './CustomerList'
import {
  Page,
  Card,
  ResourceList,
  FilterType,
  Pagination,
  Provider,
  TextStyle,
  Avatar,
} from '@shopify/polaris'

import BasicListItem from './BasicListItem'

class CustomersComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
    }
  }

  componentDidMount() {
    this.props.fetchCustomers()
  }

  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems })
  }

  renderItem = item => {
    const { id, url, name, location } = item
    const media = <Avatar customer size="medium" name={name} />

    return (
      <ResourceList.Item {...item}
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
      >
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{location}</div>
      </ResourceList.Item>
    )
  }

  render() {
    const { customers } = this.props
    let customerList = customers || []
    // console.log(customerList);

    /////////

    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    }

    const items = [
      {
        id: 341,
        url: 'customers/341',
        name: 'Mae Jemison',
        location: 'Decatur, USA',
      },
      {
        id: 256,
        url: 'customers/256',
        name: 'Ellen Ochoa',
        location: 'Los Angeles, USA',
      },
    ]

    const promotedBulkActions = [
      {
        content: 'Edit customers',
        onAction: () => console.log('Todo: implement bulk edit'),
      },
    ]

    const bulkActions = [
      {
        content: 'Add tags',
        onAction: () => console.log('Todo: implement bulk add tags'),
      },
      {
        content: 'Remove tags',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Delete customers',
        onAction: () => console.log('Todo: implement bulk delete'),
      },
    ]

    //////////

    return (
      <div>
        <CustomerList customers={customerList} />

        <Card>
          <ResourceList
            resourceName={resourceName}
            items={items}
            renderItem={this.renderItem}
            selectedItems={this.state.selectedItems}
            onSelectionChange={this.handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            bulkActions={bulkActions}
          />
        </Card>

        <Card>
          <ResourceList
            resourceName={{ singular: 'customer', plural: 'customers' }}
            items={[
              {
                attributeOne: 341,
                attributeTwo: 'customers/341',
                attributeThree: 'Mae Jemison',
                location: 'Decatur, USA',
              },
              {
                id: 256,
                url: 'customers/256',
                name: 'Ellen Ochoa',
                location: 'Los Angeles, USA',
              },
            ]}
            renderItem={item => {
              const { id, url, name, location } = item
              const media = <Avatar customer size="medium" name={name} />

              return <ResourceList.Item {...item} media={media} />
            }}
          />
        </Card>

        <Card title="Blog posts">
          <ResourceList
            resourceName={{ singular: 'post', plural: 'posts' }}
            items={[
              {
                attributeOne: 'How to Get Value from Wireframes',
                attributeTwo: 'by Jonathan Mangrove',
                attributeThree: 'Today, 7:14pm',
              },
              {
                title: 'The Best Design Systems of 2017',
                secondaryContent: 'by Stephanie Xie',
                tertiaryContent: 'Dec 28, 2017, 4:21pm',
              },
            ]}
            renderItem={this.renderItem}
          />
        </Card>

        <Card>
          <ResourceList
            items={[
              {
                url: '#',
                attributeOne: 'How to Get Value from Wireframes',
                attributeTwo: 'by Jonathan Mangrove',
                attributeThree: (
                  <TextStyle variation="subdued">Today, 7:14pm</TextStyle>
                ),
              },
              {
                url: '#',
                attributeOne: 'Test blog post',
                attributeTwo: 'by Jonathan Mangrove',
                attributeThree: (
                  <TextStyle variation="subdued">
                    Jan 14, 2016, 8:24am
                  </TextStyle>
                ),
                badges: [{ content: 'Hidden' }],
              },
            ]}
            renderItem={this.renderItem}
          />
        </Card>
      </div>
    )
  }

  // renderItem = (item, index) => {
  //   return (
  //     <div>
  //       lol
  //       <ResourceList.Item key={index} {...item}>
  //         fudge
  //       </ResourceList.Item>
  //     </div>
  //   )
  // }
}

export default CustomersComponent
