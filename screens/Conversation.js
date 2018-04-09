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
    Keyboard,
    Button,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';
import AppSettings from './helpers/index';
import ApplicationConfig from './helpers/appconfig';
import Shadow from '../constants/Shadow';

// import {Font, AppLoading} from 'expo';
import PubNubReact from 'pubnub-react';
import ChatEngine from 'chat-engine';
import { uuid } from './helpers/index';

/*
var messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'me', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];
*/


                  
var themes = [
                {name: "San Valentino", image: require('./img/elmo.jpg')},
                {name: "Saldi Febbraio", image: require('./img/bob.png')},
                {name: "New Collection", image: require('./img/cookiemonster.jpeg')},
                {name: "Flowers Theme", image: require('./img/elmo.jpg')}
    
             ];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

export default class Conversation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //convoMessages: ds.cloneWithRows(messages),
            themesData: ds.cloneWithRows(themes),
            visibleHeight: height,
            newMessage: '',
            contentLayout: {},
            showThemes: false,
            isReady: false
        }

    }

    _goBack() {
        ApplicationConfig.getInstance().index.showSearchBar();
        //AppSettings.appIndex.showSearchBar();
        this.props.navigator.pop();
    }

    _closeThemes(){
        this.setState({showThemes: false})
    }

    messageTextChanged(text){
        this.setState({newMessage: text});
        var stringText = text + "";

        if (stringText.length > 0) {
            if(stringText[stringText.length-1] == '#'){
                this.setState({showThemes: true})

            }else{
                this.setState({showThemes: false})

            }
        }else{
            this.setState({showThemes: false})
        }

    } 

        
    componentWillMount() {
        this.pubnub = new PubNubReact({
            publishKey: 'pub-c-b8fd1056-99b5-4f8b-8986-ce1ab877240b',
            subscribeKey: 'sub-c-f10175d6-fa3c-11e7-8a22-26ec4b06f838',
            uuid: uuid
        });

        this.pubnub.init(this);

        this.pubnub.subscribe({ channels: ['channel1'], triggerEvents: true, withPresence: true});
    }
      
    componentWillUnmount() {
        this.pubnub.unsubscribe({ channels: ['channel1'] });
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-bold': '../assets/fonts/Roboto-Bold.ttf'
        // });

        this.setState({isReady: true});
    }

    componentWillUnmount() {

    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height;
        this.setState({visibleHeight: newSize, k_visible: true})
    }

    keyboardWillHide (e) {
        if(this.componentDidMount) {
            this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
        }
    }

    _renderHeader() {
        return (
            <View style={styles.headerView}>
                <EvilIcons name={"chevron-left"} size={30} color={Colors.main} onPress={() => this._goBack()} style={{width: 22}}/>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', width: width - 22}}>
                    <Text style={styles.viewTitle}>{this.props.route.params.convTitle}</Text>
                    <EvilIcons name={"chevron-right"} size={22} style={{width: 22, marginTop: 3}}/>
                </View>
            </View>);
    }

    _renderRow(data) {
        if (data.from.name != '') {
            return (
                <View style={styles.fromBubble}>
                    <Image source={data.from.image} style={styles.displayPicture} />
                    <View style={styles.messageBubble}>
                        <Text>{data.message}</Text>
                    </View>
                </View>);
        }

        return (
            <View style={styles.messageBubble}>
                <Text>{data.message}</Text>
            </View>);
    }

    _renderPubNubRow(data){
        if (data.publisher != uuid) {
            return (
                <View style={styles.fromBubble}>
                    <View style={styles.messageBubble}>
                        <Text>{data.message}</Text>
                    </View>
                </View>);
        }

        return (
            <View style={styles.messageBubble}>
                <Text>{data.message}</Text>
            </View>);
    }

    themeSelected(name){
        this.state.newMessage = this.state.newMessage + name + " ";
        this.setState({showThemes: false});
    }

    _renderThemesRow(data) {
        return (
            <TouchableOpacity onPress={() => this.themeSelected(data.name)}>
                <View style={styles.themeBubble}>
                    <Image source={data.image} style={styles.displayThemePicture} />
                    <View style={styles.themeName}>
                        <Text style={styles.themeLabel}># {data.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>);
    }

    _addMessage() {
        if (this.state.newMessage == "") {
            return;
        }
        
        var {newMessage} = this.state;
        //messages.push({from: {name: 'me', image: require('./img/elmo.jpg')}, message: newMessage, read: false, date: new Date()});

        this.pubnub.publish({ message: this.state.newMessage, channel: 'channel1' });

        //this.setState({convoMessages: ds.cloneWithRows(messages)});
        this.refs['newMessageTextInput'].clear();
        this.setState({newMessage: ""}); 
        this.refs['conversationCollection'].scrollToEnd();
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />;
        // }

        var {height, visibleHeight} = this.state;
        const messages = this.pubnub.getMessage('channel1');
        
        //console.log("Message(s): " + JSON.stringify(messages));

        return (
            <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
                <View
                    style={this.state.showThemes ? {} : {flex: 1}}
                    resetScrollToCoords={{x: 0, y: 0}}>
                        <StatusBar barStyle={'light-content'} animated={true}/>
                        <DefaultRow renderChildren={() => this._renderHeader()} />

                        

                        {!this.state.showThemes ?

                            

                            <ScrollView ref="conversationCollection" keyboardShouldPersistTaps='always' contentContainerStyle={{flexGrow: 1}} onLayout={(event) => {this.setState({contentLayout: event.nativeEvent.layout});}}>
                            <ListView
                                style={[styles.listView]}
                                onScroll={this._onScroll}
                                dataSource={ds.cloneWithRows(messages)}
                                renderRow={(data) => this._renderPubNubRow(data)}/>
                            </ScrollView>
                        
                        : null}
                </View>               


                <View style={this.state.showThemes ? {flex: 1, flexDirection: 'column'} : {}}>

                    {this.state.showThemes ?
                        <View style={{flex: 1, flexDirection: 'column', backgroundColor: Colors.lightGray, marginBottom: 0}}>
                            <EvilIcons name={"chevron-down"} size={40} onPress={() => this._closeThemes()} 
                                style={{width: 40, alignSelf: 'flex-end', marginRight: 10, marginTop: 5}}/>
                            <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='always'>
                                <ListView
                                    style={[styles.listView]}
                                    onScroll={this._onScroll}
                                    dataSource={this.state.themesData}
                                    renderRow={(data) => this._renderThemesRow(data)}/>
                            </ScrollView>
                        </View>
                    :null}

                    <View style={[messageBoxStyle.newMessageAreaContainer, this.state.showThemes ? {} : {}, this.state.k_visible ? {marginBottom: 20} : {marginBottom: 0}]}>
                        <View style={messageBoxStyle.attachmentBackground}>
                            <EvilIcons name={"chevron-right"} size={30} color={Colors.white} style={messageBoxStyle.attachmentButton}/>
                        </View>
                        <View style={messageBoxStyle.textBoxContainer}>
                            <TextInput style={messageBoxStyle.textArea} ref='newMessageTextInput'
                                onChangeText={(arg) => this.messageTextChanged(arg)}
                                value={this.state.newMessage}
                                underlineColorAndroid={'rgba(0,0,0,0)'} 
                                />
                            <SimpleLineIcons name={"emotsmile"} size={22} color={Colors.yellow} style={messageBoxStyle.openEmoticons} />
                        </View>
                        <TouchableOpacity style={messageBoxStyle.sendButton} onPress={() => this._addMessage()}>
                            <MaterialIcons name={"send"} size={30} color={Colors.main} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}


const messageBoxStyle = StyleSheet.create({
    newMessageAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
        borderTopColor: Colors.borderGray,
        borderTopWidth: 1
    },
    attachmentBackground: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.main,
        marginLeft: 10,
        marginRight: 10
    },
    attachmentButton: {
        padding: 0,
        marginTop: 8,
        marginLeft: 5,
        backgroundColor: 'transparent'
    },
    textBoxContainer: {
        width: width - 115,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: Colors.borderGray,
        backgroundColor: Colors.lightGray,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40,
        marginRight: 10
    },
    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 120 - 22,
        height: 40,
        paddingLeft: 15,
        paddingRight: 15,
    },
    openEmoticons: {
        marginTop: 9,
        marginRight: 10,
        backgroundColor: 'transparent'
    },
    sendButton: {
        marginTop: 7,
        marginRight: 10
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    listView: {
        paddingTop: 10,
        
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
    statusBlackBackground: {
        backgroundColor: Colors.black,
        height: 20,
        width: width
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
    displayThemePicture: {
        marginLeft: 10,
        marginRight: 15,
        height: 30,
        width: 30,
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: {
            height: 2,
            width: 0
        },
        elevation: 2
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
    themeName: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-end'
    },
    themeLabel: {
        fontSize: 24,
        fontFamily: 'roboto-bold',
        marginLeft: 15
    },
    fromBubble: {
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-start'
    },
    themeBubble: {
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
    }
});