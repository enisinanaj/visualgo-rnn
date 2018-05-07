
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

import { StackNavigator } from 'react-navigation';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Router, {MainTabNav} from '../navigation/Router';
import cacheAssetsAsync from '../utilities/cacheAssetsAsync';
import Drawer from 'react-native-drawer'

import BlueMenu from './common/blue-menu';
import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import Login from './Login';
import StartScreen from './StartScreen';

import AppSettings, {isIphoneX} from './helpers';
import ApplicationConfig from './helpers/appconfig';
import TaskDetail from './common/task-detail';
import AlbumDetail from './AlbumDetail';
import CollabView from './CollabView';
import CreateAlbum from './common/create-visual-guideline';
import CreatePost from './common/create-post';
import CameraScreen from './CameraScreen';

const {width, height} = Dimensions.get('window');
const DRAWER_ANIMATION_DURATION = 750;

export default class AppContainer extends React.Component {
  state = {
    appIsReady: true,
    menuIsOpen: false,
    mainViewHeight: new Animated.Value(height),
    innerViewHeight: new Animated.Value(height - 69),
    marginTop: new Animated.Value(0),
    searchBarVisible: true,
    searchBarHeight: new Animated.Value(69)
  }

  componentWillMount() {
  }

  componentDidMount() {
    ApplicationConfig.getInstance().index = this;
    AppSettings.appIndex = this;
  }

  toggleMenu = () => {
    if(this._drawer.props.open){
      this._drawer.close()
      this.setState({menuIsOpen: false});
    }else{
      this._drawer.open()
      this.setState({menuIsOpen: true});

      Animated.parallel([
        Animated.timing(
          this.state.mainViewHeight,
          {
            toValue: height - 100,
            duration: DRAWER_ANIMATION_DURATION,
          }
        ),
        Animated.timing(
          this.state.marginTop,
          {
            toValue: 50,
            duration: DRAWER_ANIMATION_DURATION,
          }
        ),
        Animated.timing(
          this.state.innerViewHeight,
          {
            toValue: height - 160,
            duration: DRAWER_ANIMATION_DURATION,
          }
        )
      ]).start();
    }
  };

  closeMenu() {
    this.setState({menuIsOpen: false});
    Animated.parallel([
      Animated.timing(
        this.state.mainViewHeight,
        {
          toValue: height,
          duration: DRAWER_ANIMATION_DURATION,
        }
      ),
      Animated.timing(
        this.state.marginTop,
        {
          toValue: 0,
          duration: DRAWER_ANIMATION_DURATION,
        }
      ),
      Animated.timing(
        this.state.innerViewHeight,
        {
          toValue: height - 69,
          duration: DRAWER_ANIMATION_DURATION,
        }
      )
    ]).start();
  }

  hideSearchBar(direction) {
    Animated.parallel([
      Animated.timing(
        this.state.searchBarHeight, {
          toValue: 20,
          duration: 200,
        }
      ),
      Animated.timing(
        this.state.innerViewHeight,
        {
          toValue: height - 20,
          duration: 200,
        }
      )
    ]).start();

    this.removeSearchBar();
  }

  removeSearchBar() {
    this.setState({searchBarVisible: false});
  }

  showSearchBar() {
      Animated.parallel([
        Animated.timing(
          this.state.searchBarHeight, {
            toValue: 69,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.innerViewHeight, {
            toValue: height - 69,
            duration: 200,
          }
        )
      ]).start();

      this.setState({searchBarVisible: true});
  }

  render() {
    if (this.state.appIsReady) {
        return (
          <Drawer
            type="static"
            ref={(ref) => this._drawer = ref}
            content={<BlueMenu navigation={this.props.navigation}/>}
            openDrawerOffset={50} 
            styles={isIphoneX() ? drawerStylesX : Platform.OS === "ios" ? drawerStyles : drawerStyles}
            tweenEasing={"easeInOutBack"}
            tweenDuration={DRAWER_ANIMATION_DURATION}
            acceptTap={true}
            onCloseStart={() => this.closeMenu()}
            onClose={() => {this.setState({width: width})}}
            captureGestures={false}
            side="right">
            <View style={[styles.container, {width: width}]}>
              <Animated.View style={[{height: this.state.mainViewHeight, marginTop: this.state.marginTop}, {backgroundColor: Colors.white}]}>
                <Animated.View style={{height: this.state.searchBarHeight, zIndex: 999, backgroundColor: Colors.main, overflow: 'hidden'}}
                    removeClippedSubviews={true}>
                  <SearchBar ref='searchBar' openMenu={() => this.toggleMenu()}/>
                </Animated.View>
                <Animated.View style={{marginTop: 0,
                    bottom: 0,
                    height: this.state.innerViewHeight,
                    shadowColor: 'transparent',
                    shadowOffset: {height: 0}}}>
                    <MainTabNav />
                </Animated.View>
                {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>}
                {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
              </Animated.View>
              {this.state.menuIsOpen ? 
                <View style={{position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, backgroundColor: 'transparent'}} /> 
              : null}
            </View>
          </Drawer>
        );
    } else {
      return (
        <View />
      );
    }
  }
}

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const drawerStylesX = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0, paddingTop: 22},
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: Colors.main,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  drawer: {
    height,
    padding: 0,
    paddingTop: 20,
    width: width,
    position: 'absolute',
    backgroundColor: Colors.chat_bg,
    right: 0
  }
});