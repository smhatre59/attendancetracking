/*
All initialization variables declared in this block
*/
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import Attendance from './attendance'
import Report from './report'
/*
Main Component is parent container of all components
*/

class Main extends React.Component{
  constructor(props){
    super(props);
    var pagecontainer=[];
    pagecontainer.push(
      <div>
        <Attendance />
      </div>
    )
    this.state={
      pagecontainer:pagecontainer,
      label:"Generate Report",
      opendialog:false
    }
  }
  changeView(label){
    var pagecontainer = [];
    var labelvalue;
    if(label == "Generate Report"){
      pagecontainer.push(
        <div>
          <Report />
        </div>
      );
      labelvalue="Back to calender";
    }
    else{
      pagecontainer.push(
        <div>
          <Attendance />
        </div>
      )
      labelvalue="Generate Report"
    }

    this.setState({pagecontainer,label:labelvalue})
  }
  render(){
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={() => this.setState({opendialog:false})}
      />,
    ];
    return(
      <div>
        <div className="header">
          <div className="instructions">
            <MuiThemeProvider>
              <RaisedButton label={"Instructions"} primary={true} onTouchTap={() => this.setState({opendialog:true})}/>
            </MuiThemeProvider>
            <MuiThemeProvider>
              <Dialog
                title="Instructions"
                actions={actions}
                modal={true}
                open={this.state.opendialog}
              >
              <h5>
                <table>
                  <tbody>
                    <tr>
                      1)Click on any of the date on the calender to mark attendance
                    </tr>
                    <tr>
                      2)Mark present and select time or mark absent
                    </tr>
                    <tr>
                      3)To view report click on GenerateReport button on top right side of the page
                    </tr>
                  </tbody>
                </table>

              </h5>
              </Dialog>
            </MuiThemeProvider>
          </div>
        <div className="title">
        <h2>Attendance tracking system</h2>
        </div>
        <div className="report">
          <MuiThemeProvider>
            <RaisedButton label={this.state.label} secondary={true}  onTouchTap={() => this.changeView(this.state.label)}/>
          </MuiThemeProvider>
        </div>
      </div>
        <div>
          {this.state.pagecontainer}
        </div>
      </div>

    )
  }
}

render(<Main/>, document.getElementById('app'));
