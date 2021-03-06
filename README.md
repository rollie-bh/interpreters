# Reekoh Formatters
The Reekoh Formatters are a set of custom codes being run by the Reekoh Engine in the back-end to transform raw data coming from different devices connected to the Reekoh platform. 
 
Formatters are categorized in two:
 * **Interpreters**
 * **Converters**

## Interpreters

An interpreter is a custom code that is attached to Inbound Channels and run by the Reekoh Engine to transform the raw data being sent by the devices into a standard format. We know that in order to have broad support for a large number of devices, we need to provide a way to standardize the format of the raw data. Raw data from the devices comes in many different formats like:

* CSV or Comma Delimited Strings
* TSV or Tab Delimited Strings
* JSON String
* XML String
* Others

An interpreter's job is to consume the raw data and transform it to a JavaScript Object (JSON).
 
#### Code Format

```javascript
exports.parse = function () {
	// rawData is in the global namespace
	// parse the raw data here
	// return the parsed data using the exit function
	// parsedData should be a valid JavaScript Object (JSON)
	exit(parsedData);
};
```

#### Return

The Reekoh Engine only accepts a valid JavaScript Object or an Array/Collection of JavaScript Objects as return value of interpreters. If an error occurs within the parser code, it will be handled by the Reekoh Engine accordingly. You may also throw an error to exit execution.

Aside from the return value being a valid JavaScript Object, it should also have the following fields:

1. device - Should contain the device' identifier. This may be an IMEI number or the UUID automatically generated by the Reekoh platform for your device.
2. is_data - denotes if the return data is data or message. Set to true if data, set to false if message/command.

## Converters

While interpreters transform raw data to JSON, converters transform the data values from raw string to meaningful data. Why is there a need for converters? Classic examples:

1. A temperature sensor is configured to send temperature data as Farenheit. One would like to use Celsius.
2. A device is configured to send distance in units of meters. One would like to use miles or kilometers as base.
3. Devices send date/time data in different formats like ddMMYYYYHHmmss, MMddYYHHmmss etc.

It would be a tremendous challenge to catch all of the scenarios that can occur. So in order for the platform to be as flexible as possible, we give our users the freedom to **write their own custom code** to make sense of the values returned from the interpreters.

#### Code Format

```javascript
exports.convert = function () {
	// data is in the global namespace. It is the same data returned by the interpreter
	// convert data here
	// return the converted data using the exit function
	// convertedData should be a valid JavaScript Object (JSON)
	exit(convertedData);
};
```

#### Return

Same with the interpreters, the return value of a converter should be a valid JavaScript Object (JSON) or an Array/Collection of JavaScript Objects. It should also have the device field and the is_data field.

## API

Interpreters and Converters are given access to the APIs or libraries stated below.

#### Utility Libraries

* [Lodash](https://lodash.com) (v3.8.0) as _
* [Moment.js](http://momentjs.com) (v2.10.2) as moment
* [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) (v0.4.8) as xml2js

These libraries are available in the global namespace so if you would like to use lodash, just use it like _.contains(['123', '456', '789'], '123').

#### Node Native API

You are also given access to Node's native API. The following modules is available to use in your custom parser code. These are all in the global namespace. Names are as is.

* assert
* buffer
* crypto
* querystring
* url
* string_decoder
* timers
* util

#### JavaScript Native API

Of course, you are also given access to JavaScript's global objects and functions. These are all in the global namespace. Names are as is.

* Object
* Function
* Boolean
* Error
* Number
* Math
* Date
* String
* RegExp
* Array
* JSON
* parseInt
* parseFloat
* isNaN
* isFinite
* decodeURI
* decodeURIComponent
* encodeURI
* encodeURIComponent