import React, { Component, PropTypes } from 'react';
import { default as ScriptjsLoader } from 'react-google-maps/lib/async/ScriptjsLoader'; // eslint-disable-line
import { GoogleMap, Marker } from 'react-google-maps';
import { triggerEvent } from 'react-google-maps/lib/utils';
import { getUserRole } from '../../../services/user';

export default class Map extends Component {
  static propTypes = {
    supplier: PropTypes.object
  }

  state = {
    center: { lat: this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.latitude ? parseFloat(this.props.supplier.address.coordinates.latitude) : 0.0,
      lng: this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.longitude ? parseFloat(this.props.supplier.address.coordinates.longitude) : 0.0 },
    firstLoaded: true,
    userRole: getUserRole()
  }

  componentDidMount() {
    $('#map').on('click', () => {
      setTimeout(() => {
        triggerEvent(this.googleMapComponent, 'resize');
        if (this.state.firstLoaded) {
          this.setState({ firstLoaded: false, center: { lat: this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.latitude ? parseFloat(this.props.supplier.address.coordinates.latitude) : 0.0, lng: this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.longitude ? parseFloat(this.props.supplier.address.coordinates.longitude) : 0.0 } });
        }
      }, 0);
    });
  }

  componentWillReceiveProps(nextProps) {
    const state = {
      center: { lat: nextProps.supplier && nextProps.supplier.address && nextProps.supplier.address.coordinates && nextProps.supplier.address.coordinates.latitude ? parseFloat(nextProps.supplier.address.coordinates.latitude) : 0.0,
        lng: nextProps.supplier && nextProps.supplier.address && nextProps.supplier.address.coordinates && nextProps.supplier.address.coordinates.longitude ? parseFloat(nextProps.supplier.address.coordinates.longitude) : 0.0 }
    };

    this.setState(state);
  }

  componentWillUnmount() {
    $('#map').off('click');
  }

  handleGoogleMapLoad = (googleMap) => {
    this.googleMapComponent = googleMap;
  };

  renderMap() {
    // TODO Narongdej's personal API key, need to change the KEY to the client's Key
    const GOOGLE_API_KEY = 'AIzaSyAsiPVYu-ligzzy2d_FAzjjhAFvXKAIHxI';

    const latitude = this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.latitude ? parseFloat(this.props.supplier.address.coordinates.latitude) : 0.0;
    const longitude = this.props.supplier && this.props.supplier.address && this.props.supplier.address.coordinates && this.props.supplier.address.coordinates.longitude ? parseFloat(this.props.supplier.address.coordinates.longitude) : 0.0;

    const markers = [{
      position: {
        lat: latitude,
        lng: longitude,
      },
      key: 'center',
      defaultAnimation: 2
    }];


    return (
      <ScriptjsLoader
        hostname={'maps.googleapis.com'}
        pathname={'/maps/api/js'}
        query={{ key: GOOGLE_API_KEY, libraries: 'geometry,drawing,places' }}
        loadingElement={
          <div
            style={{
              height: '250px',
            }}
          >
            Loading..
          </div>
        }
        containerElement={
          <div style={{ height: '250px' }} />
        }
        googleMapElement={
          <GoogleMap
            ref={this.handleGoogleMapLoad}
            defaultZoom={15}
            center={this.state.center}
          >
            {markers.map(marker => (
              <Marker
                {...marker}
              />
          ))}
          </GoogleMap>
        }
      />
    );
  }

  render() {
    const { supplier } = this.props;
    const address = supplier.address;

    return (
      <div>
        {this.renderMap()}
        <div style={{ padding: '0px 20px 60px 20px' }} >
          <div className='row'>
            <div className='col s12 exo-colors-text text-darken-2'>
              {address.streetAddress}<br />
              {address.city}, {address.postCode} {address.country}
            </div>
          </div>
          { this.state.userRole === 'TA' ? null : (
            <div className='row'>
              <div className='col s12 exo-colors-text text-darken-3'>
                <i className='mdi mdi-email' /> {supplier.email}
              </div>
            </div>
          )}
          <div className='row'>
            <div className='col s12 exo-colors-text text-darken-3'>
              <i className='mdi mdi-home' /> {supplier.web}
            </div>
          </div>
          { this.state.userRole === 'TA' ? null : (
            <div className='row'>
              <div className='col s12 exo-colors-text text-darken-3'>
                <i className='mdi mdi-phone' /> {supplier.phone}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
