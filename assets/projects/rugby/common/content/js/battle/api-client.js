 (function() {
    /**
     * Classe "APIClient" permettant d'executer des requêtes sur le Web Service
     */
    function APIClient(config) {
        this.config = config;
        return this;
    }

    APIClient.prototype.getRanking = function() {
        return xhr(this.config.api + '/scores/', 'get', null, this.config.token, parseAPIResponse);
    };

    APIClient.prototype.getUserRanking = function(identifier) {
        return xhr(this.config.api + '/scores/' + identifier, 'get', null, this.config.token, parseAPIResponse);
    };

    APIClient.prototype.getSiteRanking = function(site) {
        return xhr(this.config.api + '/scores/site/' + site, 'get', null, this.config.token, parseAPIResponse);
    };

    APIClient.prototype.getSiteUserRanking = function(site, identifier) {
        return xhr(this.config.api + '/scores/site/' + site + '/' + identifier, 'get', null, this.config.token, parseAPIResponse);
    };
    
    APIClient.prototype.getSitesRanking = function() {
        return xhr(this.config.api + '/scores/site/all', 'get', null, this.config.token, parseAPIResponse);
    };
    APIClient.prototype.getTime = function() {
        return xhr(this.config.api + '/time', 'get', null, this.config.token);
    };

    window.APIClient = APIClient;

    /**
     * @function xhr
     * @description Helper to maker XMLHttpRequest/ActiveXObject requests
     * @param {string} url The URL
     * @param {string} method GET, POST, PUT, DELETE...
     *  @default get
     * @param {object|null} data Data to send with PUT/POST request
     * @param {string} token JWT access token
     * @param {function} middleware Middleware function to apply to the response
     * @returns {promise} Resolved with data or rejected with xhr status code
     */
    function xhr(url, method, data, token, middleware) {
        return new Promise(function(resolve, reject) {
            var xhr = window.XMLHttpRequest ?
                new XMLHttpRequest() :
                new ActiveXObject('Microsoft.XMLHTTP');
            var completed = false;

            if (xhr) {
                xhr.open(method || 'get', url);
                xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8'); // important to be read by body-parser JSON server-side
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                xhr.onreadystatechange = function onreadystatechange() {
                    if (completed) {
                        return;
                    }

                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            completed = true;
                            var data = {};
                            try {
                                data = JSON.parse(xhr.responseText);
                            } catch (error) {
                                //
                            }
                            var result = (middleware || function(d) { return d; })(data);
                            resolve(result);
                        } else {
                            reject(xhr.status);
                        }
                    }
                };
                xhr.send(/put|post/ig.test(method) && data ? JSON.stringify(data) : null);
            }
        });
    }

    function has(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property) &&
            object[property];
    }

    function parseAPIResponse(response) {
        if (response) {
            if (has(response, 'result') || has(response, 'error')) {
                return response;
            }
        }
        return { error: 'Invalid response' };
    }
}());