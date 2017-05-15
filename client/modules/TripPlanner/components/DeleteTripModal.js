import React, { PropTypes } from 'react';
import Modal from '../../Utils/components/Modal';


const propTypes = {
  deleteTrip: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isModalCloseOnSave: PropTypes.bool
};


const getActionButton = (onClickHandler, isModalCloseOnSave) => (
  <a
    className={isModalCloseOnSave ? 'modal-action modal-close waves-effect waves-green btn mr-20' : 'modal-action waves-effect waves-green btn mr-20'}
    onClick={onClickHandler}
  ><i className='mdi-content-remove left' />REMOVE TRIP
  </a>
);


const DeleteTripModal = ({ deleteTrip, isOpened, toggle, isModalCloseOnSave }) => (<Modal
  actionButton={getActionButton(deleteTrip, isModalCloseOnSave)}
  isModalOpened={isOpened}
  changeModalState={toggle}
  className='proposal-modal exo-colors modal-bgr1 '
  style={{ width: '60%', overflow: 'hidden', fontWeight: '400' }}
>
  <div className='row'>
    <p>This will remove this trip from proposal.</p>
    <p>Do you want to remove trip?</p>
  </div>
</Modal>);


DeleteTripModal.propTypes = propTypes;


export default DeleteTripModal;
