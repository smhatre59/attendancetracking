import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment'
export default class Report extends React.Component {
  constructor(props){
    super(props);
    var report=[];
    report.push(
      <div>
        reportdata
      </div>
    )
    this.state = {
      value:1,
      report,
      records:[],
      dialogopen:false,
      dialogtitle:"",
      monthvalue:0,
      fromDate:null,
      toDate:null,
      datedialogopen:false
    }
  }
  //function to populate initial records for current month
  componentDidMount(){
    var self = this;
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    this.getDataByMonth(month,year);
  }
  //function to retrive data for given month
  getDataByMonth(month,year){
    var self = this;
    // console.log("date month",date.getMonth(),date.getFullYear());
    var payload = {
      "month":month,
      "year":year
    }
    $.ajax({
    type: 'POST',
    url: "http://localhost:3000/api/getbymonth",
    data: payload,
    dataType: "json",
    success: function(records) {
      // console.log("data retrieved succesfully",JSON.stringify(records));
      self.generateReport(records);
      self.setState({records:records});
    },
    error: function(err){
      console.log("error occured",err);
    }
    });
  }
  //function to Generate reports based on backend data
  generateReport(records){
    var presenttabledata=[],absenttabledata=[];
    var absentcounter=0,presentcounter=0;
    for(var i=0;i<records.length;i++){
      if(records[i].title=="Absent")
      {
        ++absentcounter;
        var startdate = new Date(records[i].start);
        absenttabledata.push(
          <tr className="row">
            <td>{moment(startdate).format("DD/MM/YYYY")}</td>
          </tr>
        )

      }
      else {
        ++presentcounter;
        var startdate= new Date(records[i].start);
        var enddate = new Date(records[i].end);
        presenttabledata.push(
          <tr className="row">
            <td>{moment(startdate).format("DD/MM/YYYY")}</td>
            <td>{moment(startdate).format("hh:mm:ss a")} to {moment(enddate).format("hh:mm:ss a")}</td>
          </tr>
        )
      }
    }
    var report=[];
    report.push(
      <div>
        <div className="flexdiv">
          <div className="presentdiv flexdiv">
            <h2>No of days present:{presentcounter}</h2>
          </div>
          <div className="absentdiv flexdiv">
            <h2>No of days absent:{absentcounter}</h2>
          </div>
        </div>
        <div className="flexdiv">
          <div className="presentdiv flexdiv">
            <table className="tablestyle">
              <tbody>
              <tr className="rowheading">
                <td>Present days</td>
                <td>Present timings</td>
              </tr>
              {presenttabledata}
            </tbody>
            </table>
          </div>
          <div className="absentdiv flexdiv">
            <table className="tablestyle">
              <tbody>
              <tr>
                <td className="rowheading">Absent days</td>
              </tr>
              {absenttabledata}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )

    this.setState({report});
  }
  //function to handle change in option value
  handleDateChange(event, index, value){
    var self =this;
    switch (value) {
      case 1:
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        this.getDataByMonth(month,year);
        break;

      case 2:
        var dialogcontents=[];
        var dialogtitle = "Select Month";
        var montharray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        dialogcontents.push(
          <div>
            <MuiThemeProvider>
              <DropDownMenu value={self.state.monthvalue} onChange={(event, index, monthvalue) => self.handleMonthChange(event, index, monthvalue)}>
                  {
                    montharray.map(function(item,i) {
                          return (
                            <MenuItem value={i} primaryText={item} />
                          );
                        })
                  }
              </DropDownMenu>
            </MuiThemeProvider>
          </div>
        )
        self.setState({
                      dialogtitle,
                      dialogcontents,
                      dialogopen:true
                     });
        break;
        case 3:
        self.setState({
                      datedialogopen:true
                     });
        break;
    }
    this.setState({value})
  }

  //function to retrieve data for selected month
  handleMonthChange(event,index,monthvalue){
    var year= new Date().getFullYear();
    // console.log("month year",monthvalue,year);
    this.getDataByMonth(monthvalue+1,year);
    this.setState({monthvalue,dialogopen:false});
  }
  //function to retrive date for selected dates
  handleDaterange(){
    var self=this;
    var fromdate = this.state.fromDate;
    var todate = this.state.toDate;
    var payload = {
      "startDate":fromdate,
      "endDate":todate
    }
    $.ajax({
    type: 'POST',
    url: "http://localhost:3000/api/getbydate",
    data: payload,
    dataType: "json",
    success: function(records) {
      // console.log("data retrieved succesfully",JSON.stringify(records));
      self.generateReport(records);
      self.setState({records:records,datedialogopen:false});
    },
    error: function(err){
      console.log("error occured",err);
    }
    });
  }
  render(){
    var self = this;
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
        onTouchTap={() => this.handleDaterange()}
      />,
    ];
    return(
      <div>
        <center>
        <MuiThemeProvider>
          <DropDownMenu value={this.state.value} onChange={(event, index, value) => self.handleDateChange(event, index, value)}>
              <MenuItem value={1} primaryText="Current Month" />
              <MenuItem value={2} primaryText="Custom Month" />
              <MenuItem value={3} primaryText="Custom Date Range" />
            </DropDownMenu>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog
          title={this.state.dialogtitle}
          modal={true}
          open={this.state.dialogopen}
          >
          {this.state.dialogcontents}
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog
          title="Select Date range"
          modal={true}
          open={this.state.datedialogopen}
          actions={actions}
          >
          <div className="flexdiv">
            <div className="flexdiv">
              <h3>From:</h3>
                <DatePicker
                   hintText="From"
                   container="inline"
                   mode="landscape"
                   value={this.state.fromDate}
                   onChange={(event,date) => self.setState({fromDate:date})}
                   />
            </div>
            <div className="flexdiv">
              <h3>To:</h3>
                <DatePicker
                   hintText="To"
                   container="inline"
                   mode="landscape"
                   value={this.state.toDate}
                   onChange={(event,date) => self.setState({toDate:date})}
                   />
            </div>
          </div>
          </Dialog>
        </MuiThemeProvider>
        </center>
        {this.state.report}
      </div>
    )
  }
}
