import React from 'react';

export default class CustomTourInfo extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object
  };
  render() {
    const { viewer } = this.props;
    const imageUrl = viewer.serviceBooking.images ? viewer.serviceBooking.images[0].url : require('../../../TripPlanner/components/u4114.jpg');

    return (
      <div className='card'>
        <div className='card-image'>
          <img src={imageUrl} role='presentation' style={{ width: '100%', maxHeight: '285px', objectFit: 'cover' }} />
        </div>
        <div className='content'>
          <div className='row'>
            <div className='col s12'>
              <p>Add tour image</p>

              <div className='file-field input-field'>
                <div className='btn'>
                  <span>File</span>
                  <input type='file' />
                </div>
                <div className='file-path-wrapper'>
                  <input className='file-path validate' type='text' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
