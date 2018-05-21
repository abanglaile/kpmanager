
var fun = function test(a, b){
	return function(c){
		console.log(a + b + c);
	}
}

var f = fun(1, 2);
f(3);
