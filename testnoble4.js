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
	
	// 切断
	peripheral.on('disconnect',function(error){
		var del = uuids.indexOf(uuid);
		uuids.splice(del, 1);
		console.log("disconnected", "No: ", uuids.indexOf(uuid), "Name: ", localName,"uuid: ", uuid);
	});
}

// 接続
function onConnect(peripheral){
//		localName = peripheral.advertisement.localName;
//		uuid = peripheral.uuid;
//		rssi = peripheral.rssi;

		// 接続する
		peripheral.connect(function(error) {

		// スキャン開始
		noble.startScanning();
	});
}

// 接続されているデバイスの情報を表示
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

	// スキャン開始
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
	// ファイルがなかったら作成
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

// ファイルにデータを書き込む
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

// ステータスが変わったら呼ばれる
// state = "unknown" "resetting" "unsupported" "unauthorized" "poweredOff" "poweredOn"
noble.on('stateChange', function(state){
	if(state){
		noble.startScanning();
	}else{
		noble.stopScanning();
	}
});

// 接続できるデバイスがあったら呼ばれる
noble.on('discover', function(peripheral){
	localName = peripheral.advertisement.localName;
	uuid = peripheral.uuid;
	rssi = peripheral.rssi;
	
	// 名前と接続済みかで接続するデバイスをフィルタ
	if(localName !== undefined && localName !== "" && String(localName).match(matchStr) && uuids.indexOf(uuid) == -1){
		
		// スキャン中止
		noble.stopScanning();
		// uuid取得:
		uuids.push(uuid);

		//onDisconnect(peripheral);

		// デバイスを接続する
		onConnect(peripheral);

	} else if(uuids.indexOf(uuid) >= 0) {
		// スキャン中止
		noble.stopScanning();
		// 接続済みのデバイス情報を表示
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
