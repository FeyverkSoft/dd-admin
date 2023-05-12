// @ts-ignore 
Array.prototype.getIndex = function getIndex(func) {
    for (let i = 0; i < this.length; i++) {
        if (func(this[i]))
            return i;
    }
    return -1;
};

String.prototype.format = function () {
    let args = arguments;
    let _this = this;
    if (args) {
        Object.keys(args).forEach((element, i) => {
            _this = _this.replace('{' + i + '}', args[element]);
        })
    }
    return _this;
};

Array.prototype.firstOrDefault = function getIndex(func, def) {
    for (let i = 0; i < this.length; i++) {
        if (func(this[i]))
            return this[i];
    }
    return def || undefined;
};

Array.prototype.diff = function (a) {
    return this.filter(function (i) { return a.indexOf(i) < 0; });
};