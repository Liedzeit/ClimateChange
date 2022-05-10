const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'nyp',
        address: 'https://www.nypost.com/tag/climate-change',
        base: ''
    },
    {
        name: 'faz',
        address: 'https://www.faz.net/aktuell/wissen/erde-klima/',
        base: ''
    }
]
const articles = []

console.log(newspapers[0].address)

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
        .then((response) =>{
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")',html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({ title: title, url: newspaper.base + url, source: newspaper.name })
            })
        }).catch(err => console.log('error: ' + err))
})

app.get('/', (req, res)=> {
    res.json('Welcome to my Climate Change API')
})

app.get('/news', (req, res)=> {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res)=> {
  const newspaperId = req.params.newspaperId
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []
        $('a:contains("climate")',html).each(function (){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({ title: title, url: newspaperBase + url, source: newspaperId })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
   
})


app.listen(PORT, () => console.log(`running on port ${PORT}`))

