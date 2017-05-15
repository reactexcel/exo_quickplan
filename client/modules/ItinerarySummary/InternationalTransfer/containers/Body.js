import Relay from 'react-relay';
import Body from '../components/Body';
import TransferPlacement from '../../TransferPlacement/containers/TransferPlacement';

export default Relay.createContainer(Body, {
  fragments: {
    data: () => Relay.QL`
      fragment on TransferPlacement {
        ${TransferPlacement.getFragment('transferPlacement')}
      }
    `
  }
});
