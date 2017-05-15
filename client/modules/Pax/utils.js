import _ from 'lodash';
import moment from 'moment';

/**
 * @param {object[]} paxs
 * @returns object
 */
const getMainPax = paxs => paxs.find(pax => pax.isMainPax) || {};

/**
 *
 * @param {object[]} paxs
 * @returns {object}
 */
const groupPaxsByAgeGroup = paxs => _.chain(paxs)
  .groupBy(pax => getPaxAgeGroupByTripDate(pax))
  .toPairs()
  .sortBy(0)
  .fromPairs()
  .value();

const getPaxAgeGroupByTripDate = (pax, tripDate) => {
  const date = tripDate ? new Date(tripStartDate) : new Date();
  if (pax.ageGroup && pax.ageGroup !== '') {
    return pax.ageGroup;
  }

  let ageOnArrival;
  if (pax.dateOfBirth && pax.dateOfBirth !== '') {
    ageOnArrival = moment(date).diff(moment(pax.dateOfBirth, 'D MMMM, YYYY'), 'years');
  } else {
    ageOnArrival = pax.ageOnArrival;
  }
  const age = _.parseInt(ageOnArrival);

  if (age < 2) {
    return 'infants';
  } else if (age < 12) {
    return 'children';
  } else {  // eslint-disable-line no-else-return
    return 'adults';
  }
};

export {
  getMainPax,
  groupPaxsByAgeGroup
};
