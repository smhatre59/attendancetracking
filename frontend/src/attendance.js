import React from 'react';
import {render} from 'react-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

//BigCalendar plugin requires localizer which is defined in here
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

export default class Attendance extends React.Component {
  // initial state variables are defined here
  constructor(props){
    super(props);
    var timearray=[];
    timearray.push(
      <div className="flexdiv">
        <div className="flexdiv">
        <h4>In Time:</h4>
        <TimePicker
        hintText="12hr Format"
        onChange={(event, date) => self.setState({intime:date})}
        />
        </div>
        <div className="flexdiv">
        <h4>Out Time:</h4>
        <TimePicker
        hintText="12hr Format"
        onChange={(event, date) => self.setState({outtime:date})}
        />
        </div>
      </div>
    )
      this.state={
            myEventsList:[],
          open: false,
          timearray:timearray,
          value:1,
          datepicked:"",
          intime:"",
          outtime:""
        }
  }
  // populate data initially by retrieving previous marked events
  componentDidMount(){
    var self = this;
    $.ajax({
    type: 'GET',
    url: "http://localhost:3000/api/getallrecords",
    dataType: "json",
    success: function(records) {
      // console.log("data retrieved succesfully",records);
      var formattedrecords=[];
      for(var i = 0;i<records.length;i++){
        formattedrecords.push(
          {
            "title":records[i].title,
            "allDay":records[i].allDay,
            "start":new Date(records[i].start),
            "end":new Date(records[i].end)
          }
        )
      }
      self.setState({myEventsList:formattedrecords});
    },
    error: function(err){
      console.log("error occured",err);
    }
    });

  }
  /*
  function to show modal popup with TimePicker
  */
  dateSelected(slotInfo){
    this.setState({datepicked:slotInfo.start,open: true});
  }
  /*
  function to handle Submit
  Populate event on the date that is selected on calender
  */
  timeClose(){
    var self = this;
    var eventlist= this.state.myEventsList;
    if(this.state.value==1){
      var date = this.state.datepicked.toString().substring(4,16);
      var intime=this.state.intime.toString().substring(16,24);
      var outtime=this.state.outtime.toString().substring(16,24);
      var startdate = date+intime;
      var enddate = date+outtime;
      // console.log("startdate",startdate," enddate",enddate);
      var presentjson={
      'title': 'Present',
      'allDay': false,
      'start': new Date(startdate),
      'end': new Date(enddate)
      }
      $.ajax({
      type: 'POST',
      url: "http://localhost:3000/api/markattendance",
      data: presentjson,
      dataType: "json",
      success: function(resultData) {
        // console.log("data added succesfully",resultData);
        eventlist.push(presentjson);
        self.setState({myEventsList:eventlist,open: false});
      },
      error: function(err){
        console.log("error occured",err);
      }
      });


    }
    else{
      var absentdate = this.state.datepicked.toString().substring(4,15)
      // console.log("datepicked",absentdate);
      var absentjson ={
      'title': 'Absent',
      'allDay': true,
      'start':new Date(absentdate),
      'end': new Date(absentdate)
      }
      $.ajax({
      type: 'POST',
      url: "http://localhost:3000/api/markattendance",
      data: absentjson,
      dataType: "json",
      success: function(resultData) {
        eventlist.push(absentjson)
        self.setState({myEventsList:eventlist,open: false});
      },
      error: function(err){
        console.log("error occured",err);
      }
      });

      this.setState({myEventsList:eventlist,open: false});
    }
  }
  /*
  function to display time picker if present value is selected
  else hide TimePicker
  */
  handlePresentChange(event, index, value){
    // console.log("handlePresentChange called");
    var self= this;
    if(value==1){
      var timearray=[];
      timearray.push(
        <div className="flexdiv">
          <div className="flexdiv">
          <h4>In Time:</h4>
          <TimePicker
          hintText="12hr Format"
          onChange={(event, date) => self.setState({intime:date})}
          />
          </div>
          <div className="flexdiv">
          <h4>Out Time:</h4>
          <TimePicker
          hintText="12hr Format"
          onChange={(event, date) => self.setState({outtime:date})}
          />
          </div>
        </div>
      );
      this.setState({timearray,value});
    }
    else{
      this.setState({timearray:[],value});
    }
  }
  // main fxn which renders calender and other popups
  render () {
    var self=this;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({open:false})}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.timeClose()}
      />,
    ];
    return (
      <div>
          <BigCalendar
            events={this.state.myEventsList}
            selectable
            defaultDate={new Date()}
            onSelectSlot={(slotInfo) => this.dateSelected(slotInfo)}
          />
          <MuiThemeProvider>
              <Dialog
              title="Dialog With Actions"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
              >
              <DropDownMenu value={this.state.value} onChange={(event, index, value) => self.handlePresentChange(event, index, value)}>
                  <MenuItem value={1} primaryText="Present" />
                  <MenuItem value={2} primaryText="Absent" />
                </DropDownMenu>
              {this.state.timearray}
              </Dialog>
          </MuiThemeProvider>
      </div>
    );
  }
}
