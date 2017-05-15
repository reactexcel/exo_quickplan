import React from 'react';

export default function InclusionExclusion(cc) {
  let inclusions = '';
  let exclusions = '';
  if (cc.service && cc.service.inclusions) {
    inclusions = cc.service.inclusions.map((cc, i) => <li key={i}>{cc}</li>);
    if (cc.service.exclusions) {
      exclusions = cc.service.exclusions.map((cc, i) => <li key={i}>{cc}</li>);
    }
  }
  return (
    <div style={{ paddingTop: '20px', marginTop: '20px' }}>
      <h4 className='exo-colors-text text-data-1 ml-10'><i className='mdi mdi-repeat mdi-24px' /> Inclusions / Exclusions</h4>
      <div className='row exo-colors-text text-data-1 pl-20 pr-20 ml-10'>
        <div className='col s12'>
          <span style={{ color: '#b1b1b1' }}>Inclusions</span>
          <ol style={{ listStyleType: 'disc', padding: '0px' }}>
            {inclusions}
          </ol>
          <span style={{ color: '#b1b1b1' }}>Exclusions</span>
          <ol style={{ listStyleType: 'disc', padding: '0px' }}>
            {exclusions}
          </ol>
        </div>
      </div>
    </div>
  );
}
