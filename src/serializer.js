/* globals Matter */
// Modify Matter.js to contain a replayer intermediate step
(function(globals) {
    'use strict';
    var oldFns = {},
        necromancer = new Resurrect();

    var MatterDev = {};

    // Copy all the Matter modules
    Object.keys(Matter)
        .forEach(mod => MatterDev[mod] = Matter.Common.clone(Matter[mod]));
    
    MatterDev._actions = [];

    // Create the pass-through functions
    var fns = {
            World: ['create', 'add', 'remove'],
            Engine: ['create'],
            Body: Object.keys(MatterDev.Body)
        },
        modules = Object.keys(fns),
        mod,
        name,
        serFn = function(mod, name) {
            var args = Array.prototype.slice.call(arguments, 2);

            // Record the action
            this._actions.push({
                module: mod,
                method: name,
                time: Date.now(),
                args: args
            });

            return oldFns[mod][name].apply(this, args);
        };

    for (var i = modules.length; i--;) {
        mod = modules[i];
        oldFns[mod] = {};
        for (var j = fns[mod].length; j--;) {
            name = fns[mod][j];
            oldFns[mod][name] = MatterDev[mod][name];
            console.log('adding serialization fn for ' + mod + ' (' + name + ')');
            MatterDev[mod][name] = serFn.bind(MatterDev, mod, name);
        }
    }

    MatterDev.actions = function() {
        return necromancer.stringify(this._actions);
    };

    MatterDev.download = function() {
        download(this.actions(), 'actions.json', 'text/json');
    };

    globals.MatterDev = MatterDev;
})(this);
