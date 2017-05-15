import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

export default class WorkqueueTableHeader extends Component {
  static propTypes = {
    sortBy: PropTypes.func.isRequired
  };

  renderHeaderCell = (props) => {
    const { text, onClick } = props;
    const onClickHandler = () => {
      this.sortByFieldText = text;
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      onClick();
    };

    let icon = null;
    if (this.sortByFieldText !== text) {
      icon = <i className='mdi mdi-sort-variant small ml-5 exo-colors-text text-label-1' />;
    } else if (this.sortOrder === 'ASC') {
      icon = <i className='mdi mdi-sort-ascending small ml-5 exo-colors-text text-accent-3' />;
    } else {
      icon = <i className='mdi mdi-sort-descending small ml-5 exo-colors-text text-accent-3' />;
    }
    return (<th className='exo-colors-text text-label-1'>
      {text}
      <a onClick={onClickHandler}>
        {icon}
      </a>
    </th>);
  }

  sortOrder = 'DESC'
  sortByFieldText = null;

  render() {
    const { sortBy } = this.props;
    return (
      <thead>
        <tr>
          {this.renderHeaderCell({ text: 'Proposal', onClick: () => sortBy('_key', this.sortOrder) })}
          {this.renderHeaderCell({ text: 'Proposal travel date', onClick: () => sortBy(proposal => moment(_.get(proposal, 'startTravelOnDate'), 'DD MMMM, YYYY'), this.sortOrder) })}
          {this.renderHeaderCell({ text: 'Last updated', onClick: () => sortBy(proposal => moment(_.get(proposal, 'updatedOn'), 'DD MMMM, YYYY'), this.sortOrder) })}
          {this.renderHeaderCell({ text: 'Requested by',
            onClick: () => sortBy(proposal => [
              _.get(proposal, 'TA.office.companyName'),
              _.get(proposal, 'TA.firstName'),
              _.get(proposal, 'TA.lastName'),
            ].join(' '), this.sortOrder) })}
          {this.renderHeaderCell({ text: 'Lead Traveller',
            onClick: () => sortBy(proposal => [
              _.get(proposal, 'mainPax.firstName'),
              _.get(proposal, 'mainPax.lastName'),
            ].join(' '), this.sortOrder) })}
          <th className='exo-colors-text text-label-1'>Trips</th>
          {this.renderHeaderCell({ text: 'Status Book Ref', onClick: () => sortBy('status', this.sortOrder) })}
          {this.renderHeaderCell({ text: 'Proposed travel destination', onClick: () => sortBy('startTravelIn', this.sortOrder) })}
          {this.renderHeaderCell({ text: 'EXO TC',
            onClick: () => sortBy(proposal => [
              _.get(proposal, 'TC.firstName'),
              _.get(proposal, 'TC.lastName'),
            ].join(' '), this.sortOrder) })}
        </tr>
      </thead>
    );
  }
}
