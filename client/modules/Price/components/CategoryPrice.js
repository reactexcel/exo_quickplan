import React from 'react';
import { PT } from 'proptypes-parser';


const propTypes = PT`{
  title: String!
  price: {
    usd: Number!
    thb: Number!
  }!
  className: String
}`;


const CategoryPrice = ({
  title,
  price: {
    currency,
    amount,
    usdAmount
  },
  className = 'col m3 left-align'
}) => (<div className={className}>
  <span className='exo-colors-text text-label-1 '>{title}</span>
  <div className='pt-5'>
    <b><span className='fs-16'>{
      Number(usdAmount)
        .toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        })
    }</span></b>
  </div>
  <div>
    <b><span className='fs-16'>฿{
      Number(amount).toLocaleString({
        minimumFractionDigits: 2
      })
    }</span></b>
  </div>
</div>);


CategoryPrice.propTypes = propTypes;


export default CategoryPrice;
