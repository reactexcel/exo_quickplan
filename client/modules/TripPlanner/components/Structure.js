import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Tree from '../../NestedSorted/components/Tree';

class Structure extends Component {
  state = {
    tree: [
      {
        id: 1,
        title: 'Thailand',
        children: [
          { id: 2, title: 'Bangkok', children: [] },
          { id: 3, title: 'Pattaya', children: [] },
          { id: 4, title: 'Samui', children: [] }
        ]
      },
      {
        id: 5,
        title: 'Laos',
        children: [
          { id: 8, title: 'Vientien', children: [] },
          { id: 9, title: 'Vang Vien', children: [] }
        ]
      },
      {
        id: 6,
        title: 'Cambodia',
        children: [
          {
            id: 7,
            title: 'Phnom Phen',
            children: []
          }
        ]
      }
    ]
  };

  moveItem(id, afterId, nodeId) {
    if (id === afterId) return;

    const { tree } = this.state;

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

    const item = { ...this.findItem(id, tree) };
    if (!item.id) {
      return;
    }

    const dest = nodeId ? this.findItem(nodeId, tree).children : tree;

    if (!afterId) {
      removeNode(id, tree);
      dest.push(item);
    } else {
      const index = dest.indexOf(dest.filter(v => v.id === afterId).shift());
      removeNode(id, tree);
      dest.splice(index, 0, item);
    }
    this.setState({ tree });
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
  };

  render() {
    const { tree } = this.state;

    return (
      <div>
        <form>
          <h1>Trip Structure</h1>
          <hr />
          <div className='row'>
            <div className='col s12'>
              <Tree
                parent={null}
                items={tree}
                move={this.moveItem.bind(this)}
                find={this.findItem.bind(this)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col s4'>
              <button className='btn' onClick={this.saveStructure} name='action'>
                Save<i className='mdi-content-send right' />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Structure); // eslint-disable-line new-cap
