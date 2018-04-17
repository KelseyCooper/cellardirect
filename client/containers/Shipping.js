import { connect } from 'react-redux'
import ShippingComponent from '../components/Shipping'
import { handleShippingFormChange, setFormValues, submitformvalues } from '../actions'

const mapStateToProps = (state) => {
  return {
    form: state.shippingFormValues,
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
    submitformvalues: (form) => {
      dispatch(submitformvalues(form))
    },
  }
}

const Shipping = connect(mapStateToProps, mapDispatchToProps)(ShippingComponent)

export default Shipping
