import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { AccommodationPlaceholder } from '../../Utils/components/Placeholder';

export default class PlaceholderOverlay extends Component {
  static propTypes = {
    handleOpenOverlay: PropTypes.func.isRequired,
    handleClick: PropTypes.func,
    service: PropTypes.object
  };

  static defaultProps: {
    service: {_key: 'placeholder'}
  }

  constructor(props) {
    super(props);
    let selectedNotes = '';
    if (props.service) {
      if (props.service.notes) {
        selectedNotes = props.service.notes;
      } else if (props.service.placeholder && props.service.placeholder.notes) {
        selectedNotes = props.service.placeholder.notes;
      }
    }

    this.state = {
      _key: (props.service && props.service._key) || 'placeholder',
      placeholder: {
        notes: selectedNotes,
        title: 'Own arrangement'
      },
      id: (props.service && props.service.id) || ''
    };
  }

  handleSelectPlaceholder = () => {
    const { handleClick, handleOpenOverlay } = this.props;

    handleOpenOverlay(false);
    handleClick(this.state);
  };

  changePlaceholderState(name, e) {
    this.setState({
      placeholder: {
        ...this.state.placeholder,
        [name]: e.target.value
      }
    });
  }


  render() {
    const { handleOpenOverlay } = this.props;

    return (
      <div>
        <ReactCSSTransitionGroup transitionName='tour-modal-overlay' transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <div className='tour-modal-overlay-bg' onClick={handleOpenOverlay.bind(null, false)} style={{ height: '1000px' }}>
            <div className='btn-close exo-colors-text cursor'><i className='mdi-navigation-close' /></div>
          </div>
          <div className='tour-modal-overlay-content'>
            <div className='row mr-0'>
              <h4 className='exo-colors-text text-data-1'>Own Arrangement</h4>
            </div>
            <div className='row mr-0'>
              <div className='col s4' style={{ textAlign: 'center' }}>
                <AccommodationPlaceholder />
              </div>
              <div className='col s8 exo-colors-text text-data-1 mt-40 pl-20 pr-20'>
                <div className='input-field'>
                  <textarea placeholder='Notes' type='text' id='notes' className='materialize-textarea pt-0' value={this.state.placeholder.notes} onChange={this.changePlaceholderState.bind(this, 'notes')} />
                </div>
              </div>
            </div>
            <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right mt-40' onClick={this.handleSelectPlaceholder}><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
