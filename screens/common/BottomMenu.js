import React, {Component} from 'react';

import { StyleSheet, video,ListView, ScrollView,
        FlatList, Platform, Image, 
        backgroundColor, Text, 
        Dimensions, StatusBar,
        Animated,
        View, Button, TouchableHighlight, 
        TextInput, TouchableOpacity, Alert,} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Colors from '../../constants/Colors';

export default class BottomMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewIsOpen: false,
            viewIsTitleVisible: false,
            viewHeight: Animated.Value(0)
        }
    }

    open() {
        Animated.timing(this.state.viewHeight, {
            toValue: 80,
            duration: 200,
        }).start();
    }

    render() {
        return <View style={[styles.container, this.state.viewHeight]}>
            <Text>XXXXXXXXXXX</Text>
        </View>;
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.main,
        bottom: 0,
        position: 'absolute'
    }
});