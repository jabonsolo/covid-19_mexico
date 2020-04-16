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

async function getLinks_es() {
    const res = await fetch('https://raw.githubusercontent.com/jabonsolo/miscellaneous/master/files/covid-19_links_es.json');
    const links = await res.json();
    return links
}

async function getLinks_en() {
    const res = await fetch('https://raw.githubusercontent.com/jabonsolo/miscellaneous/master/files/covid-19_links_en.json');
    const links = await res.json();
    return links
}

async function getTop10(dataSet) {
    let topCountries = []
    let i = 0;

    for (let key in dataSet)
    {
        let confirmed = Math.max.apply(Math, 
            dataSet[key].map( (o) => 
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

    let confirmed =  Math.max.apply(Math, 
        dataSet['Mexico'].map( (o) => 
        { 
            return o.confirmed;
        }))    

    topCountries = topCountries.slice(0,10)
    
    topCountries[10] = {
        country: 'Mexico',
        confirmed
    }

    return topCountries
}

async function getDataTop10(dataSet) {
    let top10List = await getTop10(dataSet)
    let top10DataConfirmed = []
    let top10DataDeaths = []
    let arrayLengthConfirmed = []
    let arrayLengthDeaths = []

    for(key in top10List)
    {
        top10DataConfirmed[key] = await generateData(dataSet, top10List[key].country, 100, "confirmed");
        top10DataDeaths[key] = await generateData(dataSet, top10List[key].country, 10, "deaths");
        arrayLengthConfirmed[key] = top10DataConfirmed[key].confirmed.length;
        arrayLengthDeaths[key] = top10DataDeaths[key].deaths.length;
    }
    let enumArrayConfirmed = Array.from(Array(Math.max(...arrayLengthConfirmed)).keys()) 
    let enumArrayDeaths = Array.from(Array(Math.max(...arrayLengthDeaths)).keys()) 

    return {
        top10List,
        top10DataConfirmed,
        top10DataDeaths,
        enumArrayConfirmed,
        enumArrayDeaths
    };
}

async function getChart(dataSet, country)
{
    let chart = {}

    if(dataSet[country])
    {
        return dataSet[country]
    } 

    return chart;
}

function getIndex(array, value)
{
    return array.findIndex(element => element > value);
}

async function generateData(dataSet, country, value, by) {
    let chart = {}
    let data = await getChart(dataSet, country)

    chart.date = data.map(({ date }) => date)
    chart.confirmed = data.map(({ confirmed }) => confirmed)
    chart.deaths = data.map(({ deaths }) => deaths)
    chart.recovered = data.map(({ recovered }) => recovered)

    let index = 0
    if(by == "deaths")
        index = getIndex(chart.deaths, value) ;
    else
        index = getIndex(chart.confirmed, value) ;

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

async function aggregate(dataSet) {
    const aggregated = {};

    Object.keys(dataSet).forEach(country => {
        Object.keys(dataSet[country]).forEach(date => {
            if (!aggregated[date]) {
                aggregated[date] = { ...dataSet[country][date] }
            } else {
                aggregated[date].confirmed += dataSet[country][date].confirmed
                aggregated[date].deaths += dataSet[country][date].deaths
                aggregated[date].recovered += dataSet[country][date].recovered
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
    getLinks_es,
    getLinks_en,
    getDataTop10,
    data
}