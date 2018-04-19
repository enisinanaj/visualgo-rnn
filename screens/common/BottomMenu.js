import React, {Component} from 'react';

import { StyleSheet, video,ListView, ScrollView,
        FlatList, Platform, Image, 
        backgroundColor, Text, 
        Dimensions, StatusBar,
        Animated,
        View, Button, TouchableHighlight, 
        TextInput, TouchableOpacity, Alert} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';

export default class BottomMenu extends Component {
    constructor(props) {
        super(props);

        var headerTitle = this.props.headerTitle != undefined ? this.props.headerTitle : 'Upload attachment';
        this.state = {
            viewIsOpen: false,
            viewIsTitleVisible: false,
            viewHeight: new Animated.Value(0),
            headerTitle: headerTitle
        }
    }

    componentDidMount() {
        this.props.referer(this)
    }

    open() {
        Animated.timing(this.state.viewHeight, {
            toValue: 180,
            duration: 200,
        }).start();
    }

    close() {
        Animated.timing(this.state.viewHeight, {
            toValue: 0,
            duration: 200,
        }).start();
    }

    render() {
        return (<Animated.View style={[styles.container, {height: this.state.viewHeight}, Shadow.filterShadow]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{this.state.headerTitle}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 140}}>
                <View style={styles.buttonContainer}>
                    <View>
                        <TouchableHighlight style={[styles.button, Shadow.cardShadow, {marginLeft: 5}]}
                            onPress={() => this.props.picture()}>
                            <View style={{height: 26, width: 26, marginTop: 9, marginLeft: 9}}>
                                <Image
                                    style={{flex: 1, width: undefined, height: undefined}}
                                    source={require('../../assets/images/icons/camera.png')}
                                    resizeMode="contain"/>
                            </View>
                        </TouchableHighlight>
                        <Text style={styles.buttonTitle}>Pictures</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View>
                        <TouchableHighlight onPress={() => this.props.browse()} style={[styles.button, Shadow.cardShadow, {marginLeft: 3}]}>
                            <View style={{height: 15, width: 17, marginTop: 15, marginLeft: 14}}>
                                <Image
                                    style={{flex: 1, width: undefined, height: undefined}}
                                    source={require('../../assets/images/icons/browse.png')}
                                    resizeMode="contain"/>
                            </View>
                        </TouchableHighlight>
                        <Text style={styles.buttonTitle}>Browse</Text>
                    </View>
                </View>
            </View>
        </Animated.View>);
    }
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.white,
        height: 40,
        padding: 10,
        justifyContent: 'center'
    },
    headerTitle: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
        marginLeft: 7,
        color: Colors.main
    },
    container: {
        backgroundColor: Colors.main,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        left: 0,
        right: 0,
        width: Dimensions.get('window').width
    },
    buttonContainer: {
        width: Dimensions.get('window').width / 2,
        margin: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 140
    },
    button: {
        marginTop: 32,
        height: 44,
        width: 44,
        borderRadius: 22,
        backgroundColor: Colors.white
    },
    buttonTitle: {
        color: Colors.white,
        fontFamily: 'Roboto-Regular',
        marginTop: 15,
        fontSize: 14
    }
});