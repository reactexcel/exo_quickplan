import Relay from 'react-relay';
import Tree from '../components/CountryCityTreeView';

export default Relay.createContainer(Tree, {
  initialVariables: {
    tripKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
    fragment on Viewer {
      TreeStructure(tripKey: $tripKey) {
        id
        Tree {
          id
          title
          children {
            id
            title
            children
          }
        }
      }
    }`
  }
});
