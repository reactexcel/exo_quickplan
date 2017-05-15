import React, { Component } from 'react';
import _ from 'lodash';
import placeholders from '../../../Tour/placeholders.json';
import Price from '../../../Price/components/Price';
import ProductInfo from '../../Trip/components/ProductInfo';

export default class Tour extends Component {
  render() {
    const {
      tour: {
        title,
        type = 'tour',
        images,
        description
      },
      serviceBooking: {
        period,
        price
      },
      showLineAmounts,
      showDescriptions = false,
      showImages = false
    } = this.props;

    const icon = _.get({
      ...placeholders,
      tour: { icon: 'ticket' }
    }, `[${type}].icon`, '');

    const iconClassName = `col mdi mdi-${icon} little`;


    return (<div className='row line'>
      <i className={iconClassName} />
      <div
        className='col m11 pr-0'
      >
        <div className='bold'>
          <span>{title} - {period}</span>
          {showLineAmounts
            ?
              <Price
                price={price}
                className='bold fs-14 right'
              />
            : ''}
        </div>
        {type === 'tour' && <ProductInfo
          images={images}
          description={description}
          showDescriptions={showDescriptions}
          showImages={showImages}
          title={title}
        />}
      </div>
    </div>);
  }
}
