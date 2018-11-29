const path = require('path');
let config = require('../configuration/config');
let fs = require('fs');
let adapter = {
    https: https = require('https'),
    http: http = require('http')
};
const logger = require('../lib/logger');
const querystring = require('querystring');

let option_adapter = {
    external: {
        host: config.External_API.host,
        port: config.External_API.port,
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "user-agent": "node.js"
        }
    }
};

if (config.Require_Client_Cert) {
    option_adapter.external.pfx = fs.readFileSync(path.resolve(__dirname, '../certs/' + config.External_API.cert_name + '.pfx'));
    option_adapter.external.passphrase = config.External_API.passphrase;
}

const init = function (type) {
    if (type === 'external' || type === 'azure') {
        let config_section = type === 'azure' ? 'Azure_API' : 'External_API';
        const protocol = config[config_section].protocol;
        return {
            get: function (request_options) {
                return new Promise((resolve, reject) => {
                    let option = Object.assign({}, option_adapter[type]);
                    option.path = request_options.RelativePath;
                    if (request_options.Query) {
                        option.path += '?' + querystring.stringify(request_options.Query);
                    }
                    let start_time = new Date();
                    adapter[protocol]
                        .get(option, (response) => {
                            const body = [];
                            response.on('data', (chunk) => {
                                body.push(chunk);
                            });
                            response.on('end', () => {
                                var response_body = body.join('');
                                const response_time = new Date() - start_time;
                                logger.log({
                                    level: 'info',
                                    message: 'ext: GET ' + option.host + ':' + option.port + ' ' + option.path + ' ' + response.statusCode + ' ' + response_body.length + ' ' + response_time,
                                    type: 'external_request',
                                    path: option.path,
                                    host: option.host,
                                    port: option.port,
                                    status_code: response.statusCode,
                                    content_length: response_body.length,
                                    response_time: response_time
                                });
                                if (response.statusCode < 200 || response.statusCode > 299) {
                                    try {
                                        var json_response = JSON.parse(response_body);
                                        reject({
                                            message: 'Status Code: ' + response.statusCode,
                                            stack: json_response.Message
                                        });
                                    }
                                    catch (err) {
                                        reject({message: 'Status Code: ' + response.statusCode, stack: response_body});
                                    }
                                    return;
                                }
                                try {
                                    let data = JSON.parse(response_body);
                                    resolve(data);
                                }
                                catch (err) {
                                    reject(err);
                                }
                            });
                        })
                        .on("error", (error) => {
                            const response_time = new Date() - start_time;
                            logger.log({
                                level: 'error',
                                message: 'ext: GET ' + option.host + ':' + option.port + ' ' + option.path + ' ' + response_time,
                                type: 'external_request',
                                path: option.path,
                                host: option.host,
                                port: option.port,
                                response_time: response_time
                            });
                            reject(error);
                        });


                });
            },
            post: function (request_options) {
                return new Promise((resolve, reject) => {

                    var post_data = JSON.stringify(request_options.Body);

                    var post_options = Object.assign({}, option_adapter[type]);
                    post_options.path = request_options.RelativePath;
                    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);
                    post_options.method = 'POST';

                    let start_time = new Date();
                    var request = adapter[protocol]
                        .request(post_options, (response) => {
                            const body = [];
                            response.setEncoding('utf8');
                            response.on('data', (chunk) => {
                                body.push(chunk);
                            });
                            response.on('end', () => {

                                var response_body = body.join('');
                                const response_time = new Date() - start_time;
                                logger.log({
                                    level: 'info',
                                    message: 'ext: GET ' + post_options.host + ':' + post_options.port + ' ' + post_options.path + ' ' + response.statusCode + ' ' + response_body.length + ' ' + response_time,
                                    type: 'external_request',
                                    path: post_options.path,
                                    host: post_options.host,
                                    port: post_options.port,
                                    status_code: response.statusCode,
                                    content_length: response_body.length,
                                    response_time: response_time
                                });
                                if (response.statusCode < 200 || response.statusCode > 299) {
                                    try {
                                        var json_response = JSON.parse(response_body);
                                        reject({
                                            message: 'Status Code: ' + response.statusCode,
                                            statusCode: response.statusCode,
                                            stack: json_response.Message
                                        });
                                    }
                                    catch (err) {
                                        reject({message: 'Status Code: ' + response.statusCode, stack: response_body});
                                    }
                                    return;
                                }
                                try {
                                    let data = JSON.parse(response_body);
                                    resolve(data);
                                }
                                catch (err) {
                                    reject(err);
                                }
                            });
                        })
                        .on("error", (error) => {
                            const response_time = new Date() - start_time;
                            logger.log({
                                level: 'error',
                                message: 'ext: GET ' + post_options.host + ':' + post_options.port + ' ' + post_options.path + ' ' + response_time,
                                type: 'external_request',
                                path: post_options.path,
                                host: post_options.host,
                                port: post_options.port,
                                response_time: response_time
                            });
                            reject(error);
                        });

                    request.write(post_data);
                    request.end();
                });
            },
            put: function (request_options) {
                return new Promise((resolve, reject) => {

                    var put_data = JSON.stringify(request_options.Body);

                    var put_options = Object.assign({}, option_adapter[type])
                    put_options.path = request_options.RelativePath;
                    put_options.headers['Content-Length'] = Buffer.byteLength(put_data);
                    put_options.method = 'PUT';

                    var request = adapter[protocol]
                        .request(put_options, (response) => {
                            const body = [];
                            res.setEncoding('utf8');
                            response.on('data', (chunk) => {
                                body.push(chunk);
                            });
                            response.on('end', () => {

                                var response_body = body.join('');
                                if (response.statusCode < 200 || response.statusCode > 299) {
                                    try {
                                        var json_response = JSON.parse(response_body);
                                        reject({
                                            message: 'Status Code: ' + response.statusCode,
                                            stack: json_response.Message
                                        });
                                    }
                                    catch (err) {
                                        reject({message: 'Status Code: ' + response.statusCode, stack: response_body});
                                    }
                                    return;
                                }

                                try {
                                    let data = JSON.parse(response_body);
                                    resolve(data);
                                }
                                catch (err) {
                                    reject(err);
                                }
                            });
                        })
                        .on("error", (error) => {
                            reject(error);
                        });

                    request.write(put_data);
                    request.end();
                });
            }
        }
    }
};

module.exports = {
    external_http_client: init('external')
};