import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import Item from './Item';

const target = {
  drop() {
  },
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { items } = monitor.getItem();

    if (!monitor.isOver({ shallow: true })) return;

    props.find(props.parent, items);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop()
  };
}

class Tree extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    parent: PropTypes.any,
    move: PropTypes.func.isRequired,
    find: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    const { connectDropTarget, items, parent, move, find } = this.props;

    return connectDropTarget(
      <div
        style={{
          position: 'relative',
          minHeight: 10,
          paddingTop: 10,
          marginTop: -11,
          marginLeft: '2em',
          cursor: '-webkit-grab'
        }}
      >
        { items.map((item) => { // eslint-disable-line arrow-body-style
          return (
            <Item
              key={item.id}
              id={item.id}
              parent={parent}
              item={item}
              move={move}
              find={find}
            />);
        })}
      </div>
    );
  }
}

export default DropTarget('ITEM', target, collect)(Tree); // eslint-disable-line new-cap
