import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    Platform,
    ScrollView,
    ListView,
    StyleSheet,
    StatusBar,
    TextInput,
    Image,
    TouchableOpacity,
    Button,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';

import Drawer from 'react-native-drawer'

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import SearchBar from './common/search-bar';
import DefaultRow from './common/default-row';
import NoOpModal from './common/NoOpModal';
import FilterBar from './common/filter-bar';
import NewGroup from './NewGroup';
import BlueMenu from './common/blue-menu';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import _ from 'lodash';
import {NavigationActions} from 'react-navigation';

import moment from 'moment';
import locale from 'moment/locale/it'

const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {isReady: false};
  }

  componentDidMount() {
    this.loadFonts();
  }

  async loadFonts() {
      // await Font.loadAsync({
      //   'roboto': require('../assets/fonts/Roboto-Thin.ttf'),
      //   'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
      //   'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf')
      // });

      this.setState({ isReady: true });
  }

  logIn() {
    this.props.navigation.push('Login');
  }

  render() {
    var {visibleHeight} = this.state;

    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    return (
        <View style={styles.container}>
            <Text style={[styles.welcomeLabel, {marginTop: 50}]}>Welcome to VisualGo!</Text>

            <TouchableOpacity onPress={() => this._noOpModalEmail.toggleState()}>
              <View style={[styles.oAuthButton, styles.buttonStyleEmail, styles.buttonDisabled, Shadow.filterShadow]}>
                <Text style={[styles.oAuthButtonContent]}>REGISTER WITH EMAIL</Text>
              </View>
              <NoOpModal featureName={"Email Registration "} ref={(noOpModal) => this._noOpModalEmail = noOpModal} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this._noOpModalLinkedin.toggleState()}>
              <View style={[styles.oAuthButton, styles.buttonStyleLinkedin, styles.buttonDisabled, Shadow.filterShadow]}>
                <Text style={[styles.oAuthButtonContent]}>CONTINUE WITH LINKEDIN</Text>
              </View>
              <NoOpModal featureName={"LinkedIn login "} ref={(noOpModal) => this._noOpModalLinkedin = noOpModal} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this._noOpModalGoogle.toggleState()}>
              <View style={[styles.oAuthButton, styles.buttonStyleGoogle, styles.buttonDisabled, Shadow.filterShadow]}>
                <Text style={[styles.oAuthButtonContent]}>CONTINUE WITH GOOGLE</Text>
              </View>
              <NoOpModal featureName={"Google login "} ref={(noOpModal) => this._noOpModalGoogle = noOpModal} />
            </TouchableOpacity>

            <Text style={[styles.welcomeLabel, {marginTop: 30}]}>Or...</Text>

            <TouchableOpacity ref={component => this._buttonLogin = component} onPress={() => this.logIn()}>
              <View style={[styles.oAuthButton, styles.buttonLoginEnabled]}>
                <Text style={[styles.oAuthButtonContent, styles.loginText]}>LOGIN</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.notice}>By continuing you agree to VisualGo terms of service and privacy policy</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  welcomeLabel: {
    fontSize: 48,
    fontFamily: 'Roboto-Thin',
    color: Colors.main,
    marginLeft: 40,
    marginRight: 40
  },
  notice:{
    fontFamily: 'Roboto-Light',
    color: Colors.main,
    marginLeft: 40,
    marginRight: 40,
    fontSize: 16,
    marginTop: 40
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.white
  },

  oAuthButtonContent: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18,
    height: 'auto',
    fontFamily: 'Roboto-Light',
    backgroundColor: 'transparent'
  },

  oAuthButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 25,
    height: 50,
    marginRight: 40,
    marginLeft: 40, 
    minWidth: 75,
    marginTop: 20,
    alignItems: 'center'
  },

  buttonStyleEmail: {
      backgroundColor: Colors.main,
  },

  buttonStyleLinkedin: {
    backgroundColor: '#2F77B0',
  },

  buttonStyleGoogle: {
    backgroundColor: '#4F86EC',
  },

  buttonLoginEnabled: {
    backgroundColor: Colors.main,
  },

  buttonDisabled: {
    opacity: 0.3
  },

  loginText: {
    color: Colors.white
  },

  textField: {
    marginLeft: 40,
    marginRight: 40,
    borderBottomColor: Colors.grayText,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
    paddingTop: 5,
    height: 55,
    marginTop: 0,
    marginBottom: 5
  },

  textFieldContent: {
    fontSize: 52,
    fontWeight: '100'
  },

  viewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.main,
    justifyContent: 'center',
  },

  OrText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.main,
    marginLeft: 40,
    marginTop: 20,
  },

  grayText:{
    fontSize: 14,
    fontWeight: '100',
    color: Colors.grayText,
    marginLeft: 40,
    marginTop: 20,
    fontFamily: 'Roboto-Thin'
  },

  ShowPasswordText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.main,
    marginLeft: 40,
    marginTop: 0,
    marginBottom: 15
  },

  ForgottenText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.yellow,
    marginLeft: 40,
    marginTop: 25,
    marginBottom: 30
  },

  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 5,
    paddingBottom: 5,   
  }
});