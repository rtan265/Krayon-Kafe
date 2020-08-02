const express = require("express");
const axios = require("axios");
var xml2js = require("xml2js");
const app = express();
const port = process.env.PORT || 3000;

var parser = new xml2js.Parser();

parser.on("error", function (err) {
  console.log("Parser error", err);
});


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
// index page 
// app.get('/', function(req, res) {
//   res.render('pages/index');
// });

app.get('/', function(req, res) {
  console.log("Starting");

  let body = "";
  axios
    .get(
      "http://www.zenbu.co.nz/search.xml?q=britomart%20cafe&key=85a83834be894bf5e33c4969267d5d2b1eaf7206"
    )
    .then(function (response) {
      parser.parseString(response.data, function (err, result) {
        // console.log("FINISHED", err, JSON.stringify(result));
        body = result;
      });
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      let entries = Object.entries(body.zenbu.entries);
      let entries2 = entries[0][1].entry;

      let locationData = [];
      for (let i = 0; i < entries2.length; i++) {
        let cafeName = entries2[i].name;
        let lat = entries2[i].latitude;
        let long = entries2[i].longitude;
        let entry = { name: cafeName, lat: lat, long: long };
        locationData.push(entry);
      }
      console.log(locationData);
      res.render('pages/index', { locationData: locationData });
    });
});

app.get('/map', function(req,res) {
  res.render('pages/map');
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
