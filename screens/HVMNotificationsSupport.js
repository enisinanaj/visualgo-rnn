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
import {RNS3} from 'react-native-aws3';
import * as Progress from 'react-native-progress';

import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';
import ContextualActionsMenu from './common/ContextualActionsMenu';

import Router from '../navigation/Router';

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import {TaskAvatar} from '../constants/StyleSheetCommons';

import AppSettings from './helpers/index';
import ApplicationConfig, { AWS_OPTIONS } from './helpers/appconfig';
import { getFileExtension } from './helpers';
import CreateTask from './common/create-task';
import ImageBrowser from './ImageBrowser';

const {width, height} = Dimensions.get('window');


export async function loadNotificationsForHVM(c) {
    await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gethvmtasks?iduser=" + ApplicationConfig.getInstance().me.id)
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

    c([]);
}