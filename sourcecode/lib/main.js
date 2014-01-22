/*
 * main.js - SDK add-ons
 * iNetFilter - mozilla add-ons for blocking nude content
 * 
 * Author: Bambang S. | Nur Shalahuddin | Rischan Mafrur
 * Version: 0.1  (January 2013)
 * 
 */

var data = require("self").data;
var pageMod = require("sdk/page-mod");

//load all .js file in data directory
pageMod.PageMod({
  include: "*", 
  contentScriptWhen: "ready",
  contentScriptFile: [data.url("jquery-1.4.2.min.js"),
  						data.url("inetfilter.js"),
              data.url("nude.min.js"),
              data.url("worker.nude.min.js"),
              data.url("noworker.nude.min.js")
  						]
});

//create panel showing inetfilter status
var status = require("sdk/panel").Panel({
  width: 175,
  height: 45,
  contentURL: data.url("inetfilter-status.html")
});

require("sdk/widget").Widget({
  label: "inetfilter-status",
  id: "inetfilter",
  contentURL: "http://www.mozilla.org/favicon.ico",
  panel: status
});