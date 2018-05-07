import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    Switch,
    ActivityIndicator
} from 'react-native';

// import {AppLoading, Font} from '  expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import locale from 'moment/locale/it'
import {MenuIcons, getAddressForUrl, ImageCache} from '../helpers';

import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import DisabledStyle from '../../constants/DisabledStyle';

import ImagePost from './image-post';
import TaskDetail from './task-detail';
import Button from './button';
import NoOpModal from './NoOpModal';
import ContextualActionsMenu from './ContextualActionsMenu';
import ApplicationConfig, {AWS_OPTIONS} from '../helpers/appconfig';

export default class CachedImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cachedSource: {},
            loaded: false
        }
    }

    componentDidMount() {
        var obj = this.props.cachedSource;
        if (obj.uri == undefined && obj.url != undefined) {
            obj.uri = obj.url;
        }

        console.log("test: " + JSON.stringify(obj));

        if (obj.uri.indexOf("amazonaws.com") >= 0) {
            ImageCache.get(obj.uri, (uri) => {
                this.setState({cachedSource: {uri: uri}, loaded: true})
            });
            return;
        } else {
            this.setState({cachedSource: {uri: obj.uri}, loaded: true})
            return;
        }
    }

    render() {
        return this.state.loaded ? <Image key={this.state.cachedSource} source={this.state.cachedSource} {...this.props}/> : null;
    }

}