import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Image,
  TouchableOpacity,
  ListView,
  Dimensions,
  TextInput,
    Platform } from 'react-native';

import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';
import Colors from '../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';

var messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'me', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

const people = [
    {title: 'Roseanne Font', subtitle: 'Milan Store', img: require('./img/elmo.jpg'), selected: false }, 
    {title: 'Denis Mcgraw', subtitle: 'Rome Store', img: require('./img/bob.png'), selected: false },
    {title: 'Love Guerette', subtitle: 'Paris Store', img: require('./img/cookiemonster.jpeg'), selected: false },
    {title: 'Marget Divers', subtitle: 'London Store', img: require('./img/elmo.jpg'), selected: false },
    {title: 'Moriah Fewell', subtitle: 'Shanghai Store', img: require('./img/me.png'), selected: false }];

export default class NewGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            convoMessages: ds.cloneWithRows(messages),
            visibleHeight: height,
            contentLayout: {},
            managers: ds.cloneWithRows(people),
        }
    }

    _goBack() {
        this.props.navigator.pop();
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#FFF', paddingTop: 16, borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16}}>
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '600', color: Colors.main, width: 60}}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600', marginLeft: 75}}>New Group</Text>
                
            </View>

        )
    }

    toggleRow(rowData) {
        rowData.selected = !rowData.selected;
        this.setState({managers: ds.cloneWithRows(people)});
    }
    
  renderTagRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.toggleRow(data)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}]}>{data.title}</Text>
            <Text style={styles.rowSubTitle}>{data.subtitle}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  renderSelectableComponent(data) {
    if (data.img == undefined) {
      return (
         <Ionicons name={data.selected? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
              size={30} color={data.selected ? Colors.main : Colors.gray} />
      );
    }
    
    return (
      <Image source={data.img} style={[styles.selectableDisplayPicture,
        data.selected ? styles.selectedDisplayPicture : {}]} />
    );
  }

    _renderRow(data) {
        return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
    }

    _addMessage() {
        if (this.state.newMessage == "") {
            return;
        }
        
        var {newMessage} = this.state;
        messages.push(
            {from: {name: 'me', image: require('./img/elmo.jpg')}, message: newMessage, read: false, date: new Date()}
        );

        this.setState({convoMessages: ds.cloneWithRows(messages)});
        this.refs['newMessageTextInput'].clear();
        this.setState({newMessage: ""}); 
        this.refs['conversationCollection'].scrollToEnd();
    }

    renderFilters() {
        var filters = [{type: 'search', searchPlaceHolder: 'Search', fixedOpen: true}];
        return <View style={styles.filterBarContainer}><FilterBar noPadding={true} data={filters} customStyle={{padding: 0, margin: 0}} headTitle={""} /></View>
      }


      _renderSelectedTagElement(data) {
          return (
            <TouchableOpacity onPress={() => this.toggleRow(data)}>
              <Image source={data.img} style={styles.selectedDisplayPictureInFooter} />
            </TouchableOpacity>
          )
      }
    
      _renderSelectedTags() {
        var selectedManagers = people.filter((el) => el.selected);
        var dataSource = ds.cloneWithRows(selectedManagers);

    
        return (



                <ListView
                            dataSource={dataSource}
                            horizontal={true}
                            renderRow={(data) => this._renderSelectedTagElement(data)}
                        />




        );
      }

    _selectedManagerNotEmpty() {
        return people.filter((el) => el.selected).length > 0;
    }

    render() {
        var {height, visibleHeight} = this.state;
        var filters = [{type: 'search', searchPlaceHolder: 'Search', fixedOpen: true}];

        return (
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
                
                <StatusBar barStyle={'light-content'} animated={true}/>
                {Platform.os === 'ios' ? 
                    <View style={{height: 20, backgroundColor: Colors.main}}></View> 
                : null}
                {this.renderHeader()}
                <View style={{flexDirection: 'row', margin: 10, paddingBottom: -10}}>
                    <TouchableOpacity>
                        <Image source={require("../screens/img/slr-camera-128.jpg")} style={[styles.cameraPicture]} />
                    </TouchableOpacity>

                    <View style={[styles.textField]}>
                        <TextInput placeholderTextColor={Colors.gray} placeholder={'Name this group chat'} 
                        style={[styles.textFieldContent]} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                </View>
                <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
                <ListView
                    style={styles.listView}
                    onScroll={this._onScroll}
                    dataSource={this.state.managers}
                    renderRow={(data) => this._renderRow(data)}
                />
                <View style={[styles.selectedTags, this._selectedManagerNotEmpty() ? {height: 60, padding: 10} : {}]}>
                    {this._renderSelectedTags()}
                    <TouchableOpacity  onPress={() => this.props.closeModal(this.state.selectedTags)}>
                        {people.filter((el) => el.selected).length > 0 ? <Text style={{color: Colors.white, fontWeight: '700', fontSize: 18, paddingRight: 10, marginTop: 8}}>Create Group</Text> : null }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textFieldContent: {
        flex: 1,
        width: 260,
        fontSize: 20,
        fontWeight: '100'
        
      },
      textField: {
        marginRight: 40,
        marginLeft: 20,
        
        
        paddingBottom: 5,
        paddingTop: 5,
        height: 55,
        marginTop: 0,
        marginBottom: 5
      },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    listView: {
        paddingTop: 10,
        flex: 1
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingTop: 5,
        paddingBottom: 5,
        height: 30,
    },
    statusIOSBackground: {
        backgroundColor: Colors.main,
        height: 20,
        width: width
    },
    statusAndroidBackground: {
        backgroundColor: Colors.main,
        height: 24,
        width: width
    },

    statusBlackBackground: {

    },
    viewTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2
    },
    displayPicture: {
        marginLeft: 10,
        marginRight: 5,
        height: 44,
        width: 44,
        borderRadius: 22
    },
    convoContainer: {
        flex: 1, 
        justifyContent: 'space-between', 
    },
    messageBubble: {
        backgroundColor: Colors.borderGray,
        padding: 10,
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-end'
    },
    fromBubble: {
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-start'
    },
    attachment: {
        backgroundColor: Colors.main,
        borderRadius: 22,
        margin: 5,
        height: 44
    },
    messageBox: {
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        borderWidth: 2,
        borderColor: Colors.borderGray,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      textInRow: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
      },
      rowTitle: {
        fontWeight: '400',
        fontSize: 18
      },
      rowSubTitle: {
        color: Colors.grayText,
        fontSize: 14
      },
      rowSelected: {
        color: Colors.main
      },
      selectedTags: {
        flexDirection: 'row',
        backgroundColor: Colors.main,
        padding: 0,
        margin: 0,
      },
      selectableDisplayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25
      },

      cameraPicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.gray,
        padding: 4
      },
      selectedDisplayPictureInFooter: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 13
      },
      selectedDisplayPicture: {
        borderWidth: 3,
        borderColor: Colors.main
      },
      filterBarContainer: {
          backgroundColor: Colors.white
      }
});