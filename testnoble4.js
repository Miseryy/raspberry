var noble = require('noble');
var fs = require('fs');
var rl = require('readline');

//var async = require('async')
//var inter = {};
//var uuidCount = 0;
//var connectIDs = [];
var matchStr = "X";
var uuids = [];
var distance = 0;
var localName;
var rssi;
var uuid;

var path1 = "bleData.txt";
var linecount = 0;
var bf = "";
var dic = {};

function disconnect_dis(peripheral, dist){
	rssi = peripheral.rssi;
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
	localName = peripheral.advertisement.localName;
	uuid = peripheral.uuid;
	rssi = peripheral.rssi;
	
	// $B@ZCG(B
	peripheral.on('disconnect',function(error){
		var del = uuids.indexOf(uuid);
		uuids.splice(del, 1);
		console.log("disconnected", "No: ", uuids.indexOf(uuid), "Name: ", localName,"uuid: ", uuid);
	});
}

// $B@\B3(B
function onConnect(peripheral){
//		localName = peripheral.advertisement.localName;
//		uuid = peripheral.uuid;
//		rssi = peripheral.rssi;

		// $B@\B3$9$k(B
		peripheral.connect(function(error) {

		// $B%9%-%c%s3+;O(B
		noble.startScanning();
	});
}

// $B@\B3$5$l$F$$$k%G%P%$%9$N>pJs$rI=<((B
function reConnect(peripheral) {
	localName = peripheral.advertisement.localName;
	uuid = peripheral.uuid;
	rssi = peripheral.rssi;
	var no = uuids.indexOf(uuid);
	var txPower = peripheral.advertisement.txPowerLevel;
	var dist = Math.pow(10, (txPower - rssi) / 20);

	var data = "No." + uuids.indexOf(uuid) + ' ' +
				"Name: " + localName + ' ' +
				"uuid: " + uuid + ' ' +
				"rssi: " + rssi + ' ' +
				"distance: " + dist;// + "\n";
	
	console.log("reconnect");
	console.log("No:", no, "Name:", localName,"uuid:", uuid,"rssi:", rssi, "dist:", dist);

	dic[no] = data;

	// $B%9%-%c%s3+;O(B
	noble.startScanning();
}

function readLineCount(path){
	var contents = fs.readFileSync(path, 'utf8');
	var lines = contents.toString().split('\n').length - 1;

	return lines;
}

function writeFile(path, data, f){
	if(f){
		fs.writeFile(path, data, function(err){
			if(err){
				console.log(err);
			}
		});
		return 0;
	}
	
	fs.appendFile(path, data, function(err){
			if(err){
				console.log(err);
			}
	});
}

//function readLineWrite(path, no, data){
//	var is = fs.createReadStream(path1);
//	var ir = rl.createInterface(is, {});
//
//	ir.on('line', function(line){
//		if(line[3] == no){
//			console.log("same");
//			writeFileS(path, data, false);
//		} else {
//			console.log("line");
//			writeFileS(path, line + '\n', false);
//		}
//	});
//
//	writeFileS(path1, data, true);
//}

function deleteFile(path){
	fs.unlink(path, function(err){
		if(err) {
			console.log(err);
		}
	});
}

function checkFile(path){
	// $B%U%!%$%k$,$J$+$C$?$i:n@.(B
	fs.stat(path, function(error){
	//	if(error){
	//		console.log("createFile");
	//		writeFileS(path, "", false);
	//	} else {
			console.log("cleanFile");
			writeFile(path, "", true);
	//	}
	});
}

function clearDic(){
	if(Object.keys(dic).length != 0){
		console.log("Clear");
		for(key in dic){
			delete dic[key];
		}
	}
}

// $B%U%!%$%k$K%G!<%?$r=q$-9~$`(B
var writeData = function (){
	var str = [];
	var s;

	for(key in dic){
		str.push(dic[key]);
	}

	s = str.join('\n');
	writeFile(path1, s, true);

	clearDic();
}

setInterval(writeData, 1000);

/////////////// Noble

// $B%9%F!<%?%9$,JQ$o$C$?$i8F$P$l$k(B
// state = "unknown" "resetting" "unsupported" "unauthorized" "poweredOff" "poweredOn"
noble.on('stateChange', function(state){
	if(state){
		noble.startScanning();
	}else{
		noble.stopScanning();
	}
});

// $B@\B3$G$-$k%G%P%$%9$,$"$C$?$i8F$P$l$k(B
noble.on('discover', function(peripheral){
	localName = peripheral.advertisement.localName;
	uuid = peripheral.uuid;
	rssi = peripheral.rssi;
	
	// $BL>A0$H@\B3:Q$_$+$G@\B3$9$k%G%P%$%9$r%U%#%k%?(B
	if(localName !== undefined && localName !== "" && String(localName).match(matchStr) && uuids.indexOf(uuid) == -1){
		
		// $B%9%-%c%sCf;_(B
		noble.stopScanning();
		// uuid$B<hF@(B:
		uuids.push(uuid);

		//onDisconnect(peripheral);

		// $B%G%P%$%9$r@\B3$9$k(B
		onConnect(peripheral);

	} else if(uuids.indexOf(uuid) >= 0) {
		// $B%9%-%c%sCf;_(B
		noble.stopScanning();
		// $B@\B3:Q$_$N%G%P%$%9>pJs$rI=<((B
		reConnect(peripheral);
	}
});

noble.on('scanStart', function(){
	console.log('Scanning');
});

noble.on('warning', function(message){
	console.log('war');
	console.log(message);
});
