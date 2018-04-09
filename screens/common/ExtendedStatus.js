
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
  Platform,
  Dimensions,
  ScrollView } from 'react-native';

// import {Font, AppLoading} from 'expo';

import DefaultRow from './default-row';
import FilterBar from './filter-bar';
import ImageBrowser from '../ImageBrowser';
import SingleImage from './single-image';
import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entyp from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {getFileExtension} from '../helpers';

import _ from 'lodash';

const {width, height} = Dimensions.get('window');

export default class ExtendedStatus extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            creatingNew: false,
            photos: [],
            textValue: '',
            imageBrowserOpen: false
        };
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
        //     'roboto-regular': '../../assets/fonts/Roboto-Regular.ttf',
        //     'roboto-bold': '../../assets/fonts/Roboto-Bold.ttf'
        // });

        this.setState({isReady: true});
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
    
          let newPhotos = [];
          photos.forEach(element => {
              newPhotos.push({url: element.uri != null ? element.uri : element.file, md5: element.md5, 
                name: element.md5 + '.' + getFileExtension(element),
                type: "image/" + getFileExtension(element)});
          });
    
          this.setState({
            imageBrowserOpen: false,
            photos: newPhotos
          });

          this.onDone();
        }).catch((e) => console.log(e))
    }
    
    _renderImagePickerModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.imageBrowserOpen}
                onRequestClose={() => this.setState({imageBrowserOpen: false})}>
                
                <ImageBrowser max={1} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }
    
    editThemeName(v) {
        if (v == undefined || v == '' ||  v == ' ' || v == '#') {
          v = '# ';
        }
    
        if (v.indexOf('#') < 0) {
          v = '# ' + v;
        }

        if (this.state.textValue != v) {
            this.setState({textValue: v});
        }

        this.onDone();
    } 

    cleanAll() {
        this.setState({textValue: '# ', photos: []});
        this.editThemeName(this.state.textValue);
    }


    getMenu() {
        return (<View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: Colors.borderGray, height: 50, padding: 16}}>
                <TouchableOpacity onPress={() => this.setState({imageBrowserOpen: true})} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <Text style={{height: 30, fontSize: 16, marginTop: 10, textAlignVertical: 'center', fontFamily: 'roboto-light'}}>
                        {this.state.photos.length == 1 ?  'Change #Theme Image' : 'Choose #Theme Image'}
                    </Text>
                    {this.state.photos.length != 1 ? <Text style={{color:'red', marginLeft: 3, marginTop: 7}}>*</Text> : null}
                    </View>
                    <EvilIcons name={"chevron-right"} size={24} color={Colors.main} />
                </TouchableOpacity>
            </View>)
    }

    toggleState() {
        var newState = !this.state.creatingNew;
        this.setState({creatingNew: newState});
        console.log("new State: " + newState);
        this.props.onStateChange(newState);
    }

    onDone() {
        var textValue = this.state.textValue;
        var photos = this.state.photos;

        this.props.onDone(textValue, photos);
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        this.editThemeName(this.state.textValue);

        if (!this.state.creatingNew) {
            return (
                <TouchableOpacity onPress={() => this.toggleState()}>
                    <View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: Colors.borderGray, flexDirection: 'row', height: 50,
                            justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                        <Text style={{height: 30, fontSize: 16, marginTop: 10, textAlignVertical: 'center', fontFamily: 'roboto-light'}}>
                            Create New #Theme
                        </Text>
                        <EvilIcons name={"chevron-right"} size={24} color={Colors.main} />
                    </View>
                </TouchableOpacity>
            )
        } else {
            /**/
            return <View>
                <View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: Colors.borderGray, flexDirection: 'column', height: 'auto',
                        justifyContent: 'flex-start', padding: 0}}>
                {this.state.photos.length == 1 ? 
                    <View style={{height: 240, width: width, position: 'relative', left: 0, zIndex: 10}}>
                        <SingleImage image={{uri: this.state.photos[0].url}} removeSingleVisibile={false}/>
                        <TextInput autoFocus={false} style={{height: 30, fontSize: 20, marginTop: 10, marginBottom: 10,
                            marginLeft: 20, 
                            position: 'absolute',
                            top: 100,
                            textAlign: 'center',
                            fontFamily: 'roboto-bold',
                            color: 'transparent', width: width - 70, zIndex: 15}}
                        placeholder={"New #Theme Name"} placeholderTextColor={Colors.white}
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        onChangeText={(textValue) => this.setState({textValue})}
                        value={this.state.textValue} />
                        <Text style={{zIndex: 14, color: Colors.white, position: 'absolute', marginLeft: 20, 
                            position: 'absolute', backgroundColor: 'transparent', fontFamily: 'roboto-bold',
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: {width: 1, height: 1},
                            textShadowRadius: 10,
                            top: 102, width: width - 70,height: 30, fontSize: 20, marginTop: 10, marginBottom: 10,
                            textAlign: 'center'}}>{this.state.textValue}</Text> 
                        <TouchableOpacity onPress={() => this.cleanAll()}
                        style={[{backgroundColor: Colors.white, height: 36, width: 36, borderRadius: 18, position: 'absolute',
                                top: 105, right: 20},
                        Shadow.filterShadow]}>
                        <EvilIcons name={"close"} size={22} color={Colors.main} style={{marginTop: 10, marginLeft: 7, zIndex: 17, backgroundColor: 'transparent'}}/>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={{flexDirection: 'row', height: 50, width: width, zIndex: 20, backgroundColor: 'transparent'}}>
                        <TextInput autoFocus={true} style={{height: 30, fontSize: 16, marginTop: 10, marginBottom: 10,
                                        marginLeft: 20, 
                                        fontFamily: 'roboto-light',
                                        color: Colors.main, width: width - 60, zIndex: 15}}
                            placeholder={"New #Theme Name"} placeholderTextColor={Colors.gray}
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            onChangeText={(textValue) => this.setState({textValue})}
                            value={this.state.textValue} />
                        <TouchableOpacity onPress={() => this.cleanAll()}>
                            <EvilIcons name={"close"} size={22} color={Colors.main}
                                style={{marginRight: 16, marginTop: 16, marginBottom: 10, zIndex: 17}}/>
                        </TouchableOpacity>
                    </View>
                }
                </View>
                {this.getMenu()}
                {this._renderImagePickerModal()}
            </View>
        }
    }
}