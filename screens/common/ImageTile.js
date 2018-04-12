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
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                <TouchableOpacity
                    onPress={this.snap.bind(this)}
                    style = {cameraStyles.capture}>
                    <Text style={{fontSize: 14}}> SNAP </Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>)
  }

  snap = async () => {
      if (this.camera) {
          const options = { quality: 0.5, base64: true };
          const data = await this.camera.takePictureAsync(options)
          console.log(data.uri);
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