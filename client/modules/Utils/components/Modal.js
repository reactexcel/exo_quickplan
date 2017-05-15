import React, { Component, PropTypes } from 'react';
import shortId from 'shortid';
import cx from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

const enabledScorllHandler = function (e) {
  let scrollTo = null;

  if (e.type === 'mousewheel') {
    scrollTo = (e.originalEvent.wheelDelta * -1);
  } else if (e.type === 'DOMMouseScroll') {
    scrollTo = 40 * e.originalEvent.detail;
  }

  if (scrollTo) {
    e.preventDefault();
    $(this).scrollTop(scrollTo + $(this).scrollTop());
  }
};

const disabledScorllHandler = function (e) {
  e.preventDefault();
};

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    actionButton: PropTypes.node,
    cancelButton: PropTypes.node,
    className: PropTypes.string,
    fixedFooter: PropTypes.bool,
    dismissible: PropTypes.bool,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    style: PropTypes.object,
    showCancelButton: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool
  };

  handleClickOutside() {
    const { changeModalState, closeOnOutsideClick } = this.props;
    if (closeOnOutsideClick) {
      changeModalState(false);
    }
  }

  static defaultProps = {
    dismissible: true,
    showCancelButton: true,
    closeOnOutsideClick: false // need to be false by default
  };

  componentDidMount() {
    const { isModalOpened, dismissible, changeModalState } = this.props;
    if (isModalOpened) {
      $('#app').on('mousewheel DOMMouseScroll', disabledScorllHandler);
      $(`#${this.uuid}`).on('mousewheel DOMMouseScroll', enabledScorllHandler);
    }
    $(`#${this.uuid}`).modal({
      dismissible,
      complete: () => changeModalState(false)  // Callback for Modal close
    });

    this.handleDisplayModal(isModalOpened);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isModalOpened !== nextProps.isModalOpened) {
      if (nextProps.isModalOpened) {
        $('#app').on('mousewheel DOMMouseScroll', disabledScorllHandler);
        $(`#${this.uuid}`).on('mousewheel DOMMouseScroll', enabledScorllHandler);
      } else {
        $('#app').off('mousewheel DOMMouseScroll');
        $(`#${this.uuid}`).off('mousewheel DOMMouseScroll');
      }
      this.handleDisplayModal(nextProps.isModalOpened, nextProps.changeModalState);
    }
  }

  componentWillUnmount() {
    $('#app').off('mousewheel DOMMouseScroll');
    $(`#${this.uuid}`).off('mousewheel DOMMouseScroll');

    // Fix Materializecss bug, it doesn't remove the overlay when the modal closes.
    // So, we need to manually remove it
    $('.lean-overlay').remove();
  }

  getCancelButton = () => {
    if (this.props.cancelButton) {
      return this.props.cancelButton;
    }
    return <a className='modal-action modal-close waves-effect waves-red btn mr-10'><i className='mdi-content-clear left' />Cancel</a>;
  };

  handleDisplayModal(isOpen) {
    $(`#${this.uuid}`).modal(isOpen ? 'open' : 'close');
  }


  uuid = shortId.generate();

  render() {
    let none = 'none';
    if (this.props.isModalOpened) {
      none = '';
    } else {
      none = 'none';
    }
    const { children, actionButton, className, fixedFooter, style, showCancelButton } = this.props;
    return (<div style={{ height: '100%', width: '100%', position: 'fixed', zIndex: '1001', left: '0', top: '0', backgroundColor: ' rgba(0,0,0, 0.9)', overflow: 'hidden', opacity: '1.5', display: none }}>
      <div id={this.uuid} className={cx('modal', { 'modal-fixed-footer': fixedFooter }, className)} style={style}>
        <div className='modal-content'>
          {children}
        </div>
        <div className='modal-footer'>
          {actionButton}
          {showCancelButton ? this.getCancelButton() : null}
        </div>
      </div>
    </div>
    );
  }
}

export default enhanceWithClickOutside(Modal);
