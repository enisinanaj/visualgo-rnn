import {StyleSheet} from 'react-native';
import Colors from './Colors';

export const TaskAvatar = StyleSheet.create({
    avatarContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
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
    }
});