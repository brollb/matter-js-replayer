/* globals Matter */
(function(globals) {
    'use strict';
    var necromancer = new Resurrect();

    var Replayer = function() {
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

    globals.Replayer = Replayer;
})(this);
