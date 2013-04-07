beforeEach(function(){
    this.addMatchers({
        toBeArray: function (expected) {
            return Object.prototype.toString.call(this.actual) === '[object Array]' ? true : false;
        }
    });

    this.addMatchers({
        toBeNumber: function (expected) {
            return /\d+/.test(this.actual);
        }
    });

    this.addMatchers({
        toBeNaN: function (expected) {
            return isNaN(this.actual);
        }
    });
});