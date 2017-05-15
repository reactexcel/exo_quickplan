import React, { Component, PropTypes } from 'react';
import Dotdotdot from 'react-dotdotdot';
import { MdHotel } from 'react-icons/lib/md';

export default class Placeholder extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    activeDetail: PropTypes.object,
    handleClickPlaceholder: PropTypes.func,
    className: PropTypes.string.isRequired
  };

  render() {
    const { style, handleClickPlaceholder, className } = this.props;

    return (
      <div className={className} onClick={handleClickPlaceholder.bind(null, true)} style={style}>
        <div className='cursor grey lighten-4' style={{ height: '100%', width: '100%', position: 'relative', backgroundSize: 'cover' }}>
          <div style={{ textAlign: 'center', position: 'relative', top: 30 }}>
            <MdHotel size={80} style={{ color: '#d7d7d7' }} />
          </div>
          <div className='exo-colors modal-bgr1' style={{ height: '60px', width: '100%', position: 'absolute', bottom: '5px' }}>
            <div className='row m-0'>
              <div className='col s9 p-0 pl-10 pt-5' >
                <Dotdotdot clamp={2}>
                  <span>
                    Own Arrangement
                  </span>
                </Dotdotdot>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
