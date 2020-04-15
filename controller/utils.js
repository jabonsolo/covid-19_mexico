const express = require('express');
const fetch = require('node-fetch');
const http = require('http');

let data = {}

async function onRequest(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.write('Hello World');
    const res = await fetch('https://pomber.github.io/covid19/timeseries.json')
    const data = await res.json()
    response.write(data.toString())
    response.end();
}

async function getData() {
    const res = await fetch('https://pomber.github.io/covid19/timeseries.json');
    const data = await res.json();
    return data
}

async function getChart(country) {
    let data = await getData();
    if (data[country]) {
        return data[country];
    }

    return [];
}

async function aggregate() {
    const aggregated = {};
    let data = await getData();

    Object.keys(data).forEach(country => {
        Object.keys(data[country]).forEach(date => {
            if (!aggregated[date]) {
                aggregated[date] = { ...data[country][date] }
            } else {
                aggregated[date].confirmed += data[country][date].confirmed
                aggregated[date].deaths += data[country][date].deaths
                aggregated[date].recovered += data[country][date].recovered
              }
        });
    });

    return Object.keys(aggregated).map(key => {
        return aggregated[key];
    });
}

async function main() {
    //const data1 = await getData();
    //const data2 = await aggregate()
    //console.log(data1);
    //console.log(data2)
    //const data3 = data1['Mexico']
    //console.log(data3)

}

// main()

module.exports = {
    getData,
    getChart,
    aggregate,
    data
}