import React, { Component } from 'react';
import Accommodation from '../containers/Accommodation';
import Price from '../../../Price/components/Price';
import ProductInfo from '../../Trip/components/ProductInfo';


export default class TransferPlacement extends Component {
  render() {
    const {
      accommodationPlacement: {
        supplier,
        serviceBookings
      },
      showLineAmounts,
      showDescriptions,
      showImages
    } = this.props;

    const {
      title,
      description,
      images
    } = supplier;


    return (<div>
      <div className='row line'>
        <i className='col mdi mdi-hotel little' />
        <div
          className='col m11 pr-0'
        >
          <div className='bold'>
            <span>
              {title}
            </span>
            {showLineAmounts
              ?
                <Price
                  price={Price.getTotalPrice(serviceBookings.map(sb => sb.price))}
                  className=' right fs-14'
                />
              : ''}
          </div>
          {
            serviceBookings.map(serviceBooking => (
              <Accommodation
                showLineAmounts={showLineAmounts}
                serviceBooking={serviceBooking}
                supplier={supplier}
              />
            ))
          }
          <ProductInfo
            images={images}
            description={description}
            showDescriptions={showDescriptions}
            showImages={showImages}
            title={title}
          />
        </div>
      </div>
    </div>);
  }
}
