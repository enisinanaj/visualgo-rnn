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
    TouchableHighlight,
    TouchableOpacity,
    Button,
    Keyboard,
    TextInput,
    Image,
    Platform,
    StatusBar,
    KeyboardAvoidingView
} from 'react-native';

import Drawer from 'react-native-drawer'
//import {Font, AppLoading} from 'expo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

//import { withNavigation } from '@expo/ex-navigation';
import RadialMenu from 'react-native-radial-menu';
import Pdf from 'react-native-pdf';

import Colors from '../constants/Colors';
import CommentBar from '../constants/commentBar';
import Shadow from '../constants/Shadow';
import Router from '../navigation/Router';
import DefaultRow from './common/default-row';
import AppSettings, { getFileExtension, getAddressForUrl } from './helpers/index';
import appconfig, { ApplicationConfig, AWS_OPTIONS } from './helpers/appconfig';

import _ from 'lodash';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem', read: false, date: new Date()},
                {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

export default class CollabView extends Component {
    _mounted = false;

    items = [
        {
          name: 'md-home',
          color: '#298CFF'
        },
        {
          name: 'md-search',
          color: '#30A400'
        },
        {
          name: 'md-time',
          color: '#FF4B32'
        },
        {
          name: 'md-settings',
          color: '#8A39FF'
        },
        {
          name: 'md-navigate',
          color: '#FF6A00'
        }
      ];
    
    constructor(props) {
        super(props);

        var viewData = ((this.props.navigation != undefined) && (this.props.navigation.state.params != undefined)) ? this.props.navigation.state.params : undefined;

        this.state = {
            isReady: false,
            showTaskComment: false,
            commentsEnabled: false,
            viewData: viewData,
            messages: ds.cloneWithRows([]),
            paddingBottomScrollV: 90,
            bottomDots: 100
        };
    }

    componentDidMount() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.loadFonts();
        this._mounted = true;
        {((this.state.viewData != undefined) && (this.state.viewData != {})) ? this.setState({paddingBottomScrollV: 0, bottomDots: 50}) : null}
    }
    
    async loadFonts() {
        this.setState({isReady: true});
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }

    reloadComments() {
        messages = [];

        this.setState({messages: ds.cloneWithRows(messages), newMessage: ''})
    }

    async postComment() {

        let taskComment = {
            commentpost: {
              iduser: "" + ApplicationConfig.getInstance().me.id,
              idpost: "" + this.props.navigation.state.params.idtask,
              comment: "" + this.state.newMessage,
              mediaurl: []
            }
        };

        await fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/commentpost', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskComment)
            })
            .then((response) => {
                console.warn("Create task result: " + JSON.stringify(response));
                this.reloadComments();
            })
            .catch(e => {
                console.error("error: " + e);
            })
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
            this.setState({visibleHeight: newSize, k_visible: true})
    }

    keyboardWillHide (e) {
        if(this._mounted) {
            this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
        }

    }

    goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    _renderRow(data) {
        return <DefaultRow style={{padding: 0}} arguments={data} noborder={true}>
            {this.renderMessageRow(data)}
        </DefaultRow>
    }

    renderMessageRow(data) {
        return (
            <View style={CommentBar.rowContainer}>
                <TouchableOpacity style={CommentBar.rowContainer}>
                    <Image source={data.from.image} style={CommentBar.selectableDisplayPicture} />
                    <View style={CommentBar.textInRow}>
                        <Text style={[CommentBar.rowTitle, !data.read ? CommentBar.unreadMessage : {}]}>{data.from.name}
                            <Text style={CommentBar.rowSubTitle}> {data.message}</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderPdf(url) {
        const source = {uri:url, cache:false};
        return (
            <View style={[styles.containerPdf, {height: height, width: width}]}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                    }}
                    onError={(error)=>{
                        console.error(error);
                    }}
                    style={styles.pdf}/>
            </View>
        );
    }

    renderCommentBar() {
        var {height, visibleHeight, viewData} = this.state;

        if ((viewData != undefined) && (viewData != {})) {
            return(null);
        }

        if (this.state.showTaskComment) {
            return (
                    <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {}}>
                        <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
                            <TouchableHighlight
                            style={CommentBar.taskCommentVisibleContainer}
                            onPress={() => {
                                this.setState({showTaskComment: false});
                            }}>
                            <View style={[CommentBar.commentContainer, Shadow.cardShadow]}>
                                <View style={[CommentBar.rowCommentContainer, Shadow.filterShadow]}>
                                    <View>
                                        <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>Store ID</Text>
                                    </View>
                                    <View>
                                        <Entypo name={"chevron-thin-up"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 25}} />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>1 Comment</Text>
                                        <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                                            <Image style={styles.taskThumbnail} source={{uri: 'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                                        </View>
                                    </View>
                                </View>
                                <ListView
                                    style={CommentBar.listView}
                                    onScroll={this._onScroll}
                                    dataSource={this.state.messages}
                                    renderRow={(data) => this._renderRow(data)}
                                    enableEmptySections={true}/>
                                <View style={[CommentBar.newMessageAreaContainer, Shadow.filterShadow]}>
                                    <View style={CommentBar.textBoxContainer}>
                                        <TextInput style={CommentBar.textArea} ref='newMessageTextInput'
                                            onChangeText={(arg) => this.setState({newMessage: arg})}
                                            placeholder={'Scrivi un commento...'}
                                            value={this.state.newMessage}
                                            underlineColorAndroid={'rgba(0,0,0,0)'} />
                                        
                                        <View style={{height: 26, width: 60, marginTop: 5, marginRight: 10, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                            <View style={{height: 26, width: 26, marginTop: 5, marginRight: 10}}>
                                                <Image
                                                    style={{flex: 1, width: undefined, height: undefined}}
                                                    source={require('../assets/images/icons/camera.png')}
                                                    resizeMode="contain"/>
                                            </View>

                                            {this.state.newCommentOnFocus || this.state.newMessage.length > 0 ?
                                                <TouchableOpacity onPress={() => this.postComment()} style={{marginLeft: 5, marginRight: 0}}>
                                                    <Ionicons name={"md-send"} color={Colors.main} size={24}/>
                                                </TouchableOpacity>
                                            : null}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            </TouchableHighlight>
                        </KeyboardAvoidingView>
                    </Modal>
            )    
        } else {
            return (
                <TouchableOpacity onPress={() => {this.setState({showTaskComment: true})}} >
                    <View style={[CommentBar.taskCommentContainer, Shadow.cardShadow]}>
                        <View>
                            <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>Store ID</Text>
                        </View>
                        <View>
                            <Entypo name={"chevron-thin-up"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 25}} />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>1 Comment</Text>
                            <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                                <Image style={styles.taskThumbnail} source={{uri: 'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderHeader() {
        return (
            <View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingLeft: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
                <View style={{flex:1}}>
                    <Image style={{flex: 1, height: 48, width: width, 
                                    position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                    source={{uri:'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 4, paddingTop: 5}}>
                            <TouchableOpacity onPress={() => this.goBack()}>
                                <EvilIcons name={"chevron-left"} size={22} color={Colors.main}/>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                                <Text style={styles.name}>Task #Theme</Text>
                                <Text style={[styles.environment, {color: '#3FD1EB'}]}>
                                    @Ambiente
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    approveMedia() {
        this.voteMedia(1);
    }

    disapproveMedia() {
        this.voteMedia(-1);
    }

    voteMedia(vote) {     
        var voteMedia = JSON.stringify({
            like: {
                idmedia: this.state.idMedia,
                iduser: appconfig.getInstance().me.id,
                like: vote
            }
        });

        console.log("mediaToTask body: " + addmedia2task);

        fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/posts/likepostmedia', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: voteMedia
        })
        .then((response) => {
            //change UI
            //show toast notification for action
        })
        .catch(e => {
            console.error("error: " + e);
        })
    }

    render() {
        const {viewData} = this.state;
        
        return (
            <View style={[{flex: 1}, styles.container]}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                {Platform.OS === 'ios' ? 
                    <View style={{height: 20, backgroundColor: Colors.main, width: width}}></View> 
                : null}
                {this.renderHeader()}
                <View style={[{flex: 1, paddingBottom: this.state.paddingBottomScrollV}, Shadow.filterShadow]}>
                    <ScrollView pagingEnabled={true} indicatorStyle={'default'} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {((viewData != undefined) && (viewData != {})) ?
                        (getFileExtension({uri: viewData.data.url}) == 'pdf') ? this.renderPdf(AWS_OPTIONS.baseBucketAddress + viewData.data.url) :
                            <Image source={{uri: getAddressForUrl(viewData.data.url)}} style={{height: null, width: width}} resizeMode={'cover'}/> :
                            <View>
                                <Image source={{uri: 'https://media.timeout.com/images/103399489/image.jpg'}} style={{height: height, width: width}} resizeMode={'cover'}/>
                                <Image source={{uri: 'https://amp.businessinsider.com/images/55a6caf42acae716008b7018-750-562.jpg'}} style={{height: height, width: width}} resizeMode={'cover'}/>
                                <Image source={{uri: 'http://retaildesignblog.net/wp-content/uploads/2012/11/VILA-Clothes-shop-by-Riis-Retail-Copenhagen.jpg'}} style={{height: height, width: width}} resizeMode={'cover'}/>
                            </View>
                        }
                    </ScrollView>
                    <View style={[{backgroundColor: Colors.white, height: 34, width: 34, borderRadius: 17, position: 'absolute', bottom: this.state.bottomDots, left: 20, justifyContent: 'center'}, Shadow.filterShadow]}>
                        <Entypo name={"dots-three-vertical"} color={Colors.main} size={20} style={{backgroundColor: 'transparent', marginLeft: 7}} />
                    </View>
                    {((viewData != undefined) && (viewData != {})) ? null :
                        <View style={{position: 'absolute', right: 30, bottom: 60}}>
                            <RadialMenu spreadAngle={180} startAngle={270} menuRadius={70}>
                                <View style={[styles.mainPinMenuButton, Shadow.filterShadow]}>
                                    <Image source={require('../assets/images/icons/thumb-left.png')}  style={{width: 22, height: 22, marginTop: 15}}/>
                                </View>
                                <View style={[styles.pinMenu, Shadow.filterShadow]} onSelect={(it) => this.disapproveMedia()}>
                                    <Feather name={"thumbs-down"} size={22} color={Colors.main} style={{width: 22, height: 22, backgroundColor: 'transparent', marginTop: 15}} />
                                </View>
                                <View style={[styles.pinMenu, Shadow.filterShadow]}>
                                    <Feather name={"download"} size={23} color={Colors.main} style={{width: 23, height: 23, backgroundColor: 'transparent', marginTop: 15}}/>
                                </View>
                                <View style={[styles.pinMenu, Shadow.filterShadow]}
                                    onSelect={(it) => this.approveMedia()}>
                                    <Feather name={"thumbs-up"} size={22} color={Colors.main} style={{width: 22, height: 22, backgroundColor: 'transparent', marginTop: 15}} />
                                </View>
                            </RadialMenu>
                        </View> }
                </View>
                {this.renderCommentBar()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },

    containerPdf: {
        flex: 1,
        marginTop: 0,
    },
    pdf: {
        flex:1
    },

    mainPinMenuButton: {
        backgroundColor: Colors.main, 
        height: 54, 
        width: 54,
        borderRadius: 27,
        justifyContent: 'center',
        flexDirection: 'row'
    },

    pinMenu: {
        backgroundColor: Colors.white, 
        height: 52, 
        width: 52, 
        borderRadius: 26, 
        justifyContent: 'center', 
        flexDirection: 'row'
    },

    name: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'Roboto-Bold',
        height: 16
    },
    
    environment: {
        fontSize: 14,
        height: 16,
        color: 'black',
        fontFamily: 'Roboto-Bold',
        marginLeft: 4
    },

    taskThumbnailContainer: {
        height: 30,
        width: 30,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginRight: 6
    },

    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 26,
        width: 26,
        borderRadius: 4,    
    },
});