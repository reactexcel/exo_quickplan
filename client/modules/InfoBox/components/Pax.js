import React, { PropTypes } from 'react';
import { Select2 } from '../../Utils/components';

function preparePaxsForSelect2(paxs) {
  return paxs.map(pax => ({ id: pax._key, text: `${pax.firstName} ${pax.lastName}` }));
}

function handleOnChangePaxs(handleOnChange, e) {
  const paxKeys = Select2.getSelect2Values(e.currentTarget);
  handleOnChange(paxKeys);
}

export default function Pax({ availablePaxs, selectedPaxs, handleOnChange }) {
  const paxKeys = selectedPaxs.map(pax => pax._key);

  return (
    <Select2 multiple data={preparePaxsForSelect2(availablePaxs)} defaultValue={paxKeys} onSelect={handleOnChangePaxs.bind(null, handleOnChange)} onUnselect={handleOnChangePaxs.bind(null, handleOnChange)} />
  );
}

Pax.propTypes = {
  selectedPaxs: PropTypes.array,
  availablePaxs: PropTypes.array,
  handleOnChange: PropTypes.func
};
