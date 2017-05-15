import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import { Modal, Dropdown } from '../../Utils/components';
import { getUserRole } from '../../../services/user';
import SERVICES from '../../../services';
import unavailable_slot_overlay from '../../../assets/unavailable_slot_overlay.png';


export default class Meal extends Component {
  static propTypes = {
    meals: PropTypes.array,
    handleSaveMeal: PropTypes.func
  }

  state = {
    userRole: getUserRole(),
    isAddMealModalOpened: false,
    mealOrder: -1,
    mealType: 'No meal arranged',
    mealNote: '',
    meals: []
  }
  componentWillReceiveProps(props) {
    this.setState({ meals: props.meals });
  }

  changeAddMealModalState = (isOpen, mealOrder, mealType, mealNote) => {
    this.setState({ isAddMealModalOpened: isOpen, mealOrder, mealType, mealNote });
  };

  renderMeal(mealSlot, i) {
    // const amHandle = this.props.am === 'am' && i === 0;
    // const pmHandle = this.props.pm === 'pm' && i === 1;
    // const eveHandle = this.props.eve === 'eve' && i === 2;
    // above is commented since now meals are only coming for avaialble slots only
    const amHandle = false;
    const pmHandle = false;
    const eveHandle = false;

    const { handleSaveMeal } = this.props;
    if (mealSlot.isDisabled === true) {
      return null;
    }
    const top = ['40px', '128px', '216px'];
    const slotOrder = mealSlot.slotOrder;
    const meal = mealSlot.meal || { type: 'No meal arranged', note: '' };
    const mealType = meal.type || 'No meal arranged';
    const tips = {
      'No meal arranged': 'No meal arranged',
      'Included with tour': 'Meal included with tour',
      'Included with hotel': 'Meal included with hotel',
      'Pre-arranged': `Meal has been pre-arranged.<br> ${meal.note}`,
      'Guest self-arranged': `Meal will  be arranged by guests.<br> ${meal.note}`
    };
    let mealIconColor;
    if (mealType === 'Included with tour' || mealType === 'Included with hotel') {
      mealIconColor = '#3e8d72';
    } else if (mealType === 'Pre-arranged' || mealType === 'Guest self-arranged') {
      mealIconColor = '#666666';
    } else {
      mealIconColor = '#eea400';
    }

    if (this.state.userRole === 'TA') {
      return (amHandle || pmHandle || eveHandle) ? null : (<div key={slotOrder}><a className='pr-10' href='#' ><i
        key={i} className='mdi mdi-silverware-variant mdi-24px' style={{ top: top[i], position: 'relative', color: mealIconColor, left: '10px', fontSize: '20px', marginLeft: '10px' }} data-tip={tips[mealType]}
        data-html='true'
      /> <ReactTooltip /></a></div>);
    }

    const triggerDropdown = (<a className='pr-10' href='#' data-activates='dropdown2' ><i
      key={i} className='mdi mdi-silverware-variant mdi-24px' style={{ top: top[i], position: 'relative', color: mealIconColor, left: '10px', fontSize: '20px', marginLeft: '10px' }} data-tip={tips[mealType]}
      data-html='true'
    /> <ReactTooltip /></a>);
    return (
      (amHandle || pmHandle || eveHandle) ? null : (<div key={slotOrder}>
        <Dropdown className='dropdown' triggerButton={triggerDropdown}>
          <li><a onClick={() => handleSaveMeal(slotOrder, 'Included with tour', '')}>Included with tour</a></li>
          <li><a onClick={() => handleSaveMeal(slotOrder, 'Included with hotel', '')}>Included with hotel</a></li>
          <li><a onClick={() => this.changeAddMealModalState(true, slotOrder, 'Pre-arranged', meal.note)}>Pre-arranged</a></li>
          <li><a onClick={() => this.changeAddMealModalState(true, slotOrder, 'Guest self-arranged', meal.note)}>Guest self-arranged</a></li>
          <li><a onClick={() => handleSaveMeal(slotOrder, 'No meal arranged', '')}>No meal arranged</a></li>
        </Dropdown>
      </div>)
    );
  }


  render() {
    let HrWidth = '586px';
    if (SERVICES.isSideNavOpen) {
      HrWidth = '415px';
    }
    let hr_lines = '';
    if (this.state.meals.length > 0) {
      const marginTop = ['45', '104', '118'];
      // hr_lines = _.times(this.state.meals.length - 1, (i) => {
      hr_lines = _.times(this.state.meals.length, (i) => {
        let mTop = marginTop[i];
        let isUnavailable = false;
        if (i === 0 && this.props.am === 'am') {
          isUnavailable = true;
        } else if (i === 1 && this.props.pm === 'pm') {
          isUnavailable = true;
        } else if (i === 2 && this.props.eve === 'eve') {
          isUnavailable = true;
        }

        if (isUnavailable === false) {
          return (<hr key={i} style={{ position: 'relative', width: HrWidth, marginTop: `${mTop}px`, marginLeft: '40px', borderTop: '1px solid #dbdbdb' }} />);
        } else { // eslint-disable-line no-else-return
          let borderBottom = '';
          if (i === 0) {
            borderBottom = '1px solid rgb(219, 219, 219)';
            mTop = mTop - 106; // eslint-disable-line operator-assignment
          } else if (i === 1) {
            borderBottom = '1px solid rgb(219, 219, 219)';
            mTop = mTop - 125; // eslint-disable-line operator-assignment
          } else if (i === 2) {
            mTop = mTop - 139; // eslint-disable-line operator-assignment
          }
          return (<hr key={i} style={{ borderBottom: `${borderBottom}`, backgroundImage: `url(${unavailable_slot_overlay})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '105px', position: 'relative', width: HrWidth, marginTop: `${mTop}px`, marginLeft: '40px', borderTop: '1px solid #dbdbdb' }} />);
          // return (<div key={i} style={{ height:'102px', marginTop:'-17px', width:'415px', backgroundColor:'yellow', position: 'relative', marginLeft: '40px'}} />);
        }
      });
    }

    const { handleSaveMeal } = this.props;
    const { isAddMealModalOpened, mealOrder, mealType, mealNote } = this.state;
    const saveMealButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={() => handleSaveMeal(mealOrder, mealType, mealNote)}><i className='mdi mdi-silverware left' />Add Meal</a>;

    return (<div>
      {this.state.meals.map((mealSlot, i) => this.renderMeal(mealSlot, i)) }
      {hr_lines}
      {/*
        <hr style={{ position: 'relative', width: HrWidth, marginTop: '45px', marginLeft: '40px', borderTop: '1px solid #dbdbdb' }} />
        <hr style={{ position: 'relative', width: HrWidth, marginTop: '104px', marginLeft: '40px', borderTop: '1px solid #dbdbdb' }} />
      */}
      {
        isAddMealModalOpened ? (<Modal actionButton={saveMealButton} showCancelButton={false} isModalOpened={isAddMealModalOpened} changeModalState={this.changeAddMealModalState}>
          <h3>{mealType}</h3>
          <label className='active' htmlFor='input_mealNotes'>Notes</label>
          <div className='input-field'>
            <textarea id='input_mealNotes' className='materialize-textarea' value={mealNote} onChange={e => this.setState({ mealNote: e.target.value })} style={{ padding: '5px 0', minHeight: '1.5em' }} />
          </div>
        </Modal>) : null }
    </div>
    );
  }
}
