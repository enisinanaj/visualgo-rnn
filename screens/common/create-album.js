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
    ScrollView
} from 'react-native';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNCamera } from 'react-native-camera';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import moment from 'moment';
import locale from 'moment/locale/it'
import ActionSheet from '@yfuks/react-native-action-sheet';

import DefaultRow from './default-row';
import NoOpModal from './NoOpModal';

import ImageBrowser from '../ImageBrowser';
import CreateVisualGuideline from '../common/create-visual-guideline';
import BottomMenu from '../common/BottomMenu';

import Colors from '../../constants/Colors';
import DisabledStyle from '../../constants/DisabledStyle';
import Shadow from '../../constants/Shadow';
import ApplicationConfig from '../helpers/appconfig';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class NewAlbum extends Component {

    pictureButtons;

    constructor(props) {
        super(props);

        this.closeThis = this.props.closeModal;

        this.pictureButtons = [
            'Photo & Video Library',
            'Use Camera',
            'Cancel'
        ];

        this.state = {
            isReady: true,
            hasCameraPermission: null,
            imageBrowserOpen: false,
            photos: [],
            files: [],
            visualGuidelineModal: false,
            cameraModal: false,
            hasCameraPermission: null
        }
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
            this.setState({
                cameraModal: false,
                photos: [data],
            });

            this.setState({visualGuidelineModal: true});
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
            photos
          });
          this.setState({visualGuidelineModal: true});
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

    async _getDocuments() {
        try {
            this.bottomMenuContainer.close();
        } catch(e) {

        }

        try {
            // iPhone/Android
            DocumentPicker.show({
                filetype: [DocumentPickerUtil.allFiles()],
            },(error,res) => {
                // Android
                const { uri, type: mimeType, fileName } = res;
                console.log("file: " + res);

                this.setState({files: [res], visualGuidelineModal: true});
            });
        } catch (e) {
            this.bottomMenuContainer.open();
            console.error(e);
        }
    }

    finishAlbum() {
        this.setState({visualGuidelineModal: true});
    }

    pushAlbum(album) {
        this.setState({visualGuidelineModal: false});
        setTimeout(() => {
            this.closeThis({album: album});
        }, 100);
    }

    allGuidelineData() {
        return (
            <Modal
                animationType={"fade"}
                transparent={false}
                visible={this.state.visualGuidelineModal}
                onRequestClose={() => this.setState({visualGuidelineModal: false})}>
                
                <CreateVisualGuideline closeModal={(album) => this.pushAlbum(album)} theme={this.props.theme} environment={this.props.environment}
                    files={[...this.state.photos, ...this.state.files]} onBackClosure={true} owner={this.props.owner}/>
            </Modal>
        );
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', paddingTop: 16, borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.borderGray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <TouchableOpacity onPress={() => {this.closeThis({})}}>
                <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
              </TouchableOpacity>

            {false ? 
              <TouchableOpacity onPress={() => {this.finishAlbum()}}>
                <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Pubblica</Text>
              </TouchableOpacity>
            : null}
          </View>
        );
    }

    renderThemeRow() {
        var {theme} = this.props;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={[styles.themePhotoContainer, Shadow.smallCardShadow]}>
                    <Image source={{uri: theme.photo.url}} style={{width: 26, height: 26, borderRadius: 4}} />
                </View>
                <Text style={styles.themeName}>{theme.themeName}</Text>
            </View>
        )
    }

    renderEnvironmentRow() {
        var {environment} = this.props;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={[styles.environmentCircle, Shadow.filterShadow]}>
                    <FontAwesome name={"circle"} size={30} color={environment.background} />
                </View>
                <Text style={[styles.themeName, {color: environment.background}]}>
                    {environment.environmentName}
                </Text>
            </View>
        )
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

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }
        
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                <View style={styles.statusBarBackground} />
                {this.renderHeader()}
                <View style={{marginLeft: 30, marginRight: 30, flex: 1}}>
                    <Text style={styles.largeTitle}>
                        New Visual Guideline Album for
                    </Text>
                    <DefaultRow renderChildren={() => this.renderThemeRow()} noborder={true} style={{marginTop: 20, paddingLeft: 0}} />
                    <DefaultRow renderChildren={() => this.renderEnvironmentRow()} noborder={true} style={{paddingLeft: 0}} />
                    <Text style={styles.infoText}>
                        A new Visual Guideline Album will be created and linked to the #Theme and the @Environemnt selected. After that the album will be available in the visual guideline area under the name "
                        {this.props.theme.themeName} - <Text style={{color: this.props.environment.background}}>{this.props.environment.environmentName}</Text>"
                    </Text>
                </View>
                <BottomMenu referer={(b) => {this.bottomMenuContainer = b; this.bottomMenuContainer.open()}}
                    browse={() => this._getDocuments()} picture={() => this.selectPicture()}/>
                {this._renderImagePickerModal()}
                {this.allGuidelineData()}
                {this.renderCameraModal()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.white
    },
    statusBarBackground: {
        backgroundColor: Colors.main,
        height: 20,
    },
    largeTitle: {
        fontSize: 30,
        fontFamily: 'roboto-bold',
        marginTop: 14,
        color: Colors.main
    },
    environmentCircle: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        height: 30,
        width: 30,
        marginRight: 12,
        padding: 0
    },
    themePhotoContainer: {
        height: 30,
        width: 30,
        backgroundColor: Colors.white,
        borderRadius: 4,
        padding: 2,
        marginRight: 12
    },
    themeName: {
        color: Colors.black,
        fontSize: 22,
        fontFamily: 'roboto-bold',
        marginTop: 3
    },
    infoText: {
        fontSize: 18,
        fontFamily: 'roboto-light',
        marginTop: 20
    },
    optionsMenu: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginBottom: 15
    },
    menuElement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
    }
});