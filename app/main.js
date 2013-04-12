require.config({ 
    paths: {
        a: '../modules/a',
        b: '../modules/b',
        c: '../modules/c',
        jquery: '../lib/jquery'
    }
});

require(['a', 'b', 'c', 'jquery'], function (a, b, c, $) {
    console.log(a);
    console.log(b);
    console.log(c);
    console.log($);
});