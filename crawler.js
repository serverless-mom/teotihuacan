var crawler = require('simplecrawler'),
  fs = require('node-fs'),
  url = require('url'),
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
  teotihuacan.downloadUnsupported = false //trying to prevent binary data getting grabbed
  teotihuacan.stripQuerystring = true
  //Image files are tough on the spider goddess's digestion. Ignoring them.
  var conditionID = teotihuacan.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(pdf|gif|jpe?g|png|tiff|mp3)$/i);
  })


  teotihuacan.on("fetchstart", function(queueItem){
    console.log ('trying to grab ', queueItem.url);
  })


  teotihuacan.on("fetchcomplete", function(queueItem, responseBuffer){
        console.log("Completed fetching resource:", queueItem.url)
        var blobText = ""         //holds the page text and pathname
        parsedURL = url.parse(queueItem.url)
        pathname = (parsedURL.pathname)
        type = (queueItem.stateData.contentType)
        if (pathname === '/')
          pathname = '/index.html'
        item = extractor(responseBuffer)

        //checking for very short text blocks or inappropriately large. may be unecessary
        if (item.text.length >5 && item.text.length < 18000 && type == "text/html"){
          blobText = "#Pathname:"+pathname + "\n" + item.text +"\n"
          fs.appendFile(outputFile, blobText, function (err) {
            if (err) throw err;
            //console.log('Appending '+pathname+' data to file.')
            //console.log ('Data is this long: '+(blobText.length))
          });
        } else {
          //console.log ('not adding ', queueItem.url, ' to the file!'
        }


  })

  teotihuacan.on('complete', function () {
    callback()
  })
  // Start Crawl
  teotihuacan.start()
}

if (process.argv.length < 3) {
  console.log('Usage: node crawler.js mysite.com')
  process.exit(1)
}
downloadSite (process.argv[2], function () {
  console.log ("done!")
})
