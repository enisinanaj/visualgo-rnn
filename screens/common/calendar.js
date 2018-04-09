import React, {Component} from 'react';
import {StatusBar, View, Platform, TouchableOpacity, Text, Dimensions, StyleSheet} from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

import DefaultRow from '../common/default-row';
import Colors from '../../constants/Colors';

// import {AppLoading, Font} from 'expo';
import moment from 'moment';
import locale from 'moment/locale/it'
import _ from 'lodash';
import { isIphoneX } from '../helpers';

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
        //     'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
        //     'roboto': require('../../assets/fonts/Roboto-Regular.ttf'),
        //     'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf')
        // });

        this.setState({ isReady: true });
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.gray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
                <Text style={{color: Colors.main, fontWeight: '200', fontSize: 18}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        );
    }

    setDate(date) {
        let {dateString} = date;
        if (this.state.startDate == undefined || this.state.dueDate != undefined) {
            let newPeriod = {};
            
            newPeriod[dateString] = {selected: true, color: 'red', startingDate: true, endingDate: true};
            this.setState({
                startDate: date.timestamp,
                dueDate: undefined,
                period: newPeriod
            });
        } else {
            let newPeriod = _.cloneDeep(this.state.period);
            newPeriod[dateString] = {selected: true, color: 'red', startingDate: true, endingDate: true};
            this.setState({
                dueDate: date.timestamp,
                period: newPeriod,
                doneButtonVisible: true
            });
        }
    }

    getStartDate() {
        if (this.state.startDate != undefined) {
            return moment(this.state.startDate).locale("it").format("DD/MM/YYYY");
        } else {
            return "";
        }
    }

    getDueDate() {
        if (this.state.dueDate != undefined) {
            return moment(this.state.dueDate).locale("it").format("DD/MM/YYYY");
        } else {
            return "";
        }
    }

    renderSelectedDateRow(base) {
        return (
            <View style={[styles.bottomBar]}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20}}>
                    <Text style={styles.date}>{this.getStartDate()}</Text>
                    {this.getDueDate() != undefined && this.getDueDate() != "" ?
                        <Text style={[styles.date]}> - {this.getDueDate()}</Text>
                    : null }
                </View>
                {this.getDueDate() != undefined && this.getDueDate() != "" ?
                    <TouchableOpacity onPress={() => {this.props.onDone({start: this.state.startDate, due: this.state.dueDate})}}>
                        <Text style={styles.saveButton}>Save Date</Text>
                    </TouchableOpacity>
                : null}
            </View>
        )
    }

    renderDayComponent() {
        return <View>
            <Text>{this.props.date}</Text>
        </View>
    }

    render () {
        // if (!this.state.isReady) {
        //     return <AppLoading />;
        // }

        return <View style={{height: height, flex: 1, flexDirection: 'column'}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                                : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                                : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
                {this.renderHeader()}
                <CalendarList
                    // Initially visible month. Default = Date()
                    //current={'2012-03-01'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    //maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => this.setDate(day)}
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
                {this.state.startDate != undefined ? this.renderSelectedDateRow() : null}
        </View>
    }
}


const styles = StyleSheet.create({
    saveButton: {
        fontFamily: 'roboto-bold',
        color: Colors.white,
        fontSize: 16,
        marginTop: -2
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