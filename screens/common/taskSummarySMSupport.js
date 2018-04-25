import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Switch,
    ListView,
    Platform,
    Modal,
    FlatList,
    ScrollView,
    TouchableHighlight,
    KeyboardAvoidingView
} from 'react-native';
import Colors from "../../constants/Colors";
import Shadow from '../../constants/Shadow';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageBrowser from '../ImageBrowser';
import { getFileExtension } from '../helpers';
import { RNS3 } from 'react-native-aws3/lib/RNS3';
import { AWS_OPTIONS } from '../helpers/appconfig';

const {width, height} = Dimensions.get('window');

const TaskMediaContainer = {
    flexDirection: 'row',
    position: 'absolute',
    top: -95,
    width: width,
    height: 100,
    zIndex: 9999
};

const TaskMedia = {
    marginRight:4,
    marginBottom: 4,
    backgroundColor:'white',
    height:170,
    width:170,
    borderRadius:15,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'

};

const TaskMediaIcon = {
    color:'#9E9E9E',
    opacity:0.5,
    margin:5
};


export default class SMTaskSummarySupport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageBrowserOpen: false
        }
    }
    
    renderPhotos() {
        var result = [];
        for(var i = 0; i < this.props.photoNumber; i++) {
            result.push({key: i});
        }

        return result;
    }

    getItemLayout = (data, index) => {
        let length = width/2;
        return { length, offset: length * index, index }
    }

    renderImageTileElement = ({item, index}) => {
        return(
            <TouchableOpacity style={[TaskMedia, Shadow.smallCardShadow]} onPress={() => this.setState({imageBrowserOpen: true})}>
                <Entypo name={"image-inverted"} size={60} style={TaskMediaIcon}/>
            </TouchableOpacity>
        )
    }

    async uploadFiles() {
        await this.state.photos.map((file, i) => {
            const fileObj = {
                // `uri` can also be a file system path (i.e. file://)
                uri: file.uri != null ? file.uri : file.file,
                name: file.md5 + '.' + getFileExtension(file),
                type: "image/" + getFileExtension(file)
            }

            RNS3.put(fileObj, AWS_OPTIONS)
            .progress((e) => {
                let progress = this.state.fileprogress;
                progress[i] = e.percent;
                this.setState({fileprogress: progress});
            })
            .then(response => {
                if (response.status !== 201) {
                    throw new Error("Failed to upload image to S3");
                }
                
                if (i == this.state.files.length - 1) {
                    //siamo arrivati a fine upload files
                    this.setState({filesUploaded: true});
                    this.post();
                }             
            })
            .catch(function(error) {
                console.log(error);
            });
        });
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          if (photos.length == 0) {
              this.setState({imageBrowserOpen: false});
              return;
          }
          
          this.setState({
            imageBrowserOpen: false,
            photos
          });

          this.uploadFiles();
        }).catch((e) => console.log(e))
    }

    _renderImagePickerModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.imageBrowserOpen}
                onRequestClose={() => this.setState({imageBrowserOpen: false})}>
                
                <ImageBrowser max={this.props.photoNumber} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    render() {
        var container = {
            backgroundColor: Colors.borderGray,
            padding: 10,
            margin: 0
        };

        return <View style={container}>
            <FlatList
                data={this.renderPhotos()}
                numColumns={2}
                renderItem={this.renderImageTileElement}
                ListEmptyComponent={<Text style={{marginLeft: 15, marginTop: 15, fontSize: 14}}>Loading...</Text>}
                getItemLayout={this.getItemLayout}
            />
            {this._renderImagePickerModal()}
        </View>;
    }

}