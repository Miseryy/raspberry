var noble = require('noble')
//var async = require('async')
var inter = {};
var uuidCount = 0;
var connectIDs = [];
var matchStr = "X";
var uuids = [];
var distance = -1070;

function disconnect_dis(peripheral, dist){
	var rssi = peripheral.rssi;
	if(rssi <= dist){
		peripheral.disconnect(function(error){
			if(error){
				console,log(error);
			}
		});
		return "far";
	}
	return "near";
}

function onDisconnect(peripheral){
	var localName = peripheral.advertisement.localName;
	var uuid = peripheral.uuid;
	var rssi = peripheral.rssi;

	peripheral.on('disconnect',function(error){
		var del = uuids.indexOf(uuid);
		uuids.splice(del, 1);
		console.log("disconnected", "No: ", uuids.indexOf(uuid), "Name: ", localName,"uuid: ", uuid,"rssi: ", rssi);
	});
}

function onConnect(peripheral){
	var localName = peripheral.advertisement.localName;
	var uuid = peripheral.uuid;
	var rssi = peripheral.rssi;

	peripheral.connect(function(error) {
		console.log("connected", "No: ", uuids.indexOf(uuid), "Name: ", localName,"uuid: ", uuid,"rssi: ", rssi);
		noble.startScanning();
	});
}

function reConnect(peripheral) {
	var localName = peripheral.advertisement.localName;
	var uuid = peripheral.uuid;
	var rssi = peripheral.rssi;

	console.log("reconnect", localName, uuid, rssi);
	if(rssi > distance){
		console.log("No: ", uuids.indexOf(uuid), "Name: ", localName,"uuid: ", uuid,"rssi: ", rssi);
	}
	noble.startScanning();
}

noble.on('stateChange', function(state){
	if(state){
		noble.startScanning();
	}else{
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral){
	var localName = peripheral.advertisement.localName;
	var uuid = peripheral.uuid;
	var rssi = peripheral.rssi;

	if(localName !== undefined && localName !== "" && String(localName).match(matchStr) && uuids.indexOf(uuid) == -1){

		noble.stopScanning();

		uuids.push(uuid);

		onDisconnect(peripheral);

		onConnect(peripheral);

	} else if(uuids.indexOf(uuid) >= 0) {
		reConnect(peripheral);
	}
});

noble.on('scanStart', function(){
	console.log('Scanning');
});

noble.on('warning', function(message){
	console.log("war");
	console.log(message);
});
