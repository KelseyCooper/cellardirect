import React from 'react';
import {
    TextField,
  } from '@shopify/polaris'

const ShippingTextField = (props) => {
    return (
        <div>
            <TextField
                  value={props.provComma}
                  onChange={props.handleChange(props.provCode)}
                  label={props.provCode}
                  type="text"
                  helpText={
                    <span>
                     Shipping rates for {props.prov}
                    </span>
                  }
                />
                <br />
        </div>
    );
};

export default ShippingTextField;