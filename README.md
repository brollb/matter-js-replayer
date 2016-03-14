# Matter-js Replayer
This is a project which provides serializable logs for matter-js which can then be replayed at a later date (for dev and debugging purposes).

## Quick Start
Serialization of actions:

1. replace `matter.js` with `dist/serializer.js`
2. replace `Matter` with `MatterDev` in the source
3. call `MatterDev.download()` to download the serialized actions as json

Replaying actions:

1. include `dist/replayer.js`
2. create a replayer (`var replayer = new Replayer();`)
3. call `replayer.play(actions);` where `actions` is the array of actions

## Example Code
```javascript
var replayer = new Replayer();

// Create a rendering env
engine = Matter.Engine.create({
    render: {
        element: document.body,
        options: {
            width: 1800,
            height: 900
        }
    }
});
Matter.Engine.run(engine);

// convert engine create command to my own
replayer.engine = engine;
replayer.world = engine.world;

replayer.play(actions);
```
