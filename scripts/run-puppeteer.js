const { readFileSync } = require('fs')
const puppeteer = require('puppeteer')

const file = readFileSync(process.argv[2], 'utf-8')

const html = `
<html>
  <script>
  window.onload = function() {
    ${file}
  }
  </script>
</html>
`
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setContent(html)
  page.on('console', msg => console.log(msg.text()))

  // TODO: Should improve to wait for the test really ends
  await page.waitFor(2000)
  await browser.close()
})()
