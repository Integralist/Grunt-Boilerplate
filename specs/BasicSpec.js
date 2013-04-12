describe('Basic', function(){
    it('should pass a single assertion without causing an error', function(){
        expect([]).toBeArray();
    })

    it('should let me test our AMD modules', function(){
        expect($).toBeDefined();
    })
});