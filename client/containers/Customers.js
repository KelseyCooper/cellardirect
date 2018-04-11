import { connect } from 'react-redux'
import CustomersComponent from '../components/Customers'
import { fetchCustomers, deleteCustomers } from '../actions'

const mapStateToProps = state => {
  return {
    customers: state.customers.result,
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
