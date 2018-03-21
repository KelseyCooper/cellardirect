import { connect } from 'react-redux'
import CustomersComponent from '../components/Customers'
import { fetchCustomers } from '../actions'

const mapStateToProps = state => {
  return {
    customers: state.customers,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomers: () => {
      dispatch(fetchCustomers())
    },
  }
}

const Customers = connect(mapStateToProps, mapDispatchToProps)(
  CustomersComponent,
)

export default Customers
