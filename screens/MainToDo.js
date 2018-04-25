import React from 'react';
import { StyleSheet, FlatList, Platform, 
    Image, backgroundColor, Text, fontFamily, fontSize, View, 
    Button, TouchableHighlight, TextInput, TouchableOpacity, 
    Alert, ScrollView, Dimensions, Modal} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import locale from 'moment/locale/it'

import {MenuIcons, getAddressForUrl} from './helpers/index';
import { RNCamera } from 'react-native-camera';

import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';
import ContextualActionsMenu from './common/ContextualActionsMenu';

import Router from '../navigation/Router';

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import {TaskAvatar} from '../constants/StyleSheetCommons';

import AppSettings from './helpers/index';
import ApplicationConfig, { AWS_OPTIONS } from './helpers/appconfig';
import CreateTask from './common/create-task';
import ImageBrowser from './ImageBrowser';

const {width, height} = Dimensions.get('window');
const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'Survey', active: true, disabled: true}, 
    {title: 'Post', active: true, disabled: true}, 
    {title: 'Task', selected: true, active: true},
    {title: 'Done', active: true, selected: false}];

const notifications = [];

export default class MainToDo extends React.Component {

    constructor(props) {
        super(props);

        moment.locale("it")

        this.state = {
            newTaskModal: false,
            isReady: false,
            notifications: [],
            cameraPicsOpen: false,
            cameraModal: false,
            photos: [],
            contextualMenuActions: [{title: 'Approva 1 file', image: MenuIcons.THUMB_UP, onPress: () => {}}, 
                                    {title: 'Rigetta 1 file', image: MenuIcons.THUMB_DOWN, onPress: () => {}}, 
                                    {title: 'Alert', image: MenuIcons.ALERT, onPress: () => {}},
                                    {title: 'Commenta task', image: MenuIcons.COMMENT, onPress: () => {}},
                                    {title: 'Cronologia Notifiche Store per singolo task', featureName: 'Cronologia Notifiche', image: MenuIcons.HISTORY, disabled: true, onPress: () => {}}],
            addMediaMenuActions: [{title: 'Camera', image: MenuIcons.CAMERA, onPress: () => this.openCamera()}, 
                                    {title: 'Upload', image: MenuIcons.BROWSE, onPress: () => this.openImages()}, 
                                    {title: 'View task summary', image: MenuIcons.EYE, onPress: () => {}},
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

        this.loadNotifications();
    }

    async loadFonts() {
        this.setState({isReady: true});
    }

    async loadNotifications() {
        await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getnotifications?iduser=" + ApplicationConfig.getInstance().me.id)
        .then((response) => {return response.json()})
        .then((responseJson) => {
            return JSON.parse(responseJson);
        })
        .then(r => {
            var promises = [];

            r.forEach(post => {
                promises.push(new Promise((resolve, reject) => {
                    this.loadTaskByPostId(post.idpost)
                    .then(task => {
                        post.task = task;
                        return post;
                    })
                    .then(r => resolve(post))
                }));
            })

            if (promises.length) {
                return Promise.all(promises)
                    .then(el => {
                        notifications = notifications.concat(el);
                        this.setState({notifications: notifications});
                    })
                    .catch(() => {});
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    async loadTaskByPostId(idPost) {
        return await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gettaskbypost?idpost=" + idPost)
        .then((response) => {return response.json()})
        .then((responseJson) => {
            if (responseJson == "") {
                return;
            }
            return JSON.parse(responseJson);
        })
        .then(task => {
            return this.loadAlbumForTask(task.idalbum).then(album => {task.album = album; return task})
        })
        .catch((error) => {
            console.error(error);
        });
    }

    async loadAlbumForTask(idalbum) {
        return await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getalbum?idenvironment=0&idtheme=0&idalbum=" + idalbum)
        .then((response) => {return response.json()})
        .then((responseJson) => {
            return JSON.parse(responseJson);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    openContextualMenu(index) {
        this.contextualMenu.toggleState();
    }

    openAddMediaMenu(index) {
        this.addMediaMenu.toggleState();
    }

    navigateToCollabView() {
        ApplicationConfig.getInstance().index.props.navigation.navigate("CollabView");
    }

    navigateToTaskSummary(id) {
        ApplicationConfig.getInstance().index.props.navigation.navigate("TaskSummary", {idtask: id});
    }

    renderCardTitle(obj) {
        return (
            <View style={[TaskAvatar.avatarContainer]}>
                <View style={[TaskAvatar.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.taskThumbnail} source={{uri:  getAddressForUrl(obj.task.album.theme.mediaUrl)}} />
                </View>
                <View style={[TaskAvatar.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.profile} source={require('./img/dp2.jpg')}/>
                </View>
                <TouchableOpacity style={TaskAvatar.nameContainer} onPress={() => this.navigateToTaskSummary(obj.task.id)}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={TaskAvatar.name}>{obj.task.post.message} {obj.task.album.theme.tagName}</Text>
                        <Text style={[TaskAvatar.environment, {color: obj.task.album.environment.mediaUrl}]}>
                            {obj.task.album.environment.tagName}
                        </Text>
                    </View>
                    <Text style={TaskAvatar.time}>{moment(new Date(obj.task.created)).format("D MMMM [alle ore] HH:mm")}</Text>
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
        return this.state.notifications.map((obj, i) => {
            var fotoRender = [];
            var videoRender = [];
            var foto360Render = [];


            for(let k = 0; k < obj.task.foto; k++){
                fotoRender.push(
                    <TouchableOpacity onPress={() => this.openAddMediaMenu(1)}>
                        <View key = {k} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                    </TouchableOpacity>
                )
            }

            for(let k = 0; k < obj.task.video; k++){
                videoRender.push(
                    <TouchableOpacity onPress={() => this.openAddMediaMenu(1)}>
                        <View key = {k} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>                                      
                        </View>
                    </TouchableOpacity>
                )
            }

            for(let k = 0; k < obj.task.foto360; k++){
                foto360Render.push(
                    <TouchableOpacity onPress={() => this.openAddMediaMenu(1)}>
                        <View key = {k} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                    </TouchableOpacity>
                )
            }

            return <View key={i}>
                <View style={[styles.SingleTaskContainer, Shadow.cardShadow]}>
                    {this.renderCardTitle(obj)}
                </View>
                <View>
                    <ScrollView style={styles.TaskMediaContainer} showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        {/* <TouchableOpacity onPress={() => this.navigateToCollabView()} style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Image source={{uri: 'http://www.programmatic-rtb.com/wp-content/uploads/2017/10/store.png'}}
                                style={{height:65,
                                    width:65,
                                    borderRadius:10}} />
                            <View style={[styles.statusIcon, Shadow.smallCardShadow]}>
                                <View style={[{backgroundColor: 'green'}, styles.innerStatusIcon]}></View>
                            </View>
                                </TouchableOpacity> */}
                        { fotoRender }
                        { videoRender }
                        { foto360Render }
                    </ScrollView>
                </View>
            </View>
        });
    }

    renderCameraModal() {  
        const cameraStyles = StyleSheet.create({
            container: {
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'black'
            },
            preview: {
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center'
            },
            capture: {
              flex: 0,
              backgroundColor: '#fff',
              borderRadius: 5,
              padding: 15,
              paddingHorizontal: 20,
              alignSelf: 'center',
              margin: 20
            }
          });

        
        return (<Modal
            animationType={"fade"}
            transparent={false}
            visible={this.state.cameraModal}
            onRequestClose={() => this.setState({cameraModal: false})}>
            <View style={cameraStyles.container}>
                <RNCamera
                    ref={ref => {this.camera = ref;}}
                    style = {cameraStyles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                <TouchableOpacity onPress={() => {this.setState({cameraModal: false});}} 
                    style={{backgroundColor: 'transparent', top: 30, left: 10, position: 'absolute'}}>
                    <Text style={{ fontSize: 22, marginBottom: 10, color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', height: 70, width: width, position: 'absolute', bottom: 0}}>
                    <TouchableOpacity style={{marginLeft: 20, width: 60}}
                        onPress={() => {
                        this.setState({
                            type: this.state.type === RNCamera.Constants.Type.back
                            ? RNCamera.Constants.Type.front
                            : RNCamera.Constants.Type.back,
                        });
                        }}>
                        <Ionicons name={"ios-reverse-camera-outline"} size={50} color={Colors.white} style={{marginTop: 5}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 62, position: 'absolute', left: width/2 - 30}}
                        onPress={() => {this.snap()}}>
                        <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', marginLeft: 6}}></View>
                        </View>
                    </TouchableOpacity>
                    <View>
                    </View>
                </View>
            </View>
          </Modal>)
    }
    
    snap = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)
            this.setState({
                cameraModal: false,
                photos: [data],
            });

            this.setState({visualGuidelineModal: true});
        }
    };

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          if (photos.length == 0) {
              this.setState({cameraPicsOpen: false});
              return;
          }
          
          this.setState({
            cameraPicsOpen: false,
            photos
          })
        }).catch((e) => console.log(e))
    }

    _renderImagePickerModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.cameraPicsOpen}
                onRequestClose={() => this.setState({cameraPicsOpen: false})}>
                
                <ImageBrowser max={4} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    openCamera() {
        {this.openAddMediaMenu(1)}
        this.setState({cameraModal: true});
    }

    openImages() {
        {this.openAddMediaMenu(1)}
        this.setState({cameraPicsOpen: true});
    }

    openNewTaskModal() {
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
                <ContextualActionsMenu ref={e => this.addMediaMenu = e} buttons={this.state.addMediaMenuActions} />
                {this.renderNewTaskModal()}
                {this._renderImagePickerModal()}
                {this.renderCameraModal()}
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
        fontFamily: 'Roboto-BoldItalic'
    },

    taskButton:{ 
        position: 'absolute',
        right: 10,
        marginTop: 19,
        fontSize: 14,
        marginRight: 20,
        color: Colors.main,
        fontFamily: 'Roboto-Bold'
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