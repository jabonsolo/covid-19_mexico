const fetch = require('node-fetch');
const express = require('express');
const path = require('path')
const http = require('http');

var routes = require('./routes')

var app = express();


app.set('port', process.env.PORT || 8080);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(routes);

app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});

// async function onRequest(request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'})
//     response.write('Hello World');
//     const res = await fetch('https://pomber.github.io/covid19/timeseries.json')
//     const data = await res.json()
//     response.write(data.toString())
//     response.end();
// }

// http.createServer(onRequest).listen(8000);