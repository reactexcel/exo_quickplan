import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import PaxModal from '../../../../client/modules/TripPlanner/components/PaxModal';
import paxs from './mock/pax.json';


describe('<PaxModal />', () => {
  describe('without trip paxs', () => {
    before(function before() {
      const props = {
        paxs,
        isOpened: false,
        close: () => {
        }
      };

      this.wrapper = mount((<PaxModal {...props} />));
    });


    it('should found 2 < hr /> separators', function test() {
      expect(this.wrapper.find('hr').length).to.equal(2);
    });


    it('all checkboxes should be checked', function test() {
      this.wrapper.find('input[type="checkbox"]').nodes.forEach(
        checkbox => expect(checkbox.checked).ok
      );
    });


    it('contains only 1 checkbox for each paxs ', function test() {
      paxs.forEach(({ ageGroup, _key }) => {
        expect(
          this.wrapper.find(`#checkbox${ageGroup}${_key}`)
            .length
        ).to.equal(1);
      });
    });


    it('has header for each checkboxGroup with appropriate counter', function test() {
      ['adults 4', 'children 4', 'infants 2'].forEach(
        headElemText => expect(Boolean(
          this.wrapper.find('h4').nodes.find(
            node => node.textContent === headElemText
          )
        )).to.equal(true));
    });
  });
});
