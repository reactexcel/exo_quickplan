import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import Tree from './Tree';

let _parentID = 0;
const source = {
  beginDrag(props) {
    _parentID = props.parent;
    return {
      id: props.id,
      parent: props.parent,
      items: props.item.children
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const target = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props;
    if (draggedId === overId || draggedId === props.parent) return;
    if (!monitor.isOver({ shallow: true })) return;
    if (props.parent === _parentID) {
      props.move(draggedId, overId, props.parent);
    }
  }
};

class Item extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    parent: PropTypes.any,
    item: PropTypes.object,
    move: PropTypes.func,
    find: PropTypes.func,
    connectDropTarget: PropTypes.func,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func
  };

  render() {
    const {
      connectDropTarget, connectDragPreview, connectDragSource,
      item: { id, title, children }, move, find } = this.props;

    return connectDropTarget(connectDragPreview(
      <div>
        {connectDragSource(
          <div style={{ background: 'white', border: '1px solid #ccc', padding: '1em', marginBottom: -1, cursor: '-webkit-grab' }}>{title}</div>
        )}
        <Tree
          parent={id}
          items={children}
          move={move}
          find={find}
        />
      </div>
    ));
  }
}

const dropItem = DropTarget('ITEM', target, (connect, monitor) => ({ // eslint-disable-line new-cap
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop()
}))(Item);

const dndItem = DragSource('ITEM', source, (connect, monitor) => ({ // eslint-disable-line new-cap
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(dropItem);

export default dndItem;
