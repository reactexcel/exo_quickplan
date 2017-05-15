import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';
import InclusionExclusion from './InclusionExclusion';
import RoomCategory from './RoomCategory';
import Promotion from './Promotion';

export default class InfoOverlay extends Component {
  static propTypes = {
    handleOpenOverlay: PropTypes.func.isRequired,
    hasSelected: PropTypes.func,
    service: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    isSelectDisabled: PropTypes.bool,
    warningInfo: PropTypes.string
  };

  state = {
    accommodations: this.props.service.accommodations
  };

  handleSelect = () => {
    const { service, handleClick, handleOpenOverlay } = this.props;
    handleClick(service);
    handleOpenOverlay(false);
  };
  handleUnSelectedTour = () => {
    const { service, handleUnSelectedTour, handleOpenOverlay } = this.props;
    handleUnSelectedTour(service);
    handleOpenOverlay(false);
  };

  handleSelectAccommodation = (acc, idx, propName, e) => {
    e.stopPropagation();

    if (propName === 'isPreselected' && acc.isSelected) {
      return;
    }

    const accommodations = [...this.state.accommodations];
    accommodations[idx][propName] = !accommodations[idx][propName];

    this.setState({ accommodations });
  };

  renderPreferred() {
    return (
      <div className='row'>
        <div className='col s12 ml-10'>
          <div className='exo-colors-text text-data-1 fs-15 lh-30'>
            <i className='mdi-action-thumb-up exo-colors-text text-darken-2 fs-30 left' />Exo recommended
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { handleOpenOverlay, hasSelected } = this.props;

    let service = this.props.service;
    if (service.tour) {
      service = service.tour;
    }

    const imageUrl = service.images ? (service.images[0].url || service.images[0]) : require('../../TripPlanner/components/u4114.jpg');
    const highlights = service.highlights && service.highlights.map((cc, i) => <li key={i}>{cc}</li>);
    let styles = '';
    if (service.styles) {
      styles = (
        <div className='col s12 mnt-30 ml-10'>
          {service.styles.map(theme => [<div className='chip exo-colors darken-2 mt-5 mr-5'>
            <span className='exo-colors-text text-accent-2'>{theme}</span></div>])}
        </div>
      );
    }

    return (
      <div>
        <ReactCSSTransitionGroup transitionName='tour-modal-overlay' transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <div className='tour-modal-overlay-bg' style={{ height: '1500px' }} onClick={handleOpenOverlay.bind(null, false)}>
            <div className='btn-close exo-colors-text cursor'><i className='mdi-navigation-close' /></div>
          </div>
          <div className='tour-modal-overlay-content' style={{ height: '100%' }}>
            <div className='row mr-0' style={{ height: '550px' }}>
              <div className='col s6'>
                <h4 className='exo-colors-text text-data-1'>{service.title || service.name}</h4>
                <img className='m-10' src={imageUrl} role='presentation' style={{ width: '408px', height: '225px', objectFit: 'cover' }} />
                <div className='row'>
                  {styles}
                </div>
                {service.isPreferred ? this.renderPreferred() : null}
                {service.isResponsible ?
                  <div className='row'>
                    <div className='col s12 ml-10'>
                      <div className='exo-colors-text text-data-1 fs-15 lh-30'>
                        <i className='mdi-maps-local-florist exo-colors-text text-darken-2 fs-30 left' />ECO Friendly
                    </div>
                    </div>
                  </div> : null
              }

                <h4 className='exo-colors-text text-data-1'><i className='mdi mdi-file-document mdi-24px' /> Description</h4>
                <div className='row exo-colors-text text-data-1 pl-20 pr-20' style={{ paddingTop: '0px' }}>
                  <div className='row m-0'>
                    <div className='col s6'>
                      <span style={{ color: '#b1b1b1' }}>Details</span><br /><br />
                      {this.props.service.type === 'accommodations' ? this.props.service.description : service.details }
                    </div>
                    {
                    this.props.service.type === 'accommodation' ?
                    null : (<div className='col s6 p-0 pl-20'>
                      <span style={{ color: '#b1b1b1' }}>Highlights</span>
                      <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                        {highlights}
                      </ol>
                      <span style={{ color: '#b1b1b1' }}>Introduction</span><br /><br />
                      {service.introduction}<br /><br />
                    </div>)
                }
                  </div>
                </div>

              </div>

              <div className='col s6'>
                {service.hasPromotions ? <Promotion rate={service.rate} promotions={service.promotions} showHeader /> : null}
                {service.type === 'tour' ? <InclusionExclusion service={service} /> : null}
                {
                  service.type === 'accommodation' ?
                    <div>
                      <div style={{ overflowX: 'scroll', maxHeight: '500px', minHeight: '500px' }}>
                        <RoomCategory
                          accommodations={this.state.accommodations}
                          handleSelectAccommodation={this.handleSelectAccommodation}
                          isSelected={hasSelected(service)}
                        />
                      </div>
                      <div>
                        {
                          (service.type === 'accommodation' || !hasSelected(service)) ?
                            <div style={{ }}>
                              <a key='btnSelect' className={cx('modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right', { hide: this.props.removeTourButton })} onClick={this.handleSelect}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
                              <a key='btnRemove' className={cx('modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right', { hide: !this.props.removeTourButton })} onClick={this.handleUnSelectedTour}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Remove selection</a>
                              <a key='btSelecteDisabled' className={cx('btn-flat btn-select disabled right', { hide: !this.props.isSelectDisabled })} style={{ cursor: 'not-allowed' }}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
                              <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right' onClick={handleOpenOverlay.bind(null, false)}><i className='mdi-content-clear left' style={{ fontSize: '1.5em' }} />Cancel</a>
                            </div>
                            : null
                        }
                      </div>
                    </div>
                    : null
                }
                {this.props.warningInfo ? <span style={{ fontSize: '24px', color: '#ffb340', fontWeigth: 600 }}>{this.props.warningInfo}</span> : null}
              </div>
            </div>
            <div className='row mt-50'>
              <div className='col s12' />
            </div>


            {
              (service.type !== 'accommodation' && !hasSelected(service)) ?
                <div style={{ bottom: '5px', position: 'fixed', width: '90%', background: '#fff' }}>
                  <a key='btnSelect' className={cx('modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right', { hide: this.props.removeTourButton })} onClick={this.handleSelect}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
                  <a key='btnRemove' className={cx('modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right', { hide: !this.props.removeTourButton })} onClick={this.handleUnSelectedTour}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Remove selection</a>
                  <a key='btSelecteDisabled' className={cx('btn-flat btn-select disabled right', { hide: !this.props.isSelectDisabled })} style={{ cursor: 'not-allowed' }}><i className='mdi mdi-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
                  <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right' onClick={handleOpenOverlay.bind(null, false)}><i className='mdi-content-clear left' style={{ fontSize: '1.5em' }} />Cancel</a>
                </div>
                : null
            }
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
