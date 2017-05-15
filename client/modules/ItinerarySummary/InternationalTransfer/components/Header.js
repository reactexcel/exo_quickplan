import React, { PropTypes, Component } from 'react';
import { PT } from 'proptypes-parser';
import { flatMap, compact } from 'lodash';
import Price from '../../../Price/components/Price';
import CollapseExpandButton from '../../../Utils/components/CollapseExpandButton';
import Budget from '../../Budget/containers/Budget';

export default class Header extends Component {
  static propTypes = {
    ...PT`{
    collapse: Function!
    expand: Function!
    isExpanded: Boolean!
    }`
  };

  render() {
    const {
      collapse, expand, isExpanded,
      showCategoryAmounts,
      data: {
        fromCity: {
          country: fromCountry
        },

        toCity: {
          country: toCountry
        },
        serviceBookings
      }
    } = this.props;

    const titleClassName = [
      'col',
      'fs-20',
      showCategoryAmounts ? 'm4' : 'm12'
    ].join(' ');

    return (<div className='row valign-wrapper container-header pb-10 pt-20'>
      <h1 className={titleClassName}>
        {[fromCountry, toCountry].join('-')}
      </h1>
      {showCategoryAmounts && <Budget
        className='col m8 pr-0'
        transfers={serviceBookings.map(serviceBooking => serviceBooking.price)}
        display={['transfers']}
      />}
      <div className='collapse-container'>
        <CollapseExpandButton
          collapse={collapse}
          expand={expand}
          isExpanded={isExpanded}
        />
      </div>
    </div>);
  }
}
