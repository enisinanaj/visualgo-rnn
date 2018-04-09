import React from 'react';
import {View, Image, StyleSheet} from 'react-native'
import {StackNavigator, TabNavigator, TabBarBottom} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Landing from '../screens/Landing';
import ImageScreen from '../screens/imageScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Chat from '../screens/Chat';
import RootNavigation from './RootNavigation';
import ConversationView from '../screens/Conversation';
import NewGroup from '../screens/NewGroup'
import Login from '../screens/Login'
import ImagePost from '../screens/common/image-post';
import MainCalendar from '../screens/MainCalendar';
import VisualGuidelines from '../screens/VisualGuidelines';
import MainTodo from '../screens/MainToDo';
import AlbumDetail from '../screens/AlbumDetail';
import CollabView from '../screens/CollabView';

import StartScreen from '../screens/StartScreen';
import ApplicationConfig from '../screens/helpers/appconfig';
import TaskDetail from '../screens/common/task-detail';
import CreateAlbum from '../screens/common/create-visual-guideline';
import CreatePost from '../screens/common/create-post';
import CameraScreen from '../screens/CameraScreen';
import AppContainer from '../screens/AppContainer';

import {MenuIcons} from '../screens/helpers';
import Colors from '../constants/Colors';

function _renderIcon(name, isSelected) {
  let image;
  switch(name) {
    case 'Chat':
      image = MenuIcons.CHAT_IMAGE
      break;
    case 'VisualGuidelines':
      image = MenuIcons.ALBUM_IMAGE
      break;
    case 'MainCalendar':
      image = MenuIcons.CALENDAR_IMAGE
      break;
    case 'MainTodo':
      image = MenuIcons.NOTIFICATION_IMAGE
      break;
    case 'Wall':
      image = MenuIcons.BACHECA_IMAGE
      break;
  }

  if (!isSelected) {
    return <View style={[styles.mainIcon, {marginTop: 0}]}>
        <Image
          style={{flex: 1, width: undefined, height: undefined}}
          source={image}
          resizeMode="contain"/>
      </View>;
  } else {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 5}}>
        <View style={{height: 26, width: 26}}>
          <Image
            style={{flex: 1, width: undefined, height: undefined}}
            source={image}
            resizeMode="contain"/>
        </View>
        <FontAwesome name={'circle'}
          style={styles.activeSignIcon}
          size={4} color={Colors.main} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
  mainIcon: {
    height: 26,
    width: 26,
    marginTop: -10
  },
  activeSignIcon: {
    marginTop: 2,
    marginBottom: 2
  },
  tabNavigationItem: {
    
  },
  tabNvigation: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
  }
});

export const MainTabNav = TabNavigator({
    VisualGuidelines: {screen: VisualGuidelines },
    Wall: {screen: Landing},
    MainCalendar: {screen: MainCalendar},
    Chat: {screen: Chat},
    MainTodo: {screen: MainTodo},
  },
  {
    initialRouteName: 'Wall',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        return _renderIcon(routeName, focused);
      },
    }),
    tabBarOptions: {
      activeTintColor: Colors.main,
      inactiveTintColor: 'gray',
      showLabel: false
    },
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    
  });


export const MainAppNavigation = StackNavigator({
  StartScreen: {screen: StartScreen},
  Login: {screen: Login },
  Index: {screen: AppContainer},
  TaskSummary: {screen: TaskDetail},
  PostSummary: {screen: CreatePost},
  AlbumSummary: {screen: AlbumDetail},
  CollabView: {screen: CollabView},
  CreateVisualGuideline: {screen: CreateAlbum},
  CameraScreen: {screen: CameraScreen}
},
{
  initialRouteName: 'StartScreen',
  headerMode: 'none',
  navigationOptions: {
    header: {
      style: {
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
      },
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      }
    }
  }
});