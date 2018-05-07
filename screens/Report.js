import React from 'react';
import { StyleSheet, video,ListView, Dimensions, ScrollView,FlatList, 
    Platform, fontWeight, Image, backgroundColor, Text, fontFamily, 
    fontSize, View, Button, TouchableHighlight, TextInput, 
    TouchableOpacity, Alert, RefreshControl} from 'react-native';
import { NavigatorIOS, WebView,} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Pie from './pie';
import Colors from '../constants/Colors';
import FilterBar from './common/filter-bar';
import appconfig from './helpers/appconfig';
import Shadow from '../constants/Shadow';

const {width, height} = Dimensions.get('window');

export default class Report extends React.Component {
    
    constructor() {
        super();

        this.state = {
            stats: [],
            refreshing: false
        };
    }

    componentDidMount() {
        this.loadStats();
    }

    async loadStats() {
        this.setState({stats: []});

        await fetch("https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/gettasksstats?iduser=" + appconfig.getInstance().me.id)
            .then((response) => {return response.json()})
            .then((responseJson) => {
                if (responseJson == "") {
                    return;
                }

                console.log("stats response is: " + responseJson);

                try {
                    let stats = JSON.parse(responseJson);
                    this.setState({stats: stats, refreshing: false});
                } catch (e) {
                    console.log(e);
                    console.log("stats response: " + JSON.stringify(responseJson));
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderFilters() {
        filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
            {title: 'All', selected: true, active: true}, 
            {title: 'Survey', active: true}, 
            {title: 'Task', active: true}];

        return <View style={styles.filterBarContainer}>
                <FilterBar data={filters} headTitle={""} />
            </View>;
    }

    renderTaskStats() {
        return this.state.stats.map((o, i) => {
            return <View style={styles.chartContainer} key={i}>
        
                <View style={[styles.pieContainer, {flex:1}, Shadow.filterShadow]}>

                    <View style={styles.taskThemeTag}>
                        <View style={styles.UserNameView}>
                            <Text style={styles.taskTheme}>{o.task.name} {o.task.themeTagName}</Text>
                            <Text style={[styles.tag1, {color: o.task.envUrl}]}>{o.task.envTagName}</Text>
                        </View>
                    </View>
            
                    <View style={styles.pieDescriptors}>
                        <View >
                            <Text style={styles.chartTextCaricate}>{o.totalMediaUploaded}/{o.totalMediaToUpload}</Text>
                            <Text style={styles.chartTextCaricate}>Caricate</Text>
                        </View>
                        <View>
                            <Text style={styles.chartTextDaApprovare }>{o.totalMediaToApprove}</Text>
                            <Text style={styles.chartTextDaApprovare}>Da approvare</Text>
                        </View>
                        <View>
                            <Text style={styles.chartTextApprovato}>{o.totalMediaApproved}</Text>
                            <Text style={styles.chartTextApprovato}>Approvate</Text>
                        </View>
                    </View>
                </View>

                <ScrollView horizontal={true} style={[styles.pieContainerScrollView] }>
                    <View style={styles.singleChart}>
                        <Pie style={styles.pieStyle}
                        radius={100}
                        innerRadius={60}
                        series={[o.totalMediaApproved * o.totalMediaToUpload/100, o.totalMediaApproved * o.totalMediaToUpload / 100, o.totalMediaToApprove * o.totalMediaToUpload / 100]}
                        colors={['#FAFAFA', Colors.main, Colors.yellow]}/>
                            <View style={styles.chartMiddle}>
                                <Text style={styles.chartMiddleText}>{o.totalMediaToApprove * o.totalMediaToUpload / 100}%</Text>
                            </View>
                    </View>        
                </ScrollView>
            </View>
        })
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.loadStats();
    }

    render() {
        return (
            <View>
                <View style={{backgroundColor: Colors.main, height: 20}}></View>
                <View style={styles.headerContainer}>
                    <View style={styles.guideLineView}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Ionicons name={"md-close"} size={23} style={{marginTop: 4}} color={Colors.main}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerTitle}>
                        <Text style={styles.textStyle}>Task report</Text>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    } >
                    {this.renderFilters()}
                    {this.renderTaskStats()}
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({

headerContainer: {
    backgroundColor: Colors.white,        
    paddingRight: 15,
    paddingTop: 15,
    paddingLeft: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderGray,
    flexDirection: 'row',
},

headerTitle:{
    marginLeft:130,
    paddingRight:10,
    paddingTop:10,
    paddingBottom:10,
    fontSize:20,
},
textStyle:{
    fontSize:14,
    fontFamily: 'Roboto-Bold',
    color: 'black',
  },

pieDescriptors:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingBottom:20,
    marginTop:280,
    marginLeft:10,
    marginRight:10,
},

filterBarContainer: {
    backgroundColor: Colors.white,
    width: width,
    height: 100
},

singleChart: {
    margin: 27,
    width: 190,
},
chartMiddleText:{
    fontSize:30,
    color:'#D6DBDF',
},

chartTextCaricate:{
    fontSize:16,
    fontFamily: 'Roboto-Light',
    color:'#999999'
},
chartTextDaApprovare:{
    fontSize:16,
    fontFamily: 'Roboto-Light',
    color: Colors.yellow,
    textAlign: 'center'
},
chartTextApprovato:{
    fontSize:16,
    fontFamily: 'Roboto-Light',
    color: Colors.main,
    textAlign: 'right'
},
pieContainer:{
    flexDirection: 'column',
    flex: 1,
    height: null,
    backgroundColor:'white',
    borderRadius:18,
    elevation: 1,
    margin:7,
    padding:10,
},

pieContainerScrollView:{
    flexDirection: 'row',
    position:'absolute',
    flex: 1,
    height: 250,
    backgroundColor:'transparent',
    borderRadius:15,
    marginTop:80
},


chartMiddle:{
    position:'absolute',
    marginLeft:80,
    marginTop:80,
},

taskThemeTag:{

    flexDirection: 'row',
    marginTop:5,
    marginLeft:10,
    padding:5,
},

taskTheme:{
    fontSize:18,
    fontFamily: 'Roboto-Bold',
    color:'black',
},
tag1:{
    fontSize:18,
    fontFamily: 'Roboto-Bold'
}


});