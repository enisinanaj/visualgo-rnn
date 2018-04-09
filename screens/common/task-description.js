import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  ScrollView,
  Keyboard } from 'react-native';

// import {Font, AppLoading} from 'expo';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from '../helpers';

const {width, height} = Dimensions.get('window');

export default class TaskDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: height,
      doneEnabled: false,
      description: '',
      isReady: false
    };
  }

  componentDidMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

    this.loadFonts();
  }

  async loadFonts() {
    // await Font.loadAsync({
    //   'roboto-light': '../../assets/fonts/Roboto-Light.ttf'
    // });

    this.setState({isReady: true});
  }

  componentWillUnmount() {
      Keyboard.removeListener('keyboardWillShow');
      Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
      this.setState({keyboardIsOpen: true});
      let newSize = height - e.endCoordinates.height
          this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
    this.setState({keyboardIsOpen: false});
      if(this.componentDidMount) {
          this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
      }
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Text style={{color: Colors.main, fontSize: 16, fontFamily: 'roboto-light'}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderDoneRow() {
    return (
        this.state.description != '' ?
        <View style={[styles.bottomBar]}>
          <TouchableOpacity onPress={() => {this.props.onDescriptionEntered(this.state.description)}}>
              <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View> : null
    )
}

  setDescriptionText(text) {
    this.setState({description: text, doneEnabled: text.length > 0});
  }

  render() {
    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    var {visibleHeight} = this.state;
    var textInputHeight = visibleHeight - 80; //80 => renderHeader().height more or less (need to check on Android)
    
    return (
      <View style={{height: visibleHeight}}>
        <StatusBar barStyle={'light-content'} animated={true}/>
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        {this.renderHeader()}
        {this.state.description.length > 0 ?
          <TouchableOpacity onPress={() => this.setState({description: ''})} style={styles.clearField}>
            <EvilIcons name={"close"} size={24} color={Colors.main} />
          </TouchableOpacity>
        : null}
        <ScrollView>
          <TextInput autoFocus={true} height={textInputHeight}
              style={{fontSize: 16,
                padding: 20,
                paddingTop: 10,
                fontFamily: 'roboto-light',
                paddingRight: 40}}
              multiline = {true}
              underlineColorAndroid={'rgba(0,0,0,0)'} 
              placeholderTextColor={Colors.grayText} 
              placeholder={"Descrivi il Task"}
              onChangeText={(text) => this.setDescriptionText(text)}
              value={this.state.description}/>
        </ScrollView>
        {this.renderDoneRow()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saveButton: {
    fontFamily: 'roboto-bold',
    color: Colors.white,
    fontSize: 16,
    marginTop: -3
  },
  clearField: {
    position: 'absolute',
    top: 80,
    right: 15,
    zIndex: 9999
  },
  doneEnabled: {
    color: Colors.main,
    fontWeight: '800',
    fontSize: 18
  },
  doneDisabled: {
    color: Colors.greyText,
    fontWeight: '200',
    fontSize: 18
  },
  bottomBar: {
    backgroundColor: Colors.main,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20
}
});