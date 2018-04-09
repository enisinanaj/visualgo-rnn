import React, { Component } from 'react';
import { Text, 
    View, 
    Button, 
    Modal, 
    StyleSheet, 
    Dimensions, 
    ListView, 
    TouchableOpacity,
    ScrollView,
    TextInput} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import Colors from '../../constants/Colors';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Shadow from '../../constants/Shadow';
// import { Font, AppLoading } from 'expo';
import Router from '../../navigation/Router';
import DisabledStyle from '../../constants/DisabledStyle';

export default class FitlerBar extends Component {
    constructor(props) {
        super(props);

        var filters = this.props.data;
        filters.push('last-padding');

        this.state = {
            headTitle: this.props.headTitle,
            filtersSource: ds.cloneWithRows(filters),
            searchWidth: 44,
            searchQuery: '',
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
        setTimeout(() => {
            this.setState({filtersSource: ds.cloneWithRows(this.props.data), searchQuery: ''});
            try {
                this.searchBoxRef.measure( (fx, fy, width, height, px, py) => {
                    this.setState({searchBoxX: px});
                });
            } catch (e) {}
        }, 300)
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
        //     'roboto': require('../../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf')
        // });

        this.setState({ isReady: true });
    }

    _toggleSearch() {
        var filters = this.props.data;
        var searchButton = filters.filter(it => it.type == 'search');

        this.listViewRef.scrollTo({x: this.state.searchBoxX - 20, y: 0, animated: true});

        if (searchButton == undefined || !searchButton.fixedOpen) {
            if (this.state.searchWidth == 44) {
                this.setState({searchWidth: width - 50});
            } else {
                this.setState({searchWidth: 44});
            }
        }

        if (searchButton != undefined && searchButton.onType != undefined) {
            this.searchButton.onType(q);
        }

        var lastPadding = filters.filter(it => it == 'last-padding');
        if (lastPadding == undefined || lastPadding == null) {
            filters.push('last-padding');
        }

        this.setState({filtersSource: ds.cloneWithRows(filters), searchQuery: ''});
    }

    _setQuery(sender, q) {
        console.log("sender: " + sender);
        console.log("query: " + q);

        this.setState({searchQuery: q});

        if (sender.onType != undefined) {
            sender.onType(q);
        }

        return true;
    }

    drawElements(data) {
        if (data.visible == undefined || data.visible === true) {
            if (data.type === 'search' && !data.fixedOpen) {
                return (
                    <View style={[styles.searchButtonContainer, 
                            Shadow.filterShadow, 
                            {width: this.state.searchWidth}]} ref={searchBox => this.searchBoxRef = searchBox}>
                        <TouchableOpacity onPress={() => this._toggleSearch()}>
                            <EvilIcons name={'search'} size={22} color={Colors.main} style={{left: 2, width: 22, marginRight: 10}}/>
                        </TouchableOpacity>
                        {this.state.searchWidth > 44
                            ? 
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput underlineColorAndroid={'rgba(0,0,0,0)'} 
                                    placeholder={data.searchPlaceHolder}
                                    autoFocus={data.autoFocus != undefined ? data.autoFocus : true}
                                    style={{backgroundColor: 'transparent', width: 200, fontFamily: 'roboto-light', fontSize: 14}}
                                    onChangeText={(arg) => {this._setQuery(data, arg)} }
                                    ref="searchTextBox" value={this.state.searchQuery} /> 
                                <TouchableOpacity onPress={() => this._toggleSearch()}>
                                    <EvilIcons name={"close"} size={20} color={Colors.main} />
                                </TouchableOpacity>
                            </View>
                        : null}
                    </View>
                )
            } else if (data.type === 'search' && data.fixedOpen) {
                var searchWidth = width - 50;
                return (
                    <View style={[styles.searchButtonContainer, 
                        Shadow.filterShadow, 
                        {width: searchWidth}]} ref={searchBox => this.searchBoxRef = searchBox}>
                    <TouchableOpacity onPress={() => this._toggleSearch()}>
                        <EvilIcons name={'search'} size={22} color={Colors.main} style={{left: 2, width: 22, marginRight: 10}}/>
                    </TouchableOpacity>
                    {searchWidth > 44
                        ? 
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TextInput underlineColorAndroid={'rgba(0,0,0,0)'} 
                                placeholder={data.searchPlaceHolder}
                                autoFocus={data.autoFocus != undefined ? data.autoFocus : true}
                                style={{backgroundColor: 'transparent', width: 200, fontFamily: 'roboto-light', fontSize: 14}}
                                onChangeText={(arg) => {this._setQuery(data, arg)} }
                                ref="searchTextBox" value={this.state.searchQuery} />
                            <TouchableOpacity onPress={() => this._toggleSearch()}>
                                <EvilIcons name={"close"} size={20} color={Colors.main} />
                            </TouchableOpacity>
                        </View>
                    : null}
                </View>);
            }

            if ((data.title === 'Stats') && (data.active == true)) {
                return (
                    <View style={[styles.statsButtonContainer, 
                        Shadow.filterShadow, 
                        {width: this.state.searchWidth}]}>
                        <Ionicons name={'ios-podium-outline'} size={22} color={Colors.yellow} style={{left: 2, width: 22, marginRight: 10}}/>
                    </View>
                )
            }

            if (data == 'last-padding') {
                return (
                    <View style={{width: 30, backgroundColor: 'transparent'}}></View>
                );
            }

            if(data.active != undefined && data.active){
                if(data.title ===  'New'){
                    return (
                        <TouchableOpacity style={[styles.filterButtons, styles.buttonNewGroupStyle, Shadow.filterShadow]}
                            onPress={data.onPress}>
                            <Text style={[styles.filterButton, styles.buttonNewGroupContentStyle]}>{data.title}</Text>
                            <MaterialCommunityIcons style={styles.plusIcon} name={"plus-circle"} size={22} color={Colors.main} />
                        </TouchableOpacity>
                    )
                }else{
                    return (
                        <TouchableOpacity style={[data.selected ? styles.filterButtonsSelected : styles.filterButtons,
                            styles.buttonStyle, data.selected ? Shadow.filterShadow : {}, 
                            data.disabled ? DisabledStyle.disabled : {}]}
                            onPress={() => this.setSelected(data)}>
                            <Text style={[data.selected ? styles.filterButtonSelected : styles.filterButton,
                                styles.buttonContentStyle]}>{data.title}</Text>
                        </TouchableOpacity>
                    )
                }
            }
        }

        return null;


    }

    setSelected(b) {
        var buttons = this.props.data;

        if (b.onPress != undefined && b.disabled) {
            b.onPress();
            return;
        }

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].selected = false;

            if (buttons[i].title === b.title) {
                buttons[i].selected = true;
            }

            
            if (b.title === 'Group'){
                if(buttons.length > 4){

                    if(buttons[4].title === 'New'){
                        buttons[4].active = true;
                    }
                    
                }

            }else{
                if(buttons.length > 4){

                    if(buttons[4].title === 'New'){
                        buttons[4].active = false;
                    }
                    
                }
            }
        }

        if (b.onPress != undefined) {
            b.onPress();
        } else if (b.onSelected != undefined) {
            b.onSelected();
        }

        if (b.headTitle) {
            this.setState({headTitle: b.headTitle})
        }

        this.setState({filtersSource: ds.cloneWithRows(buttons)});
    }

    render() {
        // if (!this.state.isReady) {
        //     return <AppLoading />
        // }

        var {customStyle, innerStyle} = this.props;

        return <View style={[styles.filterBarContainer, customStyle ? customStyle : {}]}>
                {this.state.headTitle.length > 0 ? <Text style={styles.filterBarHeader}>{this.state.headTitle}</Text> : null}

                <ListView
                    horizontal={true}
                    ref={lv => this.listViewRef = lv}
                    style={[styles.filtersListView, innerStyle ? innerStyle : {}]}
                    dataSource={this.state.filtersSource}
                    showsHorizontalScrollIndicator={false}
                    renderRow={(data) => this.drawElements(data)}/>
                
            </View>;
    }
};

const styles = StyleSheet.create({
    filterBarContainer: {
        paddingTop: 14,
        paddingLeft: 0,
        paddingBottom:0,
        height:110,
        width: width
    },
    plusIcon: {
        marginLeft: 15,
        width: 22,
        borderRadius: 11,
        backgroundColor: 'transparent'
    },
    filterBarHeader: {
        fontSize: 14,
        fontWeight: '800',
        paddingLeft: 20,
        fontFamily: 'roboto-bold'
    },
    filtersListView: {
        flex: 1,
        height: 72,
        paddingBottom: 14,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 0,
        right: 0
    },
    searchButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 22,
        padding: 10,
        paddingTop: 14,
        height: 44,
        marginRight: 0,
        marginBottom: 14,
        marginLeft: 10,
        marginTop: 2
    },

    statsButtonContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 22,
        padding: 10,
        paddingLeft:12,
        height: 44,
        marginRight: 8,
        marginBottom: 14,
        marginLeft: 0,
        marginTop: 2
    },

    filterButtons: {
        backgroundColor: Colors.borderGray,
    },
    filterButtonsSelected: {
        backgroundColor: Colors.main
    },  
    filterButton: {
        color: Colors.main,
    },
    filterButtonSelected: {
        color: Colors.white,
    },

    buttonContentStyle: {
        padding: 0,
        paddingTop: 9,
        margin: 0,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'roboto-light'
    },
    buttonNewGroupContentStyle: {
        padding: 0,
        paddingTop: 10,
        margin: 0,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'roboto-bold'
    },
    buttonStyle: {
        flex: 1,
        borderRadius: 22,
        padding: 17,
        paddingTop: 5,
        height: 44,
        marginLeft: 8,
        minWidth: 75,
        marginTop: 2
    },
    buttonNewGroupStyle: {
        flex: 1,
        borderRadius: 22,
        padding: 8,
        paddingTop: 5,
        height: 44,
        marginRight: 0,
        marginLeft: 8,
        width: 44,
        marginTop: 2,
        backgroundColor: Colors.white
    }
});