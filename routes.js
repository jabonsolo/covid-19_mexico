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

router.get('/about', async function(req,res){
    res.render('about',{
    });
});

router.get('/more', async function(req,res){
    const links_es = await utils.getLinks_es();
    const links_en = await utils.getLinks_en();

    res.render('more',{
        links_es,
        links_en
    });
});

module.exports = router;