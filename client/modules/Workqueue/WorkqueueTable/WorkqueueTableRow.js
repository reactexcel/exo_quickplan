import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { PT } from 'proptypes-parser';
import { Link } from 'react-router';


export default class WorkqueueTableRow extends Component {
  static propTypes = {
    ...PT`{
      _key: String!
     startTravelIn: {
        _key: String
        name: String
      }!
      startTravelOnDate: String!
      travelDuration: Number!
      updatedOn: String!
      status: String!
      private: Boolean!
      mainPax: {
        firstName: String!
        lastName: String!
      }
      tripsCount: Number!
      TA: {
        firstName: String!
        lastName: String!
      }
      TC: {
        firstName: String!
        lastName: String!
        office: {
          officeName: String!
        }
      }!
      bookedTrip: {
        combinerCountryBooking: {
          tpBookingRef: String!
        }!
      }
      userRole: String!
    }`,
    openAssignProposalModal: PropTypes.func.isRequired,
    openEditProposalModal: PropTypes.func.isRequired
  };


  componentDidMount() {
    $('.dropdown-button').dropdown();
  }


  render() {
    const {
      _key,
      updatedOn,
      startTravelOnDate,
      startTravelIn,
      mainPax: {
        firstName: mainPaxFirstName,
        lastName: mainPaxLastName,
      },
      tripsCount,
      status,
      TC,
      TA: {
        firstName: TAFirstName,
        lastName: TALastName,
        office: {
          companyName: TACompanyName
        }
      },
      bookedTrip: {
        combinerCountryBooking: {
          tpBookingRef
        }
      },
      openAssignProposalModal,
      userRole,
      cloneProposal,
      removeProposal
    } = this.props;


    const lastUpdated = updatedOn ? moment(
      new Date(updatedOn)
    ).format('MMM DD, YYYY') : '';


    const proposalTravelDate = moment(
      new Date(startTravelOnDate)
    ).format('MMM DD, YYYY');

    let proposalTravelDest = startTravelIn.name;
    // format the start Travel In city.
    if (startTravelIn.name && startTravelIn.name !== '') {
      const arr = startTravelIn.name.split(',');
      if (arr.length === 2) {
        proposalTravelDest = (<div>
          {arr[0]}
          <br />
          <span className='fs-12 fw-400'>{arr[1]}</span>
        </div>);
      }
    }

    return (<tr>
      <td>
        <Link to={`/trip-planner/${_key}`}>{_key}</Link>
      </td>
      <td>{proposalTravelDate}</td>
      <td>{lastUpdated}</td>
      <td>{TACompanyName}<br /> <span className='fs-12 fw-400'>{TAFirstName} {TALastName}</span></td>
      <td>{mainPaxFirstName} {mainPaxLastName}</td>
      <td>{tripsCount}</td>
      <td>{status} {tpBookingRef}</td>
      <td>{proposalTravelDest}</td>
      <td>{TC.firstName} {TC.lastName}</td>
      <td>
        <ul
          id={`dropdown${_key}`}
          className='dropdown-content'
        >
          <li>
            <Link to={`/trip-planner/${_key}`}>Edit proposal</Link>
          </li>
          {
            userRole === 'TC' || userRole === 'superadmin'
              ? (
                <li>
                  <a onClick={() => openAssignProposalModal(_key)}>
                    Assign TC
                  </a>
                </li>)
              : ''
          }
          <li>
            <Link
              onClick={(e) => {
                e.preventDefault();
                cloneProposal(_key);
              }}
            >Clone proposal</Link>
          </li>

          <li>
            <Link
              onClick={(e) => {
                e.preventDefault();
                removeProposal(_key);
              }}
            >Remove proposal</Link>
          </li>

        </ul>
        <a
          className='dropdown-button'
          href='#!'
          data-activates={`dropdown${_key}`}
        >
          <i className='mdi mdi-dots-vertical  exo-colors-text text-data-1 small fw-600' />
        </a>

      </td>
    </tr>);
  }
}
