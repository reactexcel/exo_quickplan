import React, { Component, PropTypes } from 'react';
import { groupPaxsByAgeGroup } from '../../Pax/utils';


export default class TravellersSummaryComponent extends Component {
  static propTypes = {
    proposalPaxs: PropTypes.arrayOf(PropTypes.shape({
      ageGroup: PropTypes.string.isRequired
    })).isRequired,
    tripPaxs: PropTypes.arrayOf(PropTypes.shape({
      ageGroup: PropTypes.string.isRequired
    })).isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: 'fs-16'
  }

  /**
   * @param {object[]} proposalPaxs
   * @param {object[]} tripPaxs
   * @returns {object[]}
   */
  static choosePaxsToDisplay(proposalPaxs, tripPaxs) {
    return tripPaxs.length ? tripPaxs : proposalPaxs;
  }

  render() {
    const { className, proposalPaxs, tripPaxs } = this.props;
    const paxs = TravellersSummaryComponent.choosePaxsToDisplay(proposalPaxs, tripPaxs);
    const groupedPaxs = groupPaxsByAgeGroup(paxs);
    const groupSummaries = Object.keys(groupedPaxs)
      .map(groupName => `${groupedPaxs[groupName].length} ${groupName}`)
      .join(' + ');

    return (<span className={className}>
      {paxs.length} = {groupSummaries}
    </span>);
  }
}
