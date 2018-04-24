/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    StyleSheet
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default class ButtonBarChat extends Component {
    constructor() {
        super();
        this.state = {
            height: new Animated.Value(56),
            buttons: ['All', 'Group', 'Active']
        };
    }

    componentDidMount() {
        setTimeout(() => {this.measureView()}, 0)
    }

    measureView() {
        this.refs.container.measure((a, b, w, h, x, y) => {
            this.setState({height: new Animated.Value(h), original: h});
        });
    }

    hide() {
        if(this.state.animating) {
            return;
        }
        console.log('animating');

        this.setState({animating: true});
        Animated.timing(
            this.state.height,
            {toValue: 0}
        ).start();
    }

    show() {
        if(!this.state.animating) {
            return;
        }
        console.log('animating');
        this.setState({animating: false});
        Animated.timing(
            this.state.height,
            {toValue: this.state.original}
        ).start();
    }

    renderButtons() {
        const {buttons, icons} = this.state;
        return buttons.map((button, i) => {
            return (
                <View key={i} style={styles.buttonItem}>
                    <Text style={styles.text}>{button}</Text>
                </View>
            )
        })

    }

    getStyle() {
        const {height} = this.state;


        return {height, opacity: height.interpolate({
            inputRange: [0, 36],
            outputRange: [0, 1],
        })}
    }

    render() {

        return (
            <View ref='container'>
                <Animated.View style={[styles.container, this.getStyle()]}>
                    {this.renderButtons()}
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: Colors.white,
        borderTopWidth: 2,
        borderColor: "#f4f4f4",
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        marginBottom: 10,
    },

    buttonItem: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0
    },

    text: {
        fontSize: 14,
        backgroundColor: 'transparent',
        marginLeft: 8,
        color: Colors.main
    }
});