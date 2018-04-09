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
    var {selectImage} = this.props;

    return (<Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.cameraModal}
        onRequestClose={() => this.setState({cameraModal: false})}>
        <View style={{ flex: 1 }}>
          {/* <Camera style={{ flex: 1 }} type={this.state.type} ref={c => this.camera = c}>
            <TouchableOpacity onPress={() => {this.setState({cameraModal: false}); this.props.selectImage({cancelled: true});}} style={{backgroundColor: 'transparent', marginTop: 30, marginLeft: 10}}>
                <Text style={{ fontSize: 22, marginBottom: 10, color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
            <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', height: 70, width: width, position: 'absolute', bottom: 0}}>
              <TouchableOpacity style={{marginLeft: 20, width: 60}}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
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
          </Camera> */}
        </View>
      </Modal>)
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();

      this.props.selectImage(photo);
      this.setState({cameraModal: false});
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