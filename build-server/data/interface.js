'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeField = exports.nodeInterface = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphqlRelay = require('graphql-relay');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId),
      type = _fromGlobalId.type,
      id = _fromGlobalId.id;

  // Automatically import a controller and call a get function
  // Each type should have a controllers/<TypeName>  which implements a get<TypeName>(id) function


  if (type !== null && type !== '') {
    try {
      var controller = require('./' + type + '/controllers/' + type);
      return controller['get' + type](id).then(function (res) {
        return (0, _extends3.default)({ type: type }, res);
      });
    } catch (e) {
      console.log(e.stack);
      return null;
    }
  } else {
    return null;
  }
}, function (_ref) {
  var type = _ref.type;

  // Automatically return a correct type
  // Each type should implement <TypeName>/types/<TypeName>
  try {
    return require('./' + type + '/types/' + type).default;
  } catch (e) {
    console.log(e.stack);
    return null;
  }
}); /* eslint-disable no-undef */


var nodeInterface = _nodeDefinitions.nodeInterface,
    nodeField = _nodeDefinitions.nodeField;
exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;