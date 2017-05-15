import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import PubSub from 'pubsub-js';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TreeView from '../../NestedSorted/components/Tree';
import CountryCityTreeMutation from '../mutations/CountryCityTree';
import { Modal } from '../../Utils/components';

class CountryCityTree extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    tripKey: PropTypes.string,
    changeOrderChangeModalstatus: PropTypes.func,
    isChangeOrderModalOpened: PropTypes.bool
  }

  moveItem(id, afterId, nodeId) {
    if (id === afterId) return;

    const { Tree } = this.props.viewer.TreeStructure;

    const removeNode = (removeId, items) => {
      for (const node of items) {
        if (node.id === removeId) {
          items.splice(items.indexOf(node), 1);
          return;
        }

        if (node.children && node.children.length) {
          removeNode(id, node.children);
        }
      }
    };

    const item = { ...this.findItem(id, Tree) };
    if (!item.id) {
      return;
    }

    const dest = nodeId ? this.findItem(nodeId, Tree).children : Tree;

    if (!afterId) {
      removeNode(id, Tree);
      dest.push(item);
    } else {
      const index = dest.indexOf(dest.filter(v => v.id === afterId).shift());
      removeNode(id, Tree);
      dest.splice(index, 0, item);
    }
    this.setState({ Tree });
  }

  findItem(id, items) {
    for (const node of items) {
      if (node.id === id) return node;
      if (node.children && node.children.length) {
        const result = this.findItem(id, node.children);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }
  saveStructure = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(new CountryCityTreeMutation({
      TreeStructure: this.props.viewer.TreeStructure,
      tripKey: this.props.tripKey
    }), {
      onSuccess: (res) => {
        PubSub.publish('TripForceFetch', {});
      }
    });
  };

  render() {
    const { Tree } = this.props.viewer.TreeStructure;
    const { isChangeOrderModalOpened, changeOrderChangeModalstatus } = this.props;
    const changeOrderButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.saveStructure}><i className='mdi-content-send left' />Save</a>;
    return (
      <Modal className={'change-order-modal exo-colors modal-bgr1'} actionButton={changeOrderButton} isModalOpened={isChangeOrderModalOpened} changeModalState={changeOrderChangeModalstatus}>
        <div className='pt-20'><h3>Order itinerary</h3></div>
        <div className='row'>
          <div className='col s11'>
            <TreeView
              parent={null}
              items={Tree}
              move={this.moveItem.bind(this)}
              find={this.findItem.bind(this)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default DragDropContext(HTML5Backend)(CountryCityTree);
// eslint-disable-line new-cap
