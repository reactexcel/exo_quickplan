import React, { Component, PropTypes } from 'react';
import shortId from 'shortid';

export default class Dropdown extends Component {
  static propTypes = {
    children: PropTypes.node,
    triggerButton: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  }

  getTriggerButton(triggerButton, id) {
    return React.cloneElement(triggerButton, {
      className: 'dropdown-button cursor',
      'data-activates': id
    });
  }

  render() {
    const { children, triggerButton, className } = this.props;
    const id = shortId.generate();
    return (
      <span className={className}>
        {this.getTriggerButton(triggerButton, id)}
        <ul id={id} className='dropdown-content'>
          {children}
        </ul>
      </span>
    );
  }
}
