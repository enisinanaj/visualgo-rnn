import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

// import {StackNavigation,TabNavigation, TabNavigationItem} from '@expo/ex-navigation';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import {MenuIcons, isIphoneX} from '../screens/helpers/index';
import ApplicationConfig from '../screens/helpers/appconfig';

export default class RootNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentLanding: 'landing',
      isRady: false,
      tabNavHeight: 54,
      iconMarginTop: -10
    };
  }

  componentDidMount() {
    console.log(this.navigation.getNavigationContext().jumpToTab);
    ApplicationConfig.getInstance().tabNavigation = this.navigation;
    { isIphoneX() ? this.setState({tabNavHeight: 88, iconMarginTop: -44}) 
    : this.setState({tabNavHeight: 54, iconMarginTop: -10}) }
  }

  render() {
    return (
      <TabNavigation
        style={styles.tabNvigation}
        ref={(t) => this.navigation = t}
        tabBarHeight={this.state.tabNavHeight} 
        initialTab={this.state.currentLanding}>
        <TabNavigationItem
          id="tabVisualGuidelines" style={[styles.tabNavigationItem, {marginTop: this.state.iconMarginTop}]}
          renderIcon={isSelected => this._renderIcon('album', isSelected)}>
          <StackNavigation initialRoute="visualGuidelines" />
        </TabNavigationItem>

        <TabNavigationItem
          id="landing" style={[styles.tabNavigationItem, {marginTop: this.state.iconMarginTop}]}
          renderIcon={isSelected => this._renderIcon('bacheca', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="mainCalendar" style={[styles.tabNavigationItem, {marginTop: this.state.iconMarginTop}]}
          renderIcon={isSelected => this._renderIcon('calendar', isSelected)}>
          <StackNavigation initialRoute="mainCalendar" />
        </TabNavigationItem>

        <TabNavigationItem
            id="chat" style={[styles.tabNavigationItem, {marginTop: this.state.iconMarginTop}]}
            renderIcon={isSelected => this._renderIcon('chat', isSelected)}>
          <StackNavigation initialRoute="chat" />
        </TabNavigationItem>
        
        <TabNavigationItem
            id="mainTodo" style={[styles.tabNavigationItem, {marginTop: this.state.iconMarginTop}]}
            renderIcon={isSelected => this._renderIcon('notification', isSelected)}>
          <StackNavigation initialRoute="mainTodo" />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(name, isSelected) {
    let image;
    switch(name) {
      case 'chat':
        image = MenuIcons.CHAT_IMAGE
        break;
      case 'album':
        image = MenuIcons.ALBUM_IMAGE
        break;
      case 'calendar':
        image = MenuIcons.CALENDAR_IMAGE
        break;
      case 'notification':
        image = MenuIcons.NOTIFICATION_IMAGE
        break;
      case 'bacheca':
        image = MenuIcons.BACHECA_IMAGE
        break;
    }

    if (!isSelected) {
      return <View style={styles.mainIcon}>
          <Image
            style={{flex: 1, width: undefined, height: undefined}}
            source={image}
            resizeMode="contain"/>
        </View>;
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: this.state.iconMarginTop}}>
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
