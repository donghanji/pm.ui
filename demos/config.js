(function(){
	module.config({
		require:false,//default false
		base:'../src/js/',
		mined:'',
		alias:{
			//'jquery':'http://code.jquery.com/jquery-1.8.3.min.js',
			//'jquery.module':'https://raw.githubusercontent.com/donghanji/modules/master/src/jquery.module.js',
			
			'jquery':'jquery-1.11.1',
			'jquery.module':'jquery.module',
			
			'ui.tab':'{plugins}/ui.tab',
			'ui.dialog':'{plugins}/ui.dialog',
			'ui.dropdown':'{plugins}/ui.dropdown',
			'ui.pagination':'{plugins}/ui.pagination',
			
			'os':'https://raw.githubusercontent.com/donghanji/plugins/master/dest/os.min.js',
			
			'jquery.flexslider':'http://flexslider.woothemes.com/js/jquery.flexslider.js',
			'jquery.flexslider.module':'{modules}/jquery.flexslider.module'
		},
		files:[],
		globals:{
			'$':'jquery.module'
		},
		defaults:{},
		debug:false
	});
})();