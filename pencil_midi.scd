

(
MIDIIn.connectAll;
~iPad = MIDIClient.sources.select({|elem| (elem.name == "iPad") && (elem.device == "neeshPad")})[0];
~touchOSCBridge = MIDIClient.sources.select({|elem| (elem.name == "TouchOSC Bridge") && (elem.device == "TouchOSC Bridge")})[0];

~logs = [];
~clock = TempoClock.new;
~values = Dictionary.new;
~c0 = CC14.new(0, 32, 0, true, true);
~gotNewValues = false;

~ipadOn = MIDIFunc.noteOn({|vel, note, chan, port|
   if(note == 60, {
		"touch ipad started".postln;
		~oscOut.sendMsg("/pos/touch", 1);
	});
}, nil, nil, ~iPad.uid);

~ipadOff = MIDIFunc.noteOff({|vel, note, chan, port|
	if(note == 60, {
		"touch ipad ended".postln;
		~oscOut.sendMsg("/pos/touch", 0);
	});
}, nil, nil, ~iPad.uid);

~touchOSCOn = MIDIFunc.noteOn({|vel, note, chan, port|
   if(note == 60, {
		"touch osc started".postln;
		~oscOut.sendMsg("/recording", 1);
	});
}, nil, nil, ~touchOSCBridge.uid);

~touchOSCOff = MIDIFunc.noteOff({|vel, note, chan, port|
	if(note == 60, {
		"touch osc ended".postln;
		~oscOut.sendMsg("/recording", 0);
	});
}, nil, nil, ~touchOSCBridge.uid);


~logVal = {|name, val, chan, cc1, cc2|
	"%-Received %: %, cc1: %, cc2: %, chan: %".format(cc1, name, val, cc1, cc2, chan).postln;
};

~c0.func_({|val, chan, cc1, cc2|
	~values["x"] = val;
	~gotNewValues = true;
	if(~logs.includes(cc1), { ~logVal.("X", val, chan, cc1, cc2) });
});

~c1 = CC14.new(1, 33, 0, true, true);
~c1.func_({|val, chan, cc1, cc2|
	~values["y"] = val;
	~gotNewValues = true;
	if(~logs.includes(cc1), { ~logVal.("Y", val, chan, cc1, cc2) });
});

~c2 = CC14.new(2, 34, 0, true, true);
~c2.func_({|val, chan, cc1, cc2|
	~values["force"] = val;
	~gotNewValues = true;
	if(~logs.includes(cc1), { ~logVal.("Force", val, chan, cc1, cc2) });
});

~c3 = CC14.new(3, 35, 0, true, true);
~c3.func_({|val, chan, cc1, cc2|
	~values["azimuth"] = val;
	~gotNewValues = true;
	if(~logs.includes(cc1), { ~logVal.("Azimuth", val, chan, cc1, cc2) });
});

~hasAllValues = {|vals|
	vals["x"].isNil.not && vals["y"].isNil.not && vals["force"].isNil.not &&  vals["azimuth"].isNil.not;
};
~oscOut = NetAddr("localhost", 7071);
~sendOSC = {|vals|

};
~oscTask = Task.new({
	{
		if(~gotNewValues && ~hasAllValues.(~values), {
			~oscOut.sendMsg("/pos", ~values["x"], ~values["y"], ~clock.beats*1000, ~values["force"], ~values["azimuth"]);
			~gotNewValues = false;
		});
		(1/100).wait;
	}.loop;
});
~oscTask.start;
)

~logs = [0];


1/100

~clock.beats