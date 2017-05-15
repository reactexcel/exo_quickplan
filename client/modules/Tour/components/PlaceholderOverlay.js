import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Placeholder, FreeTime, CustomTour, ConsiderThis } from '../../Utils/components/Placeholder';
import { Select } from '../../Utils/components';

const PLACEHOLDER_TYPES = {
  freeTime: {
    title: 'Free Time',
    description: 'Use Free Time placeholder to indicate to travellers non-scheduled free time.'
  },
  customTour: {
    title: 'Custom Tour',
    description: 'Use Custom Tour to add an existing tour that is not visible in EC or to schedule a whole new tour.'
  },
  considerThis: {
    title: 'Consider This...',
    description: 'Use Consider This... to present tours that the traveller might be interested in without scheduling anything in the itinerary.'
  }
};

export default class PlaceholderOverlay extends Component {
  static propTypes = {
    handleOpenOverlay: PropTypes.func.isRequired,
    hasSelected: PropTypes.func.isRequired,
    handleClick: PropTypes.func,
    service: PropTypes.object
  };

  state = {
    typeDescription: 'Select type of tour placeholder to insert into iternary.',
    ...this.props.service
  }

  handleSelectTour = () => {
    const { handleClick, handleOpenOverlay } = this.props;

    if (this.state.placeholder.type !== 'non-selected' && this.state.placeholder.type !== '') {
      handleOpenOverlay(false);
      handleClick(this.state);
    }
  };

  changePlaceholderState(name, e) {
    this.setState({
      placeholder: {
        ...this.state.placeholder,
        [name]: e.target.value
      }
    });
  }

  changeDuration(e) {
    this.setState({
      durationSlots: e.target.value
    });
  }

  changeType(e) {
    let durationSlots = this.state.durationSlots;
    if (e.target.value === 'considerThis') {
      durationSlots = '1';
    }

    this.setState({
      placeholder: {
        ...this.state.placeholder,
        title: PLACEHOLDER_TYPES[e.target.value].title,
        type: e.target.value,
      },
      typeDescription: PLACEHOLDER_TYPES[e.target.value].description,
      durationSlots
    });
  }


  render() {
    const { handleOpenOverlay } = this.props;

    const imageBox = () => {
      if (this.state.placeholder.type === 'freeTime') {
        return <FreeTime />;
      } else if (this.state.placeholder.type === 'customTour') {
        return <CustomTour />;
      } else if (this.state.placeholder.type === 'considerThis') {
        return <ConsiderThis />;
      }
      return <Placeholder />;
    };

    const shouldDisable = () => {
      if (this.state.placeholder.type === 'considerThis') {
        return true;
      }
      return false;
    };

    return (
      <div>
        <ReactCSSTransitionGroup transitionName='tour-modal-overlay' transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <div className='tour-modal-overlay-bg' onClick={handleOpenOverlay.bind(null, false)}>
            <div className='btn-close exo-colors-text cursor'><i className='mdi-navigation-close' /></div>
          </div>
          <div className='tour-modal-overlay-content'>
            <div className='row mr-0'>
              <div className='col s4'>
                <h4 className='exo-colors-text text-data-1'>Placeholder</h4>
                <div style={{ textAlign: 'center' }}>
                  {imageBox()}
                </div>
                <div className='row' style={{ paddingTop: '20px' }}>
                  <div className='col s12 ml-10'>
                    <div className='exo-colors-text text-data-1 fs-15 lh-30'>
                      <div className='input-field'>
                        <input id='input_title' value={this.state.placeholder.title} type='text' className='validate' onChange={this.changePlaceholderState.bind(this, 'title')} disabled={shouldDisable()} />
                        <label className='active' htmlFor='input_title'>Title</label>
                      </div>
                      <div className='input-field' style={{ paddingTop: '30px' }} >
                        <Select value={this.state.durationSlots.toString()} onChange={this.changeDuration.bind(this)} disabled={shouldDisable()}>
                          <option value='' disabled>Select Duration</option>
                          <option value='1'>1 time slot</option>
                          {this.state.startSlot <= 2 ? <option value='2'>2 time slot</option> : null}
                          {this.state.startSlot === 1 ? <option value='3'>3 time slot</option> : null}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s8'>
                <div>
                  <div className='row exo-colors-text text-data-1 pl-20 pr-20'>
                    <div className='col s12'>
                      <div className='input-field' style={{ paddingTop: '30px' }}>
                        <Select value={this.state.placeholder.type} onChange={this.changeType.bind(this)} >
                          <option value=''>Select Type</option>
                          <option value='freeTime'>Free Time</option>
                          <option value='customTour'>Custom Tour</option>
                          {/* <option value='considerThis'>Consider This...</option>*/}
                        </Select>
                      </div>

                      <div style={{ padding: '20px' }}>
                        {this.state.typeDescription}
                      </div>

                      <div style={{ paddingTop: '40px' }}>
                        <div className='input-field'>
                          <textarea type='text' id='notes' className='materialize-textarea' value={this.state.placeholder.notes} onChange={this.changePlaceholderState.bind(this, 'notes')} />
                          <label htmlFor='notes' >Notes</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right mt-40' onClick={this.handleSelectTour}><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
