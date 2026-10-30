// ============================================================================
// Module      : lib.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : All purpose library
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// FUNCTIONS
//
// ****************************************************************************
// ****************************************************************************

/*
THREAD YIELDING
---------------
delay(milliseconds).then(function(){
...
});
...
await delay(milliseconds);
await async()=>{...};
...
*/
const delay = function(milliseconds = 0)
{
    return new Promise((resolve)=>{
        setTimeout(()=>{ resolve(true); }, milliseconds);
    });
};

var delayEventTimers = {};

const debounce = function(callback, ms, eventID) {
    if (typeof eventID === "undefined") { eventID = callback.name; }
    if (delayEventTimers[eventID]) {
        clearTimeout (delayEventTimers[eventID]);
    }
    delayEventTimers[eventID] = setTimeout (
        function() {
            if (is_promise(callback)) {
                (async ()=>{await callback();})();
            }
            else {
                callback();
            }
        },
        ms
    );
}

/*
FUNCTIONS
---------
*/
const is_function = function(F) {
    return (typeof F === "function");
};

const is_async_function = function(F) {
    //console.info("IN is_async_function()");
    return (F.constructor.name === "AsyncFunction");
};

const is_promise = function(F) {
    //console.info("IN is_promise()");
    if (is_async_function(F)) {
        return true;
    }
    else {
        var str = F.toString();
        str = str_replace("\t", " ", str);
        str = str_replace("  ", " ", str);
        //console.log(str);
        var dum = str.toUpperCase();
        if ((dum.indexOf("OBJECT") >= 0) && (dum.indexOf("PROMISE") >= 0)) {
            return true;
        }
        else {
            var needle = "return new Promise";
            return (str.indexOf(needle) >= 0);
        }
    }
};

const noop = ()=>{
    return new Promise((resolve)=>{
        resolve();
    });
};


// ****************************************************************************
// ****************************************************************************
//
// DOM
//
// ****************************************************************************
// ****************************************************************************

function rect (domID) {
    const elt = document.getElementById(domID);
    return elt.getBoundingClientRect();
};


// ****************************************************************************
// ****************************************************************************
//
// CONTEXT
//
// ****************************************************************************
// ****************************************************************************

function cleanURI (location) {
    //console.info(`IN cleanURI('${location}')`);
    if (location.slice(0, 1) !== "/") { location = "/" + location; }
    if (location.slice(strlen(location) - 1) !== "/") { location += "/"; }
    location = str_replace(`//`, `/`, location);
    //console.log(location);
    return location;
}

function isURI (st) {
    //console.info(`IN isURI('${st}')`);
    try {
        const urlObj = new URL(st, window.location.origin);
        return true;
    }
    catch(err) {
        //console.error(JSON.stringify(err));
        return false;
    }
}

const parseURI = function (st) {
    //console.info(`IN parseURI('${st}')`);
    try {
        const urlObj = new URL(st, window.location.origin);
        return { 
            location : cleanURI(urlObj.pathname), 
            args : Object.fromEntries(urlObj.searchParams.entries()) 
        };
    }
    catch(err) {
        //console.error(JSON.stringify(err));
        return null;
    }
    return null;
};


// Resolve an object from its name
//
const object = function(objname)
{
    if (typeof objname === "string" && objname.length > 0) {
        try {
            return eval(objname);
        }
        catch(e) {
            return null;
        }
    }
    return null;
};


// Clone an object
//
function clone(obj) { 
    if (typeof obj === "function") {
        const cloned = function(...args) {
            return obj.apply(this, args);
        };
        Object.assign(cloned, obj);
        return cloned;
    }
    else if (Array.isArray(obj)) {
        return Object.assign([], obj);
    }
    else {
        return Object.assign({}, obj);
    }
};


const install_path = function(script_filename)
{
    //console.info("IN install_path() script_filename='" + script_filename + "'");
    
    const allScripts = document.scripts;
    
    for (var i = 0; i < allScripts.length; i++) {
        const scriptElement = allScripts[i];
        if (scriptElement.src) {
            const src = scriptElement.src;
            if (src.indexOf(script_filename) > 0) {
                const result = str_replace(script_filename, "", src);
                return result;
            }
        }
        else {
            return "";
        }
    }
    
};


const online = function()
{
    return navigator.onLine;
};


const connected = function() {
    return new Promise((resolve)=>{
        console.info("IN connected()");
        if (navigator.onLine) {
            fetch('/favicon.ico?d='+Date.now(), { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch(error => {
                resolve(false);
            });
        }
        else {
            resolve(false);
        }
    });
};


// ****************************************************************************
// ****************************************************************************
//
// CUSTOM EVENTS
//
// ****************************************************************************
// ****************************************************************************

/*
register listener:
    events.addEventListener('themechanged', function(e) { console.log(e.detail.themeID); });

trigger event:
    event('themechanged',{themeID:"light"});
*/

const events = new EventTarget();

const event = function(eventName,args={}) {
    // console.info(`IN event('${eventName}' '${JSON.stringify(args)}')`);
    const evt = new CustomEvent(eventName, {detail:args});
    events.dispatchEvent(evt);
};


// ****************************************************************************
// ****************************************************************************
//
// RANDOMIZATION
//
// ****************************************************************************
// ****************************************************************************

const rand = (min, max)=>{
    min = Math.ceil (min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rand_hex_str = (len)=>{
    var text = "";
    var possible = "ABCDEF0123456789";
    for(var i=0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const rand_num_str = (len)=>{
    var firstPossible = "123456789";
    var text = firstPossible.charAt(Math.floor(Math.random() * firstPossible.length));
    var possible = "0123456789";
    for(var i=0; i < len - 1; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const rand_chr_str = (len)=>{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i=0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const unique_id = ()=>{
    // is (in theory) not really unique
    // should return a 16-digits string
    //
    return String(Math.round(new Date().getTime())) + rand_num_str(3);
};


// ****************************************************************************
// ****************************************************************************
//
// ENCODING
//
// ****************************************************************************
// ****************************************************************************

// Only implement if no native implementation is available
//
if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};

const is_json = function(jsonTest) {
    if ((typeof jsonTest === "string") && (jsonTest.length > 0)) {
        try {
            var o = JSON.parse(jsonTest);
            if (o && typeof o === "object") {
                return true;
            }
        }
        catch (e) {}
    }
    return false;
};

const payload_encode = function (data) {
    return window.btoa(JSON.stringify(data));
};

const payload_decode = function (encoded) {
    var result;
    try {
        result = JSON.parse(window.atob(encoded));
    }
    catch(e){
        result = null;
    }
    return result;
};
				
const is_payload_encoded = function (something) {
    if ((typeof something === "string") && (something.length > 0)) {
        try {
            var o = E.payload_decode(something);
            return E.payload_encode(o) === something;
        }
        catch (e) {}
        
    }
    return false;
};

function encodeHTMLEntities(str) {
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}

function decodeHTMLEntities(str) {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.textContent;
}


// ****************************************************************************
// ****************************************************************************
//
// CONVERSION
//
// ****************************************************************************
// ****************************************************************************

const radians = (degrees) => {
	return degrees * Math.PI / 180;
};

const degrees = (radians) => {
    return radians * (180 / Math.PI);
};

const degreesMinutesSeconds = (decDegrees) => {
    const negative = (decDegrees < 0);
    if (negative) { decDegrees = (-1) * decDegrees; }   // ex: 123.456
    const degrees  = Math.abs(decDegrees);              // ex: 123
    let   dumdum   = decDegrees - degrees;              // 0.456
    const minutes  = Math.abs(dumdum * 60);             // 27 (0.456 * 60 = 27.36)
    dumdum = dumdum - minutes;                          // 0.36
    const seconds  = Math.round((dumdum * 60) * 10)/10; // 21.6 (0.36 * 60 = 21.6)
    var result = { d:degrees, m:minutes, s:seconds };
    if (negative) { result.d = (-1)*result.d; } 
    return result;
};

// degreesMinutesSeconds: { d:.., m:.., s:.. }
//
const decDegrees = (degreesMinutesSeconds) => {
    return degreesMinutesSeconds.d + (degreesMinutesSeconds.m / 60) + (degreesMinutesSeconds.s / 3600);
};


// End of file: lib.js
// ============================================================================
