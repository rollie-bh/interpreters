exports.parse = function () {
	var data            = {
			is_data: true
		},
		firstEntry      = {},
		lastEntry       = {},
		processEntry    = {},
		dataEntries     = [],
		dataCollection  = [],
		multipleEntries = rawData.split('\r\n');

	if (/^\$/.test(multipleEntries[0])) {

		var command = multipleEntries[0].split('=');

		_.extend(data, {
			is_data: false,
			message_type: command[0].substr(1, command[0].length - 1),
			message: command[1],
			raw_data: multipleEntries[0]
		});

		exit(data);
	}

	if (!/^@P/.test(rawData)) {
		rawData = rawData.substr(rawData.indexOf('@P'), rawData.length);

		if (!/^@P/.test(rawData))
			throw new Error('Invalid Data', 'InvalidData');
	}


	if (multipleEntries.length === 2 && multipleEntries[1] === '')
		processEntry = _.first(multipleEntries);
	else {
		firstEntry = _.first(multipleEntries);
		lastEntry = multipleEntries[multipleEntries.length - 2];

		multipleEntries.forEach(function (entry) {
			if (lastEntry === entry || entry === '') return;

			if (entry && entry !== firstEntry && !/^@P/.test(entry) && !/^\\u/.test(entry))
				dataEntries.push(firstEntry.split(',').splice(0, 5).concat(entry.split(',')).toString());
			else if (/^@P/.test(entry))
				dataEntries.push(entry);
		});

		processEntry = firstEntry.split(',').splice(0, 5).concat(lastEntry.split(',')).toString();
	}

	var parsedData = processEntry.split(',');
	var imeiBytes = new Int64(parseInt(parsedData[4]));
	var ack = new Buffer(12);
	var i = 2;

	ack.writeUInt8(0xFE, 0);
	ack.writeUInt8(0x02, 1);

	imeiBytes.toOctets().forEach(function (imeiByte) {
		ack.writeUInt8(parseInt(imeiByte, 16), i);
		++i;
	});

	ack.writeUInt16BE(parseInt(parsedData[3]), 10);

	_.extend(data, {
		sequence_no: parsedData[3],
		device: parsedData[4],
		gps_dtm: parsedData[5],
		dtm: parsedData[6],
		position_dtm: parsedData[7],
		coordinates: [parsedData[8] * 0.000001, parsedData[9] * 0.000001],
		heading: parsedData[10],
		event_code: parsedData[11],
		odometer: ((parsedData[12] * 0.1) * 1000),
		gps_hdop: (parsedData[13] * 0.1),
		in_status: parsedData[14],
		speed: parsedData[15],
		out_status: parsedData[16],
		analog_input: parsedData[17] * 0.001,
		driver_id: parsedData[18],
		temp: parsedData[19],
		temp2: parsedData[20],
		text_msg: parsedData[21],
		ack: ack,
		raw_data: rawData,
		raw_data_entry: processEntry
	});

	dataCollection.push(data);

	dataEntries.forEach(function (entry) {
		var dataEntry  = {
				is_data: true
			},
			parsedData = entry.split(','),
			imeiBytes  = new Int64(parseInt(parsedData[4])),
			ack        = new Buffer(12),
			i          = 2;

		ack.writeUInt8(0xFE, 0);
		ack.writeUInt8(0x02, 1);

		imeiBytes.toOctets().forEach(function (imeiByte) {
			ack.writeUInt8(parseInt(imeiByte, 16), i);
			++i;
		});

		ack.writeUInt16BE(parseInt(parsedData[3]), 10);

		_.extend(dataEntry, {
			sequence_no: parsedData[3],
			device: parsedData[4],
			gps_dtm: parsedData[5],
			dtm: parsedData[6],
			position_dtm: parsedData[7],
			coordinates: [parsedData[8] * 0.000001, parsedData[9] * 0.000001],
			heading: parsedData[10],
			event_code: parsedData[11],
			odometer: ((parsedData[12] * 0.1) * 1000),
			gps_hdop: (parsedData[13] * 0.1),
			in_status: parsedData[14],
			speed: parsedData[15],
			out_status: parsedData[16],
			analog_input: parsedData[17] * 0.001,
			driver_id: parsedData[18],
			temp: parsedData[19],
			temp2: parsedData[20],
			text_msg: parsedData[21],
			ack: ack,
			raw_data: rawData,
			raw_data_entry: entry
		});

		dataCollection.push(dataEntry);
	});

	exit(dataCollection);
};
