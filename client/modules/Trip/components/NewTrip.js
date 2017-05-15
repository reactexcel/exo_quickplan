import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import './../Trip.scss';
import NewTripMutation from '../containers/NewTrip';
import Passenger from '../../Passenger/components/Passenger';

class NewTrip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mainPAX: {
        dietary: {}
      }
    };
  }

  componentDidMount() {
    $('ul.tabs').tabs();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    $(ReactDOM.findDOMNode(this.refs.date_picker1)).on('change', this.changeTripState.bind(this, 'date'));
  }

  changeTripState(name, e) {
    this.setState({
      [name]: e.target.value
    });
  }

  changePassengerState(name, e) {
    this.setState({
      mainPAX: {
        ...this.state.mainPAX,
        [name]: e.target.value
      }
    });
  }

  changeDietaryState(name, e) {
    this.setState({
      mainPAX: {
        ...this.state.mainPAX,
        dietary: {
          ...this.state.mainPAX.dietary,
          [name]: e.target.checked
        }
      }
    });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const onSuccess = function onSuccess() {
      browserHistory.push('/trip-planner');
    };
    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);// eslint-disable-line no-console
    };
    Relay.Store.commitUpdate(
      new NewTripMutation({
        ...this.state
      }), { onFailure, onSuccess }
    );
  };


  render() {
    const countries = ['Choose country', 'Thailand'];
    const cities = ['Choose city', 'Bangkok'];

    return (
      <div>
        <form onSubmit={this.handleSubmit} >
          <h1>Trip Details</h1>
          <hr />
          <div className='row'>
            <div className='col s12'>
              <ul className='tabs'>
                <li className='tab col s4'><a className='active' href='#tripDetails'>Trip Details</a></li>
                <li className='tab col s4'><a href='#hotelPreferences'>Hotel Preferences</a></li>
                <li className='tab col s4'><a href='#passengerDetails'>Passenger Details</a></li>
              </ul>
            </div>
          </div>
          <h6>Trip Main Details</h6>
          <hr />
          <div className='row'>
            <div className='col s4'>
              <select onChange={this.changeTripState.bind(this, 'country')} className='country-city-selectbox' defaultValue='Choose Country'>
                {countries.map((country, index) => {
                  if (index === 0) {
                    return <option key={index} disabled value='Choose Country'>{country}</option>;
                  }
                  return <option key={index} value={country}>{country}</option>;
                })}
              </select>
            </div>
            <div className='col s4'>
              <select onChange={this.changeTripState.bind(this, 'city')} className='country-city-selectbox' defaultValue='Choose City'>
                {cities.map((city, index) => {
                  if (index === 0) {
                    return <option key={index} disabled value='Choose City'>{city}</option>;
                  }
                  return <option key={index} value={city}>{city}</option>;
                })}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col s4'>
              <div className='input-field'>
                <input id='input_travelCompany' type='text' className='validate' onChange={this.changeTripState.bind(this, 'travelCompany')} />
                <label htmlFor='input_travelCompany'>Travel Company</label>
              </div>
            </div>
            <div className='col s4'>
              <div className='input-field'>
                <input id='input_TA' type='text' className='validate' onChange={this.changeTripState.bind(this, 'travelAgent')} />
                <label htmlFor='input_TA'>Travel Agent</label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <Passenger changePassengerState={this.changePassengerState} changeDietaryState={this.changeDietaryState} NewTrip={this} />
            </div>
          </div>
          <div className='row'>
            <div className='col s4'>
              <div className='input-field'>
                <input ref='date_picker1' className='datepicker' id='input_date' type='date' />
                <label htmlFor='input_date'>Date</label>
              </div>
            </div>
            <div className='col s4'>
              <div className='input-field'>
                <input id='input_duration' type='number' className='validate' onChange={this.changeTripState.bind(this, 'startDate')} />
                <label htmlFor='input_duration'>Duration (nights)</label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <button className='btn' type='submit' name='action'>
                Add new trip<i className='mdi-content-send right' />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default NewTrip;
