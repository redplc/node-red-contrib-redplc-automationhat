# node-red-contrib-redplc-automationhat

redPlc Automation HAT Module.<br>

## Install

[redPlc use this module node. Install redPlc.](https://www.npmjs.com/package/node-red-contrib-redplc)

[If you use this node for other nodes install this.](https://www.npmjs.com/package/node-red-contrib-redplc-module)

Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install node-red-contrib-redplc-automationhat
```
[Automation HAT more Info](https://shop.pimoroni.com/products/automation-hat)

## Usage
Wire this node to first output of redPlc cpu node,<br>
or output of module-update node.<br>
Global variable I are updated with digital inputs.<br>
Global variable Q sets digital output, relays and indicator leds.<br>
Global variable IA are updated with analog inputs.<br>
Analog input ADC1-3 has input range 0..25V.<br>
Analog input ADC4 has input range 0..3.3V.<br>
This node works only on Raspberry Pi with Raspberry Pi OS.<br>
Enable I2C with raspi-config.

## I/O Mapping
### Digital Input (Variable I):
|Bit|Function|
|:-:|:-------|
|0|Input 1|
|1|Input 2|
|2|Input 3|

### Digital Output (Variable Q):
|Bit|Function|
|:-:|:-------|
|0|Relay 1|
|1|Relay 2|
|2|Relay 3|
|3|Output 1|
|4|Output 2|
|5|Output 3|
|6|LED WARN|
|7|LED COMMS|
|8|LED POWER|

### Analog Input (Variable IA):
|Input|Array-Index|
|:----|:---------:|
|ADC1|0|
|ADC2|1|
|ADC3|2|
|ADC4|3|

## Donate
If you like my work please support it with donate:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZDRCZBQFWV3A6)
