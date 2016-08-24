'use strict';

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const sass = require('express-compile-sass');

const DEFAULT_HTTP_PORT = 8181;
const app = express();

app.use(sass({
    'root': __dirname,
    'sourceMap': false,
    'sourceComments': false
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(
    '/build',
    express.static(path.join(__dirname, '../build'))
);

app.use(
    '/assets',
    express.static(path.join(__dirname, 'assets'))
);

app.use(
    '/vendors',
    express.static(path.join(__dirname, '../vendors'))
);

app.get('/*', (request, response, next) => {
    let path = request.path.slice(1);
    if (path.endsWith('.js') || path.endsWith('.jpg') || path.endsWith('.css')) {
        next();
        return;
    }
    if (path === '') {
        response.render('index.hbs');
        return;
    }
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    path += '.hbs';
    response.render(path);
});

app.listen(DEFAULT_HTTP_PORT, () => {
    console.log('web server started!');
});
