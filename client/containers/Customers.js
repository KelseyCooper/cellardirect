import { connect } from 'react-redux'
import CustomersComponent from '../components/Customers'
import {
  fetchCustomers,
  deleteCustomers,
  handleSelectionChangeState,
  setAppliedFilters,
  setSearchValue,
} from '../actions'

const mapStateToProps = (state) => {
  return {
    customers: state.customers.result,
    selectedItems: state.selectedItems,
    appliedFilters: state.appliedFilters,
    searchValue: state.searchValue,
    requestInProgress: state.requestInProgress
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomers: (filters) => {
      dispatch(fetchCustomers(filters))
    },
    deleteCustomers: (data) => {
      dispatch(deleteCustomers(data))
    },
    handleSelectionChangeState: (items) => {
      dispatch(handleSelectionChangeState(items))
    },
    setAppliedFilters: (filters) => {
      dispatch(setAppliedFilters(filters))
    },
    setSearchValue: (values) => {
      dispatch(setSearchValue(values))
    },
  }
}

const Customers = connect(mapStateToProps, mapDispatchToProps)(
  CustomersComponent,
)

export default Customers
