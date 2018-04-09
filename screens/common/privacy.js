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
  ListView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { isIphoneX } from '../helpers';

var tagsToShow = [
  {title: 'Public', subtitle: 'All your VisualGo connections', selected: false, arrowVisible: false }, 
  {title: 'Only Tagged', subtitle: 'Only users tagged in this post', selected: false, arrowVisible: false },
  {title: 'Public Except...', subtitle: 'Don\'t show to some of your VisualGo ...', selected: false, arrowVisible: true },
  {title: 'Only me', selected: false, arrowVisible: false }];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class PostPrivacy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSource: ds.cloneWithRows(tagsToShow)
    };
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>Select privacy</Text>
          <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
      </View>
    );
  }

  toggleRow(rowData) {
    var allRows = tagsToShow;

    for (let i = 0; i < allRows.length; i++) {
      if (allRows[i].title == rowData.title) {
        console.log("rowdata is selected: " + rowData.selected);
        if (!rowData.selected) {
          allRows[i].selected = true;
        } else if(rowData.selected) {
          allRows[i].selected = false;
        }
      } else {
        allRows[i].selected = false;
      }
    }

    this.setState({tagSource: ds.cloneWithRows(allRows)});
  }

  renderSelectableComponent(data) {
    return (
      <Ionicons name={data.selected ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
            size={30} color={data.selected ? Colors.main : Colors.gray} />
    );
  }

  renderTagRow(data) {
    return (
      <View style={[styles.rowContainer, {flexDirection: 'row'}, {justifyContent: 'space-between'}, {alignItems: 'center'}]}>
        <TouchableOpacity onPress={() => this.toggleRow(data)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}]}>{data.title}</Text>
            <Text style={styles.rowSubTitle}>{data.subtitle}</Text>
          </View>
        </TouchableOpacity>
        {data.arrowVisible ? 
          <TouchableOpacity>
            <Ionicons name={"ios-arrow-dropright"} color={Colors.main} size={32} style={{marginRight: 10}} /> 
          </TouchableOpacity> : null }
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight}}>
        <StatusBar barStyle={'light-content'} animated={true}/>
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        {this.renderHeader()}
        <ListView
          style={styles.listView}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
        />
        <View style={styles.selectedTags}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 0
  },
  selectableDisplayPicture: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  selectedDisplayPicture: {
    borderWidth: 3,
    borderColor: Colors.main
  }
});