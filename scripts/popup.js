function base64(){
	var srcText = document.getElementById('srcText').value;
    var dstText = btoa(srcText);
	document.getElementById('dstText').value = dstText;
}

function unbase64(){
	var srcText = document.getElementById('srcText').value;
    var dstText = atob(srcText);
	document.getElementById('dstText').value = dstText;
}

function gzipBase64(){
	var srcText = document.getElementById('srcText').value;
	
    var gzipText = pako.gzip(srcText);
	
	var binData = new Uint8Array(gzipText).reduce((data, byte) => data + String.fromCharCode(byte), '');
	
	document.getElementById('dstText').value = btoa(binData);
}

function unbase64Gunzip(){
	var srcText = document.getElementById('srcText').value;
    var unbase64 = atob(srcText);
	var charData = unbase64.split('').map(function(x) {
		return x.charCodeAt(0);
	});
	var binData = new Uint8Array(charData);
	
    var gunzipText = pako.inflate(binData);
	
	// need to use utf8 encode
	document.getElementById('dstText').value = Utf8ArrayToStr(gunzipText);
}

function encodeUtf8(text) {
    const code = encodeURIComponent(text);
    const bytes = [];
    for (var i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            const hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
        case 12:
        case 13:
            // 110x xxxx 10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
        case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
    }

    return out;
}

document.addEventListener('DOMContentLoaded', function() {
  var base64Btn = document.getElementById('base64');
  base64Btn.addEventListener('click', base64);
  
  var unbase64Btn = document.getElementById('unbase64');
  unbase64Btn.addEventListener('click', unbase64);
  
  var gzipBase64Btn = document.getElementById('gzipBase64');
  gzipBase64Btn.addEventListener('click', gzipBase64);
  
  var unbase64GunzipBtn = document.getElementById('unbase64Gunzip');
  unbase64GunzipBtn.addEventListener('click', unbase64Gunzip);
  
})