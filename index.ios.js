/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var {
  AppRegistry
} = require('react-native');

var Example = require('./RefreshExample.js');
AppRegistry.registerComponent('PullToRefresh', () => Example);