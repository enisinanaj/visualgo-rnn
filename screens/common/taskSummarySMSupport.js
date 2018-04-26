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
import appconfig, { AWS_OPTIONS } from '../helpers/appconfig';

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
            imageBrowserOpen: false,
            photos: []
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

    handleImageTap(index) {
        if (this.state.photos[index] == undefined) {
            this.setState({imageBrowserOpen: true})
        } else {
            ApplicationConfig.getInstance().index.props.navigation.navigate("CollabView", {image: this.state.photos[index]});
        }
    }

    renderImageTileElement = ({item, index}) => {
        var image;
        if (this.state.photos[index] != undefined) {
            image = this.state.photos[index];
        }

        return(
            <TouchableOpacity style={[TaskMedia, Shadow.smallCardShadow]} onPress={() => this.handleImageTap(index)}>
                {image == undefined || image == null ?
                <Entypo name={"image-inverted"} size={60} style={TaskMediaIcon}/>
                : 
                <Image source={image} style={{
                    height:170,
                    width:170,
                    borderRadius:15
                }} resizeMode={"cover"}/>}
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
                // let progress = this.state.fileprogress;
                // progress[i] = e.percent;
                // this.setState({fileprogress: progress});
            })
            .then(response => {
                if (response.status !== 201) {
                    throw new Error("Failed to upload image to S3");
                }
                
                if (i == this.state.photos.length - 1) {
                    //siamo arrivati a fine upload files
                    this.setState({filesUploaded: true});
                    this.attachPicturesToTask();
                }             
            })
            .catch(function(error) {
                console.log(error);
            });
        });
    }

    attachPicturesToTask() {
        let filesToPost = [];
        this.state.photos.map((f, i) => {
            let tmp = {
                id: f.md5 + '.' + getFileExtension(f),
                type: "image/" + getFileExtension(f)
            };
            
            filesToPost.push(tmp);
        });

        var addmedia2task = JSON.stringify({
            addmedia2task: {
                idtask: this.props.idtask,
                idauthor: appconfig.getInstance().me.id,
                mediaurl: filesToPost,
            }
        });

        console.log("mediaToTask body: " + addmedia2task);

        fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/addmediatotask', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: addmedia2task
        })
        .then((response) => {
            //reload task detail
            console.debug("Attach Media to Task response: " + JSON.stringify(response));
            this.props.updateTask();
        })
        .catch(e => {
            console.error("error: " + e);
        })
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          if (photos.length == 0) {
              this.setState({imageBrowserOpen: false});
              return;
          }
          
          this.setState({
            imageBrowserOpen: false,
            photos: [...this.state.photos, ...photos]
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
                
                <ImageBrowser max={this.props.photoNumber - this.state.photos.length} callback={this.imageBrowserCallback}/>
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