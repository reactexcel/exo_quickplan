import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

export default class Card extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.any,
    titleClassName: PropTypes.string,
    showMinimize: PropTypes.bool,
    minimized: PropTypes.bool,
    doFullCardTitleExpand: PropTypes.bool,
    boxShadowNone: PropTypes.bool,
    titleBackColor: PropTypes.string,
    noBoxShadow: PropTypes.bool
  };

  componentDidMount() {
    conApp.initCards();
  }

  getTitle(title, titleClassName, countryStyle, titleBackColor, hasMinimize = true, doFullCardTitleExpand = false, details) { // eslint-disable-line consistent-return
    if (title) {
      if (doFullCardTitleExpand === true) {
        let none;
        if (details) {
          none = 'none';
        }
        return (
          <div className={cx('title', titleClassName)} style={{ padding: '0px', backgroundColor: titleBackColor }}>
            <div className='row m-0 minimize' style={{ transform: 'none', width: '100%', padding: '10px 1.5rem', cursor: 'pointer' }}>
              {title}
              {hasMinimize ? <a className='minimize' href='#'><i className='mdi-navigation-expand-less' style={{ display: none }} /></a> : null}
            </div>
          </div>
        );
      } else { // eslint-disable-line no-else-return
        return (
          <div className={cx('title', titleClassName)}>
            {title}
            {hasMinimize ? this.getMinimize(countryStyle) : null}
          </div>
        );
      }
    }
  }

  getContent(boxShadowNone, children, noBoxShadow) {
    if (boxShadowNone) {
      return (
        <div>
          {children}
        </div>
      );
    } else if (noBoxShadow) { // eslint-disable-line no-else-return
      return (
        <div className='content' style={{ boxShadow: 'none' }}>
          {children}
        </div>
      );
    } else { // eslint-disable-line no-else-return
      return (
        <div className='content'>
          {children}
        </div>
      );
    }
  }

  getMinimize() {
    let right = '42px';
    if (this.props.countryPanel) {
      right = '50px';
    } else if (this.props.cityPanel) {
      right = '12px';
    }
    if (this.props.countryStyle) {
      return <a className='minimize' style={{ position: 'absolute', right, top: '11px' }} href='#'><i className='mdi-navigation-expand-less' /></a>;
    }
    return <a className='minimize' href='#'><i className='mdi-navigation-expand-less' /></a>;
  }

  render() {
    const { children, details, countryStyle, countryPanel, cityPanel, boxShadowNone, noBoxShadow, className, title, titleBackColor, titleClassName, showMinimize, minimized, doFullCardTitleExpand, ...props } = this.props;
    return (
      <div className={cx('card', { minimized }, className)} {...props}>
        {this.getTitle(title, titleClassName, countryStyle, titleBackColor, showMinimize, doFullCardTitleExpand, details)}
        {this.getContent(boxShadowNone, children, noBoxShadow)}
      </div>
    );
  }
}
