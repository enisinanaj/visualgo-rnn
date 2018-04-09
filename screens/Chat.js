import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Button
} from 'react-native';

import Drawer from 'react-native-drawer'

import Colors from '../constants/Colors';
import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';
import NewGroup from './NewGroup';
import BlueMenu from './common/blue-menu';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';
import AppSettings from './helpers/index';
import ApplicationConfig from './helpers/appconfig';

const {width, height} = Dimensions.get('window');
const messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
        messages: ds.cloneWithRows(messages),
        createNewGroup: false,
    };

    this._onDrawerOpen = this._onDrawerOpen.bind(this);
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

  toggleMenu = () => {
      if(this._drawer.props.open){
          this._drawer.close()
      }else{
          this._drawer.open()
      }
  };

  renderDrawer() {
    return (
        <Drawer/>
    )
  }

  _onDrawerOpen(event) {
      const e = event.nativeEvent;
      const offset = e.contentOffset.x;
      this.offsetX.setValue(offset);
  }

  renderMessageRow(data) {
    return (
        <View style={styles.rowContainer}>
            <TouchableOpacity  onPress={() => this._goToConvo(1)} style={styles.rowContainer}>
                <Image source={data.from.image} style={styles.selectableDisplayPicture} />
                <View style={styles.textInRow}>
                    <Text style={[styles.rowTitle, !data.read ? styles.unreadMessage : {}]}>{data.from.name}</Text>
                    <Text style={styles.rowSubTitle}>{data.message}</Text>
                </View>
                <Text style={styles.messageDate}>{moment(data.date).locale("it").format("LT")}</Text>
            </TouchableOpacity>
        </View>);
  }

  _goToConvo = (messageId) => {
    //AppSettings.appIndex.removeSearchBar();
    ApplicationConfig.getInstance().index.hideSearchBar();
    //ApplicationConfig.getInstance().index.removeSearchBar();
    this.props.navigator.push(Router.getRoute('conversation', {convTitle: 'Andy'}));
  }
  
  _renderRow(data) {
    return <DefaultRow arguments={data} noborder={true} renderChildren={() => this.renderMessageRow(data)} />
  }

  _goToNewGoup() {
    this.setState({createNewGroup: true});
  }

  renderNewGroupModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.createNewGroup}
        onRequestClose={() => this.setState({createNewGroup: false})}>
        <NewGroup closeModal={() => this.setState({createNewGroup: false})}/>
      </Modal>
    );
  }

  renderFilters() {
    filters = [{type: 'search', searchPlaceHolder: 'Search'},
          {title: 'All', selected: true, active: true},
          {title: 'Group', selected: false, active: true},
          {title: 'Active', selected: false, active: true},
          {title: 'New', active: false, onPress: () => this._goToNewGoup()}];
    return <View style={styles.filterBarContainer}>
      <FilterBar data={filters} customStyle={{height: 100}} headTitle={"Messages"} />
    </View>
  }

  render() {
        return (
          <View style={{flexDirection: 'column', backgroundColor: Colors.white}}>
              <StatusBar barStyle={'light-content'} animated={true}/>
              <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
              <ListView
                  style={styles.listView}
                  onScroll={this._onScroll}
                  dataSource={this.state.messages}
                  renderRow={(data) => this._renderRow(data)}
                  enableEmptySections={true}/>
              {this.renderNewGroupModal()}
          </View>
        )
    }
}

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const styles = StyleSheet.create({
    selectableDisplayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    unreadMessage: {
        fontWeight: '800'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },
    innerContainer: {
      alignItems: 'center',
    },
    rowContainer: {
      padding: 5,
      flex: 1,
      flexDirection: 'row'
    },
    textInRow: {
      marginLeft: 10,
      marginTop: 5,
      flex: 1,
      flexDirection: 'column',
    },
    rowTitle: {
      fontWeight: '400',
      fontSize: 18
    },
    rowSubTitle: {
      color: Colors.grayText,
      fontSize: 14
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        height: 100
    },
    messageDate: {
        paddingTop: 17
    }/*,
    listView: {
      backgroundColor: Colors.white,
      flexDirection: 'column',
      bottom: 0
    }*/
  });