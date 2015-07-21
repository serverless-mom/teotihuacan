crawler = require('simplecrawler')
fs = require('node-fs')
url = require('url')
wrench = require('wrench')
extractor = require('unfluff')

crawler.crawl("http://tobyfee.com/")
    .on("fetchcomplete", function(queueItem, responseBuffer, response){
        console.log("Completed fetching resource:", queueItem.url)
        text = extractor(responseBuffer)
        console.log(text.text)
    })
