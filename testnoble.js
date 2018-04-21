var noble = require('noble')
var myInterval;
noble.on('stateChange', function(state){
	if(state){
		console.log('startScan');
		noble.startScanning();
	}else{
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral){
	noble.stopScanning();

	var localName = peripheral.advertisement.localName;
	console.log('name: ' + localName);
	console.log('uuid: ' + peripheral.uuid);
	console.log('rssi: ' + peripheral.rssi);

	if(localName === "X") {
	

	peripheral.on('rssiUpdate', function(rssi){
		if(peripheral.advertisement.txPowerLevel == undefined){
			console.log('rssi: ' + rssi);
		
		}
	});

	peripheral.on('connect', function(){
		console.log('connect');
		console.log(peripheral.advertisement.txPowerLevel);
		myInterval = setInterval(function(){
			peripheral.updateRssi(function(error, rssi){
				console.log('rssi: ' + rssi);
				console.log('error: ' + error);
			});
		}, 1000);
	});


//	if(localName == "X"){
//		setInterval(function(){
//			peripheral.updateRssi();
//		}, 1000);

//	}

	peripheral.on('disconnect',function(){
		console.log('disconnect');
		clearInterval(myInterval);
		console.log('startScan');
		noble.startScanning();
	});

	
	peripheral.connect();
}
	
});

//noble.on('waring', function(message){
//	console.log(message);
//	noble.startScanning();
//});
