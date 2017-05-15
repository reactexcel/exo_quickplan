import React, { Component } from 'react';
import Relay from 'react-relay';
import NoteModal from './NoteModal';
import ChangeNoteMutation from '../mutations/ChangeNote';


export default class Note extends Component {
  state = {
    isNoteModalOpened: false
  };

  render() {
    const {
      id,
      _key,
      note
    } = this.props.cityDay;

    const {
      isNoteModalOpened
    } = this.state;

    const wrapperClassName = [
      'inline-block',
      note ? 'z-depth-2 p-15 mb-10' : '',
      'col'
    ].join(' ');

    return (<div className='valign-wrapper line'>
      <i className='col mdi mdi-calendar-text little' />
      <div
        className={wrapperClassName}
        style={{
          maxWidth: '75%'
        }}
      >
        <div>
          {note && <div className='mr-10 bold pb-10 left inline-block'>
            Note
          </div>}
          <div className='right inline-block'>
            <a
              href='/#'
              className='exo-colors-text'
              onClick={(e) => {
                e.preventDefault();
                this.setState({
                  isNoteModalOpened: true
                });
              }}
            >
              <i className='mdi mdi-pencil little' />
            </a>
            <a
              href='/#'
              className='exo-colors-text'
              onClick={(e) => {
                e.preventDefault();

                Relay.Store.commitUpdate(new ChangeNoteMutation({
                  cityDayKey: _key,
                  note: '',
                  cityDayId: id
                }));
              }}
            >
              <i className='mdi mdi-minus little' />
            </a>
          </div>
        </div>
        {note ?
          <div className='bold'>
            <br />
            <br />
            {note}
          </div>
          : ''}
      </div>
      <NoteModal
        note={note}
        isOpened={isNoteModalOpened}
        close={() => this.setState({ isNoteModalOpened: false })}
        changeNote={note => Relay.Store.commitUpdate(new ChangeNoteMutation({
          cityDayKey: _key,
          note,
          cityDayId: id
        }))}
      />
    </div>);
  }
}

