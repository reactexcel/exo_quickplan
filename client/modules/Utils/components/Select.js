import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import shortId from 'shortid';

export default class Select extends Component {
  static defaultProps = {
    multiple: false,
    disabled: false
  };

  static propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.node,
    name: PropTypes.string,
  };

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this.refs[this.id]);
    $(this.node).material_select();
    $(this.node).on('change', this.props.onChange);
  }

  componentDidUpdate() {
    $(this.node).material_select('destroy');
    $(this.node).material_select();
  }

  id = shortId.generate();

  render() {
    const { children, multiple, disabled, value, name } = this.props;
    return (
      <select id={this.id} ref={this.id} multiple={multiple} disabled={disabled} name={name} value={value} onChange={() => null}>
        {children}
      </select>
    );
  }
}
