import React, { PropTypes, Component } from 'react';
import { compact } from 'lodash';
import Price from '../../../Price/components/Price';
import CategoryPrice from '../../../Price/components/CategoryPrice';


export default class Budget extends Component {
  render() {
    const {
      hotels = [],
      tours = [],
      transfers = [],
      placeholders = [],
      localTransfers = [],
      display = [],
      className,
    } = this.props;

    const allTransfers = [
      ...transfers,
      ...localTransfers
    ];

    const allTours = [
      ...tours,
      ...placeholders
    ];

    const allServices = [
      ...hotels,
      ...allTours,
      ...allTransfers,
    ];

    const prefixColumnClassName = [
      'col pr-0',
      `m${(3 - display.length) * 3}`
    ].join(' ');


    return (<div className={className}>
      <div className={prefixColumnClassName} />
      {
        display.includes('hotels') ? <CategoryPrice
          title='Hotels'
          price={Price.getTotalPrice(hotels)}
        /> : ''
      }
      {
        display.includes('tours') ? <CategoryPrice
          title='Tours'
          price={Price.getTotalPrice(allTours)}
        /> : ''
      }
      {
        display.includes('transfers') ? <CategoryPrice
          title='Transfers'
          price={Price.getTotalPrice(allTransfers)}
        /> : ''
      }
      {
        display.length ? <CategoryPrice
          title='Total'
          price={Price.getTotalPrice(allServices)}
        /> : ''
      }
    </div>);
  }
}
