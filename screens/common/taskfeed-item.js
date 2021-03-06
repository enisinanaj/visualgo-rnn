import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    Switch
} from 'react-native';

// import {AppLoading, Font} from '  expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import locale from 'moment/locale/it'
import {MenuIcons, getAddressForUrl} from '../helpers';

import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import DisabledStyle from '../../constants/DisabledStyle';
import CachedImage from '../common/CachedImage';

import ImagePost from './image-post';
import TaskDetail from './task-detail';
import Button from './button';
import NoOpModal from './NoOpModal';
import ContextualActionsMenu from './ContextualActionsMenu';
import ApplicationConfig, {AWS_OPTIONS} from '../helpers/appconfig';

import {withNavigation} from 'react-navigation';

const {width, height} = Dimensions.get('window');

class TaskFeedItem extends Component {
    constructor(props) {
        super(props);
        moment.locale("it");

        var {data} = this.props;

        this.state = {
            time: moment(new Date(data.created)).format("D MMMM [alle ore] HH:mm"),
            buttons: [{title: 'Comment', iconImage: require("../../assets/images/icons/comment.png"), 
                        onPress: () => {}}, 
                      {title: 'Stats', id: 'statsButton', iconImage: require("../../assets/images/icons/stats-outlined.png"), 
                        onPress: () => {this['statsButton'].toggleState()}, disabled: true}],
            likes: 0,
            isReady: false,
            comments: this.props.data.comments == undefined ? 0 : this.props.data.comments.length,
            taskModal: false,
            contextualMenuActions: [{title: 'Elimina Task', image: MenuIcons.DELETE_TASK, onPress: () => {}}, 
                                    {title: 'Modifica Task', image: MenuIcons.EDIT_TASK, onPress: () => {}}, 
                                    {title: 'Archivia Task', image: MenuIcons.ARCHIVE_TASK, disabled: true, onPress: () => {}},
                                    {advanced: true, renderContent: () => this.renderAdvancedMenuContent(), onPress: () => {}}]
        };
    }

    async loadAlbum() {
        await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getalbum?idenvironment=0&idtheme=0&idalbum=" + this.props.data.idalbum)
        .then((response) => {return response.json()})
        .then((responseJson) => {
            try {
                var parsedResponse = JSON.parse(responseJson);
                this.setState({album: parsedResponse.taskout, environment: parsedResponse.environment, theme: parsedResponse.theme});
            } catch(e) {
                console.log(e);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    renderAdvancedMenuContent() {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'Roboto-Light'}}>
                        Commenti 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.commentsEnabled} onValueChange={(v) => this.setState({commentsEnabled: v})}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'Roboto-Light'}}>
                        Notification 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.notificationsEnabled} onValueChange={(v) => this.setState({notificationsEnabled: v})}/>
                </View>
                <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'Roboto-Light', marginTop: 6}}>
                            Tutti
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        this.setState({ isReady: true });
    }

    renderAvatar() {
        const {time, album} = this.state;
        let {data} = this.props;
        let profile = data.post.author;

        return (
            <View style={[styles.avatarContainer]}>
                <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                    {/* <Image style={styles.taskThumbnail} source={{uri: getAddressForUrl(data.themeUrl), cache: 'force-cache'}} /> */}
                    <CachedImage cachedSource={{uri: getAddressForUrl(data.themeUrl), cache: 'force-cache'}} style={styles.taskThumbnail} resizeMode={'cover'}/>
                </View>
                <View style={[styles.avatarPhotoContainer, Shadow.filterShadow]}>
                    {/* <Image style={styles.profile} source={{uri: getAddressForUrl(profile.mediaurl), cache: 'force-cache'}}/> */}
                    <CachedImage style={styles.profile} cachedSource={{uri: getAddressForUrl(profile.mediaurl), cache: 'force-cache'}} resizeMode={'cover'}/>
                </View>
                <TouchableOpacity onPress={() => {this.openTaksDetail()}} style={styles.nameContainer}> 
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={styles.name}>{data.name} {data.themeTagName}</Text>
                        <Text style={[styles.environment, {color: data.envUrl}]}>
                            {data.envTagName}
                        </Text>
                    </View>
                    <Text style={styles.time}>50% - {time}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.contextualMenu.toggleState()} style={{position: 'absolute', right: 0, top: -10}}>
                    <Ionicons name="ios-more-outline" color={Colors.main} size={30} />
                </TouchableOpacity>
            </View>
        )
    }

    renderLikesAndComments() {
        const {likes, comments} = this.state;

        if(likes == 0 && comments == 0) {
            return
        }

        return null;
    }

    renderLikeBar() {
        const {buttons} = this.state;
        return buttons.map((button, i) => {
            return (
                <TouchableOpacity key={i} onPress={() => {button.onPress()}} style={button.disabled ? DisabledStyle.disabled : {}}>
                    <Image source={button.iconImage} style={{width: 20, height: 16}} resizeMode={"center"} />
                    {button.disabled ?
                        <NoOpModal featureName={button.title} ref={(noOpModal) => this[button.id] = noOpModal} />    
                    : null}
                </TouchableOpacity>
            )
        })
    }

    renderContent() {
        const {data} = this.props;
        if(data != undefined && data.themeUrl != undefined) {
            return (
                <CachedImage style={{height: 180, width: null, resizeMode: 'cover'}} cachedSource={{uri: getAddressForUrl(data.themeUrl), cache: 'force-cache'}} resizeMode={'cover'}/>
                // <Image source={{ uri: getAddressForUrl(data.themeUrl), cache: 'force-cache'}} style={{height: 180, width: null, resizeMode: 'cover'}} />
            )
        }
    }

    openTaksDetail() {
        var {data} = this.props;
        ApplicationConfig.getInstance().index.props.navigation.navigate("TaskSummary", {idtask: data.id});
    }

    renderTaskModal(data) {
        return (
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.taskModal}
            onRequestClose={() => this.setState({taskModal: false})}>
            <TaskDetail data={data} closeModal={() => this.setState({taskModal: false})}/>
          </Modal>
        );
      }

    render() {
        const {data} = this.props;

        if(data != undefined && data.themeUrl != undefined) {
            return (
                <View style={[styles.container, Shadow.cardShadow]}>
                    <View>
                        {this.renderAvatar()}
                        <View style={{margin: 0, padding: 0, marginTop: 9}}>
                            {this.renderContent()}
                        </View>
                        {this.renderLikesAndComments()}
                        <View style={styles.buttonContainer}>
                            {this.renderLikeBar()}
                        </View>
                    </View>
                    {this.renderTaskModal(data)}
                    <ContextualActionsMenu ref={e => this.contextualMenu = e} buttons={this.state.contextualMenuActions} />
                </View>
            )
        }

        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 6,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5,
    },

    content: {
        padding: 15,
        paddingTop: 0,
        paddingBottom: 15
    },

    line: {
        margin: 16,
        marginBottom: 0,
        borderColor: '#ddd'
    },

    avatarContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 15
    },

    nameContainer: {
        marginLeft: 8,
        marginTop: 3.20,
        justifyContent: 'flex-start',
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

    time: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'Roboto-Light',
        marginTop: 3
    },

    taskThumbnailContainer: {
        height: 38,
        width: 38,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2.5,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 33,
        width: 33,
        borderRadius: 4
    },
    profile: {
        backgroundColor: 'transparent',
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    avatarPhotoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        left: 15,
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.white
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.borderGray,
        height: 44,
        paddingTop: 14,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        borderTopWidth: 1,
    },

    buttonItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 14,
        marginLeft: 8,
        color: Colors.main
    },

    likeText: {
        fontSize: 12,
        color: Colors.grayText
    },

    likesComments: {
        padding: 16,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    imageStyle: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14
    },
    switchAndroid:{
        height: 24, 
        marginLeft: 5, 
        marginBottom: 5,
        
    }
})


export default withNavigation(TaskFeedItem);