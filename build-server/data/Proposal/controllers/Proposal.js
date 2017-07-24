'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.getTrips = exports.getLocation = exports.assignTC = exports.getTripsCount = exports.getMainPax = exports.getUser = exports.getBookedTrip = exports.updateProposalDetails = exports.cloneProposal = exports.addProposal = exports.getProposal = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addProposal = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var proposal, pax, selectedTC, selectedOffice, selectedTA, selectedTAOffice, selectedLocation, userToken, newDoc, proposalKey, newProposal;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            proposal = args.proposal, pax = args.pax, selectedTC = args.selectedTC, selectedOffice = args.selectedOffice, selectedTA = args.selectedTA, selectedTAOffice = args.selectedTAOffice, selectedLocation = args.selectedLocation, userToken = args.userToken;
            _context.next = 4;
            return proposals.save(proposal);

          case 4:
            newDoc = _context.sent;
            proposalKey = newDoc._key;
            _context.next = 8;
            return assignLocation(proposalKey, selectedLocation);

          case 8:
            if (!(selectedTC && selectedTC !== 'Unassigned')) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return assignTC({ proposalKey: proposalKey, userKey: selectedTC });

          case 11:
            _context.next = 21;
            break;

          case 13:
            if (!selectedOffice) {
              _context.next = 18;
              break;
            }

            _context.next = 16;
            return assignToOfficeSupervisor(proposalKey, selectedOffice);

          case 16:
            _context.next = 21;
            break;

          case 18:
            if (!selectedLocation) {
              _context.next = 21;
              break;
            }

            _context.next = 21;
            return assignCountrySupervisor(proposalKey, selectedLocation);

          case 21:
            if (!(selectedTA && selectedTA !== 'Unassigned' && selectedTAOffice)) {
              _context.next = 26;
              break;
            }

            _context.next = 24;
            return removeTAs(proposalKey);

          case 24:
            _context.next = 26;
            return addTA({ proposalKey: proposalKey, userKey: selectedTA });

          case 26:
            _context.next = 28;
            return proposals.firstExample(newDoc);

          case 28:
            newProposal = _context.sent;
            _context.next = 31;
            return addCreatorEdge(proposalKey, userToken);

          case 31:

            if (pax) {
              (0, _Pax.addPax)((0, _extends3.default)({}, pax, { isMainPax: true, proposalKey: proposalKey }));
            }
            return _context.abrupt('return', newProposal);

          case 35:
            _context.prev = 35;
            _context.t0 = _context['catch'](0);

            console.warn('[Proposal Controllers]: New Proposal failed', _context.t0);
            return _context.abrupt('return', {});

          case 39:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 35]]);
  }));

  return function addProposal(_x) {
    return _ref.apply(this, arguments);
  };
}();

var addCreatorEdge = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(proposalKey, userToken) {
    var userEmail, user, aqlQuery;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return new _promise2.default(function (resolve, reject) {
              if (!userToken) {
                reject('Invalid user token');
              } else {
                _auth2.default.getProfile(userToken, function (err, profile) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(JSON.parse(profile).email);
                  }
                });
              }
            });

          case 2:
            userEmail = _context2.sent;
            _context2.next = 5;
            return (0, _UserController.getUserByEmail)(userEmail);

          case 5:
            user = _context2.sent;


            // // create a separate record for creator if the creator is not ta or TC ?
            // // if the creator is assigned as TA or TC, update the created: true for workedBy edge.
            // const aqlQuery = `
            //    UPSERT { _from: @proposalId, _to: @userId }
            //    INSERT { _from: @proposalId, _to: @userId, created: true }
            //    UPDATE { created: true } IN workedBy
            //  `;

            // will always create a separate record for creator,
            // the proposal will need to be viewable for the creator who is not assgined to
            aqlQuery = '\n     INSERT {\n       _from: @proposalId,\n       _to: @userId,\n       created: true\n     }IN workedBy\n   ';
            _context2.next = 9;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey,
              userId: user._id
            });

          case 9:
            return _context2.abrupt('return', _context2.sent);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function addCreatorEdge(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var assignTC = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {
    var proposalKey = _ref4.proposalKey,
        userKey = _ref4.userKey;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return removeTCs(proposalKey);

          case 2:
            return _context3.abrupt('return', addTC({ proposalKey: proposalKey, userKey: userKey }));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function assignTC(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var assignToOfficeSupervisor = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(proposalKey, officeKey) {
    var supervisor;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _OfficeController.getSupervisor)(officeKey);

          case 2:
            supervisor = _context4.sent;

            if (!supervisor) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt('return', assignTC({ proposalKey: proposalKey, userKey: supervisor._key }));

          case 5:

            console.error('office \'' + officeKey + '\' does not have a supervisor');

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function assignToOfficeSupervisor(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

var assignCountrySupervisor = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(proposalKey, locationKey) {
    var supervisor;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _Location.getSupervisor)(locationKey);

          case 2:
            supervisor = _context5.sent;

            if (!supervisor) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', assignTC({ proposalKey: proposalKey, userKey: supervisor._key }));

          case 5:

            console.error('location \'' + locationKey + '\' does not have a supervisor');

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function assignCountrySupervisor(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

var assignLocation = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(proposalKey, selectedLocation) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (selectedLocation) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt('return');

          case 2:
            _context6.next = 4;
            return removeLocations(proposalKey);

          case 4:
            _context6.next = 6;
            return addLocation(proposalKey, selectedLocation);

          case 6:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function assignLocation(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();

// const paxs = db.collection('paxs');
// function getProposal(args) {
// return request(`http://
// localhost:8529/_db/exo-dev/bbt/proposals/${args.proposalKey}`,GET);
// }

var getProposal = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(args) {
    var proposalKey;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            proposalKey = args.proposalKey;
            _context7.next = 4;
            return proposals.firstExample({ _key: proposalKey });

          case 4:
            return _context7.abrupt('return', _context7.sent);

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7['catch'](0);

            console.warn('[Proposal Controllers]: getProposal failed', _context7.t0);
            return _context7.abrupt('return', {});

          case 11:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[0, 7]]);
  }));

  return function getProposal(_x11) {
    return _ref8.apply(this, arguments);
  };
}();

var updateProposalDetails = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(args) {
    var proposalKey, selectedTC, selectedOffice, selectedTA, selectedTAOffice, selectedLocation, newProposal;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            proposalKey = args.proposal.proposalKey, selectedTC = args.selectedTC, selectedOffice = args.selectedOffice, selectedTA = args.selectedTA, selectedTAOffice = args.selectedTAOffice, selectedLocation = args.selectedLocation;
            _context8.next = 4;
            return assignLocation(proposalKey, selectedLocation);

          case 4:
            if (!(selectedTC && selectedTC !== 'Unassigned')) {
              _context8.next = 9;
              break;
            }

            _context8.next = 7;
            return assignTC({ proposalKey: proposalKey, userKey: selectedTC });

          case 7:
            _context8.next = 17;
            break;

          case 9:
            if (!selectedOffice) {
              _context8.next = 14;
              break;
            }

            _context8.next = 12;
            return assignToOfficeSupervisor(proposalKey, selectedOffice);

          case 12:
            _context8.next = 17;
            break;

          case 14:
            if (!selectedLocation) {
              _context8.next = 17;
              break;
            }

            _context8.next = 17;
            return assignCountrySupervisor(proposalKey, selectedLocation);

          case 17:
            if (!(selectedTA && selectedTA !== 'Unassigned' && selectedTAOffice)) {
              _context8.next = 22;
              break;
            }

            _context8.next = 20;
            return removeTAs(proposalKey);

          case 20:
            _context8.next = 22;
            return addTA({ proposalKey: proposalKey, userKey: selectedTA });

          case 22:
            _context8.next = 24;
            return proposals.updateByExample({ _key: proposalKey }, (0, _extends3.default)({}, args.proposal, {
              updatedOn: (0, _moment2.default)().format('DD MMMM YYYY')
            }));

          case 24:
            _context8.next = 26;
            return proposals.firstExample({ _key: proposalKey });

          case 26:
            newProposal = _context8.sent;
            return _context8.abrupt('return', newProposal);

          case 30:
            _context8.prev = 30;
            _context8.t0 = _context8['catch'](0);

            console.warn('[Proposal Controllers]: updateProposalDetails failed', _context8.t0);
            return _context8.abrupt('return', {});

          case 34:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[0, 30]]);
  }));

  return function updateProposalDetails(_x12) {
    return _ref9.apply(this, arguments);
  };
}();

var cloneProposal = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(args) {
    var proposalKey, userEmail, oldProposal, newProposal, handle, proposalBookInTripsEdges, newTrips, newproposalBookInTripsEdges, locatedInEdges, user;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            proposalKey = args.proposalKey, userEmail = args.userEmail;
            _context9.next = 3;
            return proposals.firstExample({ _key: proposalKey });

          case 3:
            oldProposal = _context9.sent;

            ['_id', '_key', '_rev'].map(function (meta) {
              return delete oldProposal[meta];
            }); // eslint-disable-line no-param-reassign
            newProposal = (0, _assign2.default)({}, oldProposal, {
              status: 'New',
              createOnDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS)
            });
            _context9.next = 8;
            return proposals.save(newProposal);

          case 8:
            handle = _context9.sent;
            _context9.next = 11;
            return bookInEdgeCollection.outEdges('proposals/' + proposalKey);

          case 11:
            proposalBookInTripsEdges = _context9.sent;
            _context9.next = 14;
            return _promise2.default.all(proposalBookInTripsEdges.map(function (edge) {
              return (0, _TripClone2.default)(edge._to);
            }));

          case 14:
            newTrips = _context9.sent;
            newproposalBookInTripsEdges = newTrips.map(function (newTrip) {
              return { _from: handle._id, _to: newTrip._id };
            });
            _context9.next = 18;
            return bookInEdgeCollection.import(newproposalBookInTripsEdges);

          case 18:
            _context9.next = 20;
            return locatedInEdgeCollection.outEdges('proposals/' + proposalKey);

          case 20:
            locatedInEdges = _context9.sent;
            _context9.next = 23;
            return bookInEdgeCollection.import(locatedInEdges.map(function (edge) {
              return { _from: handle._id, _to: edge._to };
            }));

          case 23:
            _context9.next = 25;
            return (0, _UserController.getUserByEmail)(userEmail);

          case 25:
            user = _context9.sent;
            _context9.next = 28;
            return worksForEdgeCollection.import([{
              _from: handle._id,
              _to: user._id,
              created: true
            }]);

          case 28:
            _context9.next = 30;
            return proposals.firstExample(handle);

          case 30:
            return _context9.abrupt('return', _context9.sent);

          case 31:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function cloneProposal(_x13) {
    return _ref10.apply(this, arguments);
  };
}();

var getBookedTrip = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            aqlQuery = '\n    FOR trip\n    IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n    FILTER\n        IS_SAME_COLLECTION(\'trips\', trip) AND\n        trip.status == \'booked\'\n    RETURN trip\n  ';
            _context10.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context10.sent;
            return _context10.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function getBookedTrip(_x14) {
    return _ref11.apply(this, arguments);
  };
}();

var getUser = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(proposalKey, role) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            aqlQuery = '\n    FOR user, edge\n        IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n        FILTER\n            IS_SAME_COLLECTION(\'users\', user) AND\n            ( user.role == @role OR user.role == \'superadmin\' ) AND\n            edge.created != true\n        RETURN merge(user, {created: edge.created})\n  ';
            _context11.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey,
              role: role
            });

          case 3:
            result = _context11.sent;
            return _context11.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function getUser(_x15, _x16) {
    return _ref12.apply(this, arguments);
  };
}();

var getMainPax = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n      IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n      FILTER\n        edge.isMainPax == true AND\n        IS_SAME_COLLECTION(\'paxs\', vertex)\n      RETURN vertex\n  ';
            _context12.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context12.sent;
            return _context12.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function getMainPax(_x17) {
    return _ref13.apply(this, arguments);
  };
}();

var getTripsCount = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            aqlQuery = '\n    RETURN COUNT (\n      FOR vertex\n          IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n          FILTER\n              IS_SAME_COLLECTION(\'trips\', vertex)\n          RETURN vertex\n    )\n  ';
            _context13.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context13.sent;
            return _context13.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function getTripsCount(_x18) {
    return _ref14.apply(this, arguments);
  };
}();

var getTrips = function () {
  var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            aqlQuery = '\n      FOR vertex\n          IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n          FILTER\n              IS_SAME_COLLECTION(\'trips\', vertex)\n          RETURN vertex\n  ';
            _context14.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context14.sent;
            return _context14.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function getTrips(_x19) {
    return _ref15.apply(this, arguments);
  };
}();

var removeTCs = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            aqlQuery = '\n    FOR user, edge\n    IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n    FILTER\n        user.role == \'TC\' AND\n        edge.created != true AND\n        IS_SAME_COLLECTION(\'workedBy\', edge)\n    REMOVE edge IN workedBy\n  ';
            _context15.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context15.sent;
            return _context15.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function removeTCs(_x20) {
    return _ref16.apply(this, arguments);
  };
}();

var removeTAs = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            aqlQuery = '\n    FOR user, edge\n    IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n    FILTER\n        user.role == \'TA\' AND\n        edge.created != true AND\n        IS_SAME_COLLECTION(\'workedBy\', edge)\n    REMOVE edge IN workedBy\n  ';
            _context16.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context16.sent;
            return _context16.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function removeTAs(_x21) {
    return _ref17.apply(this, arguments);
  };
}();

var addUserforProposal = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(_ref19) {
    var proposalKey = _ref19.proposalKey,
        userKey = _ref19.userKey;
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            aqlQuery = '\n    INSERT {\n      _from: @proposalId,\n      _to: @userId\n    } IN workedBy\n\n    RETURN NEW._id\n  ';
            _context17.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey,
              userId: 'users/' + userKey
            });

          case 3:
            result = _context17.sent;
            return _context17.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function addUserforProposal(_x22) {
    return _ref18.apply(this, arguments);
  };
}();

var addTC = function () {
  var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(args) {
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return addUserforProposal(args);

          case 2:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function addTC(_x23) {
    return _ref20.apply(this, arguments);
  };
}();

var addTA = function () {
  var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(args) {
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return addUserforProposal(args);

          case 2:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function addTA(_x24) {
    return _ref21.apply(this, arguments);
  };
}();

var getLocation = function () {
  var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            aqlQuery = '\n    RETURN UNIQUE(\n      FOR vertex, edge, path\n        IN 1..2 OUTBOUND @proposalId\n        GRAPH \'exo-dev\'\n        FILTER\n            NOT IS_NULL(vertex) AND\n            IS_SAME_COLLECTION(\'locations\', vertex) AND\n            ((\n              LENGTH (path.vertices) == 3 AND\n              path.vertices[2].type == \'country\'\n            ) OR (\n               LENGTH (path.vertices) == 2 AND\n              path.vertices[1].type == \'country\'\n            ))\n        RETURN SLICE(path.vertices, 1)\n    )\n  ';
            _context20.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context20.sent;
            return _context20.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function getLocation(_x25) {
    return _ref22.apply(this, arguments);
  };
}();

/**
 * Remove proposal and related data
 * @param {string} proposalKey
 * @return {Promise}
 */


var remove = function () {
  var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(proposalKey) {
    var aqlQuery, result, allCollectionIds;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.prev = 0;

            // // Get and remove proposal paxs
            // const paxs = await getPaxs(`proposals/${proposalKey}`);
            // await Promise.all(paxs.map(({ _key }) => removePax(_key)));
            //
            // // get and remove proposal trips
            // const trips = await getTrips(proposalKey);
            // await Promise.all(trips.map(({ _key }) => removeTrip(_key)));
            //
            // // remove proposal
            // await proposalsGraph.remove(proposalKey);

            aqlQuery = '\n    FOR vertex, edge\n      IN 1..6 OUTBOUND @proposalId GRAPH \'exo-dev\'\n      filter IS_SAME_COLLECTION(\'trips\', vertex)  or\n      IS_SAME_COLLECTION(\'paxs\', vertex) or\n      IS_SAME_COLLECTION(\'countryBookings\', vertex) or\n      IS_SAME_COLLECTION(\'cityBookings\', vertex) or\n      IS_SAME_COLLECTION(\'transferPlacements\', vertex) or\n      IS_SAME_COLLECTION(\'accommodationPlacements\', vertex) or\n      IS_SAME_COLLECTION(\'cityDays\', vertex) or\n      IS_SAME_COLLECTION(\'serviceBookings\', vertex) or\n      IS_SAME_COLLECTION(\'activities\', vertex)\n      sort vertex._id\n      RETURN distinct vertex._id\n    ';
            _context21.next = 4;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 4:
            result = _context21.sent;
            _context21.next = 7;
            return result.all();

          case 7:
            allCollectionIds = _context21.sent;
            _context21.next = 10;
            return proposalsGraph.remove(proposalKey);

          case 10:
            _context21.next = 12;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('trips/');
            }).map(function (id) {
              return tripsGraph.remove(id);
            }));

          case 12:
            _context21.next = 14;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('paxs/');
            }).map(function (id) {
              return paxsGraph.remove(id);
            }));

          case 14:
            _context21.next = 16;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('countryBookings/');
            }).map(function (id) {
              return countryBookingsGraph.remove(id);
            }));

          case 16:
            _context21.next = 18;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('cityBookings/');
            }).map(function (id) {
              return cityBookingsGraph.remove(id);
            }));

          case 18:
            _context21.next = 20;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('transferPlacements/');
            }).map(function (id) {
              return transferPlacementsGraph.remove(id);
            }));

          case 20:
            _context21.next = 22;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('accommodationPlacements/');
            }).map(function (id) {
              return accommodationPlacementsGraph.remove(id);
            }));

          case 22:
            _context21.next = 24;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('cityDays/');
            }).map(function (id) {
              return cityDaysGraph.remove(id);
            }));

          case 24:
            _context21.next = 26;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('serviceBookings/');
            }).map(function (id) {
              return serviceBookingsGraph.remove(id);
            }));

          case 26:
            _context21.next = 28;
            return _promise2.default.all(allCollectionIds.filter(function (id) {
              return id.startsWith('activities/');
            }).map(function (id) {
              return activitiesGraph.remove(id);
            }));

          case 28:
            _context21.next = 34;
            break;

          case 30:
            _context21.prev = 30;
            _context21.t0 = _context21['catch'](0);

            console.warn('remove proposal error', proposalKey);
            console.warn(_context21.t0);

          case 34:
            return _context21.abrupt('return', { _key: proposalKey });

          case 35:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this, [[0, 30]]);
  }));

  return function remove(_x26) {
    return _ref23.apply(this, arguments);
  };
}();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _database = require('../../database');

var _TripClone = require('../../Trip/controllers/TripClone');

var _TripClone2 = _interopRequireDefault(_TripClone);

var _OfficeController = require('../../Office/OfficeController');

var _Location = require('../../Location/controllers/Location');

var _UserController = require('../../User/UserController');

var _Pax = require('../../Pax/controllers/Pax');

var _Trip = require('../../Trip/controllers/Trip');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _auth = require('../../../utils/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import request, { POST } from '../../../utils/request';

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var proposalsGraph = graph.vertexCollection('proposals');
var tripsGraph = graph.vertexCollection('trips');
var paxsGraph = graph.vertexCollection('paxs');
var countryBookingsGraph = graph.vertexCollection('countryBookings');
var cityBookingsGraph = graph.vertexCollection('cityBookings');
var transferPlacementsGraph = graph.vertexCollection('transferPlacements');
var accommodationPlacementsGraph = graph.vertexCollection('accommodationPlacements');
var cityDaysGraph = graph.vertexCollection('cityDays');
var serviceBookingsGraph = graph.vertexCollection('serviceBookings');
var activitiesGraph = graph.vertexCollection('activities');

var proposals = _database.db.collection('proposals');
var bookInEdgeCollection = _database.db.edgeCollection('bookIn');
var locatedInEdgeCollection = _database.db.edgeCollection('locatedIn');
var worksForEdgeCollection = _database.db.edgeCollection('worksFor');
var workedByEdgeCollection = _database.db.edgeCollection('workedBy');

var DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

function removeLocations(proposalKey) {
  var aqlQuery = '\n    FOR location, edge\n    IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n    FILTER\n        IS_SAME_COLLECTION(\'locatedIn\', edge)\n    REMOVE edge IN locatedIn\n  ';

  return _database.db.query(aqlQuery, {
    proposalId: 'proposals/' + proposalKey
  });
}

function addLocation(proposalKey, locationKey) {
  var aqlQuery = '\n    INSERT {\n      _from: @proposalId,\n      _to: @locationId\n    } IN locatedIn\n  ';

  return _database.db.query(aqlQuery, {
    proposalId: 'proposals/' + proposalKey,
    locationId: 'locations/' + locationKey
  });
}

exports.getProposal = getProposal;
exports.addProposal = addProposal;
exports.cloneProposal = cloneProposal;
exports.updateProposalDetails = updateProposalDetails;
exports.getBookedTrip = getBookedTrip;
exports.getUser = getUser;
exports.getMainPax = getMainPax;
exports.getTripsCount = getTripsCount;
exports.assignTC = assignTC;
exports.getLocation = getLocation;
exports.getTrips = getTrips;
exports.remove = remove;