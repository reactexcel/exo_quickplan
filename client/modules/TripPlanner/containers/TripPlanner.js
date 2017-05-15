import Relay from 'react-relay';
import TripPlanner from '../components/TripPlanner';
import CountryBooking from '../../Country/containers/Country';

export default Relay.createContainer(TripPlanner, {
  initialVariables: {
    tripKey: null,
    proposalKey: null,
    cityBookingKey: null,
    roomConfigKey: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        proposal(proposalKey: $proposalKey) {
            _key
            travelDuration
            status
            startTravelOnDate
            createOnDate
            TA {
              _key
              firstName
              lastName
               office {
                _key
                companyName
              }
            }
            TC {
              _key
              firstName
              lastName
              office {
                _key
                officeName
              }
            }
            paxs{
                _key
                ageGroup,
                ageOnArrival,
                dateOfBirth,
                firstName,
                lastName,
                isMainPax,
            }
        }
        trip(tripKey: $tripKey) {
              _key
              status
              startDate
              endDate
              lastBookedDay
              paxs {
                 _key
                ageGroup
                firstName
                lastName
                gender
                dateOfBirth
                ageOnArrival
                passportNr
                passportImage
                nationality
              }
              budget {
                total {
                  planned,
                  actual
                },
                tours {
                  planned
                  actual
                },
                hotels {
                  planned
                  actual
                },
                transfers {
                  planned
                  actual
                }
              },
              countryOrder
              durationDays
              name
              notes
              countryBookings {
                ${CountryBooking.getFragment('country')}
                tpBookingRef
                cityBookings {
                  _key
                  cityDays {
                    _key
                    startDate
                    startDay
                    timeSlots {
                      slotOrder
                      isDisabled
                      meal {
                        type
                        note
                      }
                    }
                    serviceBookings {
                      _key
                      paxs
                      roomConfigs{
                        paxs{
                          _key
                          firstName
                          paxError{
                            severity
                            message
                            errorType
                          }
                        }
                      }
                      paxStatuses{
                        severity
                        message
                      }
                      status {
                        tpBookingStatus
                        state
                      }
                    }
                  }
                  accommodationPlacements {
                    serviceBookings {
                      paxs
                      roomConfigs{
                        paxs{
                          _key
                          firstName
                          paxError{
                            severity
                            message
                            errorType
                          }
                        }
                      }
                      paxStatuses{
                        severity
                        message
                      }
                      _key
                      status {
                        tpBookingStatus
                        state
                      }
                    }
                  }
                }
              }
              departureTransferPlacement{
                _key
                _id
                transferPlacement{
                  id
                  _key
                  durationDays
                  startDate
                  startDay
                  serviceBookings{
                    id
                    _key
                    startSlot
                    durationSlots
                    paxs
                    roomConfigs{
                      paxs{
                        _key
                        firstName
                        paxError{
                          severity
                          message
                          errorType
                        }
                      }
                    }
                    paxStatuses{
                      severity
                      message
                    }
                    status {
                      tpBookingStatus
                      state
                    }
                    notes
                    inactive
                    serviceBookingType
                    transfer {
                      _key
                      type {
                        description
                      }
                      class {
                        description
                      }
                      vehicle {
                        category
                        model
                      }
                      route {
                        from {
                          cityName
                          localityName
                          place
                        }
                        to {
                          cityName
                          localityName
                          place
                        }
                      }
                    }
                  }
                }
                departureTransfer{
                  _key
                  _id
                  type
                }
                departureCityOrigin{
                  _key
                  cityCode
                  startDate
                  durationNights
                  startDay
                  durationDays
                }
              }
        }

        trips: getTripByKey(tripKey: $tripKey) {
          _key
          countryOrder
          durationDays
          endDate
          name
          notes
          startDate
          status
          budget {
            total {
              planned,
              actual
            },
            tours {
              planned
              actual
            },
            hotels {
              planned
              actual
            },
            transfers {
              planned
              actual
            }
          },
          countryBookings {
            ${CountryBooking.getFragment('country')}
            tpBookingRef
            cityBookings {
              _key
              cityDays {
                timeSlots {
                  slotOrder
                  isDisabled
                  meal {
                    type
                    note
                  }
                }
                serviceBookings {
                  _key
                  paxs
                  roomConfigs{
                    paxs{
                      _key
                      firstName
                      paxError{
                        severity
                        message
                        errorType
                      }
                    }
                  }
                  paxStatuses{
                    severity
                    message
                  }
                  status {
                    tpBookingStatus
                    state
                  }
                }
              }
              accommodationPlacements {
                _key
                serviceBookings {
                  _key
                  paxs
                  roomConfigs{
                    paxs{
                      _key
                      firstName
                      paxError{
                        severity
                        message
                        errorType
                      }
                    }
                  }
                  paxStatuses{
                    severity
                    message
                  }
                  status {
                    tpBookingStatus
                    state
                  }
                  roomConfigs {
                    _key
                    id
                    roomType
                    paxs {
                      id
                      _key
                      firstName
                      lastName
                    }
                  }
                }
              }
            }
          }
        }
        paxs: getPaxs(proposalKey: $proposalKey, tripKey: $tripKey) {
          firstName
          lastName
          gender
          dateOfBirth
          ageOnArrival
          passportNr
          passportImage
          nationality
          ageGroup
          _key
        }
        locations: location {
          id
          _key,
          type,
          name,
          country,
          tpCode,
          unCode,
          isEXODestination
        }
        taOffices: offices(type: "TA") {
          _key
          companyName
          workInCountries{
            countryCode
            currency
            tpPW
            tpUID
          }
          TAs: users{
            _key
            firstName
            lastName
          }
        }
      }`
  }
});
