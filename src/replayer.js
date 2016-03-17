/* globals Matter */
(function(globals) {
    'use strict';
    var necromancer = new Resurrect();

    var Replayer = function() {
        this.engine = null;
        this.world = null;
        this.actions = null;
        this._index = 0;
    };

    Replayer.prototype.play = function(actions, opts) {
        var action,
            accel,
            t_0;

        if (this._index) {
            throw Error('Cannot play actions until the current action sequence has finished');
        }

        opts = opts || {};
        accel = opts.speed || 1;
        this.last = opts.count || Infinity;

        this.actions = necromancer.resurrect(actions);

        // normalize the times
        t_0 = this.actions[0].time;
        this.actions
            .forEach(cmd => cmd.time = (cmd.time - t_0)/accel);

        action = this.actions.shift();

        setTimeout(this._next.bind(this), action.time, action);
    };

    Replayer.prototype._next = function(action) {
        console.log(`invoking #${++this._index}: Matter.${action.module}.` +
            `${action.method}(${action.args.join(', ')})`);

        // Set engine/world as needed
        action.args = action.args.map((arg, i) => this._updateArg(arg, i, action));

        // Play the action 
        Matter[action.module][action.method].apply(Matter, action.args);

        // Queue the next action
        if (this.actions.length && this._index < this.last) {
            var next = this.actions.shift();
            console.log(`invoking next action in ${next.time/1000} seconds`);
            setTimeout(this._next.bind(this), next.time, next);
        } else {
            console.log(`finished! Played ${this._index} actions.`);
            this._index = 0;
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
