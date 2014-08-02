beforeEach(function(){
    jasmine.addMatchers({
        toBeArray: function(){
            return {
                compare: function(actual, expected){
                    return {
                        pass: Object.prototype.toString.call(actual) === '[object Array]' ? true : false
                    };
                }
            };
        }
    });

    jasmine.addMatchers({
        toBeNumber: function(){
            return {
                compare: function(actual, expected){
                    return {
                        pass: (/\d+/).test(actual)
                    };
                }
            };
        }
    });

    jasmine.addMatchers({
        toBeNaN: function (expected) {
            return {
                compare: function(actual, expected){
                    return {
                        pass: isNaN(actual)
                    };
                }
            };
        }
    });
});
