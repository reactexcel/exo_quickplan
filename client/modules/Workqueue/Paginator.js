import React, { Component, PropTypes } from 'react';
import _ from 'lodash';


export default ({ proposals, page, limit, goToPage }) => {
  const pageCount = Math.ceil(proposals.length / limit);
  const pages = _.range(1, pageCount + 1)
    .map((number, i) => {
      if (number === page) {
        return (<a
          key={i}
          className='ml-5 mr-5 exo-colors'
          style={{ padding: '3px 5px' }}
        ><span className='align-center exo-colors-text text-lighten-5'>{number}</span></a>);
      }

      return (<a
        key={i}
        className='ml-5 mr-5 exo-colors-text text-data-1'
        style={{ cursor: 'pointer', padding: '3px 5px' }}
        onClick={() => goToPage(number)}
      >{number}</a>);
    });
  return (<div className='fs-13 fw-600'>
    <a className='ml-5 mr-5 exo-colors-text text-data-1' style={{ cursor: 'pointer', padding: '3px 5px' }} onClick={() => { if (page !== 1) goToPage(page - 1); }}><i className='mdi mdi-chevron-left' /></a>
    {pages}
    <a className='ml-5 mr-5 exo-colors-text text-data-1' style={{ cursor: 'pointer', padding: '3px 5px' }} onClick={() => { if (page !== pageCount) goToPage(page + 1); }}><i className='mdi mdi-chevron-right' /></a>
  </div>);
};
