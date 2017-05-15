import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';
import StartDateModal from '../../../../client/modules/TripPlanner/components/StartDateModal';

const isEqual = (date1, date2) => Math.abs(date1.diff(date2)) < 100;

describe('<StartDateModal />', () => {
  before(function test() {
    const startDate = moment();
    const duration = 10;
    const getEndDate = newStartDate => moment(newStartDate, 'DD MMMM, YYYY')
      .add(duration, 'days');
    const isOpened = false;
    let wrapper = null;

    const props = {
      close() {
      },
      changeStartDate(value) {
        wrapper.setProps({
          endDate: getEndDate(value)
        });
      },
      startDate,
      duration,
      isOpened,
      endDate: getEndDate(startDate),
      getEndDate
    };

    wrapper = mount((<StartDateModal {...props} />));
    this.wrapper = wrapper;
  });

  it('end date changes according to start date', function test() {
    const { wrapper } = this;
    const { startDate, endDate } = wrapper.props();
    const increment = 10;
    const startDateInput = wrapper.find('#startDate');

    expect(startDate).to.equal(wrapper.state('startDate'));
    expect(endDate).to.equal(wrapper.state('endDate'));

    startDateInput.simulate('change', {
      target: {
        value: moment(startDate).add(increment, 'days')
      }
    });

    expect(isEqual(
      moment(endDate).add(increment, 'days'),
      wrapper.state('endDate')
    )).to.equal(true);
  });


  it('keep start and end dates after save', function test() {
    const { wrapper } = this;
    const { startDate } = wrapper.props();
    const increment = 12;
    const startDateInput = wrapper.find('#startDate');
    const saveStartDateButton = wrapper.find('#saveStartDateButton');

    startDateInput.simulate('change', {
      target: {
        value: moment(startDate).add(increment, 'days')
      }
    });

    saveStartDateButton.simulate('click');

    expect(isEqual(
      wrapper.prop('startDate'),
      wrapper.state('startDate')
    )).to.equal(true);

    expect(isEqual(
      wrapper.prop('endDate'),
      wrapper.state('endDate')
    )).to.equal(true);
  });


  it('discard start and end dates after save', function test() {
    const { wrapper } = this;
    const { startDate } = wrapper.props();
    const increment = 12;
    const startDateInput = wrapper.find('#startDate');
    const closeStartDateModal = wrapper.find('#closeStartDateModal');

    startDateInput.simulate('change', {
      target: {
        value: moment(startDate).add(increment, 'days')
      }
    });

    closeStartDateModal.simulate('click');

    expect(isEqual(
      wrapper.prop('startDate'),
      wrapper.state('startDate')
    )).to.equal(false);

    expect(isEqual(
      wrapper.prop('endDate'),
      wrapper.state('endDate')
    )).to.equal(false);
  });
});
