import React from 'react';
import { StyleSheet, FlatList, Platform, fontWeight, 
    Image, backgroundColor, Text, fontFamily, fontSize, View, 
    Button, TouchableHighlight, TextInput, TouchableOpacity, 
    Alert, ScrollView, Dimensions, Modal} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {Font, AppLoading} from 'expo';

import {MenuIcons} from './helpers/index';

import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';
import ContextualActionsMenu from './common/ContextualActionsMenu';

import Router from '../navigation/Router';

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import {TaskAvatar} from '../constants/StyleSheetCommons';

import AppSettings from './helpers/index';
import ApplicationConfig from './helpers/appconfig';
import CreateTask from './common/create-task';

const {width, height} = Dimensions.get('window');
const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'Survey', active: true, disabled: true}, 
    {title: 'Post', active: true, disabled: true}, 
    {title: 'Task', selected: true, active: true},
    {title: 'Done', active: true, selected: false}];

export default class MainToDo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newTaskModal: false,
            isReady: false,
            contextualMenuActions: [{title: 'Approva 1 file', image: MenuIcons.THUMB_UP, onPress: () => {}}, 
                                    {title: 'Rigetta 1 file', image: MenuIcons.THUMB_DOWN, onPress: () => {}}, 
                                    {title: 'Alert', image: MenuIcons.ALERT, onPress: () => {}},
                                    {title: 'Commenta task', image: MenuIcons.COMMENT, onPress: () => {}},
                                    {title: 'Cronologia Notifiche Store per singolo task', featureName: 'Cronologia Notifiche', image: MenuIcons.HISTORY, disabled: true, onPress: () => {}}]
        }
    }

    componentDidMount() {
        this.loadFonts();

        for (i in filters) {
            if (filters[i].title == 'Survey') {
                filters[i].onPress = () => this._noOpSurveyInFilter.toggleState();
            }

            if (filters[i].title == 'Post') {
                filters[i].onPress = () => this._noOpPosts.toggleState();
            }
        }
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
        //     'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
        //     'roboto-bolditalic': require('../assets/fonts/Roboto-BoldItalic.ttf')
        // });

        this.setState({isReady: true});
    }

    openContextualMenu(index) {
        this.contextualMenu.toggleState();
    }

    navigateToCollabView() {
        //ApplicationConfig.getInstance().index.hideSearchBar();
        //this.props.navigator.push(Router.getRoute('collabView'), {navigator: this.props.navigator});
        ApplicationConfig.getInstance().index.props.navigation.navigate("CollabView");
    }

    navigateToTaskSummary() {
        //ApplicationConfig.getInstance().index.hideSearchBar();
        //this.props.navigator.push(Router.getRoute('collabView'), {navigator: this.props.navigator});
        ApplicationConfig.getInstance().index.props.navigation.navigate("TaskSummary", {
            theme: {name: ''},
            environment: {}
        });
    }

    renderCardTitle() {
        return (
            <View style={[TaskAvatar.avatarContainer]}>
                <View style={[TaskAvatar.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.taskThumbnail} source={{uri: 'https://media.timeout.com/images/103399489/image.jpg'}} />
                </View>
                <View style={[TaskAvatar.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.profile} source={require('./img/dp2.jpg')}/>
                </View>
                <TouchableOpacity style={TaskAvatar.nameContainer} onPress={() => this.navigateToTaskSummary()}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={TaskAvatar.name}>Task #Theme</Text>
                        <Text style={[TaskAvatar.environment, {color: '#3FD1EB'}]}>
                            @Ambiente
                        </Text>
                    </View>
                    <Text style={TaskAvatar.time}>User made the action - Date Hour</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openContextualMenu(1)} style={{position: 'absolute', right: 0, top: -10}}>
                    <Ionicons name="ios-more-outline" color={Colors.main} size={30} />
                </TouchableOpacity>
            </View>
        );
    }

    renderSectionTitle() {
        return (
            <View style={styles.subContainer}>
                <Text style={styles.Today}>Today</Text>
                <TouchableOpacity onPress={() => this.openNewTaskModal()}>
                    <Text style={styles.taskButton}>+ NewTask</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderElements() {
        var arr = [0,1,2,3,4,5,6,7,8,9];

        //https://static.highsnobiety.com/wp-content/uploads/2017/08/28095937/fake-yeezy-store-china-01-320x213.jpg

        return arr.map((obj, i) => {
            return <View key={i}>
                <View style={[styles.SingleTaskContainer, Shadow.cardShadow]}>
                    {this.renderCardTitle()}
                </View>
                <View>
                    <ScrollView style={styles.TaskMediaContainer} showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        <TouchableOpacity onPress={() => this.navigateToCollabView()} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Image source={{uri: 'http://www.programmatic-rtb.com/wp-content/uploads/2017/10/store.png'}}
                                style={{height:65,
                                    width:65,
                                    borderRadius:10}} />
                            <View style={[styles.statusIcon, Shadow.smallCardShadow]}>
                                <View style={[{backgroundColor: 'green'}, styles.innerStatusIcon]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.navigateToCollabView()} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Image source={{uri: 'http://www.programmatic-rtb.com/wp-content/uploads/2017/10/store.png'}}
                                style={{height:65,
                                    width:65,
                                    borderRadius:10}} />
                            <View style={[styles.statusIcon, Shadow.smallCardShadow]}>
                                <View style={[{backgroundColor: Colors.main}, styles.innerStatusIcon]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.navigateToCollabView()} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Image source={{uri: 'http://www.programmatic-rtb.com/wp-content/uploads/2017/10/store.png'}}
                                style={{height:65,
                                    width:65,
                                    borderRadius:10}} />
                            <View style={[styles.statusIcon, Shadow.smallCardShadow]}>
                                <View style={[{backgroundColor: 'red'}, styles.innerStatusIcon]}></View>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>            
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                    </ScrollView>
                </View>
            </View>
        });
    }

    openNewTaskModal() {
        //newTaskModal
        this.setState({newTaskModal: true});
    }

    newTaskHandler() {
        this.setState({newTaskModal: false});
    }

    renderNewTaskModal() {
        return <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.newTaskModal}
            onRequestClose={() => this.setState({newTaskModal: false})}>
            <CreateTask closeModal={(obj) => this.newTaskHandler(obj)} 
                handleTypeChange={() => {}}/>
        </Modal>
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />;
        // }

        return (
            <ScrollView style={styles.mainContainer}>
                <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"To Do List"} />
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurveyInFilter = noOpModal} />
                    <NoOpModal featureName={"Post"} ref={(noOpModal) => this._noOpPosts = noOpModal} />
                </View>
                {this.renderSectionTitle()}
                {this.renderElements()}
                <ContextualActionsMenu ref={e => this.contextualMenu = e} buttons={this.state.contextualMenuActions} />
                {this.renderNewTaskModal()}
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({

    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#F7F7F7',
    },
    subContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 0,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width,
        height: 100
    },
    Today:{
        marginTop: 19,
        paddingBottom: 10,
        fontSize: 14,
        marginLeft: 20,
        color:'#9a9a9a',
        fontFamily: 'roboto-bolditalic'
    },

    taskButton:{ 
        position: 'absolute',
        right: 10,
        marginTop: 19,
        fontSize: 14,
        marginRight: 20,
        color: Colors.main,
        fontFamily: 'roboto-bold'
    },
    
    SingleTaskContainer:{
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

    TaskMediaContainer:{
        flexDirection: 'row',
        position: 'absolute',
        top: -95,
        width: width,
        height: 100,
        zIndex: 9999
    },

    TaskMedia:{
        marginRight:7,
        backgroundColor:'white',
        height:65,
        width:65,
        borderRadius:10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'

    },
    TaskMediaIcon: {
        color:'#9E9E9E',
        opacity:0.5,
        margin:5
    },

    statusIcon: {
        position: 'absolute', 
        alignContent:'center', 
        justifyContent: 'center', 
        top: 45,
        left: 45, 
        backgroundColor: Colors.white, 
        borderRadius: 7, 
        width: 14, 
        height: 14
    },

    innerStatusIcon: {
        borderRadius: 4.5, 
        width: 9,
        height: 9,
        marginLeft: 2.5
    }
}
);