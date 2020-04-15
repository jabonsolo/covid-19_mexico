const express = require('express');
const utils = require('./controller/utils');
//const Chart = require('./node_modules/chart.js')

var router = express.Router();

router.get('/', async function(req,res){
    const data = await utils.getChart('Mexico')

    let date = data.map(({ date }) => date)
    let confirmed = data.map(({ confirmed }) => confirmed)
    let deaths = data.map(({ deaths }) => deaths)
    let recovered = data.map(({ recovered }) => recovered)
    let active = []
    for (let key in data) {
        active[key] = data[key].confirmed - data[key].deaths - data[key].recovered
    }

    res.render('index',{
        data,
        date,
        confirmed,
        deaths,
        recovered,
        active
    });
});

module.exports = router;