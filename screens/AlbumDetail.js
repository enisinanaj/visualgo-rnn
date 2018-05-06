import React from 'react';
import { StyleSheet,
        video,
        ListView, 
        ScrollView,
        FlatList, 
        Platform, 
        Image, 
        backgroundColor, 
        Text, 
        Dimensions, 
        StatusBar,
        View, 
        Button, 
        TouchableHighlight, 
        TextInput, 
        TouchableOpacity, 
        Alert,
        Modal,} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import md5 from  'react-native-md5'
import { NavigatorIOS, WebView} from 'react-native';
import moment from 'moment';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import ActionSheet from '@yfuks/react-native-action-sheet';

//import {Font, AppLoading} from 'expo';
import Colors from '../constants/Colors';
import DefaultRow from './common/default-row';
import { isIphoneX, getFileExtension, getFileName, getAddressForUrl } from './helpers';
import ImageVisualGuideline from './common/image-visual-guideline';
import CachedImage from './common/CachedImage';
import { AWS_OPTIONS } from './helpers/appconfig';
import Shadow from '../constants/Shadow';
import BottomMenu from './common/BottomMenu';
import { RNCamera } from 'react-native-camera';
import ImageBrowser from './ImageBrowser';
import {RNS3} from 'react-native-aws3';
import * as Progress from 'react-native-progress';

var {width, height} = Dimensions.get("window");

export default class AlbumDetail extends React.Component {

    bottomMenuContainer;
    pictureButtons;

    constructor(props) {
        super(props);
        moment.locale("it");

        this.pictureButtons = [
            'Photo & Video Library',
            'Use Camera',
            'Cancel'
        ];

        var {data} = this.props.navigation != undefined ? this.props.navigation.state.params : {};
        var dataMedias = (data.taskout.post.medias != undefined && data.taskout.post.medias.length > 0) ? data.taskout.post.medias : [];

        this.state = {
            isReady: false,
            visibleHeight: height,
            data: data,
            albumTime: moment(new Date(data.taskout.post.created)).format("D MMMM [alle ore] HH:mm"),
            medias: dataMedias,
            fileprogress: [],
            cameraModal: false,
            imageBrowserOpen: false,
        };

        this.state.medias.map((file, i) => {
            this.state.medias[i].done = true;
            this.state.medias[i].progress = 100;
        })
    }

    componentDidMount() {
        this.loadFonts();

    }

    async loadFonts() {
        this.setState({isReady: true});
    }

    goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    openUploadMenu() {
        this.bottomMenuContainer.open();
    }

    selectPicture() {
        try {
            this.bottomMenuContainer.close();
        } catch(e) {

        }

        ActionSheet.showActionSheetWithOptions({
            options: this.pictureButtons,
            cancelButtonIndex: 2,
            tintColor: Colors.main
          },
          (buttonIndex) => {
              if (buttonIndex == 1) {
                this.setState({cameraModal: true})
              } else if (buttonIndex == 0) {
                this.setState({imageBrowserOpen: true})
              } else if (buttonIndex == 2) {
                this.bottomMenuContainer.open();
              }
          });
    }

    selectFile() {
        try {
            this.bottomMenuContainer.close();
        } catch(e) {

        }

        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        },(error,res) => {
            const { uri, type: mimeType, fileName } = res;
            this.setState({files: [res]});
        });
    }

    async uploadFiles() {
        await this.state.medias.map((file, i) => {

            if (this.state.medias[i].done) {
                return true;
            }

            const fileObj = {
                uri: file.uri != null ? file.uri : file.file,
                name: file.md5 ? file.md5 + '.' + getFileExtension(file) : getFileName(file),
                type: "image/" + getFileExtension(file)
            }

            RNS3.put(fileObj, AWS_OPTIONS)
            .progress((e) => {
                let progress = this.state.fileprogress;
                progress[i] = e.percent;
                this.setState({fileprogress: progress});
            })
            .then(response => {
                if (response.status !== 201)
                    throw new Error("Failed to upload image to S3");
                
                this.state.medias[i].done = true;
            })
            .catch(function(error) {
                console.log(error);
            });
        })
    }

    renderCameraModal() {  
        const cameraStyles = StyleSheet.create({
            container: {
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'black'
            },
            preview: {
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center'
            },
            capture: {
              flex: 0,
              backgroundColor: '#fff',
              borderRadius: 5,
              padding: 15,
              paddingHorizontal: 20,
              alignSelf: 'center',
              margin: 20
            }
          });

        
        return (<Modal
            animationType={"fade"}
            transparent={false}
            visible={this.state.cameraModal}
            onRequestClose={() => this.setState({cameraModal: false})}>
            <View style={cameraStyles.container}>
                <RNCamera
                    ref={ref => {this.camera = ref;}}
                    style = {cameraStyles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                <TouchableOpacity onPress={() => {this.setState({cameraModal: false});}} 
                    style={{backgroundColor: 'transparent', top: 30, left: 10, position: 'absolute'}}>
                    <Text style={{ fontSize: 22, marginBottom: 10, color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', height: 70, width: width, position: 'absolute', bottom: 0}}>
                    <TouchableOpacity style={{marginLeft: 20, width: 60}}
                        onPress={() => {
                        this.setState({
                            type: this.state.type === RNCamera.Constants.Type.back
                            ? RNCamera.Constants.Type.front
                            : RNCamera.Constants.Type.back,
                        });
                        }}>
                        <Ionicons name={"ios-reverse-camera-outline"} size={50} color={Colors.white} style={{marginTop: 5}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 62, position: 'absolute', left: width/2 - 30}}
                        onPress={() => {this.snap()}}>
                        <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', marginLeft: 6}}></View>
                        </View>
                    </TouchableOpacity>
                    <View>
                    </View>
                </View>
            </View>
          </Modal>)
    }

    snap = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)

            let hex_md5 = md5.hex_md5( data.base64 ) + "-" + md5.hex_md5(new Date().getTime());
            data = {md5: hex_md5, uri: data.uri};
            
            this.setState({
                cameraModal: false,
                medias: [...this.state.medias, data],
            });

            this.uploadFiles();
        }
    };

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {

            if (photos.length == 0) {
                this.setState({imageBrowserOpen: false});
                return;
            }

          this.setState({
            imageBrowserOpen: false,
            medias: [...this.state.medias, ...photos]
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
                
                <ImageBrowser max={4} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    renderAlbumBody() {
        const {environment, theme, taskout} = this.state.data;

        return (<View>
            <View style={styles.userName}>
                <Image style={styles.profilepic} source={{uri: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'}}/>
                <View style={styles.UserNameView}>
                    <Text style={styles.userNameTextStyle1}>{taskout.post.author.name} {taskout.post.author.surname}</Text>
                    <Text style={styles.userNameTextStyle2}>{this.state.albumTime}</Text>
                </View>
            </View>

            <View style={styles.bigTextbox}>
                <Text style={styles.bigTextFontStyle}>
                    {taskout.post.message}
                </Text>
            </View>

            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                        Condiviso con 10 utenti
                    </Text>
                    <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                        Add contributor
                    </Text>
                    <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.openUploadMenu()}
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                        Upload Attachements
                    </Text>
                    <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                        <Text style={{fontFamily: 'Roboto-Regular', fontSize: 16, marginTop: 3}}>({this.state.medias == undefined ? 0 : this.state.medias.length}) </Text>
                        <Ionicons  style={styles.forwardIcon} name={"ios-attach"} size={25} color={Colors.main}/>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>);
    }

    renderImages() {
        return(
            <View style={{backgroundColor: 'transparent'}}>
                <ScrollView style={horizontalImages.imagesContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {this.renderMedias()}
                </ScrollView>
            </View>
                
        );
    }

    navigateToCollabView(data) {
        ApplicationConfig.getInstance().index.props.navigation.navigate("CollabView", {data, renderAll: false});
    }

    renderMedias() {
        if(this.state.medias != undefined && this.state.medias.length > 0) {
            if (this.state.medias[0].url == 'undefined.pdf') {
                this.state.medias[0].url = 'AON_IT_Develpoment_and_Security_Standards_V02.pdf';
            }

            return this.state.medias.map((i, index) => {
                return ( (i.url == 'AON_IT_Develpoment_and_Security_Standards_V02.pdf') ? 
                    <TouchableOpacity key={index} style={[horizontalImages.imageContainer, Shadow.filterShadow]} onPress={() => this.navigateToCollabView(i)}>
                        {this.renderPdfIcon()}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity key={index} style={[horizontalImages.imageContainer, Shadow.filterShadow]} onPress={() => this.navigateToCollabView(i)}>
                        <CachedImage cachedSource={{uri: getAddressForUrl(i.url), cache: 'force-cache'}} style={horizontalImages.img} resizeMode={"cover"}/>
                    </TouchableOpacity>
                )
            });
        }

        return null;
    }

    renderQuickViewSection() {
        return (<View>
            <View style={styles.QuickViewContainer}>
                <Text style={styles.QuickViewText}>Quick View</Text>
            </View>
            {this.renderImages()}
        </View>);
    }

    renderAllFilesGroup() {
        if(this.state.medias == undefined || this.state.medias.length == 0) {
            return null;
        }

        return (<View>
            <View style={styles.QuickViewContainer}>
                <Text style={styles.QuickViewText}>All Files</Text>
            </View>

            {
                this.state.medias.map((i, index) => {
                    return (<DefaultRow>
                        <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <CachedImage style={styles.menuThumbNail} 
                                    cachedSource={{uri: getAddressForUrl(i.url), cache: 'force-cache'}}/>
                                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                    <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                        Image
                                    </Text>
                                </View>
                            </View>
                            {this.state.fileprogress[index] < 1 ?
                                <Progress.Circle size={22} animated={true} progress={this.state.fileprogress[index]} color={Colors.main} thickness={2} style={{position: 'absolute', right: 10, marginTop: 10}}/>
                            :
                                <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                    <EvilIcons name={"close"} color={Colors.main} size={24} />
                                </View>
                            }
                            {this.state.fileprogress[index] < 1 ?
                                <View style={{position: 'absolute', bottom: 0, }}>
                                    <Progress.Bar width={width} animated={true} progress={this.state.fileprogress[index]} color={Colors.main} borderRadius={0} borderWidth={0} height={2} />
                                </View>
                            :null }
                        </TouchableOpacity>
                    </DefaultRow>)
                })
            }
        </View>)
    }

    renderHeader() {
        const {environment, theme, profile, taskout} = this.state.data;

        return (<View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingLeft: 0,
                borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
            <View style={{flex:1}}>
                <CachedImage style={{flex: 1, height: 48, width: width, 
                                position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                cachedSource={{uri: getAddressForUrl(theme.mediaUrl), cache: 'force-cache'}} />
                <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between', width: width}}>
                    <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 4, paddingTop: 5}}>
                        <TouchableOpacity onPress={() => this.goBack()}>
                            <EvilIcons name={"close"} size={22} color={Colors.main}/>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16, marginLeft: 5}}>
                            <Text style={styles.name}>{taskout.post.message} {theme.tagName}</Text>
                            <Text style={[styles.name, {color: environment.mediaUrl}]}> {environment.tagName}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, marginRight: 20}}>
                        <Text style={[styles.name, {fontFamily: 'Roboto-Bold', color: Colors.main, fontSize: 16 }]}>Add +</Text>
                    </View>
                </View>
            </View>
        </View>)
    }

    renderActions() {
        return (<View>
            <DefaultRow>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={[styles.rowTextStyle, {color: Colors.main, textAlignVertical: 'center', height: 'auto'}]}>
                                Archivia Album
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </DefaultRow>

            <DefaultRow>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 34}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={[styles.rowTextStyle, {color: '#E64E17', textAlignVertical: 'center', height: 'auto'}]}>
                                Elimina Album
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </DefaultRow>
        </View>);
    }

    renderPdfIcon() {
        return (
            <View style={[horizontalImages.img, {backgroundColor: Colors.grayText, justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={[styles.rowTextStyle, {color: '#FFFFFF', height: 'auto'}]}>PDF</Text>
            </View>
        );
    }

    render() {
        const {environment, theme, profile, taskout} = this.state.data;
        return ( 
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                                : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                                : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
                
                {this.renderHeader()}

                <ScrollView style={{backgroundColor: Colors.white, paddingBottom: 80}} >
                    {this.renderAlbumBody()}

                    {this.renderQuickViewSection()}
                    {this.renderAllFilesGroup()}                    
                    {this.renderActions()}
                </ScrollView>
                <BottomMenu referer={(b) => {this.bottomMenuContainer = b}}
                    browse={() => this.selectFile()} picture={() => this.selectPicture()}/>
                {this._renderImagePickerModal()}
                {this.renderCameraModal()}
            </View>
        );
    }
}

const horizontalImages = StyleSheet.create({
    imagesContainer: {
        height: 180,
        width: width,
        zIndex: 9999,
        backgroundColor:'#F2F4F4',
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
        fontFamily: 'Roboto-Light',
        fontSize: 14
    }
});


const styles = StyleSheet.create({

headerContainer:{    
        
    paddingRight:5,
    borderBottomWidth:1,
    borderColor:'#F8F9F9',
    marginLeft:10,
    marginTop:10,
    flex: 1, 
    flexDirection: 'row',
    },

    name: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14
    },

    rowTextStyle: {
        fontFamily: 'Roboto-Light',
        color: '#000000',
        fontSize: 16,
        paddingLeft: 5,
        paddingTop: 0
    },

WebViewContainer: {
 
    width:'100%',
    height:300,
    marginTop:0,
},

guideLineView:{
    padding:5,
},
    
QuickViewContainer:{
    
    backgroundColor:'#F2F4F4',
    paddingBottom:10,

},

bigImageContainer:{

    width:'100%',
    height:300,


},
QuickViewText:{
    color:'#999999',
    fontSize:12,
    fontFamily: 'Roboto-BoldItalic',
    marginLeft:15,
    marginTop:10,
    
},

imageViewContainer:{
    flexDirection:'row',

},
imageStyle:{
    
    width: 130, 
    height: 200,
    borderRadius:15,
    marginLeft:20,
    marginTop:10,
    
},

menuThumbNail:{
    width: 40, 
    height: 40,
    borderRadius:5,
    marginRight:10,
    backgroundColor: 'transparent'
},

profilepic:{
    width:38,
    height:38,
    borderRadius:19,
    marginTop:10,
},
menuThumbNailContainer:{
    flexDirection:'row',
    justifyContent: 'space-between',
    height:50,
    borderBottomWidth:1,
    borderColor:'#E5E7E9',
    paddingTop:10,
    marginRight:20,
    
},
Textbox:{

    paddingTop:8,
},

addButton:{
        justifyContent:'flex-end',
        flex: 1, 
        flexDirection: 'row',
        marginTop:5,
    },
    
addButtonStyle:{ 
        
        right: 5,
        fontSize:15,
        marginRight:10,
        color:'blue',
    },
    
    
TaskTag:{
        fontSize:15,
        color:'pink',
      },
    
bigTextbox:{
    padding:20,
    paddingTop: 10,
    borderColor: Colors.black,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: StyleSheet.hairlineWidth
},

bigTextFontStyle: {
    fontFamily: 'Roboto-Light',
    fontSize: 16
},

miniMenuView:{
    flexDirection:'column',
},

miniMenuSingle:{
    flexDirection:'row',
    justifyContent: 'space-between',
    height:50,
    borderBottomWidth:1,
    borderColor:'#E5E7E9',
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20,
    
},

UploadView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    borderColor:'#E5E7E9',
    padding:5,
    marginLeft:20,
   
},

UploadIcons:{
    marginLeft:10,
},

userName:{
    flex: 1, 
    flexDirection: 'row',
    marginTop:5,
    marginLeft:20,
    padding:5,
},

UserNameView:{
    padding:5,
    marginTop: 8,
    marginLeft: 10
},

userNameTextStyle1:{
    fontSize:16,
    fontFamily: 'Roboto-Light',
    color:'black',
},
userNameTextStyle2:{
    marginTop: 4,
    fontSize:12,
    fontFamily: 'Roboto-Light',
    color: '#999999'
},

textStyle:{
    fontSize:15,
    fontFamily:'Roboto-Bold',
    color:'black',
  },
});