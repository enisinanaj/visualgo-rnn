/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

// import {AppLoading, Font} from 'expo';
import moment from 'moment';
import locale from 'moment/locale/it'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import {TaskAvatar} from '../../constants/StyleSheetCommons';
import {getProfile, MenuIcons} from '../helpers';
import ImageVisualGuideline from './image-visual-guideline';
import Button from './button';
import NoOpModal from './NoOpModal';
import ContextualActionsMenu from './ContextualActionsMenu';
import Router from '../../navigation/Router';
import { AWS_OPTIONS } from '../helpers/appconfig';

const {width, height} = Dimensions.get('window');

export default class VisualGuidelineItem extends Component {
    constructor(props) {
        super(props);

        moment.locale("it");

        this.state = {
            time: moment(this.props.data.taskout.created).format("D MMMM [alle ore] HH:mm"),
            buttons: ['Comment'],
            icons: ['comment'],
            iconTypes: ["evilicon"],
            iconColors: [Colors.main],
            likes: 0,
            isReady: false,
            comments: this.props.data.comments == undefined ? 0 : this.props.data.comments.length,
            contextualMenuActions: [{title: 'Condividi', image: MenuIcons.USER_SHARE, onPress: () => {}}, 
                                    {title: 'Modifica', image: MenuIcons.EDIT_TASK, onPress: () => {}}, 
                                    {title: 'Elimina', image: MenuIcons.DELETE_TASK, onPress: () => {}},
                                    {title: 'Archivia Album', image: MenuIcons.ARCHIVE_TASK, disabled: true, onPress: () => {}}]
        };
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
        //     'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
        //     'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        // });

        this.setState({ isReady: true });
    }

    renderAvatar() {
        const {data} = this.props;

        return (
            <View style={[TaskAvatar.avatarContainer]}>
                <View style={[TaskAvatar.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.taskThumbnail} source={{uri: AWS_OPTIONS.bucketAddress + data.theme.mediaUrl}} />
                </View>
                <View style={[TaskAvatar.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={TaskAvatar.profile} source={require('../img/dp2.jpg')}/>
                </View>
                <TouchableOpacity style={TaskAvatar.nameContainer} onPress={() => {this.goToAlbumDetail()}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={TaskAvatar.name}>{data.taskout.post.message} {data.theme.tagName}</Text>
                        <Text style={[TaskAvatar.environment, {color: data.environment.mediaUrl}]}>
                            {data.environment.tagName}
                        </Text>
                    </View>
                    <Text style={TaskAvatar.time}>{data.profile.name} {data.profile.surname} - {this.state.time}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{position: 'absolute', right: 0, top: -10}} onPress={() => this.contextualMenu.toggleState()}>
                    <Ionicons name="ios-more-outline" color={Colors.main} size={30} />
                </TouchableOpacity>
                <ContextualActionsMenu ref={e => this.contextualMenu = e} buttons={this.state.contextualMenuActions} />
            </View>
        );
    }

    renderCardTitle() {
        const {time} = this.state;
        let profile = {};
        try {
             profile = this.props.data.profile;
        } catch(e) {
            return null;
        }

        return this.renderAvatar();
    }

    renderPlusButton() {
        return (
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity style={[styles.filterButtons, styles.buttonNewGroupStyle, Shadow.filterShadow]}>
                    <MaterialCommunityIcons style={[styles.plusIcon, Shadow.filterShadow]} name={"plus-circle"} size={28} color={Colors.main} />
                </TouchableOpacity>
            </View>
        )
    }

    renderContent() {
        const {data} = this.props;
        if(data.taskout.post.medias != undefined && data.taskout.post.medias.length > 0) {
            return (
                <ImageVisualGuideline imageCount={data.taskout.post.medias.length} images={data.taskout.post.medias}/>
            )
        }
    }

    goToAlbumDetail() {
        const {data} = this.props;
        ApplicationConfig.getInstance().index.props.navigation.navigate("AlbumSummary", {data});
    }

    render() {
        // if (!this.state.isReady) {
        //   return <AppLoading />;
        // }

        return (
            <View style={{height: 290, padding: 0, margin: 0}} >
                <View style={[styles.container, Shadow.cardShadow]}>
                    {this.renderCardTitle()}
                    <View style={styles.buttonContainer}>
                        {this.renderPlusButton()}
                    </View>
                </View>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 280,
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        padding: 19
    },

    line: {
        margin: 16,
        marginBottom: 0,
        borderColor: '#ddd'
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.borderGray,
        height: 44
    },

    buttonItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    filterButtons: {
        backgroundColor: Colors.borderGray,
        marginTop: 188,
        marginRight: -8
    },

    buttonNewGroupStyle: {
        borderRadius: 14,
        height: 28,
        width: 28,
        backgroundColor: 'transparent'
    },

    plusIcon: {
        borderRadius: 15,
        height: 30,
        width: 30,
        backgroundColor: 'transparent',
        marginLeft: 6,
        paddingTop: 2
    }
})
