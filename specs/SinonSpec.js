describe('Sinon.js', function(){
    beforeEach(function(){
        this.obj = {
            doSomething: function(msg) {
                return 'Your message was: ' + msg;
            },
            add10: function(num) {
                return num + 10;
            },
            delegation: function(){ this.doSomething(); }
        };
    });

    afterEach(function(){
        this.obj = null;
    });

    it('should have access to the sinon library', function(){
        expect(sinon).toBeDefined();
    });

    it('should demonstate stub feature', function(){
        sinon.stub(this.obj, 'add10', function(num){ return 12; });
        expect(this.obj.add10(1)).not.toBe(11);

        sinon.stub(this.obj, 'doSomething').returns('Something else?');
        expect(this.obj.doSomething('test 1')).toBe('Something else?');
        
        this.obj.doSomething.restore();
        this.obj.add10.restore();
    });

    it('should demonstate mock feature', function(){
        var mock = sinon.mock(this.obj);
            mock.expects('doSomething').exactly(2);

        this.obj.delegation('Some Message');
        this.obj.doSomething('Some Other Message');

        mock.verify();
        mock.restore();
    });
});