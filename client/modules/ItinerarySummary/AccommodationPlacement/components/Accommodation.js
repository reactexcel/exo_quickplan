import React, { Component } from 'react';
import { compact } from 'lodash';
import Price from '../../../Price/components/Price';

export default class Accommodation extends Component {
  render() {
    const {
      supplier,
      serviceBooking: {
        accommodation,
        price
      },
      showLineAmounts
    } = this.props;

    return (<div className='bold pt-10 exo-colors-text text-label-1'>
      <span>
        {compact([supplier.title, accommodation.title]).join(' - ')}
      </span>
      {showLineAmounts
        ?
          <Price
            price={price}
            className='right exo-colors-text text-data-1 fs-14'
          />
        : ''}
    </div>);
  }
}
