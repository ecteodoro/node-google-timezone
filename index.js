'use strict';

var request = require('request'),
  qs = require('qs');

var GOOGLE_TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json?',
  SEPARATOR = ',',

// free api key
  GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || null,

// maps for business users key
  GOOGLE_CLIENT_KEY = process.env.GOOGLE_BUSINESS_CLIENT_KEY || null,
  GOOGLE_SIGNATURE_KEY = process.env.GOOGLE_SIGNATURE_KEY || null;


var GoogleTimezoneAPI = function () {

  this.options = {
    location: null,
    timestamp: null,
    language: 'en'
  };

  this.raw_response = null;
  this.local_timestamp = 0;

  if (GOOGLE_CLIENT_KEY && GOOGLE_SIGNATURE_KEY) {
    this.options.client = GOOGLE_CLIENT_KEY;
    this.options.signature = GOOGLE_SIGNATURE_KEY;
  } else {
    if (GOOGLE_API_KEY) {
      this.options.key = GOOGLE_API_KEY;
    }
  }

};

function makeRequest(options, callback) {
  var requestURL = GOOGLE_TIMEZONE_API_URL + qs.stringify(options);
  request(requestURL, function (err, response, data) {
    if (err || response.statusCode != 200) {
      return callback(new Error('Google API request error: ' + data));
    }
    callback(null, JSON.parse(data));
  })
}

GoogleTimezoneAPI.prototype.data = function (lat, lng, timestamp, cb) {

  // validate arguments

  if (arguments.length < 4) {
    throw new Error('Invalid number of arguments');
  }
  var callback = arguments[arguments.length - 1];
  if (typeof callback != 'function') {
    throw new Error('Missing callback function');
  }

  // format arguments

  this.options.location = lat + ',' + lng;
  this.options.timestamp = timestamp;

  // makes a request to google api

  var self = this;

  makeRequest(this.options, function (err, data) {
    if (err) {
      return callback(err);
    }
    self.raw_response = data;
    if (data.status == 'OK') {
      self.local_timestamp = self.options.timestamp + data.dstOffset + data.rawOffset;
    }
    return callback(null, self);
  });

}

GoogleTimezoneAPI.prototype.key = function (key) {
  delete this.options.client;
  delete this.options.signature;
  this.options.key = key;
}

GoogleTimezoneAPI.prototype.client = function (client) {
  delete this.options.key;
  this.options.client = client;
}

GoogleTimezoneAPI.prototype.signature = function (signature) {
  delete this.options.key;
  this.options.signature = signature;
}

GoogleTimezoneAPI.prototype.language = function (language) {
  this.options.language = language;
}


module.exports = new GoogleTimezoneAPI();





