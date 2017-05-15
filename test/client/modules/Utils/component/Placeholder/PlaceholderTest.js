import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import Placeholder from '../../../../../../client/modules/Utils/components/Placeholder/Placeholder';

const expect = chai.expect;

describe('<Placeholder />', () => {
  it('contains MdHelpOutline', () => {
    const wrapper = shallow(<Placeholder />);
    expect(wrapper.find({ MdHelpOutline: 80 }));
  });
});
