### short term todo
- add duplicate xy message cleanup
- convert loops to more efficient (and easily reference-able data structure)
    - improve memory performance, remove null-access errors from JSON obj
- add non looping triggering (destroy on end)
- add loop stopping/removal methods
- add "clean looping" cleanup in JS
- show live mouse/pen position
- fix path interpolation logic so slowed-down gestures are smoother

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


### done todo 
- move loop recording into node server
- add tcp socket connection from c++ to node 
- add json deserialization to c++
- add template for processing/cleanup functions for loops to JS
- port loop manager to c++
    - add noramlized time playback
- add basic loop triggering




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