import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';
import TripHeader from '../../../../client/modules/TripPlanner/components/TripHeader';


describe('<TripHeader />', () => {
  it('should open startDateModal if trip is not in booked status', () => {
    const props = {
      viewer: {
        proposal: {
          duration: 5,
          paxs: [{
            isMainPax: true,
            firstName: 'AAA',
            lastName: 'BBB',
            ageGroup: 'adult'
          }],
          TA: {
            office: {}
          },
          TC: {
            office: {}
          }
        },
        trip: {
          status: 'booked',
          paxs: []
        },
      }
    };

    const wrapper = mount((<TripHeader {...props} />));
    const openStartDateModal = wrapper.find('#openStartDateModal');
    const oldState = wrapper.state('isStartDateModalOpened');

    openStartDateModal.simulate('click');
    expect(wrapper.state('isStartDateModalOpened')).to.equal(oldState);
  });


  it('should open startDateModal if trip is not in booked status', () => {
    const props = {
      viewer: {
        proposal: {
          duration: 14,
          paxs: [{
            isMainPax: true,
            firstName: 'AAA',
            lastName: 'BBB',
            ageGroup: 'adult'
          }],
          TA: {
            office: {}
          },
          TC: {
            office: {}
          }
        },
        trip: {
          status: 'approved',
          paxs: []
        }
      }
    };

    const wrapper = mount((<TripHeader {...props} />));
    const openStartDateModal = wrapper.find('#openStartDateModal');
    const oldState = wrapper.state('isStartDateModalOpened');

    openStartDateModal.simulate('click');
    expect(wrapper.state('isStartDateModalOpened')).to.equal(!oldState);
  });


  it('properly chooses initial value for trip start date', () => {
    const props = {
      viewer: {
        proposal: {
          duration: 14,
          startTravelOnDate: '02/02/2040',
          paxs: [{
            isMainPax: true,
            firstName: 'AAA',
            lastName: 'BBB',
            ageGroup: 'adult'
          }],
          TA: {
            office: {}
          },
          TC: {
            office: {}
          }
        },
        trip: {
          startDate: '01/01/2050',
          paxs: []
        }
      }
    };

    let wrapper = mount((<TripHeader {...props} />));
    expect(wrapper.state('startDate').format())
      .to.equal(moment(new Date(props.viewer.trip.startDate)).format());

    delete props.viewer.trip.startDate;
    wrapper = mount((<TripHeader {...props} />));
    expect(wrapper.state('startDate').format())
      .to.equal(
      moment(new Date(props.viewer.proposal.startTravelOnDate)).format()
    );

    delete props.viewer.proposal.startTravelOnDate;
    wrapper = mount((<TripHeader {...props} />));
    expect(wrapper.state('startDate').format())
      .to.equal(moment().format());
  });
});
