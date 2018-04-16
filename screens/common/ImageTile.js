import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Modal
} from 'react-native';

import Colors from '../../constants/Colors';
import { RNCamera } from 'react-native-camera';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { openCamera, getFileExtension, getFileName } from '../helpers';
import ApplicationConfig from '../helpers/appconfig'

const { width } = Dimensions.get('window')

export default class ImageTile extends React.PureComponent {

  constructor (props) {
    super(props);

    this.state = {
      cameraModal: false,
      hasCameraPermission: false
    }
  }
  
  async componentWillMount() {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === 'granted' });
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
                ref={ref => {
                this.camera = ref;
                }}
                style = {cameraStyles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
            />
            <TouchableOpacity onPress={() => {this.setState({cameraModal: false}); this.props.selectImage({cancelled: true});}} 
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
        console.debug("options: " + options);
        const data = await this.camera.takePictureAsync(options)
        console.debug("data uri: " + data);
        this.setState({cameraModal: false});
        this.props.selectImage(data);
      }      
  };

  render() {
    let { item, index, selected, selectImage } = this.props;
    if (!item) return null;

    if (item == 'camera') {
      return (
        <TouchableOpacity onPress={() => this.setState({cameraModal: true})}>
          <View style={styles.cameraSelection}>
            <FontAwesome name="camera" size={50} color={"#AAAAAA"} />
          </View>
          {this.renderCameraModal()}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableHighlight
        style={{opacity: selected ? 0.5 : 1}}
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >
        <View>
          <Image
            style={{width: width/3 - 5, height: width/3 - 5, margin: 2.5}}
            source={{uri: item}}
          />
          <Ionicons name={selected ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
                size={30} color={selected ? Colors.main : Colors.gray} style={{position: 'absolute', bottom: 10, right: 10}}/>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  cameraSelection: {
    width: width/3 - 5,
    height: width/3 - 5,
    margin: 2.5,
    backgroundColor: '#DDDDDD',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});