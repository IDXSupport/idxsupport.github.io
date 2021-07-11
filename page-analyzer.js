const puppeteer = require('puppeteer');

/**
 * @param {*} url, the url we want to analyze to determine its wrapper capability
 * @returns A collection of data for wrapper analysis.
 */
async function analyzeUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Setup console out
    page.on('console', consoleMessage => console.log(consoleMessage.text()));

    let out = {};

    let classesMap = await page.evaluate(() => {
        let elements = document.querySelectorAll('*');


        let classes = new Map();

        console.log("it worked?");
        /**
         * A map of class => number of occurrences 
         */

        for (let i=0; i<elements.length; i++) {
            let element = elements[i];

            console.log(element.classList.length);

            // Count each class we have
            // TBH, could just add classes we find a > 1 of to an "elimination" list... 
            element.classList.forEach(name => {
                classes.has(name) ? classes.set(name, classes.get(name) + 1) : classes.set(name, 1);
            })

        }

        /*
        console.log(`Map size: ${classes.size}`);        
        console.log(elements.length);
        console.log(JSON.stringify(Array.from(classes.entries())));
        */

        return JSON.stringify(Array.from(classes.entries()));
    });

    console.log(classesMap);
    out.classes = new Map(JSON.parse(classesMap));

    await browser.close();
    return out;
}

let url = 'https://duckduckgo.com/';

(async () => {
    let analysis = await analyzeUrl(url);

    console.log(`Classes that have occurred exactly once on ${url}`);

    let out = '';
    
    analysis.classes.forEach((value, key) => {
        if (value == 1) {
            out += `${key}, `;
        }
    });
})();

