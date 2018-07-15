function Tween(){
	this._duration = 0;
	this._delayTransition = 0;
	this._elementTag;
}

Tween.prototype = {
	to : function(elementTagID, duration, properties){
		this._elementTag = document.getElementById(elementTagID);
		this._duration = duration;
		this._delayTransition = 0;
		var transitionValue = "";
		var completeFunction = {};
		var easing = "";
		
		for (var prop in properties) {
			switch(prop){
				case "delay": this._delayTransition = properties[prop];break;
				case "onComplete": completeFunction = {finish:properties[prop]}; break;
				case "ease": easing = properties[prop]; break;
				default:
					this._elementTag.style[prop] = properties[prop];
					transitionValue += (prop + " "+this._duration+"s,");
			}
		}
		transitionValue = transitionValue.substring(0, transitionValue.length - 1);
		
		this._elementTag.style.transition = transitionValue;
		this._elementTag.style.WebkitTransition = transitionValue;
		this._elementTag.style.transitionDelay = this._delayTransition+"s";
		this._elementTag.style.WebkitTransitionDelay = this._delayTransition+"s";
		
		if(easing){
			this._elementTag.style.transitionTimingFunction = easing;
			this._elementTag.style.WebkitTransitionTimingFunction = easing;
		}
		
		if(completeFunction.finish){
			function tweenEnd(evt){
				var targetElement = evt.target;
				targetElement.removeEventListener("transitionend", tweenEnd, false);
				targetElement.removeEventListener("webkitTransitionEnd", tweenEnd, false);
				targetElement.removeEventListener("mozTransitionEnd", tweenEnd, false);
				targetElement.removeEventListener("msTransitionEnd", tweenEnd, false);
				targetElement.removeEventListener("oTransitionEnd", tweenEnd, false);
				completeFunction.finish();
			};			
			this._elementTag.addEventListener("transitionend", tweenEnd, false);
			this._elementTag.addEventListener("webkitTransitionEnd", tweenEnd, false);
			this._elementTag.addEventListener("mozTransitionEnd", tweenEnd, false);
			this._elementTag.addEventListener("msTransitionEnd", tweenEnd, false);
			this._elementTag.addEventListener("oTransitionEnd", tweenEnd, false);
		}
	}
}
var tween = new Tween();