exports.parse = function () {
	var data = {
		is_data: true
	};

	if (!/^\+RESP/.test(rawData) && !/^\+ACK/.test(rawData) && !/^\+ACK/.test(rawData))
		throw new Error('Invalid Data', 'InvalidData');

	rawData = rawData.substr(0, rawData.length - 1);

	var parsedData = rawData.split(',');

	var command = parsedData[0].split(':');

	_.extend(data, {
		message_header: command[0],
		message_type: command[1],
		protocol: parsedData[1],
		device: parsedData[2],
		device_name: parsedData[3],
		dtm: parsedData[parsedData.length - 2],
		count_number: parsedData[parsedData.length - 1],
		ack: '+SACK:'.concat(parsedData[parsedData.length - 1]).concat('$'),
		raw_data: rawData
	});

	if (command[0] === '+ACK' || ((command[0] === '+RESP' || command[0] === '+BUFF') &&
		(command[1] === 'GTINF' || command[1] === 'GTGPS' || command[1] === 'GTALL' ||
		command[1] === 'GTCID' || command[1] === 'GTCSQ' || command[1] === 'GTVER' ||
		command[1] === 'GTBAT' || command[1] === 'GTIOS' || command[1] === 'GTTMZ' ||
		command[1] === 'GTAIF' || command[1] === 'GTALS' || command[1] === 'GTGSV' ||
		command[1] === 'GTUVN' || command[1] === 'GTPNA' || command[1] === 'GTPFA' ||
		command[1] === 'GTPDP' || command[1] === 'GTGSM' || command[1] === 'GTPHD' ||
		command[1] === 'GTFSD' || command[1] === 'GTUFS'))) {

		parsedData = parsedData.splice(0, 1);
		_.extend(data, {
			is_data: false,
			message: parsedData.join()
		});

		exit(data);
	}


	if (command[1] === 'GTTOW' || command[1] === 'GTDIS' || command[1] === 'GTIOB' ||
		command[1] === 'GTSPD' || command[1] === 'GTSOS' || command[1] === 'GTRTL' ||
		command[1] === 'GTDOG' || command[1] === 'GTIGL' || command[1] === 'GTHBM') {
		_.extend(data, {
			reserved1: parsedData[4],
			report_id: parsedData[5],
			number: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved2: parsedData[18],
			mileage: parsedData[19]
		});
	} else if (command[1] === 'GTFRI') {
		_.extend(data, {
			ext_power: parsedData[4],
			report_id: parsedData[5],
			number: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved1: parsedData[18],
			mileage: parsedData[19],
			hr_m_cnt: parsedData[20],
			analog_in1: parsedData[21],
			analog_in2: parsedData[22],
			bkp_bat_pct: parsedData[23],
			device_stat: parsedData[24],
			reserved2: parsedData[25],
			reserved3: parsedData[26],
			reserved4: parsedData[27]
		});
	} else if (command[1] === 'GTERI') {
		_.extend(data, {
			eri_mask: parsedData[4],
			ext_power: parsedData[5],
			report_id: parsedData[6],
			number: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved1: parsedData[19],
			mileage: parsedData[20],
			hr_m_cnt: parsedData[21],
			analog_in1: parsedData[22],
			analog_in2: parsedData[23],
			mult_analog_vcc3: parsedData[24],
			bkp_bat_pct: parsedData[25],
			device_stat: parsedData[26]
		});

		/*
		 * Device Type Optional fields are not
		 * included kindly refer to queclink
		 * protocol documentation to build
		 * the code base on your setup
		 */
	} else if (command[1] === 'GTEPS' || command[1] === 'GTAIS') {
		_.extend(data, {
			analog_in_vcc: parsedData[4],
			report_id: parsedData[5],
			number: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved1: parsedData[18],
			mileage: parsedData[19]
		});
	} else if (command[1] === 'GTLBC') {
		_.extend(data, {
			call_number: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTIDA') {
		_.extend(data, {
			reserved1: parsedData[4],
			id: parsedData[5],
			report_id: parsedData[6],
			number: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved2: parsedData[19],
			mileage: parsedData[20],
			reserved3: parsedData[21],
			reserved4: parsedData[22],
			reserved5: parsedData[23],
			reserved6: parsedData[24]
		});
	} else if (command[1] === 'GTGEO') {
		_.extend(data, {
			reserved1: parsedData[4],
			report_id: parsedData[5],
			number: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved2: parsedData[18],
			mileage: parsedData[19]
		});
	} else if (command[1] === 'GTGES') {
		_.extend(data, {
			reserved1: parsedData[4],
			report_id: parsedData[5],
			trigger: parsedData[6],
			radius: parsedData[7],
			chk_interval: parsedData[8],
			number: parsedData[9],
			accuracy: parsedData[10],
			speed: parsedData[11],
			azimuth: parsedData[12],
			altitude: parsedData[13],
			coordinates: [parsedData[14], parsedData[15]],
			gps_utc_time: parsedData[16],
			mcc: parsedData[17],
			lnc: parsedData[18],
			lac: parsedData[19],
			cell_id: parsedData[20],
			reserved2: parsedData[21],
			mileage: parsedData[22]
		});
	} else if (command[1] === 'GTGIN' || command[1] === 'GTGOT') {
		_.extend(data, {
			reserved1: parsedData[4],
			reserved2: parsedData[5],
			area_type: parsedData[6],
			area_mask: parsedData[7],
			reserved3: parsedData[8],
			reserved4: parsedData[9],
			reserved5: parsedData[10],
			reserved6: parsedData[11],
			number: parsedData[12],
			accuracy: parsedData[13],
			speed: parsedData[14],
			azimuth: parsedData[15],
			altitude: parsedData[16],
			coordinates: [parsedData[17], parsedData[18]],
			gps_utc_time: parsedData[19],
			mcc: parsedData[20],
			lnc: parsedData[21],
			lac: parsedData[22],
			cell_id: parsedData[23],
			reserved7: parsedData[24],
			mileage: parsedData[25]
		});
	} else if (command[1] === 'GTMPN' || command[1] === 'GTMPF' || command[1] === 'GTBTC' || command[1] === 'GTJDR') {
		_.extend(data, {
			accuracy: parsedData[4],
			speed: parsedData[5],
			azimuth: parsedData[6],
			altitude: parsedData[7],
			coordinates: [parsedData[8], parsedData[9]],
			gps_utc_time: parsedData[10],
			mcc: parsedData[11],
			lnc: parsedData[12],
			lac: parsedData[13],
			cell_id: parsedData[14],
			reserved1: parsedData[15]
		});
	} else if (command[1] === 'GTJDS') {
		_.extend(data, {
			jam_status: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTSTC') {
		_.extend(data, {
			reserved1: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved2: parsedData[16]
		});
	} else if (command[1] === 'GTBPL') {
		_.extend(data, {
			bkp_bat_vcc: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTSTT') {
		_.extend(data, {
			state: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTANT') {
		_.extend(data, {
			ext_antenna: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTMON') {
		_.extend(data, {
			phone_no: parsedData[4],
			mon_type: parsedData[5],
			stlth_mic: parsedData[6],
			stlth_spk: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved1: parsedData[19]
		});
	} else if (command[1] === 'GTIGN') {
		_.extend(data, {
			dur_ign_off: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16],
			hr_m_cnt: parsedData[17],
			mileage: parsedData[18]
		});
	} else if (command[1] === 'GTIGF') {
		_.extend(data, {
			dur_ign_on: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16],
			hr_m_cnt: parsedData[17],
			mileage: parsedData[18]
		});
	} else if (command[1] === 'GTIDN') {
		_.extend(data, {
			reserved1: parsedData[4],
			reserved2: parsedData[5],
			accuracy: parsedData[6],
			speed: parsedData[7],
			azimuth: parsedData[8],
			altitude: parsedData[9],
			coordinates: [parsedData[10], parsedData[11]],
			gps_utc_time: parsedData[12],
			mcc: parsedData[13],
			lnc: parsedData[14],
			lac: parsedData[15],
			cell_id: parsedData[16],
			reserved3: parsedData[17],
			mileage: parsedData[18]
		});
	} else if (command[1] === 'GTIDF') {
		_.extend(data, {
			motion_state: parsedData[4],
			dur_idling: parsedData[5],
			accuracy: parsedData[6],
			speed: parsedData[7],
			azimuth: parsedData[8],
			altitude: parsedData[9],
			coordinates: [parsedData[10], parsedData[11]],
			gps_utc_time: parsedData[12],
			mcc: parsedData[13],
			lnc: parsedData[14],
			lac: parsedData[15],
			cell_id: parsedData[16],
			reserved3: parsedData[17],
			mileage: parsedData[18]
		});
	} else if (command[1] === 'GTGSS') {
		_.extend(data, {
			gps_sig_status: parsedData[4],
			satellite_no: parsedData[5],
			device_state: parsedData[6],
			reserved1: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved2: parsedData[19]
		});
	} else if (command[1] === 'GTSTR' || command[1] === 'GTSTP' || command[1] === 'GTLSP') {
		_.extend(data, {
			reserved1: parsedData[4],
			reserved2: parsedData[5],
			accuracy: parsedData[6],
			speed: parsedData[7],
			azimuth: parsedData[8],
			altitude: parsedData[9],
			coordinates: [parsedData[10], parsedData[11]],
			gps_utc_time: parsedData[12],
			mcc: parsedData[13],
			lnc: parsedData[14],
			lac: parsedData[15],
			cell_id: parsedData[16],
			reserved3: parsedData[17],
			mileage: parsedData[18]
		});
	} else if (command[1] === 'GTFLA') {
		_.extend(data, {
			input_id: parsedData[4],
			ign_off_fuel: parsedData[5],
			ign_on_fuel: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved1: parsedData[18]
		});
	} else if (command[1] === 'GTDOS') {
		_.extend(data, {
			wave_out_id: parsedData[4],
			wave_out_active: parsedData[5],
			accuracy: parsedData[6],
			speed: parsedData[7],
			azimuth: parsedData[8],
			altitude: parsedData[9],
			coordinates: [parsedData[10], parsedData[11]],
			gps_utc_time: parsedData[12],
			mcc: parsedData[13],
			lnc: parsedData[14],
			lac: parsedData[15],
			cell_id: parsedData[16],
			reserved1: parsedData[17]
		});
	} else if (command[1] === 'GTTMP') {
		_.extend(data, {
			reserved1: parsedData[4],
			ext_power: parsedData[5],
			report_id: parsedData[6],
			number: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved2: parsedData[19],
			mileage: parsedData[20],
			hr_m_cnt: parsedData[21],
			analog_in_vcc1: parsedData[22],
			analog_in_vcc2: parsedData[23],
			digital_in: parsedData[24],
			digital_out: parsedData[25],
			reserved3: parsedData[26],
			reserved4: parsedData[27],
			reserved5: parsedData[28],
			temp_dev_id: parsedData[29],
			reserved6: parsedData[30],
			temp_dev_data: parsedData[31]
		});
	} else if (command[1] === 'GTRMD') {
		_.extend(data, {
			roam_state: parsedData[4],
			accuracy: parsedData[5],
			speed: parsedData[6],
			azimuth: parsedData[7],
			altitude: parsedData[8],
			coordinates: [parsedData[9], parsedData[10]],
			gps_utc_time: parsedData[11],
			mcc: parsedData[12],
			lnc: parsedData[13],
			lac: parsedData[14],
			cell_id: parsedData[15],
			reserved1: parsedData[16]
		});
	} else if (command[1] === 'GTPHL') {
		_.extend(data, {
			camera_id: parsedData[4],
			reserved1: parsedData[5],
			photo_time: parsedData[6],
			accuracy: parsedData[7],
			speed: parsedData[8],
			azimuth: parsedData[9],
			altitude: parsedData[10],
			coordinates: [parsedData[11], parsedData[12]],
			gps_utc_time: parsedData[13],
			mcc: parsedData[14],
			lnc: parsedData[15],
			lac: parsedData[16],
			cell_id: parsedData[17],
			reserved2: parsedData[18],
			reserved3: parsedData[19],
			reserved4: parsedData[20],
			reserved5: parsedData[21],
			reserved6: parsedData[22]
		});
	} else if (command[1] === 'GTFTP') {
		_.extend(data, {
			reserved1: parsedData[4],
			filename: parsedData[5],
			accuracy: parsedData[6],
			speed: parsedData[7],
			azimuth: parsedData[8],
			altitude: parsedData[9],
			coordinates: [parsedData[10], parsedData[11]],
			gps_utc_time: parsedData[12],
			mcc: parsedData[13],
			lnc: parsedData[14],
			lac: parsedData[15],
			cell_id: parsedData[16],
			reserved2: parsedData[17]
		});
	} else if (command[1] === 'GTEXP') {
		_.extend(data, {
			reserved1: parsedData[4],
			reserved2: parsedData[5],
			reserved_param: parsedData[6],
			hw_fault_code: parsedData[7],
			accuracy: parsedData[8],
			speed: parsedData[9],
			azimuth: parsedData[10],
			altitude: parsedData[11],
			coordinates: [parsedData[12], parsedData[13]],
			gps_utc_time: parsedData[14],
			mcc: parsedData[15],
			lnc: parsedData[16],
			lac: parsedData[17],
			cell_id: parsedData[18],
			reserved3: parsedData[19]
		});
	} else if (command[1] === 'GTDAT') {
		if (parsedData.length <= 7) {
			_.extend(data, {
				is_data: false,
				format: 'short',
				data: parsedData[4]
			});
		} else {
			_.extend(data, {
				format: 'long',
				report_type: parsedData[4],
				reserved1: parsedData[5],
				reserved2: parsedData[6],
				data: parsedData[7],
				accuracy: parsedData[8],
				speed: parsedData[9],
				azimuth: parsedData[10],
				altitude: parsedData[11],
				coordinates: [parsedData[12], parsedData[13]],
				gps_utc_time: parsedData[14],
				mcc: parsedData[15],
				lnc: parsedData[16],
				lac: parsedData[17],
				cell_id: parsedData[18],
				reserved3: parsedData[19],
				reserved4: parsedData[20],
				reserved5: parsedData[21],
				reserved6: parsedData[22],
				reserved7: parsedData[23]
			});
		}
	} else if (command[1] === 'GTDTT') {
		if (parsedData.length <= 10) {
			_.extend(data, {
				is_data: false,
				format: 'short',
				reserved1: parsedData[4],
				reserved2: parsedData[5],
				data_type: parsedData[6],
				data_length: parsedData[7],
				data: parsedData[8]
			});
		} else {
			_.extend(data, {
				format: 'long',
				reserved1: parsedData[4],
				reserved2: parsedData[5],
				data_length: parsedData[6],
				data: parsedData[7],
				accuracy: parsedData[8],
				speed: parsedData[9],
				azimuth: parsedData[10],
				altitude: parsedData[11],
				coordinates: [parsedData[12], parsedData[13]],
				gps_utc_time: parsedData[14],
				mcc: parsedData[15],
				lnc: parsedData[16],
				lac: parsedData[17],
				cell_id: parsedData[18],
				reserved3: parsedData[19],
				reserved4: parsedData[20],
				reserved5: parsedData[21],
				reserved6: parsedData[22],
				reserved7: parsedData[23]
			});
		}
	} else if (command[1] === 'GTUDT') {
		_.extend(data, {
			firmware_v: parsedData[2],
			hardware_v: parsedData[3],
			reserved1: parsedData[4],
			device: parsedData[5],
			device_name: parsedData[6],
			report_type: parsedData[7],
			report_id: parsedData[8],
			number: parsedData[9],
			accuracy: parsedData[10],
			speed: parsedData[11],
			azimuth: parsedData[12],
			altitude: parsedData[13],
			coordinates: [parsedData[14], parsedData[15]],
			gps_utc_time: parsedData[16],
			mcc: parsedData[17],
			lnc: parsedData[18],
			lac: parsedData[19],
			cell_id: parsedData[20],
			reserved2: parsedData[21],
			mileage: parsedData[22],
			reserved3: parsedData[23],
			hr_m_cnt: parsedData[24],
			reserved4: parsedData[25],
			ext_antenna: parsedData[26],
			gsv_no: parsedData[27],
			geofence_state: parsedData[28],
			analog_in_vcc1: parsedData[29],
			analog_in_vcc2: parsedData[30],
			digital_in: parsedData[31],
			digital_out: parsedData[32],
			motion_status: parsedData[33],
			ext_pow_vcc: parsedData[34],
			bkp_bat_level: parsedData[35],
			charging: parsedData[36],
			geo_status_mask: parsedData[37],
			reserved5: parsedData[38],
			reserved6: parsedData[39],
			reserved7: parsedData[40]
		});
	} else if (command[1] === 'GTCAN') {
		_.extend(data, {
			report_type: parsedData[4],
			cnb_dev_state: parsedData[5],
			cnb_rep_mask: parsedData[6],
			vin: parsedData[7],
			ign_key: parsedData[8],
			total_dist: parsedData[9],
			total_fuel: parsedData[10],
			eng_rpm: parsedData[11],
			veh_speed: parsedData[12],
			eng_cool_temp: parsedData[13],
			fuel_cons: parsedData[14],
			fuel_level: parsedData[15],
			range: parsedData[16],
			accel_ped_press: parsedData[17],
			tot_eng_hrs: parsedData[18],
			tot_drive_time: parsedData[19],
			tot_idle_time: parsedData[20],
			tot_idle_fuel: parsedData[21],
			axle_weight: parsedData[22],
			tgraph_info: parsedData[23],
			detailed_info: parsedData[24],
			lights: parsedData[25],
			doors: parsedData[26],
			tot_veh_ospd_time: parsedData[27],
			tot_eng_ospd_time: parsedData[28],
			reserved1: parsedData[29],
			reserved2: parsedData[30],
			accuracy: parsedData[31],
			speed: parsedData[32],
			azimuth: parsedData[33],
			altitude: parsedData[34],
			coordinates: [parsedData[35], parsedData[36]],
			gps_utc_time: parsedData[37],
			mcc: parsedData[38],
			lnc: parsedData[39],
			lac: parsedData[40],
			cell_id: parsedData[41],
			reserved3: parsedData[42]
		});
	}

	exit(data);
};