describe('DOM', function(){
    beforeEach(function(){
        $('body').append('<div id="js-injected">An injected DOM node</div>');
    });
    
    afterEach(function(){
        $('#js-injected').remove();
    });

    it('should insert some fixture data into the SpecRunner', function(){
        expect(document.getElementById('js-injected').innerHTML).toBe('An injected DOM node');
    });
});

describe('More DOM', function(){
    it('should remove our fixture data after tearDown', function(){
        expect(document.getElementById('js-injected')).toBeNull();
    });
});