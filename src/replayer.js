/* globals Matter */
(function(globals) {
    'use strict';
    var necromancer = new Resurrect();

    var Replayer = function() {
        this.engine = null;
        this.world = null;
        this.actions = null;
    };

    Replayer.prototype.play = function(actions) {
        var action,
            t_0;

        this.actions = necromancer.resurrect(actions);

        // normalize the times
        t_0 = this.actions[0].time;
        this.actions.forEach(cmd => cmd.time -= t_0);

        action = this.actions.shift();

        setTimeout(this._next.bind(this), action.time, action);
    };

    Replayer.prototype._next = function(action) {
        console.log(`invoking Matter.${action.module}.${action.method}(${action.args.join(', ')})`);

        // Set engine/world as needed
        action.args = action.args.map((arg, i) => this._updateArg(arg, i, action));

        // Play the action 
        Matter[action.module][action.method].apply(Matter, action.args);

        // Queue the next action
        if (this.actions.length) {
            var next = this.actions.shift();
            setTimeout(this._next.bind(this), next.time, next);
        } else {
            console.log('finished!');
        }
    };

    Replayer.prototype._updateArg = function(arg/*, i, action*/) {
        if (arg.label === 'World') {
            return this.world || (this.world = arg);
        }
        if (arg.label === 'Engine') {
            return this.engine || (this.engine = arg);
        }
        return arg;
    };

    globals.Replayer = Replayer;
})(this);
