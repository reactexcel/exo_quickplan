import React from 'react';
import { Card } from '../../Utils/components';

export default class AccommodationInfo extends React.Component {
  static propTypes = {
    activeDetail: React.PropTypes.object.isRequired,
    supplier: React.PropTypes.object
  };
  render() {
    const { activeDetail, supplier } = this.props;
    const imageUrl = activeDetail.images ? activeDetail.images[0].url : require('../../TripPlanner/components/u4114.jpg');

    let styles = [];
    const tour = { styles: [] }; // TODO: check what is tour and remove stub

    if (activeDetail.styles && activeDetail.styles.length) {
      styles = (
        <div className='col s12 mnt-30'>
          {tour.styles.map(style => [<div className='chip exo-colors darken-2 mt-5 mr-5'><span className='exo-colors-text text-accent-2'>{style}</span></div>])}
        </div>
      );
    }

    const descriptionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-description' />Description</h5>;
    const description = $('<textarea/>').html(supplier.description).text();
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
            activeDetail.accommodation.isPreferred ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30' ><i className='mdi-action-thumb-up exo-colors-text text-darken-2 fs-30 left' />Exo recommended</div>
                </div>
              </div>
              : null
          }
          {
            activeDetail.accommodation.isResponsible ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30'><i className='mdi-maps-local-florist exo-colors-text text-darken-2 fs-30 left' />ECO Friendly</div>
                </div>
              </div> : null
        }
          {
            activeDetail.accommodation.hasPromotions ?
              <div className='row'>
                <div className='col s12'>
                  <div className='exo-colors-text text-data-1 fs-15 lh-30'><i className='mdi-maps-local-offer exo-colors-text text-darken-2 fs-30 left' />Promotion</div>
                </div>
                <div className='exo-colors-text text-data-1 col s10 offset-s2'>
                  {activeDetail.promotion}
                </div>
              </div> : null
          }
        </div>
        <Card title={descriptionTitle} className='fs-14 mt-50' doFullCardTitleExpand>
          <div className='row exo-colors-text text-data-1' style={{ marginTop: '0px' }}>
            <div className='col s12'>
              {description}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
