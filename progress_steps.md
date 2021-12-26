

- move loop recording into node server
- add tcp socket connection from c++ to node 
- add json deserialization to c++
- add processing/cleanup functions for loops to JS
- port loop manager to c++
    - add noramlized time playback
- add basic non looping triggering (destroy on end)

- add simple static loop drawing via p5 in browser (to help debug)
- develop loop triggering API 
    - trigger command sent via network from node to c++
    - can then remap trigger gestures live in node notebook
