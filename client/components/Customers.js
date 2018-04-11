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

class CustomersComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
    }
    this.handleSelectionChange = this.handleSelectionChange.bind(this)
  }

  componentDidMount() {
    this.props.fetchCustomers()
  }

  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems })

  }

  deleteCustomersEvent = (e) => {
    console.log('fudge');
    
    this.props.deleteCustomers(this.state.selectedItems)
  }


  renderItem = item => {
    const { first_name, last_name, address, id, bottles_purchased } = item
    const media = <Avatar customer size="medium" name={name} />

    return (
      <ResourceList.Item
        {...item}
        id={id}
        accessibilityLabel={`View details for ${name}`}
      >
        <h3>
          <TextStyle variation="strong">
            {first_name} {last_name}
          </TextStyle>
          <TextStyle variation="subdued">
            {' '}
            Total bottles paid to be shipped:{' '}
          </TextStyle>
          <TextStyle variation="strong">{bottles_purchased}</TextStyle>
        </h3>
        <div>
          {address}
          <TextStyle variation="subdued">, Province</TextStyle>
        </div>
      </ResourceList.Item>
    )
  }

  render() {
    const { customers } = this.props
    let customerList = customers || []

    /////////

    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    }

    const promotedBulkActions = [
      {
        content: 'Delete Customers ',
        onAction: () => this.deleteCustomersEvent(),
      },
    ]

    //////////

    return (
      <div>
        <Card>
          <ResourceList
            resourceName={resourceName}
            items={customerList}
            renderItem={this.renderItem}
            selectedItems={this.state.selectedItems}
            onSelectionChange={this.handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            filterControl={
              <ResourceList.FilterControl
                resourceName={{ singular: 'customer', plural: 'customers' }}
                filters={[
                  {
                    key: 'accountStatusFilter',
                    label: 'Province',
                    operatorText: 'is',
                    type: FilterType.Select,
                    options: [
                      'AB',
                      'BC',
                      'MB',
                      'NB',
                      'NL',
                      'NT',
                      'NS',
                      'NU',
                      'ON',
                      'PE',
                      'QC',
                      'YT',
                    ]
                  },
                ]}
               
                onFiltersChange={(appliedFilters) => {
                  console.log(
                    `Applied filters changed to ${appliedFilters}.`,
                    'Todo: use setState to apply this change.'
                  );
                }}
              />
            }
          />
        </Card>
      </div>
    )
  }
}

export default CustomersComponent
