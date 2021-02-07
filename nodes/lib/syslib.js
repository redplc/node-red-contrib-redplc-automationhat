/**
 * Copyright 2021 Ocean (iot.redplc@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use node file except in compliance with the License.
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

"use strict";

const fs = require('fs');

/**
 * Outputs error on status and error log.
 */
module.exports.outError = function (node, errShort, errLong) {
	if (node.save_txt === errShort)
		return true;

	node.save_txt = errShort;
	node.status({ fill: "red", shape: "ring", text: errShort });
	node.error(errLong);

	return true;
}

/**
 * Sets node status.
 */
module.exports.setStatus = function (node, txt) {
	if (node.save_txt === txt)
		return;

	node.save_txt = txt;

	node.status({ fill: "blue", shape: "ring", text: txt });
}

function isbit(value, bit) {
	return (value & (1 << bit)) > 0;
}

function setbit(value, bit) {
	return value |= (1 << bit);
}

const MODE_INPUT_PULLD = 2;
const MODE_OUTPUT = 4;

var pinsinput = [26, 20, 21];
var pinsoutput = [13, 19, 16, 5, 12, 6];

/**
 * Get input pin from index.
 */
module.exports.initDIO = function (mod) {
	mod.initDIO();
	pinsinput.forEach(function (pin) { mod.setModeDIO(pin, MODE_INPUT_PULLD); } );
	pinsoutput.forEach(function (pin) { mod.setModeDIO(pin, MODE_OUTPUT); });
}

/**
 * Shift input pins data.
 */
module.exports.shiftPinsInput = function (value) {
	var valret = 0;

	pinsinput.forEach(function (pin, index) {
		if (isbit(value, pin))
			valret = setbit(valret, index);
	});

	return valret;
}

/**
 * Shift output pins data.
 */
module.exports.shiftPinsOutput = function (value) {
	var valret = 0;

	pinsoutput.forEach(function (pin, index) {
		if (isbit(value, index))
			valret = setbit(valret, pin);
	});

	return valret;
}

const LED_ADC1 = 0;
const LED_ADC2 = 1;
const LED_ADC3 = 2;
const LED_OUT1 = 3;
const LED_OUT2 = 4;
const LED_OUT3 = 5;
const LED_RLO1 = 6;
const LED_RLC1 = 7;
const LED_RLO2 = 8;
const LED_RLC2 = 9;
const LED_RLO3 = 10;
const LED_RLC3 = 11;
const LED_INP1 = 14;
const LED_INP2 = 13;
const LED_INP3 = 12;
const LED_WARN = 15;
const LED_COMM = 16;
const LED_POWR = 17;

module.exports.initLed = function (mod, pwmai, pwmdo, pwmdi, pwmind) {
	mod.initLED();

	mod.setpwmLED(LED_ADC1, pwmai);
	mod.setpwmLED(LED_ADC2, pwmai);
	mod.setpwmLED(LED_ADC3, pwmai);

	mod.setpwmLED(LED_OUT1, pwmdo);
	mod.setpwmLED(LED_OUT2, pwmdo);
	mod.setpwmLED(LED_OUT3, pwmdo);

	mod.setpwmLED(LED_RLO1, pwmdo);
	mod.setpwmLED(LED_RLO2, pwmdo);
	mod.setpwmLED(LED_RLO3, pwmdo);

	mod.setpwmLED(LED_RLC1, pwmdo);
	mod.setpwmLED(LED_RLC2, pwmdo);
	mod.setpwmLED(LED_RLC3, pwmdo);

	mod.setpwmLED(LED_INP1, pwmdi);
	mod.setpwmLED(LED_INP2, pwmdi);
	mod.setpwmLED(LED_INP3, pwmdi);

	mod.setpwmLED(LED_WARN, pwmind);
	mod.setpwmLED(LED_COMM, pwmind);
	mod.setpwmLED(LED_POWR, pwmind);

	mod.updateLED();
}

module.exports.adcLed = function (mod) {
	mod.setLED(LED_ADC1, true);
	mod.setLED(LED_ADC2, true);
	mod.setLED(LED_ADC3, true);
}

module.exports.diLed = function (mod, value) {
	mod.setLED(LED_INP1, isbit(value, 0));
	mod.setLED(LED_INP2, isbit(value, 1));
	mod.setLED(LED_INP3, isbit(value, 2));
}

module.exports.doLed = function (mod, value) {
	mod.setLED(LED_RLC1, !isbit(value, 0));
	mod.setLED(LED_RLC2, !isbit(value, 1));
	mod.setLED(LED_RLC3, !isbit(value, 2));
	mod.setLED(LED_RLO1, isbit(value, 0));
	mod.setLED(LED_RLO2, isbit(value, 1));
	mod.setLED(LED_RLO3, isbit(value, 2));
	mod.setLED(LED_OUT1, isbit(value, 3));
	mod.setLED(LED_OUT2, isbit(value, 4));
	mod.setLED(LED_OUT3, isbit(value, 5));
	mod.setLED(LED_WARN, isbit(value, 6));
	mod.setLED(LED_COMM, isbit(value, 7));
	mod.setLED(LED_POWR, isbit(value, 8));
}

/**
 * Check if runs on Raspberry Pi.
 */
function isRaspberryPi()
{
	if (process.platform !== 'linux')
		return false;

	var cpuinfo = fs.readFileSync("/proc/cpuinfo").toString();

	if (cpuinfo.indexOf(": BCM") === -1)
		return false;

	return true;
}

/**
 * Check for Raspberry Pi, if matchs loads hardware driver module.
 */
module.exports.LoadModule = function (module, testrpi = false) {
	try {
		if (testrpi)
			if (!isRaspberryPi())
				return;
		return require("./" + module);
	}
	catch (e) { console.log(e); }
	return undefined;
}
