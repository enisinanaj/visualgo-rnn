import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  CameraRoll,
  FlatList,
  Dimensions,
  Button,
  StatusBar,
  Platform
} from 'react-native';
import Colors from '../constants/Colors';
import ImageTile from './common/ImageTile';

import RNFetchBlob from 'react-native-fetch-blob';
import md5 from  'react-native-md5'
import { isIphoneX, getFileName, getFileExtension } from './helpers';

const { width } = Dimensions.get('window')

export default class ImageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: ['camera'],
      selected: {},
      after: null,
      has_next_page: true,
      takenPictures: []
    }
  }

  selectImage = (index) => {
    let newSelected = {...this.state.selected};
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true
    }
    if (Object.keys(newSelected).length > this.props.max) return;
    if (!newSelected) newSelected = {};
    this.setState({ selected: newSelected })
  }

  shiftSelectedImages() {
      let newSelected = {};

      for (k in this.state.selected) {
        newSelected[++k] = this.state.selected[--k];
      }

      this.setState({selected: newSelected});
      this.selectImage(1); // selected just captured image
  }

  selectNewCameraImage = (image) => {
    if (image.cancelled) {
        return null;
    }

    let photos = this.state.photos.filter((it) => it != 'camera')

    this.setState({
        photos: ['camera', image.uri, ...photos],
        takenPictures: [...this.state.takenPictures, image]
    });

    this.shiftSelectedImages();
  }

  getPhotos = () => {
    let params = { first: 50, mimeTypes: ['image/jpeg'] };
    if (this.state.after) params.after = this.state.after
    if (!this.state.has_next_page) return
    CameraRoll
      .getPhotos(params)
      .then(this.processPhotos)
  }

  processPhotos = (r) => {
    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map(i=> i.node).map(i=> i.image).map(i=>i.uri)
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  getItemLayout = (data,index) => {
    let length = width/3;
    return { length, offset: length * index, index }
  }

  prepareCallback() {
    let { selected, photos } = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return(selected[index])
    });

    let files = [];
    
    selectedPhotos
    .forEach(element => {
      files.push(this.readFile(element))
    })
    
    let callbackResult = Promise.all(files)
    this.props.callback(callbackResult)
  }

  async readFile(url) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs.readFile(url, 'base64')
      .then((data) => {
        let hex_md5 = md5.hex_md5( data ) + "-" + md5.hex_md5(new Date().getTime());
        resolve({data: data, md5: hex_md5, uri: url})
      })
      .catch(() => {
        var file;
        for (var i = 0; i < this.state.takenPictures.length; i++) {
          if (this.state.takenPictures[i].uri == url) {
            file = this.state.takenPictures[i];
          }
        }
        if (file == undefined || file == null) {
          console.debug("PHO05 - photo selection rejected. Tried to select a captured picture but not found it's data.");
          reject();
        }

        let hex_md5 = md5.hex_md5( file.base64 ) + "-" + md5.hex_md5(new Date().getTime());
        resolve({md5: hex_md5, uri: file.uri});
      })
    })
  }

  renderHeader = () => {
    let selectedCount = Object.keys(this.state.selected).length;
    let headerText = "Camera Roll"; //selectedCount + ' Selected';
    return (
      <View>
        <StatusBar barStyle={'light-content'} animated={true} />
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        <View style={styles.header}>
          <Button
            title="Cancel"
            onPress={() => this.props.callback(Promise.resolve([]))}
          />
          <Text style={{fontSize: 20}}>{headerText}</Text>
          <Button
            title="Done"
            onPress={() => this.prepareCallback()}
          />
        </View>
      </View>
    )
  }
  
  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false
    return(
      <ImageTile
        item={item}
        index={index}
        selected={selected}
        selectImage={item == 'camera' ? this.selectNewCameraImage : this.selectImage}
      />
    )
  }

  renderImages() {
    return(
      <FlatList
        data={this.state.photos}
        numColumns={3}
        renderItem={this.renderImageTile}
        keyExtractor={(_,index) => index}
        onEndReached={()=> {this.getPhotos()}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text style={{marginLeft: 15, marginTop: 15, fontSize: 20}}>Loading...</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.lightGray
  },
})
