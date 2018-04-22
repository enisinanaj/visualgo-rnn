/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet
} from 'react-native';

// import {Font, AppLoading} from 'expo';

export default class onYourMind extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        this.setState({isReady: true});
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/me.png')} style={styles.profile}/>
                <Text onPress={this.props.onFocus} style={styles.input}>What are we working on today?</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },

    input: {
        flex: 1,
        fontSize: 16,
        height: 23,
        marginLeft: 8,
        marginRight: 15,
        color: '#000000',
        fontFamily: 'Roboto-Light'
    },

    profile: {
        backgroundColor: 'transparent',
        marginLeft: 15,
        height: 40,
        width: 40,
        borderRadius: 20
    }
})