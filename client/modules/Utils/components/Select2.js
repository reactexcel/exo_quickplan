import React, { PropTypes } from 'react';
import Select2 from 'react-select2-wrapper';

function Select(props) {
  return (
    <Select2 {...props} style={{ ...props.style, width: '100%' }} />
  );
}

Select.getSelect2Values = (select) => {
  const selectedValues = [];
  for (let i = 0; i < select.length; i++) {
    if (select.options[i].selected) selectedValues.push(select.options[i].value);
  }
  return selectedValues;
};

Select.propTypes = {
  style: PropTypes.object
};

export default Select;
