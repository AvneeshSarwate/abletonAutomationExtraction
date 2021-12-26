Ableton live files are just gzipped xml files. This is an attempt at writing a python script that extracts the automation information and returns a nice JSON object with each curve mapped to it's (track, clip, parameter) tuple, with a special clip-ID used to specify session-view automation.

Also includes a dummy max for live device as a template for making devices with custom named knobs. This combines well with the "OSC Send" device in the Max For Live Connection Kit pack for sending realtime OSC automation via Ableton.

very not finished atm.



js_server.ipynb is meant to work with https://github.com/n-riesco/ijavascript and connects to https://github.com/AvneeshSarwate/gestureLoopsOF