if(!window.log){
	window.log = function (message) {
		try {
			console.log(message);
		} catch (exception) {
			return;
		}
	}
};