import React, { Component } from 'react'
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

    this.handleFiltersChange = this.handleFiltersChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSaveFilters = this.handleSaveFilters.bind(this)
  }

  componentDidMount() {
    this.props.fetchCustomers()
  }

  handleSelectionChange = (selectedItems) => {
    this.props.handleSelectionChangeState(selectedItems)
  }

  deleteCustomersEvent = (e) => {
    this.props.deleteCustomers(this.props.selectedItems)
  }

  handleFiltersChange(appliedFilters) {
    console.log(appliedFilters)
    this.props.fetchCustomers(appliedFilters)
    this.props.setAppliedFilters({ appliedFilters })
  }

  handleSearchChange(searchValue) {
    this.props.setSearchValue(searchValue)
  }

  handleSaveFilters() {
    const appliedFiltersArray = this.props.appliedFilters
    const search = {
      key: 'Filter',
      value: this.props.searchValue,
    }
    appliedFiltersArray.push(search)
    this.props.fetchCustomers(appliedFiltersArray)
    this.props.setAppliedFilters({ appliedFilters: appliedFiltersArray })
  }

  renderItem = (item) => {
    const {
      first_name,
      last_name,
      address,
      id,
      bottles_purchased,
      province,
    } = item

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
          <TextStyle variation="subdued">, {province}</TextStyle>
        </div>
      </ResourceList.Item>
    )
  }

  render() {
    const { customers, appliedFilters, searchValue } = this.props

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

    return (
      <div>
        <p>Be aware that the search is case sensitive.</p>
        <br />
        <Card>
          <ResourceList
            resourceName={resourceName}
            items={customers}
            renderItem={this.renderItem}
            selectedItems={this.props.selectedItems}
            onSelectionChange={this.handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            filterControl={
              <ResourceList.FilterControl
                resourceName={{ singular: 'customer', plural: 'customers' }}
                filters={[
                  {
                    key: 'accountStatusFilter',
                    label: 'Located in',
                    operatorText: 'province',
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
                    ],
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={this.handleFiltersChange}
                searchValue={searchValue}
                onSearchChange={this.handleSearchChange}
                additionalAction={{
                  content: 'Save',
                  onAction: this.handleSaveFilters,
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
