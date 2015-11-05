#!/usr/bin/env node
var fs=require("fs");
var jsxml = require("node-jsxml"), XML = jsxml.XML;
var device = "";
var fetchUrl = "";

function readXML(xmlName) {
    var path = ".repo/manifests/" + xmlName;
    var data=fs.readFileSync(path,"utf-8");
    return data;
}

function writeXML(xmlName, data) {
    var path = ".repo/manifests/" + xmlName;
    fs.writeFileSync(path, '<?xml version="1.0" ?>\n', "utf-8");
    fs.appendFileSync(path, data, "utf-8");
}

function parseAndChange(xmlName) {
    var xml = new XML(readXML(xmlName));

    var includeNodes = xml.child("include");
    var remoteNodes = xml.child("remote");
    remoteNodes.each(function(item, index){
        item.attribute("fetch").setValue("git://10.240.8.43/" + device + "/");
    });

    if (remoteNodes.length() != 0) {
        writeXML(xmlName, xml.toXMLString());
        console.log(xmlName + " changed to fetch git://10.240.8.43/" + device + "/");
    }

    if (includeNodes.length() == 0) return;
    includeNodes.each(function(item, index){
        var includeXMLName = item.attribute("name").getValue();
        parseAndChange(includeXMLName);
    });

}

function main() {
    if (process.argv.length < 3) {
        console.log("Please input device name!");
        return;
    }
    device = process.argv[2];
    //fetchUrl = process.argv[3] + device;
    parseAndChange(device + ".xml");
}

main();
