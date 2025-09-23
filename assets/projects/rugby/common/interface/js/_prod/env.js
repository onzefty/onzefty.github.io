var env=(function(){
    var server = 'https://nodejs3.onlineformapro.com';
    var path = '/rugby23';
	return {
	    server: server,
	    path: path,
	    api: server + path.replace('rugby23', 'rugby23-api'),
	};
})();
