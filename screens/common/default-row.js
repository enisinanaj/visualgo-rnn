import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '../../constants/Colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class DefaultRow extends Component {

    static propTypes = {
        renderChildren: PropTypes.func,
        style: PropTypes.object,
        noborder: PropTypes.bool,
        usePadding: PropTypes.bool
    };

    constructor(props) {
        super(props);
        var usePadding = true;

        if (this.props.usePadding != undefined) {
            usePadding = this.props.usePadding;
        }

        this.state = {
            drawBorder: !this.props.noborder,
            usePadding: usePadding
        }
    }

    render() {
        return (
            <View style={[styles.defaultRow, this.state.drawBorder ? styles.border : {},
                this.state.usePadding ? styles.padding : {},
                this.props.style ? this.props.style : {}]}>
                {this.props.renderChildren ? this.props.renderChildren(this.props.arguments) : null}
                {this.props.children ? this.props.children : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    padding: {
        padding: 10
    },
    border: {
        backgroundColor: '#FFF',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor: Colors.borderGray,
    }
});