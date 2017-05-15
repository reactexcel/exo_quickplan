import React from 'react';
import { Card } from '../../Utils/components';

export default class LocalTransferInfo extends React.Component {
  static propTypes = {
    transfer: React.PropTypes.object
  };
  render() {
    const { transfer } = this.props;
    const descriptionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-description' />Description</h5>;
    const description = $('<textarea/>').html(transfer.description).text();
    return (
      <div className='card'>
        <Card title={descriptionTitle} className='fs-14 mt-50' doFullCardTitleExpand>
          <div className='row exo-colors-text text-data-1 m-0'>
            <div className='col s12'>
              {description}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
