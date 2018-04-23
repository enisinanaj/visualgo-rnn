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
import Colors from '../../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';

import moment from 'moment';
import locale from 'moment/locale/it';
import Shadow from '../../constants/Shadow';
import DefaultRow from './default-row';
import { isIphoneX, getProfile } from '../helpers';
import ApplicationConfig from '../helpers/appconfig';

export default class TaskMediaCompletion extends Component {
    constructor(props) {
        super(props);

        const {pictures, videos, m360} = this.props;

        this.state = {
            pictures: pictures != undefined ? pictures : [],
            pictureIndex: 0,
            vides: videos != undefined ? videos : [],
            videoInde: 0,
            m360: m360 != undefined ? m360 : [],
            m360Index: 0
        }
    }

    renderPicture() {
        if (this.state.pictures.length > 0 && this.state.pictureIndex < this.state.pictureIndex.length) {
            return <View style={styles.card}></View>
        }

        return null;
    }

    renderEmptyPicture() {
        if (this.state.pictures.length <= this.state.pictureIndex && this.state.pictureIndex < this.props.numberOfPictures) {

        }
    }


    render() {
        return <View>
            {this.renderPicture()}
            {this.renderEmptyPicture()}
            {this.renderVideo()}
            {this.renderEmptyVideo()}
            {this.render360()}
            {this.renderEmptym360()}
        </View>
    }
}