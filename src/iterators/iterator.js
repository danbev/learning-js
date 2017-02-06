let it = {
    [Symbol.iterator]() {
        var n = 0;
        return {
            // allows the returned iterator to be used in multiple
            // for of loops. The loop will call this function and 
            // unless it is here you'll get an error.
            [Symbol.iterator]() { return this; },
            next: () => {
              let value = n++;
              return { value: value, done: false };
            },
            return: (v) => {
              console.log("return called!");
              n = 0;
              return {value: v, done: true};
            }
        };
    }
};

module.exports = it;
