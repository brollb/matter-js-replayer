/* globals Matter */
// Modify Matter.js to contain a replayer intermediate step
(function() {
    'use strict';
    var MatterCore = Matter,
        oldFns = {},
        necromancer = new Resurrect();

    Matter._actions = [];

    // Create the pass-through functions
    var fns = {World: ['create', 'add', 'remove']},
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
            oldFns[mod][name] = Matter[mod][name];
            console.log('adding serialization fn for ' + mod + ' (' + name + ')');
            Matter[mod][name] = serFn.bind(Matter, mod, name);
        }
    }

    Matter.actions = function() {
        return necromancer.stringify(this._actions);
    };

})();
