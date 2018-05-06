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

export default class ToastNotification extends Component {
    constructor(props) {
        super(props);

        var message = this.props.message != undefined ? this.props.message : 'Operation completed!';
        var duration = this.props.duration != undefined ? this.props.duration : 400;
        this.state = {
            viewIsOpen: false,
            viewIsTitleVisible: false,
            viewHeight: new Animated.Value(0),
            message: message,
            duration: duration,
            bgColor: Colors.main
        }
    }

    componentDidMount() {
        this.props.referer(this)
    }

    open(m, c) {
        if (m != undefined) {
            this.setState({message: m});
        }

        if (c != undefined) {
            this.setState({bgColor: c});
        }

        Animated.timing(this.state.viewHeight, {
            toValue: 48,
            duration: 200,
        }).start();

        setTimeout(this.close.bind(this), this.state.duration);
    }

    close() {
        Animated.timing(this.state.viewHeight, {
            toValue: 0,
            duration: 200,
        }).start();
    }

    render() {
        return (<Animated.View style={[styles.container, {height: this.state.viewHeight, backgroundColor: this.state.bgColor}, Shadow.filterShadow]}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 140, padding: 16}}>
                <Text style={{color: "white", fontFamily: 'Roboto-Bold', fontSize: 14, marginLeft: 4}}>{this.state.message}</Text>
            </View>
        </Animated.View>);
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        left: 0,
        right: 0,
        width: Dimensions.get('window').width
    }
});