import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TravellersSummary from '../../../../client/modules/TripPlanner/components/TravellersSummary';


describe('<TravellersSummary />', () => {
  it('should generate summary based on proposal paxs', () => {
    const props = {
      proposalPaxs: [
        { ageGroup: 'children' },
        { ageGroup: 'adults' },
        { ageGroup: 'infants' },
        { ageGroup: 'adults' },
        { ageGroup: 'adults' },
        { ageGroup: 'children' },
        { ageGroup: 'adults' },
      ],
      tripPaxs: [],
    };

    const wrapper = mount((<TravellersSummary {...props} />));
    const summary = wrapper.find('span');

    expect(summary.text()).to.equal('7 = 4 adults + 2 children + 1 infants');
  });

  it('should generate summary based on trip paxs', () => {
    const props = {
      proposalPaxs: [
        { ageGroup: 'infants' },
        { ageGroup: 'children' },
        { ageGroup: 'adults' },
        { ageGroup: 'children' },
        { ageGroup: 'adults' },
        { ageGroup: 'adults' },
        { ageGroup: 'adults' },
      ],
      tripPaxs: [
        { ageGroup: 'children' },
        { ageGroup: 'infants' },
        { ageGroup: 'adults' },
        { ageGroup: 'adults' },
        { ageGroup: 'children' },
        { ageGroup: 'infants' },
        { ageGroup: 'adults' },
        { ageGroup: 'children' }
      ]
    };

    const wrapper = mount((<TravellersSummary {...props} />));
    const summary = wrapper.find('span');

    expect(summary.text()).to.equal('8 = 3 adults + 3 children + 2 infants');
  });
});
