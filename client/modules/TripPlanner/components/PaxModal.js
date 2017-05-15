import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Modal from '../../Utils/components/Modal';
import CheckboxGroup from '../../Utils/components/CheckboxGroup';
import { groupPaxsByAgeGroup } from '../../Pax/utils';


export default class PaxModalComponent extends Component {
 /* static propTypes = {
    paxs: PropTypes.arrayOf(PropTypes.shape(
      PaxShape({
        extension: {
          isTripPax: PropTypes.bool.isRequired
        }
      })
    )).isRequired,
    isOpened: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    openAddPaxModal: PropTypes.func
  };*/


  static getDefaultState(props) {
    const { paxs } = props;

    return {
      checkboxChecked: paxs.reduce((acc, pax) => Object.assign(acc, {
        [PaxModalComponent.getCheckboxId(pax)]: pax.isTripPax
      }), {})
    };
  }


  static getCheckboxId = pax => `checkbox${pax.ageGroup}${pax._key}`;


  constructor(props) {
    super(props);

    this.state = PaxModalComponent.getDefaultState(props);
  }


  componentWillReceiveProps(props) {
    this.setState(PaxModalComponent.getDefaultState(props));
  }


  onSave = () => {
    const { onSave, paxs } = this.props;
    const { checkboxChecked } = this.state;

    const checkedPaxKeys = paxs
      .filter((pax) => {
        const checkboxId = PaxModalComponent.getCheckboxId(pax);
        return checkboxChecked[checkboxId];
      })
      .map(pax => pax._key);

    onSave(checkedPaxKeys);
  };


  onNewTravellerClick = () => {
    const { close, openAddPaxModal } = this.props;
    close();
    openAddPaxModal();
  };


  getCancelButton = () => (<a
    className='modal-action modal-close waves-effect waves-red mr-30 right fs-16'
    id='closePaxModal'
  >CLOSE</a>);


  getSaveButton = () => (<div>
    <a
      className='modal-action modal-close waves-effect waves-red mr-10 right fs-16'
      onClick={this.onSave}
    >
      <i className='mdi mdi-cloud-upload small exo-colors-text text-label mr-10' />
      SAVE
    </a>

    <a
      className='modal-action modal-close waves-effect waves-red mr-30 right fs-16'
      onClick={this.onNewTravellerClick}
    >
      <i className='mdi mdi-plus small exo-colors-text text-label mr-10' />
      NEW TRAVELLER
    </a>
  </div>);


  paxGroupToCheckBoxGroup =
    ([title, paxs]) => (<CheckboxGroup
      title={title}
      checkboxes={paxs.map(this.paxToCheckbox)}
      key={`checkboxGroup${title}`}
    />);


  paxToCheckbox = (pax) => {
    const id = PaxModalComponent.getCheckboxId(pax);
    const { checkboxChecked } = this.state;


    return {
      labelText: `${pax.firstName} ${pax.lastName}`,
      isDisabled: Boolean(pax.isMainPax),
      checked: Boolean(checkboxChecked[id]),
      id,
      onChange: this.checkboxOnChange
    };
  };


  checkboxOnChange = (id, checked) => this.setState(prevStat => _.merge({}, prevStat, {
    checkboxChecked: {
      [id]: checked
    }
  }));


  render() {
    const { isOpened, close, paxs } = this.props;
    const groupedPaxs = groupPaxsByAgeGroup(paxs);

    const checkboxGroups = _.chain(groupedPaxs)
      .toPairs()
      .map(this.paxGroupToCheckBoxGroup)
      .flatMap((checkboxGroup, i) => [
        checkboxGroup,
        <hr key={`hrAfterCheckboxGroup${i}`} />
      ])
      .slice(0, -1)
      .value();


    return (
      <Modal
        isModalOpened={isOpened}
        changeModalState={close}
        cancelButton={this.getCancelButton()}
        actionButton={this.getSaveButton()}
        style={{
          width: '75%'
        }}
      >
        <h2>Trip Travellers</h2>
        {checkboxGroups}
      </Modal>
    );
  }
}
