import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';

const {width, height} = Dimensions.get('window');

export default commentBar = StyleSheet.create({
    taskCommentContainer:{
        paddingRight: 5,
        height: 40,
        backgroundColor: Colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    taskTextStyle: {
        padding: 13,
        margin: 0,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: '#FFFFFF',
        backgroundColor: 'transparent'
    },
    
    taskCommentVisibleContainer: {
        marginTop: 65, 
        backgroundColor: 'rgba(256,256,256, 0.84)', 
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'center', 
        height: height, 
        width: width
    },

    commentContainer: {
        padding: 5,
        bottom: 0,
        position: 'absolute',
        height: 375, 
        backgroundColor: '#FFFFFF', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width
    },

    rowCommentContainer: {
        paddingRight: 5,
        top: 0,
        position: 'absolute',
        height: 40, 
        backgroundColor: Colors.main, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    rowContainer: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'row'
    },

    selectableDisplayPicture: {
        width: 41,
        height: 41,
        borderRadius: 20.5
    },

    textInRow: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 0,
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        padding: 5
    },

    rowTitle: {
        paddingLeft: 5,
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        paddingTop: 1,
        backgroundColor: 'transparent'
    },

    newMessageAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        marginLeft: -5,
        marginBottom: -5,
        backgroundColor: '#FFFFFF',
        width: width
    },

    rowSubTitle: {
        fontFamily: 'Roboto-Regular',
        color: '#9A9A9A',
        fontSize: 12,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 4,
        backgroundColor: 'transparent',
        width: width - 120
    },
    
    messageDate: {
        paddingTop: 17
    },

    listView: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        bottom: 0,
        marginTop: 40,
        paddingBottom: 10
    },

    textBoxContainer: {
        width: width - 115,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: Colors.main,
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        marginRight: 10,
        marginTop: 10,
        marginLeft: 10
    },

    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 120 - 22,
        height: 40,
        paddingLeft: 15,
        paddingRight: 15,
    },

    cameraEmoticon: {
        marginTop: 9,
        marginRight: 0,
        backgroundColor: 'transparent'
    }
});