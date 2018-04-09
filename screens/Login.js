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

// import {Font, AppLoading} from 'expo';
import Drawer from 'react-native-drawer'

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import DisabledStyle from '../constants/DisabledStyle';

import DefaultRow from './common/default-row';
import NoOpModal from './common/NoOpModal';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import _ from 'lodash';
import {NavigationActions} from 'react-navigation';

import moment from 'moment';
import locale from 'moment/locale/it';
import {isIphoneX} from './helpers';
import AppConfiguration from './helpers/appconfig';

const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  _mounted = false;

  constructor(props) {
    super(props);

    this.state = {
        visibleHeight: height,
        canLogin: false,
        passTyped: false,
        emailTyped: false,
        email: '',
        pass: '',
        showPasswordLabel: 'Show password',
        secureEntryPassword: true,
        keyboardIsOpen: false,
        isReady: false,
        emailFieldFocused: false,
        passwordFieldFocused: false
    };
  }

  componentDidMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    this._mounted = true;
    this.loadFonts();
  }

  async loadFonts() {
      // await Font.loadAsync({
      //   'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
      //   'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
      //   'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
      //   'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
      // });

      this.setState({ isReady: true });
  }

  componentWillUnmount() {
      Keyboard.removeListener('keyboardWillShow');
      Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
      this.setState({keyboardIsOpen: true});
      let newSize = height - e.endCoordinates.height
          this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
      if(this._mounted) {
        this.setState({keyboardIsOpen: false});
        this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
      }
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _renderHeader() {
    return (
        <View style={styles.headerView}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: width}}>
              {/* <EvilIcons name={"chevron-left"} size={30} onPress={() => this._goBack()} color={Colors.main} style={{width: 22}}/> */}
              <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                <Text style={styles.viewTitle}>Login</Text>
              </View>
            </View>
        </View>);
  }

  emailChanged(email) {
    if(email != ''){
      this.setState({emailTyped: true, email: email});
    }else{
      this.setState({emailTyped: false});
    }

    if(this.state.passTyped && this.state.emailTyped){
      this.setState({canLogin: true});
    }else{
      this.setState({canLogin: false});
    }
  }

  passwordChanged(pass) {
    if(pass != ''){
      this.setState({passTyped: true, pass: pass});
    }else{
      this.setState({passTyped: false});
    }

    if (this.state.emailTyped && this.state.passTyped) {
      this.setState({canLogin: true});
    } else {
      this.setState({canLogin: true});
    }
  }

  async LogIn(){
    var endpoint = 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/login?username=' + this.state.email + '&password=' + this.state.pass;
    //endpoint = 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/login?username=eni&password=eni';
    let loginSuccessful = false;
    try {
      let response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      let responseJson = await response.json();
      if (responseJson != "Error::null") {
        try {
          AppConfiguration.getInstance().me = JSON.parse(responseJson);
          console.log("user is HVM: " + AppConfiguration.getInstance().isHVM());
          loginSuccessful = true;  
        } catch (e) {
          console.log(e);
          loginSuccessful = false;
        }
      }
    } catch (error) {
      console.error(error);
    }

    if (loginSuccessful) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.push({routeName: 'Index'})
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      //TODO: show error
    }
  }

  showPassword(){
    if (this.state.secureEntryPassword) {
      this._passInput.setNativeProps({secureTextEntry: false});
      this.setState({showPasswordLabel: 'Hide password', secureEntryPassword: false});
    } else {
      this._passInput.setNativeProps({secureTextEntry: true});
      this.setState({showPasswordLabel: 'Show password', secureEntryPassword: true});      
    }
  }

  render() {
    var {visibleHeight, passTyped, emailTyped, emailFieldFocused, passwordFieldFocused, secureEntryPassword} = this.state;
    
    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    return (
      <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>}
        <Animated.View style={[isIphoneX() ? styles.containerIOSX : Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height: 0}]}/>

        <View style={{flexDirection: 'column', backgroundColor: Colors.white, height: height - 20}} resetScrollToCoords={{x: 0, y: 0}}>
            <DefaultRow renderChildren={() => this._renderHeader()} />

            {!this.state.keyboardIsOpen? 
              <View>
                <TouchableOpacity onPress={() => this._noOpLinkedin.toggleState()}>
                  <View style={[styles.oAuthButton, styles.buttonStyleLinkedin, DisabledStyle.disabled, Shadow.filterShadow]}>
                    <Text style={[styles.oAuthButtonContent]}>LOGIN WITH LINKEDIN</Text>
                  </View>
                  <NoOpModal featureName={"LinkedIn login "} ref={(noOpModal) => this._noOpLinkedin = noOpModal} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this._noOpGoogle.toggleState()}}>
                  <View style={[styles.oAuthButton, styles.buttonStyleGoogle, DisabledStyle.disabled, Shadow.filterShadow]}>
                    <Text style={[styles.oAuthButtonContent]}>LOGIN WITH GOOGLE</Text>
                  </View>
                  <NoOpModal featureName={"Google login "} ref={(noOpModal) => this._noOpGoogle = noOpModal} />
                </TouchableOpacity>

                <Text style={styles.OrText}>Or...</Text>
              </View>
            : null}

            <Text style={styles.grayText}>Enter your e-mail address</Text>

            <View style={[styles.textField, emailFieldFocused ? {borderBottomColor: Colors.main} : {}]}>
              <TextInput ref={component => this._emailInput = component} placeholderTextColor={Colors.main} placeholder={'Email'} 
                style={emailTyped ? styles.textFieldUserContent : styles.textFieldContent} 
                onChangeText={(email) => this.emailChanged(email)}
                onFocus={() => this.setState({emailFieldFocused: true})} onBlur={() => this.setState({emailFieldFocused: false})}
                numberOfLines={1} adjustsFontSizeToFit={true} miniminimumFontScale={16}
                />
              {emailFieldFocused || emailTyped ? 
                <TouchableOpacity onPress={() => {this._emailInput.clear()}}>
                  <EvilIcons name={"close-o"} size={26} color={Colors.main} 
                    style={styles.clearFieldButton}/>
                </TouchableOpacity>
                : null}
            </View>

            <Text style={styles.grayText}>Enter your password </Text>

            <View style={[styles.textField, passwordFieldFocused ? {borderBottomColor: Colors.main} : {}]}>
              <TextInput ref={component => this._passInput = component} secureTextEntry={true} placeholderTextColor={Colors.main} placeholder={'Password'} 
                style={[passTyped ? styles.textFieldUserContent : styles.textFieldContent,
                  secureEntryPassword && passTyped ? {fontSize: 28} : {}]}
                onChangeText={(pass) => this.passwordChanged(pass)}
                onFocus={() => this.setState({passwordFieldFocused: true})} onBlur={() => this.setState({passwordFieldFocused: false})}
                numberOfLines={1}/>
              {passwordFieldFocused || passTyped ? 
                <TouchableOpacity onPress={() => {this._passInput.clear()}}>
                  <EvilIcons name={"close-o"} size={26} color={Colors.main} 
                    style={styles.clearFieldButton}/>
                </TouchableOpacity>
                : null}
            </View>

            <TouchableOpacity onPress={() => this.showPassword()}>
              <Text style={styles.ShowPasswordText}>{this.state.showPasswordLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity ref={component => this._buttonLogin = component} disabled={!this.state.canLogin} onPress={() => this.LogIn()}>
              <View style={[passTyped && emailTyped ? styles.buttonLoginEnabled : styles.buttonLoginDisabled, styles.oAuthButton]}>
                <Text style={[styles.oAuthButtonContent, passTyped && emailTyped ? {} : styles.loginTextDisabled]}>LOGIN</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.ForgottenText}>Forgotten your password?</Text>
            </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>

    )
  }
}

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  containerIOSX: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.main,
    paddingTop: 44,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  containerIOS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.main,
    paddingTop: 20,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  containerAndroid:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    backgroundColor: Colors.main,
    paddingTop: 24,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  oAuthButtonContent: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'roboto-light',
    backgroundColor: 'transparent'
  },

  oAuthButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 10,
    height: 50,
    marginRight: 40,
    marginLeft: 40, 
    minWidth: 75,
    marginTop: 17,
    alignItems: 'center'
  },

  buttonStyleLinkedin: {
      backgroundColor: '#2F77B0'
  },

  buttonStyleGoogle: {
    backgroundColor: '#4F86EC'
  },

  buttonLoginEnabled: {
    backgroundColor: Colors.main
  },

  buttonLoginDisabled: {
    backgroundColor: '#F0F0F0'
  },

  loginTextDisabled: {
    color: '#cccccc'
  },

  textField: {
    marginLeft: 40,
    marginRight: 40,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
    paddingTop: 5,
    height: 55,
    marginTop: 0,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },

  textFieldContent: {
    fontSize: 48,
    flex: 1,
    marginLeft: 0,
    marginRight: 3,
    fontFamily: 'roboto-thin'
  },

  textFieldUserContent: {
    height: 45,
    flex: 1,
    marginLeft: 0,
    marginRight: 3,
    marginTop: 2,
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: Colors.main,
  },

  clearFieldButton: {
    marginTop: 14.5,
    backgroundColor: 'transparent'
  },

  viewTitle: {
    fontSize: 18,
    marginLeft: -11,
    color: Colors.main,
    justifyContent: 'center',
    fontFamily: 'roboto-bold'
  },

  OrText:{
    fontSize: 18,
    color: Colors.main,
    marginLeft: 40,
    marginTop: 20,
    fontFamily: 'roboto-bold'
  },

  grayText:{
    fontSize: 16,
    color: Colors.grayText98,
    marginLeft: 40,
    marginTop: 20,
    fontFamily: 'roboto-light'
  },

  ShowPasswordText:{
    fontSize: 16,
    color: Colors.main,
    marginLeft: 40,
    marginTop: 0,
    marginBottom: 15,
    fontFamily: 'roboto-bold'
  },

  ForgottenText:{
    fontSize: 16,
    color: Colors.yellow,
    marginLeft: 40,
    marginTop: 15,
    marginBottom: 30,
    fontFamily: 'roboto-bold'
  },

  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 5 
  }
});