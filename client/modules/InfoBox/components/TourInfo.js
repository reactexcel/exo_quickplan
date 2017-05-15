import React from 'react';
import { Card } from '../../Utils/components';

export default class TourInfo extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {
    const { viewer: { serviceBooking: { tour } } } = this.props;
    const imageUrl = tour.images ? tour.images[0].url : require('../../TripPlanner/components/u4114.jpg');

    let styles = [];

    if (tour.styles && tour.styles.length) {
      styles = (
        <div className='col s12 mnt-30'>
          {tour.styles.map(style => [<div className='chip exo-colors darken-2 mt-5 mr-5'><span className='exo-colors-text text-accent-2'>{style}</span></div>])}
        </div>
      );
    }
    const descriptionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-description' />Description</h5>;
    const inclusionsTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-av-repeat' />Inclusions / Exclusions</h5>;
    const detailTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-av-repeat' />Details</h5>;
    const details = $('<textarea/>').html(tour.details).text();
    const introduction = tour.introduction;
    const highlights = tour.highlights && tour.highlights.map((cc, i) => <li key={i}>{cc}</li>);
    const inclusions = tour.inclusions && tour.inclusions.map((cc, i) => <li key={i}>{cc}</li>);
    const exclusions = tour.exclusions && tour.exclusions.map((cc, i) => <li key={i}>{cc}</li>);
    return (
      <div className='card'>
        <div className='card-image'>
          <img src={imageUrl} role='presentation' style={{ width: '100%', maxHeight: '285px', objectFit: 'cover' }} />
        </div>
        <div className='content'>
          <div className='row'>
            {styles}
          </div>
          {
            tour.isPreferred ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30' ><i className='mdi-action-thumb-up exo-colors-text text-darken-2 fs-30 left' />Exo recommended</div>
                </div>
              </div>
              : null
          }
          {
            tour.isResponsible ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30'><i className='mdi-maps-local-florist exo-colors-text text-darken-2 fs-30 left' />ECO Friendly</div>
                </div>
              </div> : null
        }
          {
            tour.hasPromotions ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30'><i className='mdi-maps-local-offer exo-colors-text text-darken-2 fs-30 left' />Promotion</div>
                </div>
                <div className='exo-colors-text text-data-1 col s10 offset-s2'>
                  {tour.promotion}
                </div>
              </div> : null
          }
        </div>
        {
          (tour.inclusions || tour.exclusions) ?
            <div style={{ borderTop: '1px solid #e0e0e0' }}>
              <Card title={inclusionsTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
                <div className='row m-0 exo-colors-text text-data-1 pl-10 pr-10'>
                  <div className='col s12'>
                    <span style={{ color: '#b1b1b1' }}>Inclusions</span>
                    <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                      {inclusions}
                    </ol>
                    <span style={{ color: '#b1b1b1' }}>Exclusions</span>
                    <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                      {exclusions}
                    </ol>
                  </div>
                </div>
              </Card>
            </div>
          : null
        }
        {
          (tour.description || tour.highlights || tour.introduction || tour.details) ?
            <div style={{ borderTop: '1px solid #e0e0e0' }}>
              <Card title={descriptionTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
                <div className='row exo-colors-text text-data-1 pl-20 pr-20'>
                  <div className='col s12'>
                    <span style={{ color: '#b1b1b1' }}>Highlights</span>
                    <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                      {highlights}
                    </ol>
                    <span style={{ color: '#b1b1b1' }}>Introduction</span><br /><br />
                    {introduction}<br /><br />
                    <span style={{ color: '#b1b1b1' }}>Details</span><br /><br />
                    {details}
                  </div>
                </div>
              </Card>
            </div>
          : null
        }
        {/* {
          tour.details ?
            <Card title={detailTitle} className='fs-15' minimized doFullCardTitleExpand>
              <div className='row exo-colors-text text-data-1 pl-20 pr-20'>
                <div className='col s12'>
                  {tour.details}
                </div>
              </div>
            </Card>
          : null
        } */}
      </div>
    );
  }
}
