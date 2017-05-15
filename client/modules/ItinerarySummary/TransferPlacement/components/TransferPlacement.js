import React, { Component } from 'react';
import Transfer from '../../TransferPlacement/containers/Transfer';
import Price from '../../../Price/components/Price';


export default class TransferPlacement extends Component {
  getCityCountryPair = ({ name, country }) => [
    name, country
  ].join(', ');

  static defaultProps = {
    offset: true,
    summary: true,
    type: 'regional'
  };

  isInternational =
    (fromCity, toCity) => fromCity.country !== toCity.country;


  isRegional =
    (fromCity, toCity) => fromCity.country === toCity.country;


  render() {
    const {
      transferPlacement: {
        serviceBookings,
        fromCity,
        toCity
      },
      summary,
      offset,
      showLineAmounts,
      type
    } = this.props;

    if (!serviceBookings || !serviceBookings.length) {
      return null;
    }

    if (type === 'regional' &&
        this.isInternational(fromCity, toCity)
    ) {
      return null;
    }

    if (type === 'international' &&
      this.isRegional(fromCity, toCity)
    ) {
      return null;
    }

    return (<div>
      {summary
        ?
          <div className='row line valign-wrapper mt-15'>
            <div className='col m12'>
              <span className='fs-18 bold'>
                {fromCity.name} - {toCity.name}
              </span>
            </div>
          </div>
        : ''}
      {
        serviceBookings.map(serviceBooking => (
          <Transfer
            serviceBooking={serviceBooking}
            showLineAmounts={showLineAmounts}
            transfer={serviceBooking.transfer}
          />
        ))
      }
    </div>);
  }
}
