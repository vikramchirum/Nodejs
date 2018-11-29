const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./lib/logger');

logger.log({
    message: 'Server Started',
    level: 'info'
});

let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./specs/swagger.json'),
    prospecting_swagger = require('./specs/prospecting_swagger.json');
    documents_swagger = require('./specs/documents_swagger');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan(logger.format, {stream: logger.loggerstream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    next();
});

app.use('/docs/swagger', function (req, res) {
    swaggerDocument.host = req.get('host');
    res.send(swaggerDocument)
});
app.use('/docs/prospecting', function (req, res) {
    prospecting_swagger.host = req.get('host');
    res.send(prospecting_swagger);
});

app.use('/docs/documentsapi', function (req, res) {
    documents_swagger.host = req.get('host');
    res.send(documents_swagger);
});

const api = require('./routes/api');
app.use('/api', api);

app.use('/documentsapi',
    swaggerUi.serve,
    function (req, res) {
        documents_swagger.host = req.get('host'); // Replace hardcoded host information in Swagger file
        //swaggerDocument.schemes = [req.protocol]; // Replace hardcoded protocol information in Swagger file  --Won't work for azure deployment
        swaggerUi.setup(documents_swagger)(req, res);
    },
    swaggerUi.setup(documents_swagger)
);

app.use('/',
    swaggerUi.serve,
    function (req, res) {
        swaggerDocument.host = req.get('host'); // Replace hardcoded host information in Swagger file
        //swaggerDocument.schemes = [req.protocol]; // Replace hardcoded protocol information in Swagger file  --Won't work for azure deployment
        swaggerUi.setup(swaggerDocument)(req, res);
    },
    swaggerUi.setup(swaggerDocument)
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development

    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send(err.message);
    }
    else if (err.status && err.message) {
        res.status(err.status).send(err.message);
    }
    else {
        logger.log({
            message: err.message,
            stack: err.stack,
            level: 'error',
            request_headers: req.headers,
            request_url: req.url,
            request_params: req.params,
            request_query: req.query
        });

        // render the error page
        res.status(err.status || 500);
        res.send({Message: 'Uh Oh... an error occured.<br>We are already working on it.'});
    }
});

module.exports = app;
