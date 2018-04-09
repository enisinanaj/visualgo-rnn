
import React from 'react';
import {
  AppRegistry,
  Platform,
  Animated,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import ApplicationConfig from './screens/helpers/appconfig';
import Router, {MainAppNavigation} from './navigation/Router';
export default () => <MainAppNavigation ref={r => ApplicationConfig.getInstance().mainAppNavigation = r}/>;