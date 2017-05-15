import React, { PropTypes } from 'react';
import style from '../style.module.scss';

function renderRatePromotions(rate, promotions = []) {
  let r_name = rate.name;
  let r_description = rate.description;
  if (r_name === 'Standard') {
    r_name = '';
  }
  if (r_description === 'Standard') {
    r_description = '';
  }

  let r_name_desc = <div>{r_name} - {r_description}</div>;
  if (r_name === '' && r_description === '') {
    r_name_desc = '';
  }
  return (
    <div className='row exo-colors-text text-data-1 pl-20 pr-20 m-0'>
      <div className='col s12 pb-0'>
        {r_name_desc}
        <ul className={style.promotion}>
          {promotions.map((promotion, idx) => <li key={idx}>{promotion.description}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function Promotion({ rate, promotions, showHeader, hasPromotions }) {
  return (
    <div className='row m-0'>
      <div>
        { showHeader ? <h4 className='exo-colors-text text-data-1'><i className='mdi-maps-local-offer' />Promotion</h4> : null }
        { hasPromotions ? <span className='left'><i className='mdi-maps-local-offer' /></span> : null }
        { rate ? renderRatePromotions(rate, promotions) : null }
      </div>
    </div>
  );
}

Promotion.propTypes = {
  rate: PropTypes.object,
  promotions: PropTypes.array,
  showHeader: PropTypes.bool,
  hasPromotions: PropTypes.bool
};

