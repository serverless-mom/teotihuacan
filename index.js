crawler = require('simplecrawler')
fs = require('node-fs')
url = require('url')
wrench = require('wrench')
extractor = require('unfluff')



var downloadSite = function (domain, callback){
  var outputDirectory = process.cwd() + '/' + domain
  var teotihuacan = new crawler(domain)

  //config block for the crawler
  teotihuacan.downloadUnsupported = true
  teotihuacan.interval = 250


  teotihuacan.on("fetchcomplete", function(queueItem, responseBuffer, response){
        console.log("Completed fetching resource:", queueItem.url)
        var blobText = ""
        parsedURL = url.parse(queueItem.url)
        pathname = (parsedURL.pathname)
        if (pathname === '/')
          pathname = '/index.html'
        item = extractor(responseBuffer)
        blobText = "Pathname:"+pathname + "\n" + item.text
        console.log (blobText)
  })

  teotihuacan.on('complete', function () {
    callback()
  })
  // Start Crawl
  teotihuacan.start()
}

if (process.argv.length < 3) {
  console.log('Usage: node index.js mysite.com')
  process.exit(1)
}
downloadSite (process.argv[2], function () {
  console.log ("done!")
})
