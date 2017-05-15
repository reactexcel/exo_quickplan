import React from 'react';

export default class Passenger extends React.Component {
  static propTypes = {
    changePassengerState: React.PropTypes.func.isRequired,
    changeDietaryState: React.PropTypes.func.isRequired,
    NewTrip: React.PropTypes.object.isRequired
  };

  render() {
    const titles = ['Choose title', 'Mr.', 'Mrs.', 'Miss.', 'Miss.', 'Fr.', 'Sr.', 'Dr.'];
    const countries = ['Choose country', 'Thailand', 'U.S.', 'Sweden'];
    return (
      <div>
        <h6 style={{ margin: 0 }}>Lead Customer</h6>
        <hr />
        <div className='row'>
          <div className='col s4'>
            <select onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'title')} className='dib fs-16' defaultValue='Choose title'>
              {titles.map((title, index) => {
                if (index === 0) {
                  return <option key={index} disabled value='Choose title'>{title}</option>;
                }
                return <option key={index} value={title}>{title}</option>;
              })}
            </select>
          </div>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_passengerLastName' type='text' />
              <label htmlFor='input_passengerLastName' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'lastName')}>Last Name</label>
            </div>
          </div>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_passengerFirstName' type='text' className='validate' />
              <label htmlFor='input_passengerFirstName' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'FirstName')}>First Name</label>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_passportNumber' type='number' className='validate' />
              <label htmlFor='input_passportNumber' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'passportNumber')}>Passport Number</label>
            </div>
          </div>
          <div className='col s4'>
            <select onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'passportCountry')} className='dib fs-16' defaultValue='Choose country'>
              {countries.map((country, index) => {
                if (index === 0) {
                  return <option key={index} disabled value='Choose country'>{country}</option>;
                }
                return <option key={index} value={country}>{country}</option>;
              })}
            </select>
          </div>
        </div>
        <h6 style={{ margin: 0 }}>Number of passengers</h6>
        <hr />
        <div className='row'>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_adults' type='number' className='validate' />
              <label htmlFor='input_adults' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'adult')}>Adults</label>
            </div>
          </div>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_children' type='number' className='validate' />
              <label htmlFor='input_children' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'children')}>Children</label>
            </div>
          </div>
          <div className='col s4'>
            <div className='input-field'>
              <input id='input_infants' type='number' className='validate' />
              <label htmlFor='input_infants' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'infant')}>Infants</label>
            </div>
          </div>
        </div>
        <h6 style={{ margin: 0 }}>Dietary Requirements</h6>
        <hr />
        <div className='row'>
          <div className='col s2'>
            <p>
              <input type='checkbox' id='checkboxVegetarian' onChange={this.props.changeDietaryState.bind(this.props.NewTrip, 'vegetarian')} />
              <label htmlFor='checkboxVegetarian'>Vegetarian</label>
            </p>
          </div>
          <div className='col s2'>
            <p>
              <input type='checkbox' id='checkboxVegan' onChange={this.props.changeDietaryState.bind(this.props.NewTrip, 'vegan')} />
              <label htmlFor='checkboxVegan'>Vegan</label>
            </p>
          </div>
          <div className='col s2'>
            <p>
              <input type='checkbox' id='checkboxKosher' onChange={this.props.changeDietaryState.bind(this.props.NewTrip, 'kosher')} />
              <label htmlFor='checkboxKosher'>Kosher</label>
            </p>
          </div>
          <div className='col s2'>
            <p>
              <input type='checkbox' id='checkboxHalal' onChange={this.props.changeDietaryState.bind(this.props.NewTrip, 'halal')} />
              <label htmlFor='checkboxHalal'>Halal</label>
            </p>
          </div>
          <div className='col s2'>
            <div className='input-field'>
              <input id='input_allergy' type='text' className='validate' />
              <label htmlFor='input_allergy' onChange={this.props.changePassengerState.bind(this.props.NewTrip, 'allergy')}>Allergies</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
