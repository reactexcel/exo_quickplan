import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Modal from '../../Utils/components/Modal';


export default class StartDateModalComponent extends Component {
  static propTypes = {
    isOpened: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    changeStartDate: PropTypes.func.isRequired,
    getEndDate: PropTypes.func.isRequired,
    startDate: PropTypes.object.isRequired,
    duration: PropTypes.number,
    endDate: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { startDate, endDate } = props;
    this.state = { startDate, endDate };
  }


  componentDidMount() {
    $('.datepicker').pickadate();
    $(this.startDate).on('change', this.handleStartDateChange);
  }

  componentWillReceiveProps({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }


  getCancelButton() {
    return (<a
      className='modal-action modal-close waves-effect waves-red mr-30 right fs-16'
      id='closeStartDateModal'
    >CLOSE</a>);
  }


  getSaveButton() {
    const { changeStartDate } = this.props;

    return (<a
      className='modal-action modal-close waves-effect waves-red mr-10 right fs-16'
      onClick={() => changeStartDate(this.startDate.value)}
      id='saveStartDateButton'
    >
      <i className='mdi mdi-cloud-upload small exo-colors-text text-label mr-10' />
      SAVE
    </a>);
  }


  handleStartDateChange = ({ target: { value } }) => {
    this.setState((prevState, { getEndDate, duration }) => {
      const startDate = moment(value, 'DD MMMM, YYYY');

      return {
        startDate,
        endDate: getEndDate(startDate, duration)
      };
    });
  }


  render() {
    const { isOpened, close, duration } = this.props;
    const { startDate, endDate } = this.state;

    return (
      <Modal
        isModalOpened={isOpened}
        changeModalState={close}
        cancelButton={this.getCancelButton()}
        actionButton={this.getSaveButton()}
      >
        <div className='row'>
          <div className='col m12'>
            <h2>Trip Date</h2>
          </div>
        </div>
        <div className='row valign-wrapper'>
          <div className='col m6 '>
            <div className='input-field'>
              <b><input
                type='text'
                className='datepicker'
                id='startDate'
                ref={ref => (this.startDate = ref)}
                value={startDate.format('MMMM, DD YYYY')}
                onChange={this.handleStartDateChange}
              /></b>
            </div>
          </div>
          <div className='col m4 '>
            <span className='fs-14 exo-colors-text text-label-1 '>End date</span>
            <div className='valign-wrapper pt-8'>
              <b><span className='fs-16 ml-4'>{endDate.format('MMMM, DD YYYY')}</span></b>
            </div>
          </div>
          <div className='col m2 '>
            <span className='fs-14 exo-colors-text text-label-1 '>Duration</span>
            <div className='valign-wrapper'>
              <i className='mdi-acton-account-box small exo-colors-text text-label' />
              <b><span className='fs-16 ml-4'>{duration} days</span></b>
            </div>
          </div>
        </div>
      </ Modal>
    );
  }
}
