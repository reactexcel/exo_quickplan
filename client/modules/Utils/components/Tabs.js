import React, { Component, PropTypes, Children } from 'react';
import cx from 'classnames';
import shortId from 'shortid';

export default class Tab extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
    $('ul.tabs').tabs();
  }

  /**
   * Rebind onClick to tabs, this is necessary
   * when we have to add or remove tabs dynamically
   */
  componentDidUpdate() {
    const $this = $('ul.tabs');

    // Unbind on click before rebinding it
    $this.off('click');
    $this.tabs();
  }

  render() {
    const { children, className, ...props } = this.props;
    const ids = [];
    /* eslint-disable no-shadow */
    return (
      <div className='row m-0 mt-15'>
        <div className='col s12 p-0'>
          <ul className={cx('tabs fs-10', className)} style={{ borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', overflowX: 'hidden' }} {...props}>
            {Children.map(children, (childNode, i) => {
              let color;
              const { title, active, id } = childNode.props;
              ids.push(shortId.generate());
              return <li key={i} className='tab' id={id}><a className={cx({ active })} style={{ letterSpacing: 'normal' }} href={`#${ids[i]}`}>{title}</a></li>;
            })}
          </ul>
        </div>
        {Children.map(children, (childNode, i) => {
          const { className, children } = childNode.props;
          return (
            <div key={i} id={`${ids[i]}`} className={cx('col', 's12', 'p-0', className)}>
              {children}
            </div>
          );
        })}
      </div>
    );
    /* eslint-enable no-shadow */
  }
}
