import React, { Component, PropTypes } from 'react';

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    labelClassName: PropTypes.string,
    className: PropTypes.string,
    labelText: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };


  static defaultProps = {
    labelClassName: 'fs-16',
    className: 'col m3',
  };


  onChange = ({ target: { checked } }) => {
    const { id, onChange } = this.props;
    onChange(id, checked);
  };


  getInputAttributes = () => {
    const { id, isDisabled, checked } = this.props;

    const attributes = {
      id,
      checked,
      type: 'checkbox',
      onChange: this.onChange
    };

    if (isDisabled) {
      attributes.disabled = 'disabled';
    }

    return attributes;
  };


  render() {
    const { id, labelClassName, labelText, className } = this.props;

    return (<div className={className}>
      <input {...this.getInputAttributes()} />
      <label htmlFor={id} className={labelClassName}>{labelText}</label>
    </div>);
  }
}
