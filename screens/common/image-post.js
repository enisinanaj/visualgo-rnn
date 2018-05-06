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
    TouchableOpacity
} from 'react-native';

// import {Font, AppLoading} from 'expo';

import {getImage, getAddressForUrl} from '../helpers';
const {width, height} = Dimensions.get('window');

import _ from 'lodash';
import SingleImage from './single-image';
import ImageScreen from '../imageScreen';
import CachedImage from './CachedImage';
import Router from '../../navigation/Router';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Colors from '../../constants/Colors';
import { AWS_OPTIONS } from '../helpers/appconfig';

export default class ImagePost extends Component {
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
        this.setState({isReady: true});
    }

    renderImages() {
        const {imageCount, images} = this.props;

        if (this.props.useBasePath) {
            images.map((o,i) => {
                if (!o.hasPath) {
                    o.hasPath = true;
                    o.url = getAddressForUrl(o.url);
                }
            });
        }

        switch(imageCount) {
            //1 image
            case 1:
                return (
                    <View style={styles.imageContainer}>
                        <SingleImage image={{uri: images[0].url}} 
                            removeSinglePhotoCallack={() => this.props.removeSinglePhotoCallack()}
                            removeSingleVisibile={this.props.removeSingleVisibile}/>
                    </View>
                );
                break;

            case 2:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <CachedImage style={[styles.img, {marginBottom: 4}]} cachedSource={{uri: images[0].url}}/>
                            <CachedImage style={styles.img} cachedSource={{uri: images[1].url}}/>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 3:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <CachedImage style={[styles.img, {marginBottom: 4}]} cachedSource={{uri: images[0].url}}/>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[1].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[2].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 4:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[0].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[2].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[3].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 5:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[0].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[2].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2, marginRight: 2}]} cachedSource={{uri: images[3].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[4].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            default:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[0].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <CachedImage style={[styles.img, {marginRight: 2}]} cachedSource={{uri: images[2].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2, marginRight: 2}]} cachedSource={{uri: images[3].url}}/>
                                <CachedImage style={[styles.img, {marginLeft: 2}]} cachedSource={{uri: images[4].url}} />
                                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.7)', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 18, color: 'white'}}>
                                        + {imageCount - 5}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
        }
    }

    openImages() {
        this.props.onPress()
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        const {imageCount} = this.props;
        return (
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.textContent}>{this.props.textContent}</Text>
                </View>
                {this.renderImages()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        height: height/2.5,
    },
    img: {
        flex: 1,
        width: null,
        height: null
    },
    textContainer: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 8
    },
    textContent: {
        fontFamily: 'Roboto-Light',
        fontSize: 14
    }
});