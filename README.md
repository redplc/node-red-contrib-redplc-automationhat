# node-red-contrib-redplc-automationhat

Node-Red node for Pimoroni Automation HAT<br>

## Node Features
- 3 x 5-24V Digital Inputs<br>
- 3 x Relays (24V @2A)<br>
- 3 x 24V Sinking Outputs<br>
- Brightness adjustable Leds for Inputs, Relays, Outputs and Indicators<br>
- 3 x Indicator Leds POWER, COMMS, WARN<br>
- 3 x 11bit Analog Input (0..25V)  conversion time 1ms/channel<br>
- 1 x 11bit Analog Input (0..3.3V) conversion time 1ms<br>
- Output value in mV
- Scaling with factor and offset

[Automation HAT more Info](https://shop.pimoroni.com/products/automation-hat)

## Install

For using with Ladder-Logic install
[redPlc](https://www.npmjs.com/package/node-red-contrib-redplc) nodes

For using with other nodes, install
[module](https://www.npmjs.com/package/node-red-contrib-redplc-module) nodes

Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install node-red-contrib-redplc-automationhat
```

## Usage
Update is triggered by redPlc cpu node<br>
or module-update node<br>
This node reads/writes from/to Node-Red global variables<br>
This node works only on Raspberry Pi with Raspberry Pi OS<br>
Enable I2C with raspi-config

## I/O Mapping
### Digital Input (Variable I):
|Bit|Function|
|:---:|:-------|
|0|Input 1|
|1|Input 2|
|2|Input 3|

### Digital Output (Variable Q):
|Bit|Function|
|:---:|:-------|
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
|:---|:---------:|
|ADC1|0|
|ADC2|1|
|ADC3|2|
|ADC4|3|

### Scaling with Factor and Offset:

```
Formula:

Factor = (OH - OL) / (IH - IL)
Offset = OL - (IL * Factor)

Output = Input * Factor + Offset

Where:

IL = Input Low (mV), IH = Input High (mV) 
OL = Output Low, OH = Output High
```
### Example:
Input:  0mV .. 10000mV, IL = 0, IH = 10000<br>
Output: -20°C .. 60°C, OL = -20, OH = 60<br>
**Factor** = (60 - (-20)) / (10000 - 0) = **0.008**<br>
**Offset** = (-20) - (0 * 0.008) = **-20**<br>

Input = 4000mV<br>
Output = 4000 * 0.008 + (-20) = 12°C<br>

## Donate
If you like my work please support it with donate:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZDRCZBQFWV3A6)
