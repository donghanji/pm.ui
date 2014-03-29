/*
 * @name jquery.flexSlider Module
    
 * @desc 
		jquery.flexslider as a module.
        
        to see:
            http://www.woothemes.com/flexslider/
   
 */
(function(global,undefined){
	if(module.declare === undefined){
		
        throw 'There is no global module.declare method!';
	}
    var $name=module.globals('$');
	module.files({
		'jquery.flexslider':'http://flexslider.woothemes.com/js/jquery.flexslider.js'
	});
    //jquery plugin must been loaded
    module.declare([$name],function(){
        //define jquery.flexslider.module module
        module.declare('jquery.flexslider.module',['jquery.flexslider'],function(require){
            
            return jQuery||require('jQuery')||{};
        });
    });
})(window);