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

    notifications = [];

    await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gethvmtasks?iduser=" + ApplicationConfig.getInstance().me.id)
        .then((response) => {return response.json()})
        .then((responseJson) => {
            return JSON.parse(responseJson);
        })
        .then(notificationsArrayDaAggregare => {
            var notificationsAggregate = [];
            notificationsArrayDaAggregare.forEach (it => {

                var found = false;
                notificationsAggregate.map((o, i) => {
                    if (o.id == (it.idPost + "-" + it.idauthor)) {
                        o.media.push({url: it.mediaUrl, ilike: it.ilike});
                        found = true;
                    }
                });

                if (!found) {
                    var temp = {};
                    temp.id = it.idPost + "-" + it.idauthor;
                    temp.original = it;
                    temp.media = [];
                    temp.media.push({url: it.mediaUrl, ilike: it.ilike});
                    notificationsAggregate.push(temp);
                }          
            });
            
            return notificationsAggregate;
        })
        .then(notificationsAggregate => {
            var promises = [];

            notificationsAggregate.forEach(post => {

                promises.push(new Promise((resolve, reject) => {
                    loadTask(post.original.idTask)
                    .then(task => {
                        post.task = task;
                        post.task.medias = post.media;
                        return post;
                    })
                    .then(r => resolve(post))
                }));
            })

            if (promises.length) {
                return Promise.all(promises)
                    .then(el => {
                        notifications = notifications.concat(el);
                        console.log("notifications: " + JSON.stringify(notifications));
                        return notifications;
                    })
                    .then(notifications => c(notifications))
                    .catch(() => {});
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function loadTask(id) {
    return await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gettask?idtask=" + id)
    .then((response) => {return response.json()})
    .then((responseJson) => {
        if (responseJson == "") {
            return;
        }
        return JSON.parse(responseJson);
    })
    .then(task => {
        return loadAlbumForTask(task.idalbum).then(album => {task.album = album; return task})
    })
    .catch((error) => {
        console.error(error);
    });
}

export async function loadAlbumForTask(idalbum) {
    return await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/getalbum?idenvironment=0&idtheme=0&idalbum=" + idalbum)
    .then((response) => {return response.json()})
    .then((responseJson) => {
        return JSON.parse(responseJson);
    })
    .catch((error) => {
        console.error(error);
    });
}

export function cercaPostInNotifications(idpost, n) {
    result = n.filter(f => f.id == idpost);
    
    if (result.length <= 0) {
        return null;
    } else {
        return result;
    }
}