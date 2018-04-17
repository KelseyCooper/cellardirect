import { connect } from 'react-redux'
import ShippingComponent from '../components/Shipping'
import {
    fetchCustomers
} from '../actions'

const mapStateToProps = (state) => {
  return {
    
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomers: (filters) => {
      dispatch(fetchCustomers(filters))
    },
  }
}

const Shipping = connect(mapStateToProps, mapDispatchToProps)(
  ShippingComponent,
)

export default Shipping
