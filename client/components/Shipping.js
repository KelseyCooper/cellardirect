import React, { Component } from 'react'
import {
  Card,
  TextContainer,
  TextStyle,
  FormLayout,
  TextField,
  Form,
  Button,
} from '@shopify/polaris'
import ShippingTextField from './ShippingTextField';

class Shipping extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newsletter: false,
      email: '',
      AB: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000],
      BC: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      MB: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      NB: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      NL: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      NT: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      NS: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      NU: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      ON: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      PE: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      QC: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      SK: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      YT: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
    }
  }

  render() {
    const { newsletter, email, BC, AB, MB, NB, NL, NT, NS, NU, ON, PE, QC, SK, YT } = this.state
    let abComma = Array.prototype.join.call(AB, ', ')
    const bcComma = BC.join(', ')
    const mbComma = MB.join(', ')
    const nbComma = NB.join(', ')
    const nlComma = NL.join(', ')
    const ntComma = NT.join(', ')
    const nsComma = NS.join(', ')
    const nuComma = NU.join(', ')
    const onComma = ON.join(', ')
    const peComma = PE.join(', ')
    const qcComma = QC.join(', ')
    const skComma = SK.join(', ')
    const ytComma = YT.join(', ')

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

          <Card.Section title="Summary">
            <FormLayout>
              <Form onSubmit={this.handleSubmit}>

                <ShippingTextField provComma={abComma} handleChange={this.handleChange} provCode="AB" prov="Alberta"/>
                <ShippingTextField provComma={BC} handleChange={this.handleChange} provCode="BC" prov="British Columbia"/>
                <ShippingTextField provComma={MB} handleChange={this.handleChange} provCode="MB" prov="Manitoba"/>
                <ShippingTextField provComma={NB} handleChange={this.handleChange} provCode="NB" prov="New Brunswick"/>
                <ShippingTextField provComma={NL} handleChange={this.handleChange} provCode="NL" prov="Newfoundland"/>
                <ShippingTextField provComma={NT} handleChange={this.handleChange} provCode="NT" prov="Northwest Territories"/>
                <ShippingTextField provComma={NS} handleChange={this.handleChange} provCode="NS" prov="Noba Scotia"/>
                <ShippingTextField provComma={NU} handleChange={this.handleChange} provCode="NU" prov="Nunavut"/>
                <ShippingTextField provComma={ON} handleChange={this.handleChange} provCode="ON" prov="Ontario"/>
                <ShippingTextField provComma={PE} handleChange={this.handleChange} provCode="PE" prov="Prince Edward Island"/>
                <ShippingTextField provComma={QC} handleChange={this.handleChange} provCode="QC" prov="Quebec"/>
                <ShippingTextField provComma={SK} handleChange={this.handleChange} provCode="SK" prov="Saskatchewan"/>
                <ShippingTextField provComma={YT} handleChange={this.handleChange} provCode="YT" prov="Yukon"/>

                <Button submit>Submit</Button>
              </Form>
            </FormLayout>
          </Card.Section>
        </Card>
        <Card>
          <TextContainer />
        </Card>
        <br />
      </div>
    )
  }
  handleSubmit = (event) => {
    console.log(event)

    this.setState({ newsletter: false, email: '' })
  }


  splitTheString(CommaSepStr) {
    var ResultArray = []; 

     if (CommaSepStr!= null) {
         var noSpaces = CommaSepStr.replace(/\s+/g, '');
         
         
         var SplitChars = ',';
         if (noSpaces.indexOf(SplitChars) >= 0) {
             ResultArray = noSpaces.split(SplitChars);

         }
     } else {
         ResultArray = []
     }
    return ResultArray ;
 }

  handleChange = (field) => {
      
    return (value) => {
        console.log(value);
        const valueArray = this.splitTheString(value)
        console.log(valueArray);
        
        
        this.setState({ [field]: valueArray })
    }
  }
}

export default Shipping
