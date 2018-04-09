import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Switch,
    ListView,
    Platform,
    Modal,
    ScrollView,
    TouchableHighlight,
    KeyboardAvoidingView
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const backgroundColorsArray = ['#6923b6', '#7c71de', 
                               '#f7d6f0', '#0e3efb', '#d8b96a',
                               '#c32ebd', '#e488f1', '#3f075d',
                               '#198ab8', '#70d384'];

// import {Font, AppLoading} from 'expo';
import Colors from '../../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';

import ThemeList from './theme-list';
import EnvironmentsList from './environments-list';
import CalendarView from './calendar';
import PostPrivacy from './privacy';
import TagListTask from './tag-list-task';
import TaskDescription from './task-description';
import moment from 'moment';
import locale from 'moment/locale/it';
import FilterBar from './filter-bar';
import DisabledStyle from '../../constants/DisabledStyle';
import NoOpModal from './NoOpModal';
import Shadow from '../../constants/Shadow';
import {TaskAvatar} from '../../constants/StyleSheetCommons';
import nodeEmoji from 'node-emoji';
import DefaultRow from './default-row';
import { isIphoneX } from '../helpers';
import { AWS_OPTIONS } from '../helpers/appconfig';

const messages = [{from: {name: 'John', image: require('../img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('../img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('../img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem', read: false, date: new Date()},
                {from: {name: 'John', image: require('../img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('../img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('../img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

export default class TaskDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleHeight: height,
            k_visible: false,
            backgroundColors: ds.cloneWithRows(backgroundColorsArray),
            themeModal: false,
            tagListTastModal: false,
            environmentModal: false,
            privacyModal: false,
            guidelineDescriptionModal: false,
            addPhotoSelected: true,
            addVideoSelected: false,
            add360Selected: false,
            selectedTheme: {},
            allEnvironments: [],
            allTags: [],
            countPhoto: 1,
            countVideo: 0,
            count360: 0,
            start: undefined,
            due: undefined,
            clustersVisible: false,
            storeVisible: false,
            managerVisible: false,
            assignTo: false,
            headTitle: 'Clusters',
            taskDescription: '',
            commentsEnabled: false,
            notificationsEnabled: false,
            isReady: false,
            showTaskComment: false,
            messages: ds.cloneWithRows(messages),
            newCommentOnFocus: false
        }
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-light': require('../../assets/fonts/Roboto-Light.ttf')
        // });

        this.setState({isReady: true});
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
            this.setState({visibleHeight: newSize, k_visible: true})
    }

    keyboardWillHide (e) {
        if(this.componentDidMount) {
            this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
        }

    }

    goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    renderHeader() {
        var {data} = this.props.navigation.state.params;

        return (
            <View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingLeft: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
                <View style={{flex:1}}>
                    <Image style={{flex: 1, height: 48, width: width, 
                                    position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                    source={{uri: AWS_OPTIONS.bucketAddress + data.album.post.medias[0].url}} />
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 4, paddingTop: 5}}>
                            <TouchableOpacity onPress={() => this.goBack()}>
                                <EvilIcons name={"close"} size={22} color={Colors.main}/>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                                <Text style={styles.name}>Task {data.theme.tagName}</Text>
                                <Text style={[styles.environment, {color: data.environment.mediaUrl}]}>
                                    {data.environment.tagName}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{marginTop: 3, marginRight: 10}}>
                            <Image source={require("../../assets/images/icons/twoCards.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderFilters() {
        filters = [{type: 'search', searchPlaceHolder: '', visible: false},
            {title: 'Stats', icon: 'ios-podium-outline', onPress: () => {}, active: true},
            {title: 'Summary', selected: true, active: true}, 
            {title: 'All Stores', selected: false, active: true}, 
            {title: 'Pending', selected: false, active: true}];
        
        return <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={""} customStyle={{height: 80, paddingTop: 0}}
                        innerStyle={{paddingLeft: 10}}/>
                </View>;
    }

    renderCommentSwitchRow() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Comments 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.commentsEnabled} onValueChange={(v) => this.setState({commentsEnabled: v})}/>
                </View>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Notification 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.notificationsEnabled} onValueChange={(v) => this.setState({notificationsEnabled: v})}/>
                </View>
                <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'roboto-light', marginTop: 6}}>
                            All
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderPrivacyModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.privacyModal}
                onRequestClose={() => this.setState({privacyModal: false})}>
                <PostPrivacy closeModal={() => this.setState({privacyModal: false})} />
            </Modal>
        );
    }

    renderGuidelineDescriptionModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.guidelineDescriptionModal}
                onRequestClose={() => this.setState({guidelineDescriptionModal: false})}>
                <TaskDescription closeModal={() => this.setState({guidelineDescriptionModal: false})} 
                    onDescriptionEntered={(description) => this.setState({taskDescription: description, guidelineDescriptionModal: false})} />
            </Modal>
        );
    }

    renderThemeModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.themeModal}
                onRequestClose={() => this.setState({themeModal: false})}>
                
                <ThemeList closeModal={(theme) => this.onThemeSelected(theme)} />
            </Modal>
        );
    }

    renderTagListTaskModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.tagListTastModal}
                onRequestClose={() => this.setState({tagListTastModal: false})}>
                
                <TagListTask clustersVisible={this.state.clustersVisible} storeVisible={this.state.storeVisible} 
                    managerVisible={this.state.managerVisible} headTitle={this.state.headTitle} closeModal={(tags) => this.finishTagListTask(tags)} />
            </Modal>
        );
    }

    renderText() {
        const {data} = this.props.navigation.state.params;
        
        return (
            <View style={{padding: 16, paddingBottom: 0}}>
                {this.renderTextAvatar()}
                <Text style={{height: 'auto', fontFamily: 'roboto-light', fontSize: 16, textAlign: 'left', paddingBottom: 5, marginBottom: 5}}
                    numberOfLines = {6}>
                    {data.name}
                </Text>
            </View>
        )
    }

    renderStores() {
        var arr = [0,1,2,3,4,5,6,7,8,9];

        return arr.map((obj, i) => {
            return <View>
                <View style={[styles.SingleStoreContainer, Shadow.cardShadow]}>
                    {this.renderCardTitle()}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', position: 'relative', top: 85}}>
                        <Image source={require("../../assets/images/icons/comment_filled_main.png")} 
                            style={{height: 12, width: 13, resizeMode: 'center'}} />
                    </View>
                </View>
                <View>
                    <ScrollView style={styles.StoreContainer} showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.StoreIcon}/>
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.StoreIcon}/>            
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.StoreIcon}/>                                        
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.StoreIcon}/>            
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.StoreIcon}/>                                        
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.StoreIcon}/>            
                        </View>
                        <View style={[styles.Store, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.StoreIcon}/>                                        
                        </View>
                    </ScrollView>
                </View>
            </View>
        });
    }

    renderCardTitle() {
        const {data} = this.props.navigation.state.params;
        return (
            <View style={[TaskAvatar.avatarContainer]}>
                <View style={[TaskAvatar.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.taskThumbnail} source={{uri: 'https://media.timeout.com/images/103399489/image.jpg'}} />
                </View>
                <View style={[TaskAvatar.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.profile} source={require('../img/dp2.jpg')}/>
                </View>
                <View style={TaskAvatar.nameContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={TaskAvatar.name}>Store ID</Text>
                    </View>
                    <Text style={TaskAvatar.time}>Time</Text>
                </View>
                <Ionicons name="ios-more-outline" color={Colors.main} size={30} style={{position: 'absolute', right: 0, top: -10}} />
            </View>
        );
    }

    renderStartDueDate() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} onPress={() => this.setState({calendarModal: true})}>
                    {this.state.start != undefined && this.state.due != undefined ?
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '200', paddingLeft: 2, paddingTop: 5, color: Colors.main}}>
                            {moment(this.state.start).locale("it").format("DD/MM/YYYY")} - {moment(this.state.due).locale("it").format("DD/MM/YYYY")}
                        </Text>
                    :
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={styles.rowTextStyle}>Start/Due Date</Text>
                    </View>}
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderPhoto() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({addPhotoSelected: !this.state.addPhotoSelected, countPhoto: 0})} 
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.addPhotoSelected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Foto</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: --this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={this.state.countPhoto > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addPhotoSelected) && (this.state.countPhoto > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.countPhoto > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countPhoto}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: ++this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={!this.state.addPhotoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addPhotoSelected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderVideo() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({addVideoSelected: !this.state.addVideoSelected, countVideo: 0})} 
                                      style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.addVideoSelected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Video</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: --this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={this.state.countVideo > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addVideoSelected) && (this.state.countVideo > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.countVideo > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countVideo}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: ++this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={!this.state.addVideoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addVideoSelected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render360() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({add360Selected: !this.state.add360Selected, count360: 0})} 
                                      style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.add360Selected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>360°</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({count360: --this.state.count360})}} style={{alignSelf: 'center'}} disabled={this.state.count360 > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.add360Selected) && (this.state.count360 > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.count360 > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.count360}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({count360: ++this.state.count360})}} style={{alignSelf: 'center'}} disabled={!this.state.add360Selected}>
                            <EvilIcons name={"plus"} color={(this.state.add360Selected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    prepareAssignToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    renderAssignTo() {
        const objs =
            [
                {
                    name: 'Assigned to',
                    onPress: () => this.prepareAssignToModal()
                }
            ];

        var {allTags} = this.state;

        if (allTags.length > 0) {
            var clustersLength = allTags.filter((row) => row.category == 'clusters').length;
            console.log(clustersLength);
            var clustersLabel = '';

            if (clustersLength > 1) {
                clustersLabel += clustersLength + " Clusters";
            } else if (clustersLength == 1) {
                clustersLabel += allTags.filter((row) => row.category == 'clusters')[0].title;
            }

            objs[0].name = "Assegnato a ";
            objs[0].innerName = clustersLabel;

            var managersLength = allTags.filter((row) => row.category == 'managers').length;
            console.log(managersLength);
            var managersLabel = '';

            if (managersLength > 1) {
                managersLabel += managersLength + " Managers";
            } else if (managersLength == 1) {
                managersLabel += allTags.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].innerName = managersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={[styles.rowTextStyle, {marginTop: 4}]}>{o.name}</Text>
                                {(allTags.length == 0 || clustersLength == 0) && false ? <Text style={{color: 'red', marginLeft: 5}}>*</Text> : null }
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontWeight: '500', paddingLeft: 5, paddingTop: 5}}>{o.innerName}</Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    prepareTaskAdminsModal() {
        this.setState({clustersVisible: false, storeVisible: false, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    renderTaskAdmins() {
        const objs =
            [
                {
                    name: 'Task Manager',
                    onPress: () => this._noOpModal != undefined ? this._noOpModal.toggleState() : {}
                }
            ];

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} 
                                      style={[{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}, DisabledStyle.disabled]}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={[styles.rowTextStyle, {marginTop: 4, color: Colors.main}]}>{o.name}</Text>
                                {false ? <Text style={{color: 'red', marginLeft: 5}}>*</Text> : null }
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, paddingLeft: 5, paddingTop: 0}}>{o.innerName}</Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                    <NoOpModal featureName={"Task administrators "} ref={(noOpModal) => this._noOpModal = noOpModal} />
                </View>
            )
        })
    }

    renderArchiveMenu() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={[styles.rowTextStyle, {color: Colors.main}]}>Archivia Task</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderDeleteMenu() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={[styles.rowTextStyle, {color: '#E64E17'}]}>Elimina Task</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderRow(data) {
        return <DefaultRow style={{padding: 0}} arguments={data} noborder={true}>
            {this.renderMessageRow(data)}
        </DefaultRow>
    }

    renderMessageRow(data) {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.rowContainer}>
                    <Image source={data.from.image} style={styles.selectableDisplayPicture} />
                    <View style={styles.textInRow}>
                        <Text style={[styles.rowTitle, !data.read ? styles.unreadMessage : {}]}>{data.from.name}
                            <Text style={styles.rowSubTitle}> {data.message}</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>);
      }

    renderTaskComment() {
        var {height, visibleHeight} = this.state;

        if (this.state.showTaskComment) {
            return (
                    <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {}}>
                        <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
                            <TouchableHighlight
                            style={styles.taskCommentVisibleContainer}
                            onPress={() => {
                                this.setState({showTaskComment: false});
                            }}>
                            <View style={[styles.commentContainer, Shadow.cardShadow]}>
                                <View style={[styles.rowCommentContainer, Shadow.filterShadow]}>
                                    <View>
                                        <Text></Text>
                                    </View>
                                    <View>
                                        <Entypo name={"chevron-thin-down"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 110}} />
                                    </View>
                                    <View>
                                        <Text style={[styles.taskTextStyle]}>Task Comment</Text>
                                    </View>
                                </View>
                                <ListView
                                    style={styles.listView}
                                    onScroll={this._onScroll}
                                    dataSource={this.state.messages}
                                    renderRow={(data) => this._renderRow(data)}
                                    enableEmptySections={true}/>
                                <View style={[styles.newMessageAreaContainer, Shadow.filterShadow]}>
                                    <View style={styles.textBoxContainer}>
                                        <TextInput style={styles.textArea} ref='newMessageTextInput'
                                            onChangeText={(arg) => this.setState({newMessage: arg})}
                                            placeholder={'Scrivi un commento...'}
                                            value={this.state.newMessage}
                                            underlineColorAndroid={'rgba(0,0,0,0)'} onFocus={() => this.setState({newCommentOnFocus: true})}
                                            onBlur={() => this.setState({newCommentOnFocus: false})}/>

                                        {this.state.newCommentOnFocus?
                                            <TouchableOpacity>

                                            </TouchableOpacity>
                                        : null}
                                        
                                        <View style={{height: 26, width: 26, marginTop: 5, marginRight: 10}}>
                                            <Image
                                                style={{flex: 1, width: undefined, height: undefined}}
                                                source={require('../../assets/images/icons/camera.png')}
                                                resizeMode="contain"/>
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
                    <View style={[styles.taskCommentContainer, Shadow.cardShadow]}>
                        <View>
                            <Text></Text>
                        </View>
                        <View>
                            <Entypo name={"chevron-thin-up"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 110}} />
                        </View>
                        <View>
                            <Text style={[styles.taskTextStyle, {backgroundColor: 'transparent'}]}>Task Comment</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderSelectedTag(data){
        return (
            <Text style={{color: Colors.main, paddingLeft: 8}}>{data.title}</Text>
        );
    }

    onThemeSelected(themes) {
        this.setState({selectedTheme: themes, themeModal: false});
    }

    finishTagListTask(tags) {
        this.setState({allTags: tags, tagListTastModal: false});
    }

    finishEnvironments(environments) {
        console.log("received environments: " + environments.length);
        this.setState({allEnvironments: environments, environmentModal: false});
    }

    renderEnvironmentsModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.environmentModal}
                onRequestClose={() => this.setState({environmentModal: false})}>
                
                <EnvironmentsList closeModal={(environments) => this.finishEnvironments(environments)} />
            </Modal>
        );
    }

    _getDocuments() {
        try {
            Expo.DocumentPicker.getDocumentAsync({});
        } catch (e) {
            
        }
    }

    renderUploadAttach() {
        var {data} = this.props.navigation.state.params;

        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this._getDocuments()} disabled={true} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16, marginTop: 10}}>
                        <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                            <Image style={styles.taskThumbnail} source={{uri: data.album.post.medias[0].url}} />
                        </View>
                        <Text style={styles.name}>{data.theme.tagName}</Text>
                        <Text style={[styles.environment, {color: data.environment.mediaUrl}]}>
                            {data.environment.tagName}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                        <Ionicons name={"ios-attach"} color={Colors.main} size={32} style={{marginRight: 5, marginTop: 2}} />
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10, marginTop: 5}} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderTextAvatar() {
        const {data} = this.props.navigation.state.params;
        console.log("data: " + JSON.parse(data.profile));
        const profile = JSON.parse(data.profile);
        moment.locale("it");

        return (
            <View style={styles.textAvatarContainer}>
                <Image source={require('../img/me.png')} style={styles.profile}/>
                <View style={{flexDirection:'column'}}>
                    <Text style={styles.titleAvatar}>{profile.name} {profile.surname}</Text>
                    <Text style={styles.subtitleAvatar}>{moment(new Date(data.created)).format("D MMMM [alle ore] HH:mm")}</Text>
                </View>
            </View>
        )
    }

    prepareAssignToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Clusters', tagListTastModal: true});
    }

    prepareTaskAdminsModal() {
        this.setState({clustersVisible: false, storeVisible: false, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        const {data} = this.props;
        
        if (false) { //if filters.
            return (
                <View style={{height: this.state.visibleHeight}}>
                    <StatusBar barStyle={'default'} animated={true}/>
                    {this.renderHeader()}
                    <ScrollView>
                        {this.renderFilters()}
                        {this.renderStores()}
                    </ScrollView>
                </View>
            )
        } else {
            return (
                <View style={{height: this.state.visibleHeight, backgroundColor: Colors.white}}>
                    <StatusBar barStyle={'light-content'} animated={true}/>
                    { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
                    
                    {this.renderHeader()}
                    <ScrollView>
                        {this.renderFilters()}
                        
                        {this.renderCommentSwitchRow()}
                        <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                            {this.renderText()}
                        </View>
                        {this.renderUploadAttach()}
                        {this.renderStartDueDate()}
                        {this.renderPhoto()}
                        {this.renderVideo()}
                        {this.render360()}
                        {this.renderAssignTo()}
                        {this.renderTaskAdmins()}
                        {this.renderArchiveMenu()}
                        {this.renderDeleteMenu()}
                    </ScrollView>
                    {this.renderTaskComment()}
                    {this.renderThemeModal()}
                    {this.renderEnvironmentsModal()}
                    {this.renderPrivacyModal()}
                    {this.renderTagListTaskModal()}
                    {this.renderGuidelineDescriptionModal()}
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundColorsItem: {
        height: 20,
        width: 20,
        backgroundColor: Colors.tintColor,
        margin: 4,
        borderRadius: 4
    },

    backgroundColors: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        backgroundColor: Colors.white,
    }, 

    backgroundColorsAssignTo: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: Colors.white
    }, 

    backgroundColorsAdmins: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: Colors.white
    }, 

    img: {
        width: 40,
        height: 40
    },

    icon: {
        marginLeft: 10
    },

    switchAndroid:{
        height: 24, 
        marginLeft: 5, 
        marginBottom: 5,
        
    },

    viewAndroid:{
        flexDirection: 'row'
    },

    selectedTheme: {
        color: Colors.main,
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 5,
        paddingTop: 5,
        fontFamily: 'roboto-light'
    },

    name: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'roboto-bold',
        height: 16
    },
    
    environment: {
        fontSize: 14,
        height: 16,
        color: 'black',
        fontFamily: 'roboto-bold',
        marginLeft: 4
    },

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 4
    },

    filterBarContainer: {
        borderBottomColor: Colors.borderGray,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 65
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
        marginTop: -6,
        marginRight: 6
    },

    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 26,
        width: 26,
        borderRadius: 4,    
    },

    textAvatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: -10
    },

    profile: {
        backgroundColor: 'transparent',
        marginLeft: 0,
        height: 38,
        width: 38,
        borderRadius: 19
    },

    titleAvatar: {
        flex: 1,
        fontSize: 16,
        height: 23,
        marginLeft: 8,
        marginTop: 15,
        color: '#000000',
        fontFamily: 'roboto-light'
    },

    subtitleAvatar: {
        flex: 1,
        fontSize: 12,
        height: 23,
        marginLeft: 8,
        marginTop: -16,
        color: '#999999',
        fontFamily: 'roboto-light'
    },

    StoreContainer:{
        flexDirection: 'row',
        position: 'absolute',
        top: -95,
        width: width,
        height: 100,
        zIndex: 9999
    },

    Store:{
        marginRight:7,
        backgroundColor:'white',
        height:65,
        width:65,
        borderRadius:10,
        padding:5,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'

    },
    StoreIcon: {
        color:'#9E9E9E',
        opacity:0.5,
    },
    SingleStoreContainer:{
        marginLeft:10,
        marginRight:10,
        backgroundColor:'white',
        marginTop:10,
        height:160,
        borderRadius:20,
        padding:15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    taskCommentContainer:{
        paddingRight: 5,
        height: 40,
        backgroundColor: Colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    taskTextStyle: {
        padding: 13,
        margin: 0,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'roboto-regular',
        color: '#FFFFFF',
        backgroundColor: 'transparent'
    },
    
    taskCommentVisibleContainer: {
        marginTop: 65, 
        backgroundColor: 'rgba(256,256,256, 0.84)', 
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'center', 
        height: height, 
        width: width
    },

    commentContainer: {
        padding: 5,
        bottom: 0,
        position: 'absolute',
        height: 375, 
        backgroundColor: '#FFFFFF', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width
    },

    rowCommentContainer: {
        paddingRight: 5,
        top: 0,
        position: 'absolute',
        height: 40, 
        backgroundColor: Colors.main, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    rowContainer: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'row'
    },

    selectableDisplayPicture: {
        width: 41,
        height: 41,
        borderRadius: 20.5
    },

    textInRow: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 0,
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        padding: 5
    },

    rowTitle: {
        paddingLeft: 5,
        fontFamily: 'roboto-regular',
        fontSize: 12,
        paddingTop: 1,
        backgroundColor: 'transparent'
    },

    newMessageAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        marginLeft: -5,
        marginBottom: -5,
        backgroundColor: '#FFFFFF',
        width: width
    },

    rowSubTitle: {
        fontFamily: 'roboto-regular',
        color: '#9A9A9A',
        fontSize: 12,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 4,
        backgroundColor: 'transparent',
        width: width - 120
    },
    
    messageDate: {
        paddingTop: 17
    },

    listView: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        bottom: 0,
        marginTop: 40,
        paddingBottom: 10
    },

    textBoxContainer: {
        width: width - 115,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: Colors.main,
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        marginRight: 10,
        marginTop: 10,
        marginLeft: 10
    },

    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 120 - 22,
        height: 40,
        paddingLeft: 15,
        paddingRight: 15,
    },

    cameraEmoticon: {
        marginTop: 9,
        marginRight: 0,
        backgroundColor: 'transparent'
    }
});