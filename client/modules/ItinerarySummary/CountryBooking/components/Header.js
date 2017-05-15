import React, { PropTypes, Component } from 'react';
import { PT } from 'proptypes-parser';
import { flatMapDeep } from 'lodash';
import CollapseExpandButton from '../../../Utils/components/CollapseExpandButton';
import Budget from '../../Budget/containers/Budget';

export default class ContainerHeader extends Component {
  static propTypes = {
    ...PT`{
    collapse: Function!
    expand: Function!
    isExpanded: Boolean!
    }`
  };


  render() {
    const {
      collapse, expand, isExpanded,
      showCategoryAmounts,
      data: {
        countryCode: title,
        cityBookings
      },
    } = this.props;

    const titleClassName = [
      'col',
      'fs-20',
      showCategoryAmounts ? 'm4' : 'm12'
    ].join(' ');

    const hotels = flatMapDeep(cityBookings
      .map(({ accommodationPlacements }) => accommodationPlacements
        .map(({ serviceBookings }) => serviceBookings
          .map(({ price }) => price)
        )
      ));

    const transfers = flatMapDeep(cityBookings
      .map(({ transferPlacements: { serviceBookings } }) => serviceBookings
        .map(({ price }) => price)
      )
    );

    const tours = flatMapDeep(cityBookings
      .map(({ cityDays }) => cityDays
        .map(({ serviceBookings }) => serviceBookings
          .filter(({ tour }) => tour)
          .map(({ price }) => price)
        )
      ));

    const placeholders = flatMapDeep(cityBookings
      .map(({ cityDays }) => cityDays
        .map(({ serviceBookings }) => serviceBookings
          .filter(({ placeholder }) => placeholder)
          .map(({ price }) => price)
        )
      ));

    const localTransfers = flatMapDeep(cityBookings
      .map(({ cityDays }) => cityDays
        .map(({ serviceBookings }) => serviceBookings
          .filter(({ transfer }) => transfer)
          .map(({ price }) => price)
        )
      ));


    return (<div className='row valign-wrapper container-header pb-10 pt-20'>
      <h1 className={titleClassName}>{title}</h1>
      {showCategoryAmounts && <Budget
        className='col m8 pr-0'
        hotels={hotels}
        tours={tours}
        transfers={transfers}
        placeholders={placeholders}
        localTransfers={localTransfers}
        display={['transfers', 'hotels', 'tours']}
      />}

      <div className='collapse-container'>
        <CollapseExpandButton
          collapse={collapse}
          expand={expand}
          isExpanded={isExpanded}
        />
      </div>
    </div>);
  }
}
