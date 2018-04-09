/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

// import {AppLoading, Font} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import locale from 'moment/locale/it'

import Colors from '../../constants/Colors';
import {getProfile} from '../helpers';
import ImagePost from './image-post';
import Button from './button';
import Shadow from '../../constants/Shadow';
import ApplicationConfig from '../helpers/appconfig';


const {width, height} = Dimensions.get('window');

export default class NewsFeedItem extends Component {
    constructor(props) {
        super(props)
        moment.locale("it")

        let {data} = this.props

        this.state = {
            time: moment(new Date(data.created)).format("D MMMM [alle ore] HH:mm"),
            buttons: ['Comment', 'Stats'],
            icons: ['comment', 'ios-podium-outline'],
            iconTypes: ["evilicon"],
            iconColors: [Colors.main, Colors.yellow],
            likes: 0,
            isReady: false,
            comments: data.comments == undefined ? 0 : data.comments.length
        };
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
        //     'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
        //     'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        // });

        this.setState({ isReady: true });
    }

    buttonOnPress(name) {
        console.log(name);
        switch(name) {
            case 'Like':
                this.setState({likes: this.state.likes + 1});
                break;
            case 'Dislike':
                this.setState({likes: this.state.likes - 1});
                break;
            case 'Comment':
                this.setState({comments: this.state.comments + 1});
                break;
            default:
                return
        }
    }

    openPostSummary(post) {
        ApplicationConfig.getInstance().index.props.navigation.navigate("PostSummary", {post});
    }

    renderAvatar() {
        const {time} = this.state;
        let {data} = this.props;
        let profile = {};

        try {
            profile = JSON.parse(data.profile);
        } catch(e) {
            return null;
        }
        
        return (<View style={styles.avatarContainer}>
                <Image style={styles.profile} source={{uri: 'https://s3.amazonaws.com/visualgotest-hosting-mobilehub-922920593/uploads/' + profile.mediaurl}}/>
                <TouchableOpacity style={styles.nameContainer} onPress={() => this.openPostSummary(data)}>
                    <Text style={styles.name}>{profile.name} {profile.surname}</Text>
                    <Text style={styles.time}>{time}</Text>
                </TouchableOpacity>
                <Ionicons name="ios-more-outline" color={Colors.main} size={30} style={{position: 'absolute', right: 0, top: -10}} />
            </View>
        )
    }

    renderLikesAndComments() {
        const {likes, comments} = this.state;

        if(likes == 0 && comments == 0) {
            return
        }

        return null /*(
            <View style={styles.likesComments}>
                <Text style={styles.likeText}>{likes > 0 ? <Ionicons name='md-thumbs-up' color={Colors.main}/> : ''}{likes == 0 ? '' : ' ' + likes}</Text>
                <Text style={styles.likeText}>{comments == 0 ? '' : comments + ' Comments'}</Text>
            </View>
        )*/
    }

    renderLikeBar() {
        const {buttons, icons, iconTypes, iconColors} = this.state;
        return buttons.map((button, i) => {
            return (
                <Button key={i} name={button} onPress={this.buttonOnPress.bind(this)} icon={icons[i]} 
                    iconType={iconTypes[i]} iconColor={iconColors[i]} />
            )
        })
    }

    renderContent() {
        const {data} = this.props;
        if(data.medias != undefined && data.medias.length > 0) {
            return (
                <ImagePost imageCount={data.medias.length} images={data.medias} style={styles.imageStyle} textContent={data.message}
                    onPress={() => {}} useBasePath={true}/>
            )
        }

        return (
            <View style={styles.content}>
                <Text style={{fontFamily: 'roboto-light'}}>{data.message}</Text>
            </View>
        )
    }

    render() {
        // if (!this.state.isReady) {
        //   return <AppLoading />;
        // }

        var {data} = this.props;

        //{backgroundColor: data.backgroundMediaUrl}
        return (
            <View style={[styles.container, Shadow.cardShadow]}>
                <View>
                    {this.renderAvatar()}
                    {this.renderContent()}
                    {this.renderLikesAndComments()}
                    <View style={styles.buttonContainer}>
                        {this.renderLikeBar()}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 6,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5,
    },

    content: {
        padding: 15,
        paddingTop: 0,
        paddingBottom: 15
    },

    line: {
        margin: 16,
        marginBottom: 0,
        borderColor: '#ddd'
    },

    avatarContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 15
    },

    nameContainer: {
        marginLeft: 8,
        justifyContent: 'space-around'
    },

    name: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'roboto-light'
    },

    time: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'roboto-light'
    },

    profile: {
        backgroundColor: 'transparent',
        height: 40,
        width: 40,
        borderRadius: 20
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.borderGray,
        height: 44,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 15,
        paddingRight: 15,
        borderTopWidth: 1,
    },

    buttonItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
        color: Colors.main
    },

    likeText: {
        fontSize: 12,
        color: Colors.grayText
    },

    likesComments: {
        padding: 16,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    imageStyle: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14
    }
})
