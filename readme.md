
# Teotihuacan - get all the text on the site


## Installing
1. install [npm](https://nodejs.org/download/)
2. clone Teotihuacan to a new directory
3. run `npm install` in that directory

To use to search to see if there's any non-matching text (e.g. to make sure that
  only the word 'banana' appears on the site):

`node crawler.js example.com`

(might take some time)

After this has run with your target domain, you should have an 'example.com.txt'
file. Run `sed -ie "s/banana//g" example.com.txt` to remove every time 'banana'
appears. This text file should show you where to check!
