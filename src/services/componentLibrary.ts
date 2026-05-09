import type { ComponentDef } from '../types';

export const COMPONENT_LIBRARY: ComponentDef[] = [
  // ── POWER ──
  { type:'battery', label:'Battery', category:'power', emoji:'🔋', description:'DC Voltage Source', defaultSize:{width:60,height:40}, defaultProperties:{voltage:9,label:'BAT1',value:'9V'}, pins:[{id:'p',label:'+',x:60,y:20,direction:'out'},{id:'n',label:'-',x:0,y:20,direction:'in'}], tags:['battery','dc','power'] },
  { type:'vdc', label:'DC Supply', category:'power', emoji:'⚡', description:'Ideal DC Voltage Source', defaultSize:{width:60,height:60}, defaultProperties:{voltage:5,label:'V1',value:'5V'}, pins:[{id:'p',label:'+',x:30,y:0,direction:'out'},{id:'n',label:'-',x:30,y:60,direction:'in'}], tags:['voltage','dc','supply'] },
  { type:'vac', label:'AC Supply', category:'power', emoji:'〰️', description:'AC Voltage Source', defaultSize:{width:60,height:60}, defaultProperties:{voltage:120,frequency:60,label:'VAC1',value:'120V'}, pins:[{id:'p',label:'+',x:30,y:0,direction:'out'},{id:'n',label:'-',x:30,y:60,direction:'in'}], tags:['voltage','ac','supply'] },
  { type:'gnd', label:'Ground', category:'power', emoji:'⏚', description:'Circuit Ground Reference', defaultSize:{width:40,height:30}, defaultProperties:{label:'GND',value:'0V'}, pins:[{id:'g',label:'GND',x:20,y:0,direction:'in'}], tags:['ground','reference'] },
  { type:'isrc', label:'Current Source', category:'power', emoji:'🔄', description:'Ideal Current Source', defaultSize:{width:60,height:60}, defaultProperties:{current:0.001,label:'I1',value:'1mA'}, pins:[{id:'p',label:'+',x:30,y:0,direction:'out'},{id:'n',label:'-',x:30,y:60,direction:'in'}], tags:['current','source'] },

  // ── PASSIVE ──
  { type:'resistor', label:'Resistor', category:'passive', subcategory:'Resistors', emoji:'Ω', description:'Fixed Resistor', defaultSize:{width:60,height:20}, defaultProperties:{resistance:1000,label:'R1',value:'1kΩ'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'inout'},{id:'b',label:'B',x:60,y:10,direction:'inout'}], tags:['resistor','passive','r'] },
  { type:'potentiometer', label:'Potentiometer', category:'passive', subcategory:'Resistors', emoji:'🎚️', description:'Variable Resistor', defaultSize:{width:60,height:30}, defaultProperties:{resistance:10000,label:'RV1',value:'10kΩ'}, pins:[{id:'a',label:'A',x:0,y:15,direction:'inout'},{id:'w',label:'W',x:30,y:0,direction:'out'},{id:'b',label:'B',x:60,y:15,direction:'inout'}], tags:['potentiometer','variable','resistor'] },
  { type:'capacitor', label:'Capacitor', category:'passive', subcategory:'Capacitors', emoji:'⚡', description:'Non-polarized Capacitor', defaultSize:{width:40,height:30}, defaultProperties:{capacitance:0.000001,label:'C1',value:'1µF'}, pins:[{id:'p',label:'+',x:0,y:15,direction:'inout'},{id:'n',label:'-',x:40,y:15,direction:'inout'}], tags:['capacitor','passive','c'] },
  { type:'cap_polar', label:'Polar Capacitor', category:'passive', subcategory:'Capacitors', emoji:'⚡', description:'Electrolytic Capacitor', defaultSize:{width:40,height:30}, defaultProperties:{capacitance:0.0001,label:'C2',value:'100µF'}, pins:[{id:'p',label:'+',x:0,y:15,direction:'in'},{id:'n',label:'-',x:40,y:15,direction:'in'}], tags:['electrolytic','polar','capacitor'] },
  { type:'inductor', label:'Inductor', category:'passive', subcategory:'Inductors', emoji:'🌀', description:'Inductor / Coil', defaultSize:{width:60,height:20}, defaultProperties:{inductance:0.001,label:'L1',value:'1mH'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'inout'},{id:'b',label:'B',x:60,y:10,direction:'inout'}], tags:['inductor','coil','passive'] },
  { type:'transformer', label:'Transformer', category:'passive', subcategory:'Inductors', emoji:'🔁', description:'Transformer', defaultSize:{width:80,height:60}, defaultProperties:{label:'T1',value:'1:1'}, pins:[{id:'p1',label:'P1',x:0,y:15,direction:'inout'},{id:'p2',label:'P2',x:0,y:45,direction:'inout'},{id:'s1',label:'S1',x:80,y:15,direction:'inout'},{id:'s2',label:'S2',x:80,y:45,direction:'inout'}], tags:['transformer','coupled'] },

  // ── SEMICONDUCTOR – DIODES ──
  { type:'diode', label:'Diode', category:'semiconductor', subcategory:'Diodes', emoji:'▷|', description:'PN Junction Diode', defaultSize:{width:60,height:20}, defaultProperties:{forwardVoltage:0.7,label:'D1',value:'1N4007'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'k',label:'K',x:60,y:10,direction:'out'}], tags:['diode','pn','rectifier'] },
  { type:'zener', label:'Zener Diode', category:'semiconductor', subcategory:'Diodes', emoji:'↕', description:'Zener Diode', defaultSize:{width:60,height:20}, defaultProperties:{forwardVoltage:5.1,label:'D2',value:'5.1V'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'k',label:'K',x:60,y:10,direction:'out'}], tags:['zener','voltage','regulator'] },
  { type:'led', label:'LED', category:'semiconductor', subcategory:'Diodes', emoji:'💡', description:'Light Emitting Diode', defaultSize:{width:60,height:20}, defaultProperties:{forwardVoltage:2.0,color:'#00d4f0',label:'LED1',value:'Blue'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'k',label:'K',x:60,y:10,direction:'out'}], tags:['led','light','diode'] },
  { type:'schottky', label:'Schottky Diode', category:'semiconductor', subcategory:'Diodes', emoji:'⚡', description:'Low forward-voltage diode', defaultSize:{width:60,height:20}, defaultProperties:{forwardVoltage:0.3,label:'D3',value:'1N5819'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'k',label:'K',x:60,y:10,direction:'out'}], tags:['schottky','fast'] },

  // ── SEMICONDUCTOR – TRANSISTORS ──
  { type:'npn', label:'NPN BJT', category:'semiconductor', subcategory:'Transistors', emoji:'▲', description:'NPN Bipolar Junction Transistor', defaultSize:{width:60,height:60}, defaultProperties:{beta:100,label:'Q1',value:'2N2222'}, pins:[{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'c',label:'C',x:40,y:0,direction:'out'},{id:'e',label:'E',x:40,y:60,direction:'out'}], tags:['npn','bjt','transistor'] },
  { type:'pnp', label:'PNP BJT', category:'semiconductor', subcategory:'Transistors', emoji:'▼', description:'PNP Bipolar Junction Transistor', defaultSize:{width:60,height:60}, defaultProperties:{beta:100,label:'Q2',value:'2N2907'}, pins:[{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'c',label:'C',x:40,y:0,direction:'out'},{id:'e',label:'E',x:40,y:60,direction:'out'}], tags:['pnp','bjt','transistor'] },
  { type:'nmos', label:'NMOS', category:'semiconductor', subcategory:'Transistors', emoji:'⊤', description:'N-Channel MOSFET', defaultSize:{width:60,height:60}, defaultProperties:{label:'M1',value:'2N7000'}, pins:[{id:'g',label:'G',x:0,y:30,direction:'in'},{id:'d',label:'D',x:40,y:0,direction:'inout'},{id:'s',label:'S',x:40,y:60,direction:'inout'}], tags:['nmos','mosfet','fet'] },
  { type:'pmos', label:'PMOS', category:'semiconductor', subcategory:'Transistors', emoji:'⊥', description:'P-Channel MOSFET', defaultSize:{width:60,height:60}, defaultProperties:{label:'M2',value:'BS250'}, pins:[{id:'g',label:'G',x:0,y:30,direction:'in'},{id:'d',label:'D',x:40,y:0,direction:'inout'},{id:'s',label:'S',x:40,y:60,direction:'inout'}], tags:['pmos','mosfet','fet'] },

  // ── DIGITAL – GATES ──
  { type:'and', label:'AND Gate', category:'digital', subcategory:'Logic Gates', emoji:'&', description:'2-input AND Gate', defaultSize:{width:60,height:40}, defaultProperties:{logicFamily:'CMOS',label:'U1',value:'AND'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'y',label:'Y',x:60,y:20,direction:'out'}], tags:['and','gate','digital','logic'] },
  { type:'or',  label:'OR Gate',  category:'digital', subcategory:'Logic Gates', emoji:'≥1', description:'2-input OR Gate',  defaultSize:{width:60,height:40}, defaultProperties:{logicFamily:'CMOS',label:'U2',value:'OR'},  pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'y',label:'Y',x:60,y:20,direction:'out'}], tags:['or','gate','digital'] },
  { type:'not', label:'NOT Gate', category:'digital', subcategory:'Logic Gates', emoji:'1', description:'Inverter / NOT Gate', defaultSize:{width:50,height:30}, defaultProperties:{logicFamily:'CMOS',label:'U3',value:'NOT'}, pins:[{id:'a',label:'A',x:0,y:15,direction:'in'},{id:'y',label:'Y',x:50,y:15,direction:'out'}], tags:['not','inverter','gate'] },
  { type:'nand',label:'NAND Gate',category:'digital', subcategory:'Logic Gates', emoji:'↑', description:'2-input NAND Gate',defaultSize:{width:60,height:40}, defaultProperties:{logicFamily:'CMOS',label:'U4',value:'NAND'},pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'y',label:'Y',x:60,y:20,direction:'out'}], tags:['nand','gate','universal'] },
  { type:'nor', label:'NOR Gate', category:'digital', subcategory:'Logic Gates', emoji:'↓', description:'2-input NOR Gate', defaultSize:{width:60,height:40}, defaultProperties:{logicFamily:'CMOS',label:'U5',value:'NOR'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'y',label:'Y',x:60,y:20,direction:'out'}], tags:['nor','gate','universal'] },
  { type:'xor', label:'XOR Gate', category:'digital', subcategory:'Logic Gates', emoji:'=1', description:'2-input XOR Gate', defaultSize:{width:60,height:40}, defaultProperties:{logicFamily:'CMOS',label:'U6',value:'XOR'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'in'},{id:'b',label:'B',x:0,y:30,direction:'in'},{id:'y',label:'Y',x:60,y:20,direction:'out'}], tags:['xor','gate','parity'] },

  // ── DIGITAL – FLIP FLOPS ──
  { type:'dff',  label:'D Flip-Flop', category:'digital', subcategory:'Flip Flops', emoji:'D', description:'D-type Flip Flop', defaultSize:{width:80,height:60}, defaultProperties:{label:'FF1',value:'DFF'}, pins:[{id:'d',label:'D',x:0,y:15,direction:'in'},{id:'clk',label:'CLK',x:0,y:45,direction:'in'},{id:'q',label:'Q',x:80,y:15,direction:'out'},{id:'qn',label:'Q̄',x:80,y:45,direction:'out'}], tags:['dff','flipflop','sequential'] },
  { type:'jkff', label:'JK Flip-Flop', category:'digital', subcategory:'Flip Flops', emoji:'JK', description:'JK Flip Flop', defaultSize:{width:80,height:80}, defaultProperties:{label:'FF2',value:'JKFF'}, pins:[{id:'j',label:'J',x:0,y:15,direction:'in'},{id:'k',label:'K',x:0,y:45,direction:'in'},{id:'clk',label:'CLK',x:0,y:65,direction:'in'},{id:'q',label:'Q',x:80,y:15,direction:'out'},{id:'qn',label:'Q̄',x:80,y:45,direction:'out'}], tags:['jkff','flipflop'] },

  // ── ANALOG ──
  { type:'opamp', label:'Op-Amp', category:'analog', subcategory:'OPAMP', emoji:'△', description:'Ideal Operational Amplifier', defaultSize:{width:70,height:60}, defaultProperties:{label:'U1',value:'LM741'}, pins:[{id:'inp',label:'+',x:0,y:15,direction:'in'},{id:'inn',label:'-',x:0,y:45,direction:'in'},{id:'out',label:'OUT',x:70,y:30,direction:'out'},{id:'vp',label:'V+',x:35,y:0,direction:'power'},{id:'vn',label:'V-',x:35,y:60,direction:'power'}], tags:['opamp','amplifier','analog'] },
  { type:'comparator', label:'Comparator', category:'analog', subcategory:'OPAMP', emoji:'≷', description:'Voltage Comparator', defaultSize:{width:70,height:60}, defaultProperties:{label:'U2',value:'LM393'}, pins:[{id:'inp',label:'+',x:0,y:15,direction:'in'},{id:'inn',label:'-',x:0,y:45,direction:'in'},{id:'out',label:'OUT',x:70,y:30,direction:'out'}], tags:['comparator','analog'] },

  // ── IC ──
  { type:'555timer', label:'555 Timer', category:'ic', emoji:'⏱', description:'555 Timer IC', defaultSize:{width:80,height:100}, defaultProperties:{label:'U3',value:'NE555'}, pins:[{id:'gnd',label:'GND',x:0,y:20,direction:'power'},{id:'trg',label:'TRG',x:0,y:40,direction:'in'},{id:'out',label:'OUT',x:80,y:40,direction:'out'},{id:'rst',label:'RST',x:0,y:60,direction:'in'},{id:'cv',label:'CV',x:80,y:60,direction:'inout'},{id:'thr',label:'THR',x:0,y:80,direction:'in'},{id:'dis',label:'DIS',x:80,y:80,direction:'inout'},{id:'vcc',label:'VCC',x:80,y:20,direction:'power'}], tags:['555','timer','ic','monostable','astable'] },
  { type:'mux', label:'Multiplexer', category:'ic', emoji:'⇉', description:'4:1 Multiplexer', defaultSize:{width:80,height:80}, defaultProperties:{label:'U4',value:'74153'}, pins:[{id:'i0',label:'I0',x:0,y:15,direction:'in'},{id:'i1',label:'I1',x:0,y:35,direction:'in'},{id:'i2',label:'I2',x:0,y:55,direction:'in'},{id:'s',label:'S',x:40,y:0,direction:'in'},{id:'y',label:'Y',x:80,y:40,direction:'out'}], tags:['mux','multiplexer','ic'] },
  { type:'adc', label:'ADC', category:'ic', emoji:'📊', description:'Analog to Digital Converter', defaultSize:{width:80,height:60}, defaultProperties:{label:'U5',value:'ADC0804'}, pins:[{id:'vin',label:'Vin',x:0,y:20,direction:'in'},{id:'ref',label:'Vref',x:0,y:40,direction:'in'},{id:'d0',label:'D0',x:80,y:10,direction:'out'},{id:'d1',label:'D1',x:80,y:25,direction:'out'},{id:'d2',label:'D2',x:80,y:40,direction:'out'},{id:'d3',label:'D3',x:80,y:55,direction:'out'}], tags:['adc','converter','analog','digital'] },
  { type:'dac', label:'DAC', category:'ic', emoji:'📈', description:'Digital to Analog Converter', defaultSize:{width:80,height:60}, defaultProperties:{label:'U6',value:'DAC0808'}, pins:[{id:'d0',label:'D0',x:0,y:10,direction:'in'},{id:'d1',label:'D1',x:0,y:25,direction:'in'},{id:'d2',label:'D2',x:0,y:40,direction:'in'},{id:'d3',label:'D3',x:0,y:55,direction:'in'},{id:'out',label:'Out',x:80,y:30,direction:'out'}], tags:['dac','converter'] },

  // ── DISPLAY ──
  { type:'led_display', label:'LED', category:'display', emoji:'💡', description:'Single LED Indicator', defaultSize:{width:30,height:30}, defaultProperties:{color:'#00d4f0',label:'LED1',value:'Blue'}, pins:[{id:'a',label:'A',x:0,y:15,direction:'in'},{id:'k',label:'K',x:30,y:15,direction:'in'}], tags:['led','display','indicator'] },
  { type:'seven_seg', label:'7-Segment', category:'display', emoji:'🔢', description:'7-Segment Display', defaultSize:{width:60,height:80}, defaultProperties:{label:'DSP1',value:'Common Cathode'}, pins:[{id:'a',label:'a',x:0,y:10,direction:'in'},{id:'b',label:'b',x:0,y:25,direction:'in'},{id:'c',label:'c',x:0,y:40,direction:'in'},{id:'d',label:'d',x:0,y:55,direction:'in'},{id:'e',label:'e',x:0,y:70,direction:'in'},{id:'com',label:'COM',x:60,y:40,direction:'in'}], tags:['seven-segment','display','numeric'] },
  { type:'oscilloscope', label:'Oscilloscope', category:'display', emoji:'📺', description:'Virtual Oscilloscope', defaultSize:{width:100,height:70}, defaultProperties:{label:'OSC1',value:'Scope'}, pins:[{id:'ch1',label:'CH1',x:0,y:20,direction:'in'},{id:'ch2',label:'CH2',x:0,y:50,direction:'in'},{id:'gnd',label:'GND',x:50,y:70,direction:'power'}], tags:['scope','oscilloscope','measure'] },

  // ── INPUT ──
  { type:'switch', label:'Switch', category:'input', emoji:'🔘', description:'SPST Switch', defaultSize:{width:50,height:20}, defaultProperties:{label:'SW1',value:'OFF'}, pins:[{id:'a',label:'A',x:0,y:10,direction:'inout'},{id:'b',label:'B',x:50,y:10,direction:'inout'}], tags:['switch','spst','input'] },
  { type:'button', label:'Push Button', category:'input', emoji:'⬜', description:'Momentary Push Button', defaultSize:{width:40,height:40}, defaultProperties:{label:'BTN1',value:'Push'}, pins:[{id:'a',label:'A',x:0,y:20,direction:'inout'},{id:'b',label:'B',x:40,y:20,direction:'inout'}], tags:['button','push','momentary'] },
  { type:'clk_gen', label:'Clock Generator', category:'input', emoji:'🕐', description:'Clock Pulse Generator', defaultSize:{width:60,height:40}, defaultProperties:{frequency:1000,label:'CLK1',value:'1kHz'}, pins:[{id:'out',label:'OUT',x:60,y:20,direction:'out'},{id:'gnd',label:'GND',x:30,y:40,direction:'power'}], tags:['clock','pulse','generator'] },

  // ── ACTUATORS ──
  { type:'buzzer', label:'Buzzer', category:'output', emoji:'🔔', description:'Piezo Buzzer', defaultSize:{width:50,height:50}, defaultProperties:{label:'BZ1',value:'5V Buzzer'}, pins:[{id:'p',label:'+',x:0,y:15,direction:'in'},{id:'n',label:'-',x:50,y:15,direction:'in'}], tags:['buzzer','audio','sound'] },
  { type:'motor', label:'DC Motor', category:'output', emoji:'⚙️', description:'DC Motor', defaultSize:{width:60,height:60}, defaultProperties:{label:'M1',value:'Motor'}, pins:[{id:'p',label:'+',x:0,y:20,direction:'inout'},{id:'n',label:'-',x:60,y:20,direction:'inout'}], tags:['motor','actuator','dc'] },
  { type:'relay', label:'Relay', category:'output', emoji:'🔀', description:'SPDT Relay', defaultSize:{width:70,height:60}, defaultProperties:{label:'RLY1',value:'5V Relay'}, pins:[{id:'coil1',label:'C1',x:0,y:15,direction:'in'},{id:'coil2',label:'C2',x:0,y:45,direction:'in'},{id:'com',label:'COM',x:70,y:30,direction:'inout'},{id:'no',label:'NO',x:70,y:10,direction:'inout'},{id:'nc',label:'NC',x:70,y:50,direction:'inout'}], tags:['relay','switch','electromechanical'] },

  // ── SENSORS ──
  { type:'temp_sensor', label:'Temp Sensor', category:'sensor', emoji:'🌡️', description:'Temperature Sensor (LM35)', defaultSize:{width:60,height:40}, defaultProperties:{label:'U7',value:'LM35'}, pins:[{id:'vcc',label:'VCC',x:0,y:10,direction:'power'},{id:'out',label:'OUT',x:60,y:20,direction:'out'},{id:'gnd',label:'GND',x:0,y:30,direction:'power'}], tags:['temperature','sensor','lm35'] },
  { type:'ldr', label:'LDR', category:'sensor', emoji:'☀️', description:'Light Dependent Resistor', defaultSize:{width:50,height:30}, defaultProperties:{resistance:10000,label:'LDR1',value:'10kΩ'}, pins:[{id:'a',label:'A',x:0,y:15,direction:'inout'},{id:'b',label:'B',x:50,y:15,direction:'inout'}], tags:['ldr','light','sensor','photoresistor'] },
  { type:'ultrasonic', label:'Ultrasonic', category:'sensor', emoji:'📡', description:'Ultrasonic Distance Sensor (HC-SR04)', defaultSize:{width:80,height:40}, defaultProperties:{label:'US1',value:'HC-SR04'}, pins:[{id:'vcc',label:'VCC',x:0,y:10,direction:'power'},{id:'trig',label:'TRIG',x:0,y:25,direction:'in'},{id:'echo',label:'ECHO',x:80,y:25,direction:'out'},{id:'gnd',label:'GND',x:0,y:35,direction:'power'}], tags:['ultrasonic','distance','sensor'] },

  // ── MCU ──
  { type:'arduino', label:'Arduino UNO', category:'mcu', emoji:'🟦', description:'Arduino UNO Microcontroller', defaultSize:{width:100,height:120}, defaultProperties:{label:'U8',value:'ATmega328P'}, pins:[{id:'d0',label:'D0',x:0,y:20,direction:'inout'},{id:'d1',label:'D1',x:0,y:35,direction:'inout'},{id:'d2',label:'D2',x:0,y:50,direction:'inout'},{id:'d13',label:'D13',x:0,y:65,direction:'inout'},{id:'a0',label:'A0',x:100,y:20,direction:'inout'},{id:'a1',label:'A1',x:100,y:35,direction:'inout'},{id:'vcc',label:'5V',x:50,y:0,direction:'power'},{id:'gnd',label:'GND',x:50,y:120,direction:'power'}], tags:['arduino','uno','mcu','atmega'] },
  { type:'esp32', label:'ESP32', category:'mcu', emoji:'📶', description:'ESP32 WiFi/BT Module', defaultSize:{width:100,height:120}, defaultProperties:{label:'U9',value:'ESP32-WROOM'}, pins:[{id:'gpio0',label:'IO0',x:0,y:20,direction:'inout'},{id:'gpio2',label:'IO2',x:0,y:35,direction:'inout'},{id:'gpio4',label:'IO4',x:0,y:50,direction:'inout'},{id:'tx',label:'TX',x:100,y:20,direction:'out'},{id:'rx',label:'RX',x:100,y:35,direction:'in'},{id:'vcc',label:'3.3V',x:50,y:0,direction:'power'},{id:'gnd',label:'GND',x:50,y:120,direction:'power'}], tags:['esp32','wifi','bluetooth','mcu'] },
];

export const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  power:         { label:'Power',        emoji:'🟥', color:'#ef4444' },
  passive:       { label:'Passive',      emoji:'🟡', color:'#eab308' },
  semiconductor: { label:'Semiconductor',emoji:'🔵', color:'#3b82f6' },
  digital:       { label:'Digital',      emoji:'🟣', color:'#8b5cf6' },
  analog:        { label:'Analog',       emoji:'🔴', color:'#f43f5e' },
  ic:            { label:'ICs',          emoji:'🟠', color:'#f97316' },
  display:       { label:'Display',      emoji:'🟤', color:'#a78bfa' },
  input:         { label:'Input',        emoji:'⚪', color:'#94a3b8' },
  output:        { label:'Output',       emoji:'🔊', color:'#f472b6' },
  sensor:        { label:'Sensors',      emoji:'🟧', color:'#fb923c' },
  mcu:           { label:'MCU',          emoji:'🟪', color:'#a855f7' },
};

export const getComponentDef = (type: string): ComponentDef | undefined =>
  COMPONENT_LIBRARY.find((c) => c.type === type);

export const searchComponents = (q: string): ComponentDef[] => {
  if (!q.trim()) return COMPONENT_LIBRARY;
  const lower = q.toLowerCase();
  return COMPONENT_LIBRARY.filter(
    (c) =>
      c.label.toLowerCase().includes(lower) ||
      c.description?.toLowerCase().includes(lower) ||
      c.tags?.some((t) => t.includes(lower))
  );
};
