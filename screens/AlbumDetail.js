import React from 'react';
import { StyleSheet, video,ListView, ScrollView,
        FlatList, Platform, Image, 
        backgroundColor, Text, 
        Dimensions, StatusBar,
        View, Button, TouchableHighlight, 
        TextInput, TouchableOpacity, Alert,} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { NavigatorIOS, WebView} from 'react-native';
import moment from 'moment';

//import {Font, AppLoading} from 'expo';
import Colors from '../constants/Colors';
import DefaultRow from './common/default-row';
import { isIphoneX } from './helpers';
import ImageVisualGuideline from './common/image-visual-guideline';
import { AWS_OPTIONS } from './helpers/appconfig';
import Shadow from '../constants/Shadow';

var {width, height} = Dimensions.get("window");

export default class AlbumDetail extends React.Component {

    constructor(props) {
        super(props);
        moment.locale("it");

        var {data} = this.props.navigation != undefined ? this.props.navigation.state.params : {};

        this.state = {
            isReady: false,
            visibleHeight: height,
            data: data,
            albumTime: moment(new Date(data.taskout.post.created)).format("D MMMM [alle ore] HH:mm")
        };
    }

    componentDidMount() {
        this.loadFonts();

    }

    async loadFonts() {
        /*await Font.loadAsync({
            'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
            'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
            'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
            'roboto-bold-italic': require('../assets/fonts/Roboto-BoldItalic.ttf')
        });*/

        this.setState({isReady: true});
    }

    goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    renderAlbumBody() {
        const {environment, theme, profile, taskout} = this.state.data;

        return (<View>
            <View style={styles.userName}>
                <Image style={styles.profilepic} 
                        source={{uri: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'}}
                        />
                <View style={styles.UserNameView}>
                    <Text style={styles.userNameTextStyle1}>{profile.name} {profile.surname}</Text>
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
                <TouchableOpacity 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                        Upload Attachements
                    </Text>
                    <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                        <Text style={{fontFamily: 'Roboto-Regular', fontSize: 16, marginTop: 3}}>(6) </Text>
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

    renderMedias() {
        const {data} = this.state;
        
        if(data.taskout.post.medias != undefined && data.taskout.post.medias.length > 0) {
            return data.taskout.post.medias.map((i, index) => {
                return (<View key={index} style={[horizontalImages.imageContainer, Shadow.filterShadow]}> 
                        <Image source={{uri: AWS_OPTIONS.bucketAddress + i.url}} style={horizontalImages.img} resizeMode={"cover"}/>
                    </View>);
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
        const {data} = this.state;
        
        if(data.taskout.post.medias == undefined || data.taskout.post.medias.length == 0) {
            return null;
        }

        return (<View>
            <View style={styles.QuickViewContainer}>
                <Text style={styles.QuickViewText}>All Files</Text>
            </View>

            {
                data.taskout.post.medias.map((i, index) => {
                    return (<DefaultRow>
                        <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Image style={styles.menuThumbNail} 
                                    source={{uri: AWS_OPTIONS.bucketAddress + i.url}}/>
                                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                    <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                        Image
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                <EvilIcons name={"close"} color={Colors.main} size={24} />
                            </View>
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
                <Image style={{flex: 1, height: 48, width: width, 
                                position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                source={{uri: AWS_OPTIONS.bucketAddress + theme.mediaUrl}} />
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

    render() {
        /*if (!this.state.isReady) {
            return <AppLoading />;
        }*/

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

                    {/* <View style={{ height: 300 }}>
                        <WebView
                                style={ styles.WebViewContainer }
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                source={{uri: 'https://www.youtube.com/embed/gnKzljwIMdM'}}
                        />
                    </View>
                    <View>
                        <Image style={styles.bigImageContainer} source={{uri: 'http://www.urdesignmag.com/wordpress/wp-content/uploads/2015/01/3-gilles-boissier-designed-a-moncler-boutique-dedicated-entirely-to-men.jpg'}}/>
                    </View> */}
                    
                    {this.renderActions()}
                </ScrollView>
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
        fontWeight: '500',
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
        fontWeight: 'bold'
    },
    
    
TaskTag:{
        fontSize:15,
        fontWeight:'bold',
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
    fontFamily: 'roboto-light',
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
    fontFamily: 'roboto-light',
    color:'black',
},
userNameTextStyle2:{
    marginTop: 4,
    fontSize:12,
    fontFamily: 'roboto-light',
    color: '#999999'
},

textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black',
  },
});