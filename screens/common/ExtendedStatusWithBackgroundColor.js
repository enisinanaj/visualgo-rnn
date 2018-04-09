
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import _ from 'lodash';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');
const backgroundColorsArray = ['#6923b6', '#7c71de', 
                               '#f7d6f0', '#0e3efb', '#d8b96a',
                               '#c32ebd', '#e488f1', '#3f075d',
                               '#198ab8', '#70d384'];

export default class ExtendedStatus extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            creatingNew: false,
            photos: [],
            textValue: '',
            postBackgroundColor: '',
            backgroundColors: ds.cloneWithRows(backgroundColorsArray)
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
    
    editThemeName(v) {
        if (v == undefined || v == '' ||  v == ' ' || v == '@') {
          v = '@ ';
        }
    
        if (v.indexOf('@') < 0) {
          v = '@ ' + v;
        }
        
        if (this.state.textValue != v) {
            this.setState({textValue: v});
        }
        this.onDone();
    }

    renderColorBox(data) {
        return (
            <TouchableOpacity style={[styles.backgroundColorsItem, {backgroundColor: data}]} 
                onPress={() => {this.setState({postBackgroundColor: data}); this.onDone()}} />
        );
    }

    getMenu() {
        return (<View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: Colors.borderGray, height: 50, padding: 16, 
                            flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={{flex: 0.4, flexDirection: 'row'}}>
                    <Text style={{height: 30, fontSize: 16, textAlignVertical: 'center', fontFamily: 'roboto-light'}}>
                        {this.state.photos.length == 1 ?  'Assign color' : 'Assign color'}
                    </Text>
                    {this.state.postBackgroundColor == '' ? <Text 
                        style={{color:'red', marginLeft: 3, marginRight: 2, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.borderGray}}>
                        *</Text> : null}
                </View>
                <View style={{flex: 1, marginTop: -5, height: 30, marginLeft: 4}}>
                    <ListView
                        horizontal={true}
                        contentContainerStyle={styles.backgroundColors}
                        dataSource={this.state.backgroundColors}
                        renderRow={(data) => this.renderColorBox(data)}/>
                </View>
            </View>)
    }

    toggleState() {
        var newState = !this.state.creatingNew;
        this.setState({creatingNew: newState});
        this.props.onStateChange(newState);
    }

    cleanAll() {
        this.setState({textValue: '@ ', postBackgroundColor: ''});
        this.editThemeName(this.state.textValue);
    }

    onDone() {
        var textValue = this.state.textValue;
        var postBackgroundColor = this.state.postBackgroundColor;

        this.props.onDone(textValue, postBackgroundColor);
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
                            Create New @Environment
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
                {this.state.postBackgroundColor != '' ? 
                    <View style={{height: 240, width: width, position: 'relative', left: 0, zIndex: 10, backgroundColor: this.state.postBackgroundColor}}>
                        <TextInput autoFocus={false} style={{height: 30, fontSize: 20, marginTop: 10, marginBottom: 10,
                                marginLeft: 20, 
                                position: 'absolute',
                                top: 100,
                                textAlign: 'center',
                                fontFamily: 'roboto-bold',
                                color: 'transparent', width: width - 70, zIndex: 15}}
                            placeholder={"New @Environment Name"} placeholderTextColor={Colors.white}
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            onChangeText={(textValue) => this.setState({textValue})}
                            value={this.state.textValue} />
                        <Text style={{zIndex: 14, color: Colors.white, position: 'absolute', marginLeft: 20, 
                            position: 'absolute', backgroundColor: 'transparent', fontFamily: 'roboto-bold',
                            textShadowColor: 'rgba(0, 0, 0, 0.40)',
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
                            placeholder={"New @Environment Name"} placeholderTextColor={Colors.gray}
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
            </View>
        }
    }
}

const styles = StyleSheet.create({
    backgroundColorsItem: {
        height: 20,
        width: 20,
        backgroundColor: Colors.tintColor,
        margin: 4,
        marginTop: 0,
        borderRadius: 4
    },
    backgroundColors: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        backgroundColor: Colors.white
    }
});