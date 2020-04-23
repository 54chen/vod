var Util = {
	trim:function(str) {
		if (typeof str !== "string") {
			return str;
		}
		if (typeof str.trim === "function") {
			return str.trim();
		} else {
			return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "");
		}
	},
	isEmpty:function(obj){
		if(obj === undefined){
			return true;
		}else if(obj==null){
			return true;
		}else if(typeof obj === "string"){
			if(this.trim(obj) == ""){
				return true;
			}
		}
		return false;
	},
	isNotEmpty:function(obj){
		return !this.isEmpty(obj);
	},
	breachHTML:function(str){
		if(typeof str !== "string" || this.isEmpty(str))return str;
		return str.replace(/\</g,"&lt;");
	},
	escapeHTML:function(str){
		if(typeof str !== "string" || this.isEmpty(str))return str;
		return str.replace(/\&/g,"&amp;").replace(/\</g,"&lt;");
	},
	checkTime:function(num){
		var n = Number(num);
		if(n<10)n = "0"+n;
		return n;
	},
	timeDuration : function(second) {
		if (!second || isNaN(second))
			return;
		second = parseInt(second);
		var time = '';
		var hour = second / 3600 | 0;
		if (hour != 0) {
			time += this.checkTime(hour) + ':';
		}
		var min = (second % 3600) / 60 | 0;
		time += this.checkTime(min) + ':';
		var sec = (second - hour * 3600 - min * 60) | 0;
		time += this.checkTime(sec);
		return time;
	},
	calcPercent : function(value, total) {
		if (isNaN(value) || Number(value) == 0)
			return "0";
		if (isNaN(total) || Number(total) == 0)
			return "0";
		return Math.round(Number(value) * 100 / Number(total));
	},
	formatTime : function(time) {
		var date = new Date();
		date.setTime(time*1000);
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		return this.checkTime(h) + ":" + this.checkTime(m) + ":" + this.checkTime(s);
	},
	//占位符替换
	replaceholder:function(str, values){
		return str.replace(/\{(\d+)\}/g, function(m, i) {
			return values[i];
		});
	}
};
//截取标签名称
function changeUrl(match){
	var idx1 = match.indexOf("src=");
	var idx2 = match.indexOf("emotion");
	return match.substring(0, idx1+5)+match.substring(idx2);
}
//标签做ubb代码替换
function emotionNormalize(richText, isText, local){
	richText = richText.replace(/<img.*?emotion\/(.+?).(gif|png)\".*?>/gi, function (match, capture) {
		var note = "";
		if(!isText && (typeof local == "undefined" || !local))match = changeUrl(match);
		var code = "";
		switch(capture){
			case "feedback.quickly":
				code = "$^tk^";
				if(isText)note = "【太快了】";
				break;
			case "feedback.slowly":
				code = "$^tm^";
				if(isText)note = "【太慢了】";
				break;
			case "feedback.agreed":
				code = "$^zt^";
				if(isText)note = "【赞同】";
				break;
			case "feedback.against":
				code = "$^fd^";
				if(isText)note = "【反对】";
				break;
			case "feedback.applaud":
				code = "$^gz^";
				if(isText)note = "【鼓掌】";
				break;
			case "feedback.think":
				code = "$^sk^";
				if(isText)note = "【值得思考】";
				break;
			case "chat.gift":
				code = "$^lw^";
				if(isText)note = "【礼物】";
				break;
			case "emotion.angerly":
				code = "$^fn^";
				if(isText)note = "【愤怒】";
				break;
			case "emotion.bs":
				code = "$^qm^";
				if(isText)note = "【鄙视】";
				break;
			case "emotion.cry":
				code = "$^sx^";
				if(isText)note = "【伤心】";
				break;
			case "emotion.goodbye":
				code = "$^zj^";
				if(isText)note = "【再见】";
				break;
			case "emotion.laugh":
				code = "$^gx^";
				if(isText)note = "【高兴】";
				break;
			case "emotion.lh":
				code = "$^lh^";
				if(isText)note = "【流汗】";
				break;
			case "emotion.nod":
				code = "$^wl^";
				if(isText)note = "【无聊】";
				break;
			case "emotion.question":
				code = "$^yw^";
				if(isText)note = "【疑问】";
				break;
			case "emotion.smile":
				code = "$^nh^";
				if(isText)note = "【你好】";
				break;
			case "rose.down":
				code = "$^dx^";
				if(isText)note = "【凋谢】";
				break;
			case "rose.up":
				code = "$^xh^";
				if(isText)note = "【鲜花】";
				break;
			
			default:
		}
		if((typeof local == "undefined" || !local))match = code;
		if(isText){
			return note;
		}else{
			return match + note;
		}
	}); 
	return richText;
}
//表情替换成本地资源
function emotion2Local(richText){
	richText = richText.replace(/<img.*?emotion(\\|\/)(.+?).(gif|png)\".*?>/gi, function (match, capture) {
			return changeUrl2Local(match);
		}); 
	return richText.replace(/color: rgb(0, 0, 0);/gi,'').replace(/COLOR: #000000;/gi,'').replace(/color: rgb(92, 92, 92);/gi,'').replace(/COLOR: #5c5c5c;/gi,'').replace(/<font color=#[^>]+>/ig, "").replace(/<\/font>/ig, "");
}
//替换链接
function changeUrl2Local(match){
	var idx1 = match.indexOf("src=");
	var idx2 = match.indexOf("emotion");
	console.log(match);
	return match.substring(0, idx1+5)+"images/"+match.substring(idx2).replace('.gif"','.png"');
}
/*自动滚动到底部*/
;(function($){
$.fn.scrollTo = function(options){
	var defaults = {
		to : "bottom",   //"top":滚至顶部,"bottom":滚至底部
		fn : function(){}
	};
	var opts = $.extend({},defaults,options);
	return this.each(function(){
		
		var self = $(this);
		//console.log(self);
		var parent = self.parent();
		//console.log(parent);
		var height = self.outerHeight();
		
		var scrollTop = parent.scrollTop();
		var parentHeight = parent.height();
		var scrollHeight = self.outerHeight();
		//console.log(height+" "+scrollTop+" "+parentHeight+" "+scrollHeight+" "+self.find('li').last().outerHeight());
		//console.log(self.attr('id'));
		//console.log(scrollTop+parentHeight,scrollHeight-self.find('li').last().outerHeight()-self.find('li').eq(self.find('li').size()-2).outerHeight());
		
		if(scrollTop+parentHeight<=scrollHeight){
			opts.fn();
			switch (opts.to){
				case "bottom":
				case "tobottom":
				//console.log('ddd');
					parent.scrollTop(height);
					break;
				case "top":
					parent.scrollTop(0);
					break;
				default :
					console.log(opts.to);
			}
		}else{
			opts.fn();
		}
		
	});
};
})(jQuery);

