import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { flatMap, get } from 'lodash';
import TripHeader from '../../../TripPlanner/components/TripHeader';
import CheckboxGroup from '../../../Utils/components/CheckboxGroup';
import CountryBooking from '../../CountryBooking/containers/CountryBooking';
import Header from '../../CountryBooking/containers/Header';
import Body from '../../CountryBooking/containers/Body';
import InternationalTransferBody from '../../InternationalTransfer/containers/Body';
import InternationalTransferHeader from '../../InternationalTransfer/containers/Header';
import InternationalTransfer from '../../InternationalTransfer/containers/InternationalTransfer';
import WordFileURLMutation from '../mutations/WordFileURL';

export default class PublishedTrip extends Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    tripKey: PropTypes.string,
    auth: PropTypes.object
  }
  state = {
    showLineAmounts: true,
    showCategoryAmounts: true,
    showImages: true,
    showDescriptions: true,
    showDayNotes: true
  };

  hasInternationalTransferPlacement = () => false;
  // hasInternationalTransferPlacement = ({
  //   transferPlacement
  // }) => {
  //   const { fromCity, toCity } = transferPlacement;

  //   let result = false;
  //   if (fromCity && toCity) {
  //     result = get(transferPlacement, 'serviceBookings.length', 0) &&
  //       fromCity.country !== toCity.country;
  //   }
  //   return result;
  // };

  exportToWord = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(new WordFileURLMutation({
      tripKey: this.props.tripKey,
      userToken: this.props.auth.getAccessToken(),
      firstName: this.props.viewer.user.firstName,
      lastName: this.props.viewer.user.lastName,
      showLineAmounts: this.state.showLineAmounts,
      showCategoryAmounts: this.state.showCategoryAmounts,
      showImages: this.state.showImages,
      showDescriptions: this.state.showDescriptions,
      showDayNotes: this.state.showDayNotes
    }), {
      onSuccess: (res) => {
        if (res.tripToWordURLMutation.wordFileURL) {
          window.open(res.tripToWordURLMutation.wordFileURL, '_blank');
        }
      }
    });
  }

  getMailToURL = (subject, htmlBody) => `mailto:?${[
    `subject=${subject}`,
    `body=${htmlBody}`
  ].join('&')}`;

  getEmail = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(new WordFileURLMutation({
      tripKey: this.props.tripKey,
      userToken: this.props.auth.getAccessToken(),
      firstName: this.props.viewer.user.firstName,
      lastName: this.props.viewer.user.lastName,
      showLineAmounts: this.state.showLineAmounts,
      showCategoryAmounts: this.state.showCategoryAmounts,
      showImages: this.state.showImages,
      showDescriptions: this.state.showDescriptions,
      showDayNotes: this.state.showDayNotes,
    }), {
      onSuccess: (res) => {
        if (res.tripToWordURLMutation.wordFileURL) {
          const fileURL = `http://docs.create.exotravel.com/${this.props.tripKey}.doc`;
          const htmlBody = `
            Please download your itinerary document here:
            ${fileURL}`;
          const emailURL = this.getMailToURL('Itinerary summary of your trip', htmlBody);
          // console.log(emailURL);
          window.location = emailURL;
        }
      }
    });
  }

  render() {
    const { trip } = this.props.viewer;
    const { countryBookings } = trip;
    const {
      showLineAmounts,
      showCategoryAmounts,
      showImages,
      showDescriptions,
      showDayNotes
    } = this.state;


    return (<div className='page'>
      <TripHeader
        {...this.props}
        viewOnly
      />
      <br />
      <a href='/#' onClick={this.exportToWord} className='fs-16'>
        <i className='mdi mdi-download small exo-colors-text' />
        EXPORT
      </a>
      { /* <a href={this.getMailToURL('Itinerary summary of your trip', 'hello')} className='fs-16 ml-15'> */ }
      <a href='/#' onClick={this.getEmail} className='fs-16 ml-15'>
        <i className='mdi mdi-send small exo-colors-text' />
        <span className='pl-1'> SEND</span>
      </a>
      <CheckboxGroup
        checkboxes={[
          {
            labelText: 'Show day notes',
            id: 'showDayNotes',
            labelClassName: 'bold',
            className: 'inline-block pl-20',
            checked: showDayNotes,
            onChange: () => this.setState(({ showDayNotes }) => ({
              showDayNotes: !showDayNotes
            }))
          }, {
            labelText: 'Show images',
            id: 'showImages',
            labelClassName: 'bold',
            className: 'inline-block pl-20',
            checked: showImages,
            onChange: () => this.setState(({ showImages }) => ({
              showImages: !showImages
            }))
          }, {
            labelText: 'Show descriptions',
            id: 'showDescriptions',
            className: 'inline-block pl-20',
            labelClassName: 'bold',
            checked: showDescriptions,
            onChange: () => this.setState(({ showDescriptions }) => ({
              showDescriptions: !showDescriptions
            }))
          }, {
            labelText: 'Show category amounts',
            id: 'showCategoryAmounts',
            labelClassName: 'bold',
            className: 'inline-block pl-20',
            checked: showCategoryAmounts,
            onChange: () => this.setState(({ showCategoryAmounts }) => ({
              showCategoryAmounts: !showCategoryAmounts
            }))
          }, {
            labelText: 'Show line amounts',
            id: 'showLineAmouns',
            labelClassName: 'bold',
            className: 'inline-block pl-20',
            checked: showLineAmounts,
            onChange: () => this.setState(({ showLineAmounts }) => ({
              showLineAmounts: !showLineAmounts
            }))
          },
        ]}
      />
      {flatMap(countryBookings, countryBooking => ([
        this.hasInternationalTransferPlacement(countryBooking)
          ?
            <InternationalTransfer
              showImages={showImages}
              showDescriptions={showDescriptions}
              showCategoryAmounts={showCategoryAmounts}
              showLineAmounts={showLineAmounts}
              data={countryBooking.transferPlacement}
              showDayNotes={showDayNotes}
              Body={InternationalTransferBody}
              Header={InternationalTransferHeader}
            />
          : '',
        <CountryBooking
          showImages={showImages}
          showDescriptions={showDescriptions}
          showCategoryAmounts={showCategoryAmounts}
          showLineAmounts={showLineAmounts}
          data={countryBooking}
          showDayNotes={showDayNotes}
          Header={Header}
          Body={Body}
        />
      ]))}
    </div>);
  }
}
