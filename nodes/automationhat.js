/**
 * Copyright 2021 Ocean (iot.redplc@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";

	const syslib = require('./lib/syslib.js');
	const sysmodulegpio = syslib.LoadModule("rpi_gpio.node", true);
	const sysmoduleled = syslib.LoadModule("rpi_sn3218.node");
	const sysmoduleai = syslib.LoadModule("rpi_ads1x15.node");

	const AI_1 = 4;
	const AI_2 = 5;
	const AI_3 = 6;
	const AI_4 = 7;
	const F_4096 = 1;
	const ADS1015 = false;

    RED.nodes.registerType("automationhat", function(n) {
		var node = this;
		RED.nodes.createNode(node, n);

		node.tagnamedi = "I" + n.addressdi;
		node.tagnamedo = "Q" + n.addressdo;
		node.tagnameai = "IA" + n.addressai;
		node.name = "autom.hat";
		node.disableai = n.disableai;

		node.factor0 = Number(n.factor0);
		node.factor1 = Number(n.factor1);
		node.factor2 = Number(n.factor2);
		node.factor3 = Number(n.factor3);
		node.offset0 = Number(n.offset0);
		node.offset1 = Number(n.offset1);
		node.offset2 = Number(n.offset2);
		node.offset3 = Number(n.offset3);

		node.store = node.context().global;
		node.iserror = false;
		node.setai = false;
		node.setdi = false;
		node.setdo = false;
		node.factor = 2 * 940 / 120;
			
		node.statustxt = "";

		if ((sysmodulegpio === undefined) || (sysmoduleled === undefined) || (sysmoduleai === undefined))
			node.iserror = syslib.outError(node, "sysmodules", "sysmodules not load");

		if (!node.iserror) {
			if (typeof node.store.keys().find(key => key == node.tagnamedi) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnamedi, "duplicate address " + node.tagnamedi);
			else {
				node.store.set(node.tagnamedi, 0);
				node.statustxt += " " + node.tagnamedi;
				node.setdi = true;
			}
		}

		if (!node.iserror) {
			if (typeof node.store.keys().find(key => key == node.tagnamedo) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnamedo, "duplicate address " + node.tagnamedo);
			else {
				node.store.set(node.tagnamedo, 0);
				node.statustxt += " " + node.tagnamedo;
				node.setdo = true;
			}
		}

		if (!node.iserror && !node.disableai) {
			if (typeof node.store.keys().find(key => key == node.tagnameai) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnameai, "duplicate address " + node.tagnameai);
			else {
				node.store.set(node.tagnameai, [0, 0, 0, 0]);
				node.statustxt += " " + node.tagnameai;
				node.setai = true;
			}
		}

		if (!node.iserror) {
			if (sysmoduleled.inuse())
				node.iserror = syslib.outError(node, "in use", "node in use");
			else {
				syslib.initLed(sysmoduleled, n.pwmai, n.pwmdo, n.pwmdi, n.pwmind);
				syslib.initDIO(sysmodulegpio);
			}
		}

		if (!node.iserror && !node.disableai) {
			sysmoduleai.setmuxAI(0, AI_1, AI_2, AI_3, AI_4);
			sysmoduleai.setgainAI(0, F_4096, F_4096, F_4096, F_4096);
			if (!sysmoduleai.initAI(0, ADS1015))
				node.iserror = syslib.outError(node, "init AI", " error on init AI");
			else
				syslib.adcLed(sysmoduleled);
		}
		
		if (!node.iserror) {
			node.statustxt = node.statustxt.trim();
			syslib.setStatus(node, node.statustxt);
		}
		
		node.on("input", function (msg) {
			if (!node.iserror) {
				if (msg.payload === "input") {
					var dival = syslib.shiftPinsInput(sysmodulegpio.updateDI());
					syslib.diLed(sysmoduleled, dival);
					node.store.set(node.tagnamedi, dival);

					if (!node.disableai) {
						var aival = sysmoduleai.updateAI();

						if (aival === undefined)
							node.iserror = syslib.outError(node, "update AI", "error on update AI");
						else {
							aival[0] = Number((aival[0] * node.factor).toFixed(0)) * node.factor0 + node.offset0;
							aival[1] = Number((aival[1] * node.factor).toFixed(0)) * node.factor1 + node.offset1;
							aival[2] = Number((aival[2] * node.factor).toFixed(0)) * node.factor2 + node.offset2;
							aival[3] = aival[3] * 2 * node.factor3 + node.offset3;
							node.store.set(node.tagnameai, aival);
							syslib.setStatus(node, node.statustxt);
						}
					}
				}

				if (msg.payload === "output") {
					var doval = node.store.get(node.tagnamedo);
					syslib.doLed(sysmoduleled, doval);
					sysmodulegpio.updateDO(syslib.shiftPinsOutput(doval));
				}
			}

			node.send(msg);
		});

		node.on('close', function () {
			sysmoduleled.inuseClear();
			sysmoduleled.deinitLED();
				
			if (node.setdi)
				node.store.set(node.tagnamedi, undefined);

			if (node.setdo)
				node.store.set(node.tagnamedo, undefined);

			if (node.setai)
				node.store.set(node.tagnameai, undefined);
        });
 	});
}
