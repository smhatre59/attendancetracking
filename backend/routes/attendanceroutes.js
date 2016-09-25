var Attendance = require('../models/attendance');
var moment = require('moment');
// function to insert documents in db
exports.markattendance = function(req, res) {
    Attendance.create(req.body, function (err, post) {
          if (err) {
            res.send(err);
            }
            res.send(post);
          });
};

//function to retrive all documents in db
exports.getallrecords = function(req, res) {
  Attendance.find(function(err, records) {
          if (err)
              res.send(err);
          var formattedrecords=[];
          for(var i = 0;i<records.length;i++){
            formattedrecords.push(
              {
                "title":records[i].title,
                "allDay":records[i].allDay,
                "start":records[i].start,
                "end":records[i].end
              }
            )
          }
          res.json(formattedrecords);
      });
};

exports.getbymonth = function(req,res){
  var month = req.body.month;
  var year = req.body.year;
    //get starting and ending dates of the month
    var startDate = moment([year, month]).add(-1,"month");
    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');
    // console.log("year month vales",startDate.toDate().toString(),endDate.toDate().toString());

    //find all the record whose start & end date is between than starting & ending of the month
  Attendance.find({start: {$gte: startDate},end:{$lte: endDate}},function(err, records) {
          if (err)
              res.send(err);
          var formattedrecords=[];
          for(var i = 0;i<records.length;i++){
            formattedrecords.push(
              {
                "title":records[i].title,
                "allDay":records[i].allDay,
                "start":records[i].start,
                "end":records[i].end
              }
            )
          }
          res.json(formattedrecords);
      });
}

exports.getbydate = function(req,res){
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
    //find all the record whose start & end date is between than starting & ending dates
  Attendance.find({start: {$gte: startDate},end:{$lte: endDate}},function(err, records) {
          if (err)
              res.send(err);
          var formattedrecords=[];
          for(var i = 0;i<records.length;i++){
            formattedrecords.push(
              {
                "title":records[i].title,
                "allDay":records[i].allDay,
                "start":records[i].start,
                "end":records[i].end
              }
            )
          }
          res.json(formattedrecords);
      });
}
