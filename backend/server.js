var express = require('express'),
 attendance = require('./routes/attendanceroutes')
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/attendancedb').then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow cross origin requests on server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Content-Type', 'application/json');
    next();
});
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our attendance module apis' });
});

// create an attendance record (accessed at POST http://localhost:3000/api/markattendance)
router.route('/markattendance').post(attendance.markattendance);
// retrieve all records
router.get('/getallrecords',attendance.getallrecords);
//retrieve by month
router.post('/getbymonth',attendance.getbymonth);
//retrieve by date
router.post('/getbydate',attendance.getbydate);
app.use('/api', router);
var port = process.env.PORT || 3000;
app.listen(port);
console.log("serve listening on port 3000");
