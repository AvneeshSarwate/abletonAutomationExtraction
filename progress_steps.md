### short-term/"core" todo
- add button to clear all loops
- create 2 super simple composite objects
- add json launch-config format for composite gestures
    - be able to cleanly handle multiple types of composite objects
- add a scheme for sending OSC messages to individual composite gesture instances
    - turn voronoi rendering into a composite gesture, with a 
      param-per-instance of grid size controllable via OSC
    - turn launching gestures from a gesture-track into a composite gesture,
      with the track position/phase an OSC param
- add deleting by key/group/loopKey
  - implementation with single pass and minimal implementation complexity
    - have sets for ids/groups/loopkeys to be erased - these get added to when an erase message comes in 
    - on the clean up iteration, check if loops properties are in ids/groups/loopkeys to be erased
    - check if there would be OSC-threading issues. can send over TCP if so 


### Scaling individual OF sketches into a whole set 
- For sketching, have multiple ofApp{123} in the same project, but just switch 
  up which one gets called in main.cpp
    - Have the drawing happening in a single function (realDraw) that returns a 
      texture, and the draw() function just calls that 
- Namespace the osc messages sent from js to the apps so when combining c++ code later, there’s no issues 
- When combining sketches into a single app for a live set, 
  just copy the realDraw/update functions and class variables into a new app
- How to deal with class variables with the same name across sketches? 
  Just rename them with subscripts _123 before copying? 
- Can you call multiple ofApps in a wrapper app? Would solve class variable naming problem 
- Might need a way to indicate the TCP socket over which to send “global” 
  information, and also figure out name spacing for tcp sockets for gesture launches 
    - Clients could send their “name” to js upon instantiating, and JS keeps a name/socket map 

### scheme for remapable and ableton-recordable controllers
come up with a way to map touchOSC sliders to OSC addresses from JS (and also record into ableton)
touchOSC always sends "/param-i", js bounces it to a param name, and the remapping function in js bounces the names to labels under the sliders in touchOSC
can also set up 14 bit midi bounce to ableton 
JS bouncer sends osc message to Max, which bounces to ableton via xctlout object
(see dynalist)



### scheme for making draw functions for individual gestures live-codeable with lua
- push all OSC values into a map, and inject that map into the script
  - v0 - only 2 value per message, for a position-xy, need a "/pos_x" and "/pos_y" address
- only instantiate one script, and only call the "draw" function from openFrameworks
  - but before you call draw, you can push the name of the function the draw function will call
  - have a name->function map in the script, and the draw function calls whatever value is set
    on the global "function to call" variable
- "arguments" of these inner functions will be set as global vars in the script before the call from OF
  - this is kind of like how openGL api works
- overall, a bit convoluted, but has the same level of "fixedness" as making an ofxLua -> lua func binding
  like make for the ofApp functions, and is more "portable" between sketches 
- need to set up hot-reloading for the one main script
- TODO - how to use a hot-reloading shader inside the lua script?
  - try passing in an AutoReloadingShader object and see if bindings work
  - set up auto reload in c++ on a normal ofShader object and pass it in
  - create shader and auto reload all in lua 

### creating UIs for sketch params and making ableton mapping easy
- automatically generate buttons/sliders, etc based on OSC handlers set
    - scope/name them by sketch name
    - make sure they can run in a mobile browser for jamming
- figure out how to map these into ableton to quickly record triggers/sliders
- see if you can use JS introspection to generate buttons from functions quickly?
- use livecoding to quickly insert buttons for functions on the fly without UI refresh?
### "creative-driven" feature roadmap (roughly priotity order)
- create first composite gesture instance - loop addition
    - can get lots of milage of complex ensemble motion with this
- figure out how to use lambdas and "push/pop" style transformations to create a sort of
  "granular post processing" set of transformations on drawn things
    - e.g, can draw something, but just slap OF transform functions (rotate/scale/color)
      or even shaders (vertex, fragment, geom) to change how a thing is rendered with no
      knowledge of what it actuall is
- add affine transforms for loops (priority: rotate, reflect, scale)
    - set them at launch time rather than clean-up time, because 
      this is necessary for quickly triggering ensemble launches
    - can simply apply the transform to the delta at each step?
- initialize with non-0 phase
    - very useful for ensemble launching
- live-mouse "yank" by group id
    - determine how this would work with composites 
    - (they also have group id, and a yank(delta) method that could be a no-op)
- think of 80/20 api for group-id/ensemble steering
- interactions between gestures for emergent complexity
    - e.g - 2 gesture trails, trail head turns 90 degrees to avoid intersecting when 
      within a certain distance of the other trail


### c++ unknowns
- interfaces (for composite gesture objects)
- appropriate/efficient storage structures for querying 


### longer term todo - (don't overdo it - make actual art)
- add simple static loop drawing via p5 in browser (to help debug)
- be able to set draw style of gesture brush with OSC
    - initial style via constructor, modify style via 
- design/streamline loop triggering API 
    - create high level loop-ensemble launch commands that can be triggered from ableton or manual controllers
- create query API so you can grab all elements by id/group/etc and modify their properties/behavior
        - doing this rhythmically is a powerful expressive capability, esp on looping brush-heads
- add gesture "composition" primitives
    - lerp
    - yank/deviation (either live or with gesture)
- (DONE) add pausability to gestures
    - feed in currentTime/lastTime from outer draw loop so all gestures update to same timestep
    - increase gesture age by incrementing with a delta
    - potential API - step() a gesture with a time delta, let it internally calculate 
      it's own phase delta based on its duration


### using gestures to control other systems
- shaders+feedback - driving brushes, driving positional feedback displacement
- physics (ofxBox2D, ofxLiquidFun)
- particle systems
    - attraction (gravity/spring), dragging/accumulation
    - arrangement across/between gesture points
- displacement/optical flow (ofxFlowTools)
- actual painting (ofxInkSim, ofxOilPaint)

### done todo 
- move loop recording into node server
- add tcp socket connection from c++ to node 
- add json deserialization to c++
- add template for processing/cleanup functions for loops to JS
- port loop manager to c++
    - add noramlized time playback
- add basic loop triggering
- add duplicate xy message cleanup
- fix path interpolation logic so slowed-down gestures are smoother
- add delta motion for infinite smooth moving (works with normed duration)
- convert loops to more efficient (and easily reference-able) data structure
    - improve memory performance, remove null-access errors from JSON obj
- add basic loop stopping/removal methods
- add "clean looping" cleanup in JS
- add time-stamped messages for use in slow-network situations (either OSC timestamps or custom websocket UI)
- add mechanism for sending a "launch-config" with json (for basic groups of gestures, no composites yet)
- add rotation property to gestures
- show live mouse/pen position
- add non looping triggering (destroy on end)
- Move drawing to draw into framebuffer, and add basics of namespacing OSC messages by sketch
- add pausability to gestures (sending a wall-clock delta to step() for each gesture)


#### steering API ideas
- concrete bases - all steer to a point
- abstract - all steer to a point based on individual state + some function + live param(s) global to group
    - example, steer towards nearest point on a grid of anchors 
- steering could be a "post processing" transformation applied to anything that implements "steerable"
    - what state do steering functions need? (all same, easy, all diff? sounds like an ECS)


#### composite gesture object design sketch.
- has a bunch of child gestures
- it's step() method steps all of them 
- it's draw() method takes the point values of all of them and then does whatever
- it still has key/group/loopName(s) parameters for querying an managing
- this can be used to implement:
    - interpolation
    - launching along a common "track" 
    - drawing complex shapes (e.g, bounding polygon of weird moving points)
- can take references of existing gesture instances, so multiple composites can share motion
    - e.g, multiple "launchers" on the same "track" 
- could manage lifecycles of their emitted child gestures


### fixed bugs
- some kind of flickering on some loops
- crash in C++ when updating loop-store and loops running


### touchOSC bugs
- duplicate UDP message (happens with old touchOSC too - mac bug?)
- Android doesn't encode TCP-OSC correctly
- eventual slowdown when sending TCP-OSC for long XY gestures