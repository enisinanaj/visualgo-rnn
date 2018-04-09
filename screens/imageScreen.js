/**
 * Created by ggoma on 1/1/17.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageView,
    Image,
    Dimensions,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import Colors from '../constants/Colors';
import Router from '../navigation/Router';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Shadow from '../constants/Shadow';
const {width, height} = Dimensions.get('window');

export default class ImageScreen extends Component {

    constructor(props) {
        super(props);

        var canEdit = true;

        if (!this.props.canEdit) {
            canEdit = this.props.canEdit;
        }

        this.state = {
            images: this.props.images,
            canEdit: canEdit
        };
    }

    _removeImage(img) {
        let images = [];

        for (k in this.state.images) {
            if (this.state.images[k].url != img.url) {
                images.push(this.state.images[k]);
            }
        }

        if (images.length == 0) {
            this.props.onClose([]);
        }

        this.setState({images: images});
    }

    _renderImages() {
        let objs = this.state.images;

        return objs.map((o, i) => {
            return (
                <View>
                    <Image
                        style={styles.imageStyle}
                        source={{uri: o.url}}
                    />
                    {this.state.canEdit ?
                        <View style={[styles.removeIconStyle, Shadow.filterShadow]}>
                            <TouchableOpacity onPress={() => this._removeImage(o) }>
                                <EvilIcons name={"close"} size={22} color={Colors.main} style={{backgroundColor: 'transparent'}} />
                            </TouchableOpacity>
                        </View>
                    : null}
                </View>
            )
        })
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.gray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <View style={{width: 30}}></View>
              {this.state.canEdit ?
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600', alignContent: 'center', alignSelf: 'center'}}>Edit</Text>
              : null}
              <TouchableOpacity onPress={() => this.props.onClose(this.state.images)}>
                <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
              </TouchableOpacity>
          </View>
        );
      }

    render() {
        return (
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                <ScrollView>
                    {this._renderImages()}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    imageStyle: {
        flexDirection: 'row',
        height: width,
        width: width,
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 10,
        borderTopColor: Colors.gray,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    removeIconStyle: {
        position: 'absolute',
        top: 25,
        right: 10,
        zIndex: 99999999,
        borderRadius: 14,
        width: 28,
        height: 28,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 3,
        paddingTop: 3,
        backgroundColor: Colors.white
    }
});