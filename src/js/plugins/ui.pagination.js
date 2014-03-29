/*
 * ui.pagination
 * api:
        load:function(options){}//
 * sample:
        html:
            <ul class="pagination">
				<li class="first"><a>&lt;&lt;</a></li>
				<li class="prev"><a>&lt;&nbsp;上一页</a></li>
				<li data-role="pagination"><a>1</a></li>
				<li data-role="pagination" class="active"><a>2</a></li>
				<li data-role="pagination"><a>3</a></li>
				<li data-role="pagination"><a>4</a></li>
				<li data-role="pagination" class="ellipsis"><a>...</a></li>
				<li data-role="pagination"><a>5</a></li>
				<li class="next"><a>&gt;</a></li>
				<li class="last"><a>&gt;&gt;</a></li>
			</ul>
        
        css:
            <link type="text/css" rel="stylesheet" href="./stylesheets/ui.pagination.css"/>
        
        js:
            var pagination=require('ui.pagination');
            pagination.load({
				el:'.pagination',
				current:1,//current page index
				totals:21,//total page index
				pages:5,//page counts ,default 0(no pagination),if ellipsis,only odd
				//ellipsis:false,//default true
				pagination:'<li><a>{pagination}</a></li>',//pagination object
				callback:function(index){//click callback
					//
					console.log(index);
				}
			});
 */
(function(){
    if (module.declare === undefined) {
        
        throw 'There is no global module.declare method!';
    }
    var $name=module.globals('$');
    
    module.declare('ui.pagination',[$name],function(require){
        var $=require($name);
        
        function Pagination(options){
            options=options||{};
            
            if(!options.el){
                
                return ;
            }
            this.$el=$(options.el);
            this.previous=this.current=options.current||1;
            this.totals=options.totals||5;
            this.pages=options.pages||0;
            this.pagination=options.pagination||'<li><a>{pagination}</a></li>';
            this.callback=options.callback;
            
			//ellipsis
			var ellipsis=options.ellipsis === false ? false : true;
			this.create=ellipsis ? this.ellipsis : this.normal;
			
            this.$prev=this.$el.find('>li.prev')||this.$el.find('>li.first');
            
            this.pageto(this.current);
            
            var _this=this;
            //bind event
            this.$el.bind('click',function(e){
                var $target=$(e.target),
                    $parent=$target.parent();
                  
                if($parent.hasClass('ellipsis') || $parent.hasClass('disabled') || $parent.hasClass('active')){
                    
                    return;
                }  
                if($parent.attr('data-role') === 'pagination'){//pagination
                    _this.current=parseInt($parent.text());
                    //_this.created=false;
                    
                    return _this.pageto(_this.current);
                }
                //to prev page
                if($parent.hasClass('first')){
                    
                    _this.current=1;
                    
                    return _this.pageto(_this.current);
                }
                if($parent.hasClass('prev')){
                    
                    _this.current--;
                    
                    return _this.pageto(_this.current);
                }
                
                //to next page
                if($parent.hasClass('next')){
                    
                    _this.current++;
                    
                    return _this.pageto(_this.current);
                }
                if($parent.hasClass('last')){
                    
                    _this.current=_this.totals;
                    
                    return _this.pageto(_this.current);
                }
            });
        };
        Pagination.prototype={
            pageto:function(index){
                //remove disabled
                this.$el.find('>li').removeClass('disabled');
                
                this.created && this.callback && this.callback(this.current);
                
                if(this.current <= 1){//first
                    this.current=1;
                    this.$el.find('>li.first,>li.prev').addClass('disabled');
                }
                
                if(this.current >= this.totals){//last
                    this.current=this.totals;
                    this.$el.find('>li.last,>li.next').addClass('disabled');
                }
                //pagination object
                var $pagination=this.$el.find('>li:not(.first,.prev,.next,.last)');
                
                $pagination.removeClass('active');
                
                if(this.pages === 0){
                    
                    return $pagination.remove();
                }
                
                //totals <= pages
                if(this.totals <= this.pages){
                    if(this.created){
                        
                        return $pagination.eq(this.current-1).addClass('active');
                    }
                    //
                    return this.create(this.totals);
                }
                
                //totals > pages
                this.create(this.pages,$pagination);
            },
            normal:function(len,$pagination){
                var i=0,
                    activeIndex=this.current,
                    index=1,
                    $ul=$('<ul/>'),
                    _mIndex=Math.ceil(this.pages/2);
                if(this.totals > this.pages){
                    if(this.totals-this.current < _mIndex){
						index=this.totals-this.pages+1;
                        activeIndex=this.pages-(this.totals-this.current);
                    }else if(this.current > _mIndex){
						index=this.current-_mIndex+1;
                        activeIndex=_mIndex;
                    }
                }                
                $pagination=$pagination||this.$el.find('>li:not(.first,.prev,.next,.last)');
                
                index=index <=0 ? 1 : index;
                //console.log('current:'+this.current,'index:'+index,'activeIndex:'+activeIndex);
				
				if(this.previous !== index){
                    this.created=false;
                }
				
				if(this.created){
                    
                    return $pagination.eq(activeIndex-1).addClass('active');
                }
                
                $pagination.remove();
				//previous
				this.previous=index;
                for(;i<len;i++){
                    var $li=$(this.pagination.replace(/{pagination}/g,index++)).attr('data-role','pagination');
                    $ul.append($li);
                }
                var $children=$ul.children();
                //atter to
                this.$prev.after($children);
                //active
                $children.eq(activeIndex-1).addClass('active');
                
                this.created=true;
            },
			ellipsis:function(len,$pagination){
                if(this.totals > this.pages){
                    len=len-4;
                }else{
					
					return this.normal(this.totals);
				}
			    len=len<3 ? 3 : len;//
				len=len % 2 === 0 ? len+1 : len;//only odd
                var i=0,
                    activeIndex=this.current,
					_mIndex=Math.floor(len/2)
                    index=1,
                    $ul=$('<ul/>');
				$pagination=$pagination||this.$el.find('>li:not(.first,.prev,.next,.last)');
                var $ellipsis=$(this.pagination.replace(/{pagination}/g,'...')).attr('data-role','pagination').addClass('ellipsis');
				
				if(this.current-_mIndex > 2){
					index=this.current-_mIndex;
					activeIndex=_mIndex+3;
				}
				if(this.current-_mIndex >= this.totals-len+1){
					index=this.totals-len+1;
				}
				if(this.current+_mIndex > this.totals-2){
					activeIndex=3+this.current-index;//2+this.current-index+1
				}
				if(this.previous !== index){
                    this.created=false;
                }
				if(this.created){
                    
                    return $pagination.eq(activeIndex-1).addClass('active');
                }
				
				$pagination.remove();
				
				if(this.current-_mIndex > 2){
					//first
					$ul.append($(this.pagination.replace(/{pagination}/g,1)).attr('data-role','pagination'));
					//ellipsis
					$ul.append($ellipsis);
				}
				index=index <=0 ? 1 : index;
				//previous
				this.previous=index;
				//console.log('current:'+this.current,'index:'+index,'activeIndex:'+activeIndex);
                for(;i<len;i++){
                    var $li=$(this.pagination.replace(/{pagination}/g,index++)).attr('data-role','pagination');
                    $ul.append($li);
                }
				if(this.current+_mIndex <= this.totals-2){
					//ellipsis
					$ul.append($ellipsis.clone());
				}
				if(this.current+_mIndex <= this.totals-1){
					//last
					$ul.append($(this.pagination.replace(/{pagination}/g,this.totals)).attr('data-role','pagination'));
				}
				
                var $children=$ul.children();
                //atter to
                this.$prev.after($children);
                //active
                $children.eq(activeIndex-1).addClass('active');
                
                this.created=true;
			}
        };
        
        return {
            load:function(options){
                
                return new Pagination(options);
            }
        };
    });
})();