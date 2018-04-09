import{
    Dimensions,
    Platform
} from 'react-native';

// import {ImagePicker} from 'expo';

const profile = [
    {
        source: require('../img/dp2.jpg'),
        name: 'Marco',
        online: false,
    },
    {
        source: require('../img/dp1.jpg'),
        name: 'Jennifer',
        online: true,
    },
    {
        source: require('../img/elmo.jpg'),
        name: 'Christina',
        online: false,
    }
];

export const uuid = Math.random()*1000;

const images = {
    '1': require('../img/shopping1.jpg'),
    '2': require('../img/shopping2.jpg'),
    '3': require('../img/shopping3.jpg'),
    '4': require('../img/shopping4.jpg')
}

export const MenuIcons = {
    BACHECA_IMAGE: require('../../assets/images/icons/bacheca.png'),
    CHAT_IMAGE: require('../../assets/images/icons/chat.png'),
    CALENDAR_IMAGE: require('../../assets/images/icons/calendar.png'),
    NOTIFICATION_IMAGE: require('../../assets/images/icons/notification.png'),
    ALBUM_IMAGE: require('../../assets/images/icons/album.png'),
    BACHECA_W_IMAGE: require('../../assets/images/icons/bacheca_white.png'),
    CHAT_W_IMAGE: require('../../assets/images/icons/chat_white.png'),
    CALENDAR_W_IMAGE: require('../../assets/images/icons/calendar_white.png'),
    NOTIFICATION_W_IMAGE: require('../../assets/images/icons/notifications_white.png'),
    ALBUM_W_IMAGE: require('../../assets/images/icons/album_white.png'),
    REPORT_W_IMAGE: require('../../assets/images/icons/report_white.png'),
    REPORT_MENU_DISABLED: require('../../assets/images/icons/ReportDisabled.png'),
    CALENDAR_MENU_DISABLED: require('../../assets/images/icons/CalendarDisabled.png'),
    MESSAGES_MENU_DISABLED: require('../../assets/images/icons/MessagesDisabled.png'),
    DELETE_TASK: require('../../assets/images/icons/delete-task.png'),
    EDIT_TASK: require('../../assets/images/icons/edit-task.png'),
    ARCHIVE_TASK: require('../../assets/images/icons/archive-task.png'),
    THUMB_UP: require('../../assets/images/icons/thumb-up.png'),
    THUMB_DOWN: require('../../assets/images/icons/thumb-down.png'),
    HISTORY: require('../../assets/images/icons/history.png'),
    ALERT: require('../../assets/images/icons/alert.png'),
    COMMENT: require('../../assets/images/icons/comment-outline.png'),
    USER_SHARE: require('../../assets/images/icons/user-share.png'),
}

export default settings = {
    baseApi: 'http://crpbddyxugpgmqhgx-mock.stoplight-proxy.io/v1'
}

export async function getProfile(profileId, getData) {
    return fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/users/id/?iduser=' + profileId)
    .then((response) => response.json())
    .then((responseJson) => getData(responseJson))
    .catch((error) => {
        console.error(error);
    });
}

export const makeCancelable = (promise) => {
    let hasCanceled_ = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
        error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
      );
    });
  
    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
  };

export function randomProfile() {
    var random = Math.floor((Math.random() * profile.length));
    return profile[random];
}

export function getImage(index) {
    return images[index];
}

export const isIphoneX = () => {
    let d = Dimensions.get('window');
    const { height, width } = d;
  
    return (
      Platform.OS === 'ios' &&
      (height === 812)
    );
}

export function getFileName(file) {
    var filename = file.uri != null ? file.uri : file.file;
    var lastIndex = filename.indexOf('?') == -1 ? filename.length : filename.indexOf('?');

    filename = filename.substring(filename.lastIndexOf('/') + 1, lastIndex);

    return filename;
}

export function getFileExtension(file) {
    const filename = getFileName(file);

    return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
}

export async function openCamera(callback) {
    let options = {
        allowsEditing: false,
        quality: 1,
        base64: true,
        exif: true
    };

    // let image = await ImagePicker.launchCameraAsync(options);
    // callback(image);
};