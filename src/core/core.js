this.Sync = {};

Sync.Core = function(config) {
    // when this function is invoked with the 'new' keyword a new object will be created
    // and 'this' will refer to that object. The following handles the case where 'new' was
    // left out.
    if (!(this instanceof Sync.Core)) {
        return new Sync.Core(config);
    }

    this.config = config || {};

    this.something = function(c) {
        return c;
    };
};


