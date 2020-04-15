const express = require('express');
const utils = require('./controller/utils');
//const Chart = require('./node_modules/chart.js')

var router = express.Router();

router.get('/', async function(req,res){
    const chart = await utils.generateData();
   
    await utils.getTop10()

    res.render('index',{
        data: chart
    });
});

module.exports = router;