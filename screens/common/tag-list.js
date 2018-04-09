import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  RefreshControl,
  Platform,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { isIphoneX } from '../helpers';

import _ from 'lodash';

var currentCategory = "clusters";
var tagsToShow = {};

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

export default class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSource: ds.cloneWithRows(tagsToShow),
      selectedTags: [],
      isReady: false,
      visibleHeight: height,
      managers: [],
      stores: [],
      clusters: [],
      userResponse: [],
      storeResponse: [],
      clusterResponse: []
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    
    this.loadFonts();
    this.getClusters();
    this.getStores();
    this.getUsers();
  }

  async loadFonts() {
    // await Font.loadAsync({
    //   'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
    //   'roboto-bold': '../../assets/fonts/Roboto-Bold.ttf'
    // });

    this.setState({isReady: true});
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
    this.setState({keyboardIsOpen: true});
    let newSize = height - e.endCoordinates.height;
    this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
    this.setState({keyboardIsOpen: false});
    if(this.componentDidMount) {
        this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
        this.setState({refreshing: false});
    }, 1500)
  }

  _onScroll(event) {
    const e = event.nativeEvent;
    const l_height = e.contentSize.height;
    const offset = e.contentOffset.y;

    this.offsetY = offset;

    if(offset + this.content_height >= l_height) {
        this.loadMore();
    }
  }

  loadMore() {
    this.setState({loading: true});
    this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
            <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Manager', onType: () => {}},
      {title: 'Clusters', selected: true, active: true, onSelected: () => this.filterForClusters(), headTitle: 'Clusters'},
      {title: 'Store', selected: false, active: true, onSelected: () => this.filterForStores(), headTitle: 'Stores'},
      {title: 'Manager', selected: false, active: true, onSelected: () => this.filterForManagers(), headTitle: 'Managers'}];
    return <View style={styles.filterBarContainer}>
      <FilterBar data={filters} customStyle={{height: 100}} headTitle={"Clusters"}/>
    </View>
  }

  filterForClusters() {
    this.setState({tagSource: ds.cloneWithRows(this.state.clusters)});
    currentCategory = 'clusters';
    tagsToShow = this.state.clusters;
  }

  filterForManagers() {
    this.setState({tagSource: ds.cloneWithRows(this.state.managers)});
    currentCategory = 'managers';
    tagsToShow = this.state.managers;
  }

  filterForStores() {
    this.setState({tagSource: ds.cloneWithRows(this.state.stores)});
    currentCategory = 'stores';
    tagsToShow = this.state.stores;
  }

  toggleRow(rowData) {
    rowData.selected = !rowData.selected;

    if (rowData.selected) {
      rowData.category = currentCategory;
      this.state.selectedTags.push(rowData);
    } else {
      this.setState({selectedTags: this.state.selectedTags.filter(value => value != rowData)});
    }

    this.refs.selectedTagsView.scrollToEnd();
    this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
  }

  renderSelectableComponent(data) {
    if (data.img == undefined) {
      return (
        <Ionicons name={data.selected ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
              size={30} color={data.selected ? Colors.main : Colors.gray} style={{marginLeft: 10}} />
      );
    }
    
    return (
      <Image source={data.img} style={[styles.selectableDisplayPicture,
        data.selected ? styles.selectedDisplayPicture : {}]} />
    );
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

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
  }

  _renderSelectedTagElement(data) {
    if (data.category != 'managers') {
      return (
      <TouchableOpacity onPress={() => this.toggleRow(data)}>
        <Text style={{color: Colors.white, marginRight: 13, marginTop: 12, fontSize: 12}}>{data.title}</Text>
      </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.toggleRow(data)}>
          <Image source={data.img} style={styles.selectedDisplayPictureInFooter} />
        </TouchableOpacity>
      ) 
    }
  }

  _renderSelectedTags() {
    var dataSource = ds.cloneWithRows(this.state.selectedTags);
    var result = <ListView
        ref={"selectedTagsView"}
        dataSource={dataSource}
        horizontal={true}
        renderRow={(data) => this._renderSelectedTagElement(data)}
      />;
    return result;
  }

  async getUsers(){
    var endpoint = 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/users';
    let isResponseEmpty = true;
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
          this.setState({userResponse: JSON.parse(responseJson)});
          var managersList = [];
          this.state.userResponse.map((el, i) => {
            let obj = {title: el.name + ' ' + el.surname, subtitle: el.username, img: require('../img/me.png'), selected: false, id: el.id};  
            managersList.push(obj);
          })
          this.setState({managers: managersList});
          isResponseEmpty = false;
        } catch (e) {
          console.log(e);
          isResponseEmpty = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getClusters(){
    var endpoint = 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/clusters/getclusters';
    let isResponseEmpty = true;
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
          this.setState({clusterResponse: JSON.parse(responseJson)});
          var clustersList = [];
          this.state.clusterResponse.map((el, i) => {
            let obj = {title: el.name, subtitle: el.description, selected: false, id: el.id};  
            clustersList.push(obj);
          })
          this.setState({clusters: clustersList});
          tagsToShow = this.state.clusters;
          this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
          isResponseEmpty = false;  
        } catch (e) {
          console.log(e);
          isResponseEmpty = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getStores(){
    var endpoint = 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/stores/getstores';
    let isResponseEmpty = true;
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
          this.setState({storeResponse: JSON.parse(responseJson)});
          var storesList = [];
          this.state.storeResponse.map((el, i) => {
            let obj = {title: el.name, subtitle: el.description, selected: false, id: el.id};  
            storesList.push(obj);
          })
          this.setState({stores: storesList});
          isResponseEmpty = false;  
        } catch (e) {
          console.log(e);
          isResponseEmpty = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    var {visibleHeight} = this.state;

    return (
      <KeyboardAvoidingView style={{height: visibleHeight, flex: 1, flexDirection: 'column'}} behavior={"padding"}>
        <StatusBar barStyle={'light-content'} animated={true}/>
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        {this.renderHeader()}
        <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
        />
        <View style={[styles.selectedTags, this.state.selectedTags.length > 0 ? {height: 60, padding: 10} : {}]}>
          {this._renderSelectedTags()}
          <TouchableOpacity  onPress={() => this.props.closeModal(this.state.selectedTags)}>
            {this.state.selectedTags.length > 0 ? 
              <Text style={{color: Colors.white, fontFamily: 'roboto-bold', fontSize: 18, paddingRight: 10, marginTop: 8}}>Done</Text> 
            : null }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: Colors.main,
    padding: 0,
    margin: 0,
    flexDirection: 'row',
  },
  selectableDisplayPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10
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
      backgroundColor: Colors.white,
      height: 100
  }
});