import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import TransferPlacement from './TransferPlacement';
import styles from '../style.module.scss';

export default class TransferPlacementHoverable extends Component {
  static propTypes = {
    leftClickHandler: PropTypes.func.isRequired,
    rightClickHandler: PropTypes.func.isRequired,
    zIndex: PropTypes.number,
    disableRight: PropTypes.bool,
    disableLeft: PropTypes.bool,
    data: PropTypes.object.isRequired,
    dataLength: PropTypes.number.isRequired,
    removeClickHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showHover: false,
      enableHover: true,
      placementId: this.props.data.id,
      dataLength: this.props.dataLength
    };
    this.enableHover = true;
    this.isOnHover = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.id !== this.state.placementId && nextProps.dataLength >= this.state.dataLength) {
      this.shouldRunAnimation = true;
      this.setState({ placementId: nextProps.data.id, dataLength: nextProps.dataLength });
    } else {
      this.setState({ placementId: nextProps.data.id, dataLength: nextProps.dataLength });
    }
  }

  componentDidUpdate() {
    if (this.shouldRunAnimation) {
      this.shouldRunAnimation = false;
      this.runAnimation();
    }
  }

  onMouseEnterHandler = () => {
    this.setState({
      showHover: true
    });
  };

  onMouseLeaveHandler = () => {
    this.setState({
      showHover: false
    });
  };

  getXYpos = (elm) => {
    let x = elm.offsetLeft;        // set x to elm’s offsetLeft
    let y = elm.offsetTop;         // set y to elm’s offsetTop

    // eslint-disable-next-line no-param-reassign
    elm = elm.offsetParent;    // set elm to its offsetParent

    // use while loop to check if elm is null
    // if not then add current elm’s offsetLeft to x
    // offsetTop to y and set elm to its offsetParent
    while (elm != null) {
      x = parseInt(x, 10) + parseInt(elm.offsetLeft, 10);
      y = parseInt(y, 10) + parseInt(elm.offsetTop, 10);

      // eslint-disable-next-line no-param-reassign
      elm = elm.offsetParent;
    }

    // returns an object with "xp" (Left), "=yp" (Top) position
    return { xp: x, yp: y };
  };

  getCoords = (e) => {
    const xyPos = this.getXYpos(this.node);

    let x = e.pageX;

    x -= xyPos.xp;

    if (x > 150) {
      this.setState({ enableHover: false });
    } else {
      this.setState({ enableHover: true });
    }
  };

  leftClickHandler = (e) => {
    this.props.leftClickHandler(e);
  };

  runAnimation() {
    const transferPlacement = ReactDOM.findDOMNode(this.transferPlacement);
    transferPlacement.classList.remove(styles['fadeUpDown-animation']);
    transferPlacement.classList.add(styles['fadeUpDown-animation']);
  }


  render() {
    const cx = classNames.bind(styles);
    const isLocalTransferModal = this.props.isLocalTransferModal || false;

    let arrows = '';

    arrows = (<div>
      <i className={cx('mdi mdi-arrow-left hover', { disabled: this.props.disableLeft })} onClick={this.leftClickHandler.bind(this)} />
      <i className={cx('mdi mdi-arrow-right hover', { disabled: this.props.disableRight })} onClick={this.props.rightClickHandler.bind(this)} />
    </div>);

    if (isLocalTransferModal) {
      arrows = '';
    }

    /* eslint-disable no-return-assign */
    const transferWrapperStyle = this.props.transferWrapperStyle ? { ...this.props.transferWrapperStyle, display: 'inline', zIndex: 999 } : { display: 'inline', zIndex: 999 };

    return (
      <div style={{ position: 'relative', display: 'inline-block', paddingRight: '50px', zIndex: this.props.zIndex }} ref={node => this.node = node} >
        <div
          onMouseEnter={this.onMouseEnterHandler}
          onMouseLeave={this.onMouseLeaveHandler}
          onMouseMove={this.getCoords}
          // onClick={this.props.removeClickHandler}
          onClick={this.props.openOverlay}
          style={transferWrapperStyle}
          className={cx(styles.transferWrapper)}
        >
          <TransferPlacement ref={t => this.transferPlacement = t} {...this.props} />
        </div>
        {
          this.state.showHover && this.state.enableHover ?
            <span
              className={styles.transferHover}
              onMouseEnter={this.onMouseEnterHandler}
              onMouseLeave={this.onMouseLeaveHandler}
            >
              {arrows}
            </span>
          : null
        }
      </div>
    );
    /* eslint-enable no-return-assign */
  }
}
