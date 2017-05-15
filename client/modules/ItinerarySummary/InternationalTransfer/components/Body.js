import React from 'react';
import TransferPlacement from '../../TransferPlacement/containers/TransferPlacement';

export default ({
  data: transferPlacement,
  showLineAmounts,
}) => (<div className='pt-30'>
  <TransferPlacement
    transferPlacement={transferPlacement}
    showLineAmounts={showLineAmounts}
    summary={false}
    type='international'
  />
</div>);
