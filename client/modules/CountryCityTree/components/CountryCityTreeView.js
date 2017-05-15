import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import CountryCityTreeModal from './CountryCityTreeModal';

class CountryCityTreeView extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    tripKey: PropTypes.string
  }

  state = {
    isChangeOrderModalOpened: false
  }

  changeOrderChangeModalstatus(isOpened) {
    this.setState({ isChangeOrderModalOpened: isOpened });
  }

  componentWillReceiveProps(nextProps) {
    nextProps.relay.forceFetch();
  }

  render() {
    const renderCountry = country => <div key={country.id} className='pt-20'>
      <span>{country.title}</span>
      <div className='pl-20' >
        { country.children ? country.children.map(city => <div key={city.id} className='pt-10'>{city.title}</div>) : null}
      </div>
    </div>;

    const { Tree } = this.props.viewer.TreeStructure;
    return (<div>
      <div className='right-align fs-14 exo-colors-text fw-600 pr-20'>
        <a onClick={() => this.changeOrderChangeModalstatus(true)}><i className='mdi mdi-swap-vertical' />Change Order</a>
      </div>
      <div className='pl-20 fs-14 exo-colors-text text-label-1 fw-600'>
        { Tree ? Tree.map(country => renderCountry(country)) : null }
      </div>
      { this.state.isChangeOrderModalOpened ? <CountryCityTreeModal
        viewer={this.props.viewer}
        tripKey={this.props.tripKey}
        changeOrderChangeModalstatus={isOpened => this.changeOrderChangeModalstatus(isOpened)}
        isChangeOrderModalOpened={this.state.isChangeOrderModalOpened}
      /> : null}
    </div>);
  }
}

export default CountryCityTreeView;
