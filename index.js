var postcss = require("postcss");
var CONTAINS_CALC=/calc\.(.*)\((.*)\)/;
module.exports = postcss.plugin('postcss-math', function(options) {
	options = options || {}
  	options.precision = options.precision || 5;
	return function(css, result) {
		var decimalPrecision=Math.pow(10,options.precision);
		function transformValue(node, property) {
			var value = node[property];
			if (!value || !CONTAINS_CALC.test(value)) {
				return;
			}
			return getExpression(value,node,property);
			
		}
		function getExpression(value,node,property){
			var matches=CONTAINS_CALC.exec(value);
		    if (!matches || !matches[1]) {
		    	result.warn("Could not reduce expression: " + value)
		      	return;
		    }
		    var func=matches[1];
		    var params=matches[2].split(',');
		    var unit="";
		    for(var i=0;i<params.length;i++){
		    	var units=getUnitsInExpression(params[i]);		    	
		    	if(units.length>1){
		    		result.warn('multiple units can not handle.');
		    		return;
		    	}
		    	if(units.length==0 || unit=="" || unit==units[0]){
		    		if(units.length>0){
		    			unit=units[0];
		    		}   		
		    		params[i]=params[i].replace(unit,"");
		    	}else{
		    		result.warn('multiple units can not handle.');
		    		return;
		    	}	
		    }
			try{
				if(typeof Math[func]==='function'){
					if(func=="random"){
						var result=Math[func].apply(null,[])*params[0];
					}else{
						var result=Math[func].apply(null,params);
					}
										
					result = Math.round(result * decimalPrecision) / decimalPrecision;
					node[property]=result+unit;
					return;
				}else{
					result.warn('Math function is unavailable.');
					return;			
				}
			}catch(err){
				result.warn('Math Error:'+JSON.stringify(err));
				return;
			}    
		}
		function getUnitsInExpression(expression) {
		  var uniqueUnits = []
		  var unitRegEx = /[\.0-9]([%a-z]+)/g
		  var matches = unitRegEx.exec(expression)
		
		  while (matches) {
		    if (!matches || !matches[1]) {
		      continue
		    }
		
		    if (uniqueUnits.indexOf(matches[1]) === -1) {
		      uniqueUnits.push(matches[1])
		    }
		
		    matches = unitRegEx.exec(expression)
		  }
		
		  return uniqueUnits
		}
		css.walk(function(rule) {
			if (rule.type === "atrule") {
				return transformValue(rule, "params")
			} else if (rule.type === "decl") {
				return transformValue(rule, "value")
			}
		})
		return result;
	};
});
