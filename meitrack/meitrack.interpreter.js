exports.parse = function () {
	var data = {
		is_data: true
	};

	if (!/^\$\$/.test(rawData))
		throw new Error('Invalid Data', 'InvalidData');

	var parsedData = rawData.split('*')[0].split(',');

	_.extend(data, {
		header: parsedData[0],
		device: parsedData[1],
		message_type: parsedData[2],
		raw_data: rawData
	});

	if (data.message_type !== 'AAA') {
		parsedData = parsedData.splice(0, 3);
		_.extend(data, {
			is_data: false,
			message: parsedData.join()
		});

		exit(data);
	}

	_.extend(data, {
		event_code: parsedData[3],
		coordinates: [parsedData[5], parsedData[4]],
		dtm: parsedData[6],
		status: parsedData[7],
		satellite_no: parsedData[8],
		signal: parsedData[9],
		speed: parsedData[10],
		direction: parsedData[11],
		accuracy: parsedData[12],
		altitude: parsedData[13],
		mileage: parsedData[14],
		run_time: parsedData[15],
		base_station: parsedData[16],
		io_status: parsedData[17],
		analog_input: parsedData[18]
	});

	var eventCode = parseInt(data.event_code);

	if (eventCode === 37)
		data.rfid = parsedData[19];

	if (eventCode === 39)
		data.picture_name = parsedData[19];

	if (eventCode === 50 || eventCode === 51)
		data.temp_num = parsedData[19];

	if (eventCode === 20 || eventCode === 21 || eventCode === 58 || eventCode === 145)
		data.asst_event_info = parsedData[19];

	if (parsedData.length >= 21) {
		data.custom = parsedData[20];
		data.protocol = parsedData[21];

		if (data.protocol === '1') {
			if (parsedData.length === 24) {
				data.fuel_value = parsedData[22];
				data.temp = parsedData[23];
			} else {
				if (parsedData[22].length === 4)
					data.fuel_value = parsedData[22];
				else
					data.temp = parsedData[22];
			}
		}
	}

	exit(data);
};
