import React, { Component } from 'react';
import { compact } from 'lodash';
import transferIcon from '../../../Transfer/typeIcons.json';
import Price from '../../../Price/components/Price';

export default class Transfer extends Component {
  render() {
    const {
      serviceBooking: {
        price
      },
      transfer: {
        type: {
          description
        },
        vehicle: {
          category,
          model
        },
        route: {
          from,
          to,
          departureTime,
          arrivalTime
        }
      },
      priceClassName = 'fs-14 right',
      showLineAmounts
    } = this.props;

    const iconClassName = compact([
      'col mdi little',
      `mdi-${transferIcon[description]}`,
    ]).join(' ');


    return (<div className='bold row valign-wrapper line'>
      <i className={iconClassName} />
      <div className='col m11 pr-0 ml-0'>
        <span>
          {compact([
            from.localityName || from.place,
            to.localityName || to.place,
            compact([description, category, model]).join(' '),
            compact([departureTime, arrivalTime]).join(' / ')
          ]).join(' - ')}
        </span>
        {showLineAmounts
          ?
            <Price
              price={price}
              className={priceClassName}
            />
          : ''}
      </div>
    </div>);
  }
}
