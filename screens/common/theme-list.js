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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import ImageBrowser from '../ImageBrowser';
import SingleImage from './single-image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { isIphoneX } from '../helpers';

import _ from 'lodash';
import Shadow from '../../constants/Shadow';
import ExtendedStatus from './ExtendedStatus';
import {AWS_OPTIONS} from '../helpers/appconfig';
import {RNS3} from 'react-native-aws3';

const {width, height} = Dimensions.get('window');

var themes = [];
var themesToShow = themes;
var currentCategory = "themes";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ThemeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themeSource: ds.cloneWithRows(themesToShow),
      selectedThemes: [],
      isReady: false,
      creatingNew: false,
      imageBrowserOpen: false,
      photos: [],
      themeDescription: '',
      visibleHeight: height,
      backgroundUploaded: false
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

    this.loadFonts();
  }

  async loadFonts() {
    // await Font.loadAsync({
    //   'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
    //   'roboto-regular': '../../assets/fonts/Roboto-Regular.ttf',
    //   'roboto-bold': '../../assets/fonts/Roboto-Bold.ttf'
    // });

    this.loadThemes();
    this.setState({isReady: true});
  }

  async loadThemes() {
    await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getthemes")
    .then((response) => {return response.json()})
    .then((responseJson) => {
        if (responseJson == "") {
            return;
        }

        var ths = [];
        //{title: '# NewCollection', img: {url: 'https://media.timeout.com/images/103399489/image.jpg'}, id: 9}];

        var parsedResponse = JSON.parse(responseJson);
        parsedResponse.forEach(it => {
          ths.push({
            title: it.tagName, img: {url: 'https://s3.amazonaws.com/visualgotest-hosting-mobilehub-922920593/uploads/' + it.mediaUrl}, ...it
          })
        });
        this.setState({themeSource: ds.cloneWithRows(ths)});
        themes = ths;
    })
    .catch((error) => {
        console.error(error);
    });
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
    this.setState({themeSource: ds.cloneWithRows(themesToShow)});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: Colors.borderGray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
            <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    var filters = [{type: 'search', searchPlaceHolder: 'Search Themes', fixedOpen: true, autoFocus: false,
      onType: (v) => this.setState({themeSource: ds.cloneWithRows(themes.filter(it => it.title.toLowerCase().indexOf(v.toLowerCase()) >= 0))})}];
    return (<View style={styles.filterBarContainer}>
        <FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"} />
      </View>);
  }

  filterForThemes() {
    this.setState({themeSource: ds.cloneWithRows(themes)});
    currentCategory = 'themes';
    themesToShow = themes;
  }

  toggleRow(rowData) {
    rowData.selected = !rowData.selected;

    if(rowData.selected) {
      rowData.category = currentCategory;
      this.state.selectedThemes.push(rowData);
    } else {
      this.setState({selectedThemes: this.state.selectedThemes.filter(value => value != rowData)});
    }

    this.setState({themeSource: ds.cloneWithRows(themesToShow)});
    this.props.closeModal({themeName: rowData.title, photo: rowData.img, id: rowData.id});
  }

  renderSelectableComponent(data) {
    data.selected = false;

    if (data.img == undefined) {
      return (
        <Ionicons name='ios-checkmark-circle-outline' 
              size={24} color={Colors.gray} />
      );
    }

    return (
      <Image source={{uri: data.img.url}} style={styles.selectableDisplayPicture} />
    );
  }

  renderThemeRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.toggleRow(data)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={styles.rowTitle}>{data.title}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderThemeRow(data)} noborder={true} />
  }

  async uploadBackground() {
    RNS3.put(this.state.photos[0], AWS_OPTIONS)
    .then(response => {
        if (response.status !== 201) {
            throw new Error("Failed to upload image to S3");
        }

        this.setState({backgroundUploaded: true});
        this.pushTheme();
    })
    .catch(function(error) {
        console.log(error);
    });
  }

  pushTheme() {
    console.log("pushing theme onto the server");

    if (!this.state.backgroundUploaded) {
      console.log("uploading background");
      this.uploadBackground();
    } else if (this.state.backgroundUploaded) {
      console.log("uploading theme");

      fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/themes/createtheme', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: {
            name: this.state.themeDescription,
            description: "",
            mediaurl: this.state.photos[0].name
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {console.log("theme id: " + response); this.props.closeModal({themeName: this.state.themeDescription, photo: this.state.photos[0], id: response})})
      .catch(e => {
          console.error("error: " + e);
      })
    }
  }

  renderSaveBar() {
    return (
      <View style={[styles.bottomBar]}>
          <TouchableOpacity onPress={() => {this.pushTheme()}}>
              <Text style={styles.saveButton}>Save and Select</Text>
          </TouchableOpacity>
      </View>
    )
  }

  onNewDone(value, photos) {
    if (value != this.state.themeDescription) {
      this.setState({themeDescription: value});
    }

    if (photos != this.state.photos) {
      this.setState({photos: photos});
    }
  }

  render() {
    // if (!this.state.isReady) {
    //   return <AppLoading />
    // }

    return (
      <KeyboardAvoidingView style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}} behavior={"padding"}>
        <StatusBar barStyle={'light-content'} animated={true}/>
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        {this.renderHeader()}
        <ExtendedStatus onStateChange={(v) => this.setState({creatingNew: v})}
          onDone={(value, photos) => {this.onNewDone(value, photos)}} />
        <ScrollView>
          {!this.state.creatingNew ?  
            this.renderFilters() : null}
          {!this.state.creatingNew ? <ListView
            style={styles.listView}
            onScroll={this._onScroll}
            dataSource={this.state.themeSource}
            renderRow={(data) => this._renderRow(data)}
          /> : null}
        </ScrollView>
        { (this.state.photos.length == 0 || this.state.themeDescription == '' 
        || this.state.themeDescription.trim() == '#') ?
            null : this.renderSaveBar()
        }
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
    fontFamily: 'roboto-bold',
    fontSize: 20,
    color: 'black'
  },
  selectedThemes: {
    padding: 0,
    margin: 0,
  },
  selectableDisplayPicture: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginLeft: 10
  },
  filterBarContainer: {
      backgroundColor: Colors.white
  },
  bottomBar: {
    backgroundColor: Colors.main,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    height: "auto"
  },
  saveButton: {
    fontFamily: 'roboto-bold',
    color: Colors.white,
    fontSize: 16,
    marginRight: 10,
    width: 180,
    textAlign: 'right'
  },
});