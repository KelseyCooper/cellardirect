import { connect } from 'react-redux'
import ShippingComponent from '../components/Shipping'
import { handleShippingFormChange, setFormValues } from '../actions'

const mapStateToProps = (state) => {
  return {
      form: state.shippingFormValues
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleShippingFormChange: (field, value) => {
      dispatch(handleShippingFormChange(field, value))
    },
    setFormValues: (values) => {
      dispatch(setFormValues(values))
    },
  }
}

const Shipping = connect(mapStateToProps, mapDispatchToProps)(ShippingComponent)

export default Shipping
