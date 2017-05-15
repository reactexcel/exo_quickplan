import React from 'react';
import { PT } from 'proptypes-parser';


const propTypes = PT`{
  price: {
    currency: String!
    amount: Number!
    usdAmount: Number
    className: String
  }
}`;


const Price = ({
  price: {
    currency,
    amount,
  },
  className
}) => (<span className={className}>
  {[currency, amount.toFixed(2)].join(' ')}
</span>);


Price.propTypes = propTypes;
Price.getTotalPrice =
  prices => prices
    .reduce((totalPrice, price) => ({
      ...totalPrice,
      amount: totalPrice.amount + price.amount,
      usdAmount: totalPrice.usdAmount + price.usdAmount,
    }), {
      currency: 'THB',
      usdAmount: 0,
      amount: 0
    });
export default Price;
