import Relay from 'react-relay';
import Note from '../components/Note';

export default Relay.createContainer(Note, {
  fragments: {
    cityDay: () => Relay.QL`
      fragment on CityDay {
        id
        _key
        note
      }
    `
  }
});
