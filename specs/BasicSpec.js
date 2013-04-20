describe('Basic', function(){
    it('should pass a single assertion without causing an error', function(){
        expect([]).toBeArray();
    });

    it('should let me test our AMD modules', function(){
        expect($).toBeDefined();
    });
});

describe('AJAX', function(){
    beforeEach(function(){
        // SET-UP FAKE XHR
        var requests = this.requests = [];
        this.ajax = sinon.useFakeXMLHttpRequest(); // replaces the native XHR/ActiveXObject
        this.ajax.onCreate = function(xhr) {
            requests.push(xhr);
        };
    });
    
    afterEach(function(){
        // RESTORE REAL XHR
        this.ajax.restore();
    });

    it('should demonstrate the Sinon mocking and spying functionality', function(){
        var spy = sinon.spy();

        $.ajax({
            url: '/Gruntfile.js',
            success: spy
        });
        
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123, "comment": "Hey there" }]');

        expect(this.requests.length).toBeNumber();
        expect(this.requests.length).toBe(1);
        expect(this.requests[0].url).toEqual('/Gruntfile.js');
        expect(this.requests[0].method).toEqual('GET');
        
        expect(spy.called).toBeTruthy();
        expect(spy.callCount).toBe(1);
        expect(spy.calledWith([{ id: 123, comment: "Hey there" }])).toBeTruthy();
    });
});