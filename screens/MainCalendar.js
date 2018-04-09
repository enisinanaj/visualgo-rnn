import React, {Component} from 'react';
import {StatusBar, View, TouchableOpacity, Text, Dimensions, StyleSheet, Platform} from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

import Colors from '../constants/Colors';

// import {AppLoading, Font} from 'expo';
import moment from 'moment';
import locale from 'moment/locale/it'
import _ from 'lodash';

LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venderdì','Sabato'],
  dayNamesShort: ['D','L','M','M','J','V','S']
};

LocaleConfig.defaultLocale = 'it';

const {width, height} = Dimensions.get('window');

export default class CalendarView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: undefined,
            dueDate: undefined,
            period: undefined,
            doneButtonVisible: false,
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        // await Font.loadAsync({
        //     'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
        // });

        this.setState({ isReady: true });
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.gray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
                <Text style={{color: Colors.main, fontWeight: '200', fontSize: 18}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        );
    }

    render () {
        // if (!this.state.isReady) {
        //     return <AppLoading />;
        // }

        return (
            <View style={{height: height, flex: 1, flexDirection: 'column'}}>
                {Platform.OS === 'ios' && <StatusBar barStyle="light-content" animated={true}/>}
                {
                    //this.renderHeader()
                }
                <CalendarList
                    // Initially visible month. Default = Date()
                    //current={'2012-03-01'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    //maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    //onDayPress={(day) => this.setDate(day)}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {console.log('month changed', month)}}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    // renderArrow={(direction) => (<Arrow />)}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={false}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={false}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    markedDates={this.state.period}
                    // Date marking style [simple/period/multi-dot]. Default = 'simple'
                    markingType='period'
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: Colors.white,
                        calendarBackground: Colors.white,
                        selectedDayTextColor: Colors.white,
                        dayTextColor: Colors.main,
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: Colors.main,
                        monthTextColor: Colors.grayText,
                        textDayFontSize: 12,
                        textMonthFontSize: 22,
                        textDayHeaderFontSize: 18,
                        'stylesheet.calendar.header': {
                            week: {
                              marginTop: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-around'
                            },
                            header: {
                              justifyContent: 'flex-start'
                            }
                        }
                    }}
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}
                />
        </View>)
    }
}


const styles = StyleSheet.create({
    saveButton: {
        fontFamily: 'roboto-bold',
        color: Colors.white,
        fontSize: 16
    },
    selectedDates: {
        flex: 1,
        flexDirection: 'row',
        height: 80
    },
    date: {
        color: Colors.white,
        fontFamily: 'roboto-regular',
        fontSize: 14,
    },
    alignRight: {
        textAlign: 'right',
        width: 150
    },
    bottomBar: {
        backgroundColor: Colors.main,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingTop: 20,
        paddingBottom: 0
    }
});