var crawler = require('simplecrawler'),
  fs = require('node-fs'),
  url = require('url'),
  wrench = require('wrench'),
  extractor = require('unfluff')



var downloadSite = function (domain, callback){
  outputFile = domain + ".txt"
  fs.exists(outputFile, function(exists){
    if (exists){
      console.log ("file "+outputFile+" already exists! adding a timecode")
      var now = new Date()
      outputFile = outputFile + now.toString()
    }
  })

  var teotihuacan = new crawler(domain)
  //config block for the crawler
  teotihuacan.downloadUnsupported = true
  teotihuacan.interval = 250


  teotihuacan.on("fetchcomplete", function(queueItem, responseBuffer){
        console.log("Completed fetching resource:", queueItem.url)
        var blobText = ""         //holds the page text and pathname
        parsedURL = url.parse(queueItem.url)
        pathname = (parsedURL.pathname)
        if (pathname === '/')
          pathname = '/index.html'
        item = extractor(responseBuffer)
        blobText = "#Pathname:"+pathname + "\n" + item.text +"\n"
        console.log (blobText)
        fs.appendFile(outputFile, blobText, function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
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
  //console.log ("done!")
})
