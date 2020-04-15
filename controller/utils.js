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

async function getTop10() {
    let data = await getData();
    let chart = {}

    let topCountries = []
    let i = 0;
    for (let key in data)
    {
        let confirmed = Math.max.apply(Math, 
            data[key].map( (o) => 
            { 
                return o.confirmed;
            }));

        topCountries[i] = {
            country: key,
            confirmed
        };
        i+=1;
    }
    
    topCountries= topCountries.sort(function(a, b) {
        return b.confirmed - a.confirmed;
    })

    
      //topCountries = topCountries.slice(10)
    console.log(topCountries.slice(0,10))
}

async function getChart(country) {
    let data = await getData();
    let chart = {}

    if(data[country])
    {
        return data[country]
    } 

    return chart;
}

async function generateData() {
    const data = await getChart('Mexico')
    let chart = {}


    chart.date = data.map(({ date }) => date)
    chart.confirmed = data.map(({ confirmed }) => confirmed)
    chart.deaths = data.map(({ deaths }) => deaths)
    chart.recovered = data.map(({ recovered }) => recovered)

    const index = chart.confirmed.findIndex(element => element == 1) -1;

    chart.date = chart.date.slice(index);
    chart.confirmed = chart.confirmed.slice(index);
    chart.deaths = chart.deaths.slice(index);
    chart.recovered = chart.recovered.slice(index);

    chart.active = []
    chart.confirmedDiff = []
    chart.recoveredDiff = []
    chart.deathsDiff = []


    for (let key in chart.confirmed) {
            chart.active[key] = chart.confirmed[key] - chart.deaths[key] - chart.recovered[key]
            if(key == 0)
            {
                chart.confirmedDiff[key] = 0
                chart.recoveredDiff[key] = 0
                chart.deathsDiff[key] = 0
            }
            else{
                if(chart.confirmed[key] - chart.confirmed[key-1] < 0)
                    chart.confirmedDiff[key] = 0;
                else
                    chart.confirmedDiff[key] = chart.confirmed[key] - chart.confirmed[key-1];
                
                if(chart.recovered[key] - chart.recovered[key-1] < 0)
                    chart.recoveredDiff[key] = 0;
                else
                    chart.recoveredDiff[key] = chart.recovered[key] - chart.recovered[key-1];

                if(chart.deaths[key] - chart.deaths[key-1] < 0)
                    chart.deathsDiff[key] = 0;
                else
                    chart.deathsDiff[key] = chart.deaths[key] - chart.deaths[key-1];
            }
    }

    return chart;
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
    generateData,
    getTop10,
    data
}