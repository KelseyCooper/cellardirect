import React, { Component } from 'react'
import {
  Card,
  TextContainer,
  TextStyle,
  FormLayout,
  TextField,
  Form,
  Button,
  Spinner,
} from '@shopify/polaris'
import ShippingTextField from './ShippingTextField'

import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/scale.css'

class Shipping extends Component {
  componentDidMount() {
    this.props.fetchRates().then(() => {
      this.props.setFormValues({
        AB: this.props.shippingRates.AB.join(', '),
        BC: this.props.shippingRates.BC.join(', '),
        MB: this.props.shippingRates.MB.join(', '),
        NB: this.props.shippingRates.NB.join(', '),
        NL: this.props.shippingRates.NL.join(', '),
        NT: this.props.shippingRates.NT.join(', '),
        NS: this.props.shippingRates.NS.join(', '),
        NU: this.props.shippingRates.NU.join(', '),
        ON: this.props.shippingRates.ON.join(', '),
        PE: this.props.shippingRates.PE.join(', '),
        QC: this.props.shippingRates.QC.join(', '),
        SK: this.props.shippingRates.SK.join(', '),
        YT: this.props.shippingRates.YT.join(', '),
      })
    })
  }

  render() {
    const {
      AB,
      BC,
      MB,
      NB,
      NL,
      NT,
      NS,
      NU,
      ON,
      PE,
      QC,
      SK,
      YT,
    } = this.props.form

    const { requestInProgress } = this.props

    const spinner = <Spinner size="large" color="teal" />

    const shippingRatesCard = (
      <div>
        <FormLayout>
          <Form onSubmit={this.handleSubmit}>
            <ShippingTextField
              provComma={AB}
              handleChange={this.handleChange}
              provCode="AB"
              prov="Alberta"
            />
            <ShippingTextField
              provComma={BC}
              handleChange={this.handleChange}
              provCode="BC"
              prov="British Columbia"
            />
            <ShippingTextField
              provComma={MB}
              handleChange={this.handleChange}
              provCode="MB"
              prov="Manitoba"
            />
            <ShippingTextField
              provComma={NB}
              handleChange={this.handleChange}
              provCode="NB"
              prov="New Brunswick"
            />
            <ShippingTextField
              provComma={NL}
              handleChange={this.handleChange}
              provCode="NL"
              prov="Newfoundland"
            />
            <ShippingTextField
              provComma={NT}
              handleChange={this.handleChange}
              provCode="NT"
              prov="Northwest Territories"
            />
            <ShippingTextField
              provComma={NS}
              handleChange={this.handleChange}
              provCode="NS"
              prov="Noba Scotia"
            />
            <ShippingTextField
              provComma={NU}
              handleChange={this.handleChange}
              provCode="NU"
              prov="Nunavut"
            />
            <ShippingTextField
              provComma={ON}
              handleChange={this.handleChange}
              provCode="ON"
              prov="Ontario"
            />
            <ShippingTextField
              provComma={PE}
              handleChange={this.handleChange}
              provCode="PE"
              prov="Prince Edward Island"
            />
            <ShippingTextField
              provComma={QC}
              handleChange={this.handleChange}
              provCode="QC"
              prov="Quebec"
            />
            <ShippingTextField
              provComma={SK}
              handleChange={this.handleChange}
              provCode="SK"
              prov="Saskatchewan"
            />
            <ShippingTextField
              provComma={YT}
              handleChange={this.handleChange}
              provCode="YT"
              prov="Yukon"
            />

            <Button submit>Submit Rates</Button>
          </Form>
        </FormLayout>
      </div>
    )

    return (
      <div>
        <Card title="Province Shipping Rates Setup">
          <Card.Section title="Usage">
            <p>All rates must be input using cent values.</p>
            <br />
            <TextStyle variation="strong">Example</TextStyle>
            <p>
              <TextStyle variation="subdued">
                $12.98 should be input as 1298, $20 should be input as 2000.
              </TextStyle>
            </p>
            <br />
            <p>Please use commas with no spaces to separate each value</p>
            <br />
            <p>
              Start with the greatest shipping cost, the cost of the first case
              shipped. Increment lower to the least amount you will charge per
              case.
            </p>
            <br />
            <TextStyle variation="strong">Example</TextStyle>
            <p>
              <TextStyle variation="subdued">
                1295, 999, 839, 756, 555, 223, 99
              </TextStyle>
            </p>
          </Card.Section>
          <Card.Section title="Shipping Rates">
            {requestInProgress ? spinner : shippingRatesCard}
          </Card.Section>
          <Alert stack={{ limit: 3 }} />
        </Card>
      </div>
    )
  }
  handleSubmit = (event) => {
    this.props.submitformvalues(this.props.form).then(() => {
      Alert.success('Shipping Rates have been updated', {
        position: 'top',
        effect: 'scale',
      })
    })
  }

  handleChange = (field) => {
    return (value) => {
      this.props.handleShippingFormChange(field, value)
    }
  }
}

export default Shipping
