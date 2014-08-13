node-google-timezone
====================

## A Node.js wrapper to Google Timezone API

The Time Zone API provides time offset data for locations on the surface of the earth. Requesting the time zone information for a specific Latitude/Longitude pair will return the name of that time zone, the time offset from UTC, and the Daylight Savings offset.

Please refer to [The Google Time Zone API](https://developers.google.com/maps/documentation/timezone/) documentation for further details on **request parameters** and **response format**. 

##Installation

`npm install node-google-timezone`

##Usage

```javascript
var timezone = require('node-google-timezone');

var timestamp = 1402629305; 
// time as seconds since midnight, January 1, 1970 UTC

console.log(new Date(timestamp * 1000));
// => Fri Jun 13 2014 00:15:05 GMT-0300 (BRT)

// somewhere in New York
var lat = 40.7421,
    lng = -73.9914;

//timezone.key('YOUR API KEY HERE'); // optional

//timezone.language('es'); // optional: default 'en'

timezone.data(lat, lng, timestamp, function (err, tz) {

  console.log(tz.raw_response);
  //=> { dstOffset: 3600,
  //     rawOffset: -18000,
  //     status: 'OK',
  //     timeZoneId: 'America/New_York',
  //     timeZoneName: 'Eastern Daylight Time' }

  console.log(tz.local_timestamp);
  // => 1402614905

  var d = new Date(tz.local_timestamp * 1000);

  console.log(d.toDateString() + ' - ' + d.getHours() + ':' + d.getMinutes());
  // => Thu Jun 12 2014 - 20:15

});
```

##API Key

Optional for users of the **Free API** (2,500 requests per 24 hour period).  

Please read the [API Key](https://developers.google.com/maps/documentation/distancematrix/#api_key) documentation first.

If using a **key**:

* There are 2 options to define the key:  

1. Create an environment variable `GOOGLE_API_KEY`, or...  
2. Programatically: 
```javascript
timezone.key('YOUR-API-KEY');
```

* If using **client** and **signature**:  

1. Create environment variables `GOOGLE_CLIENT_KEY` and `GOOGLE_SIGNATURE_KEY`, or...  
2. Programmatically: 
```javascript
timezone.client('YOUR-CLIENT-KEY');
timezone.signature('YOUR-SIGNATURE');
```

##Parameters

* `lat`: location latitude
* `lng`: location longitude
* `timestamp`: time as seconds since midnight, January 1, 1970 UTC. Times before 1970 can be expressed as negative values.
* `callback(err, timezone)`: callback function with an `Error` object and a `Timezone` object as parameters.

## Timezone Properties

* `timezone.raw_response`: the response as returned by Google API. See [Time Zone Responses](https://developers.google.com/maps/documentation/timezone/#Responses) for more details.
```
{ dstOffset: 3600,
  rawOffset: -18000,
  status: 'OK',
  timeZoneId: 'America/New_York',
  timeZoneName: 'Eastern Daylight Time' }
```
* `timezone.local_timestamp`: the local time at the specified location considering Daylight Savings Time.
* `timezone.options`: 
```
{ location: '40.7421,-73.9914',
  timestamp: 1402629305,
  language: 'en' }
```

## Options

* API Key (optional): defaults to environment variable `GOOGLE_API_KEY`
```javascript
timezone.key('YOUR-API-KEY');
```

* Client ID (optional): defaults to environment variable `GOOGLE_CLIENT_KEY`
```javascript
timezone.client('YOUR-CLIENT-KEY');
```

* Signature (optional): defaults to environment variable `GOOGLE_SIGNATURE_KEY`
```javascript
timezone.signature('YOUR-SIGNATURE');
```

* Language (optional): defaults to `en`

```javascript
timezone.language('pt');
```