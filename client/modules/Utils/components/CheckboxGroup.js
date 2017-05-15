import React, { Component, PropTypes } from 'react';
import CheckBox from './Checkbox';


export default class CheckboxGroup extends Component {
  static propTypes = {
    title: PropTypes.string,
    titleClassName: PropTypes.string,
    className: PropTypes.string,
    checkboxes: PropTypes.arrayOf(PropTypes.shape({
      labelText: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
      isDisabled: PropTypes.boolean,
      labelClassName: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      className: PropTypes.string
    })).isRequired
  };

  static defaultProps = {
    titleClassName: 'col m12',
    className: 'p-15 row',
    title: ''
  };


  getTitle = () => {
    const { title, titleClassName, checkboxes } = this.props;
    return title
      ? <h4 className={titleClassName}>{title} {checkboxes.length}</h4>
      : '';
  };


  render() {
    const { checkboxes, className } = this.props;

    return (
      <div className={className}>
        {this.getTitle()}
        {checkboxes.map(checkbox => <CheckBox
          {...checkbox}
          key={checkbox.id}
        />)}
      </div>
    );
  }
}
