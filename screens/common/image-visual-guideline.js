/**
 * Created by ggoma on 1/1/17.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Modal,
    TouchableOpacity,
    ScrollView
} from 'react-native';

// import {Font, AppLoading} from 'expo';

import {getImage} from '../helpers';
const {width, height} = Dimensions.get('window');

import _ from 'lodash';
import SingleImage from './single-image';
import ImageScreen from '../imageScreen';
import Router from '../../navigation/Router';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import { AWS_OPTIONS } from '../helpers/appconfig';

export default class ImageVisualGuideline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imagesScreen: false,
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
        //     'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
        //     'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        // });

        this.setState({isReady: true});
    }

    renderMedias() {
        var {images} = this.props;

        return images.map((i, index) => {
            return (<View key={index} style={[styles.imageContainer, Shadow.filterShadow]}> 
                    <Image source={{uri: AWS_OPTIONS.bucketAddress + i.url}} style={styles.img} resizeMode={"cover"}/>
                </View>);
        });
    }

    renderImages() {
        const {imageCount, images} = this.props;

        return(
            <View>
                <ScrollView style={styles.imagesContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {this.renderMedias()}
                </ScrollView>
            </View>
                
        );
    }

    openImages() {
        this.props.onPress()
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        return this.renderImages();
    }
}

const styles = StyleSheet.create({
    imagesContainer: {
        height: 180,
        width: width,
        position: 'absolute',
        top: -210,
        zIndex: 9999
    },
    imageContainer: {
        width: 110,
        height: 170,
        marginRight: 4,
        marginLeft: 4,
        borderRadius: 10
    },
    img: {
        flex: 1,
        width: 110,
        height: 170,
        borderRadius: 10
    },
    textContainer: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 8
    },
    textContent: {
        fontFamily: 'roboto-light',
        fontSize: 14
    }
});