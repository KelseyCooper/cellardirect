import { connect } from 'react-redux'
import CustomersComponent from '../components/Customers'
import { fetchCustomers, deleteCustomers, handleSelectionChangeState } from '../actions'

const mapStateToProps = state => {
  return {
    customers: state.customers.result,
    selectedItems: state.selectedItems,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomers: () => {
      dispatch(fetchCustomers())
    },
    deleteCustomers: (data) => {
      dispatch(deleteCustomers(data))
    },
    handleSelectionChangeState: (items) => {
      dispatch(handleSelectionChangeState(items))
    }
  }
}

const Customers = connect(mapStateToProps, mapDispatchToProps)(
  CustomersComponent,
)

export default Customers
