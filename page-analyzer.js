const puppeteer = require('puppeteer');

/**
 * An element that might be able to be used as a wrapper.
 */
class WrapperCandidate {
    /**
     * 
     * @param {*} type, whether this candidate is an 'id' or a 'class' 
     * @param {*} name, the name of the id or class
     * @param {*} element, the dom element associated with this candidate
     */
    constructor(type, name, element) {
        this.type = type;
        this.name = name;
        this.element = element;
        this.score = 0;
    }
}

/**
 * @param {*} url, the url we want to analyze to determine its wrapper capability
 * @returns An object collection of wrapper canidates for consideration. .classes for classes, .ids for ids. 
 */
async function analyzePage(page) {

    let out = {};

    /**
     * A map of class => number of occurrences
     */
    let candidateMapsJson = await page.evaluate(() => {

        // Go through all the elements and see which IDs and classes might work...
        let elements = document.querySelectorAll('*');

        let classes = new Map();
        let ids = new Map();

        // Count up how many of each class and id we have.
        for (let i=0; i<elements.length; i++) {
            let element = elements[i];

            // console.log(element.classList.length);

            // Count each class we have
            // TBH, could just add classes we find a > 1 of to an "elimination" list... 
            element.classList.forEach(name => {
                classes.has(name) ? classes.set(name, classes.get(name) + 1) : classes.set(name, 1);
            })

            ids.has(element.id) ? ids.set(element.id, ids.get(element.id) + 1) : ids.set(element.id, 1);

        }

        /*
        console.log(`Map size: ${classes.size}`);        
        console.log(elements.length);
        console.log(JSON.stringify(Array.from(classes.entries())));
        */
       // Result has to be serializable, so let's keep it simple with an object.


        return JSON.stringify({ 
            classes: Array.from(classes.entries()),
            ids: Array.from(ids.entries())
        });
    });

    let candidateMaps = JSON.parse(candidateMapsJson);

    // console.log(classesMap);
    out.classes = new Map(candidateMaps.classes);
    out.ids = new Map(candidateMaps.ids);

    return out;
}

let url = 'https://duckduckgo.com/';

(async () => {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Setup console out
    page.on('console', consoleMessage => console.log(consoleMessage.text()));
    page.on('pageerror', err => console.log(err));

    await page.goto(url);

    let analysis = await analyzePage(page);

    let candidates = [];

    console.log(`Classes that have occurred exactly once on ${url}`);

    let out = '';
    
    analysis.classes.forEach((value, key) => {
        if (value == 1) {
            out += `${key}, `;
            candidates.push(new WrapperCandidate('class', key));
        }
    });

    console.log(out);
    console.log("");
    console.log(`Ids that have occurred exactly once on ${url}`);

    let idsOut = '';
    analysis.ids.forEach((value, key) => {
        if (value==1) {
            idsOut += `${key}, `;
            candidates.push(new WrapperCandidate('id', key));
        } 
    });

    console.log(idsOut);

    console.log("");
    console.log("============================");
    console.log("");

    // Score each candidate
    await page.evaluate((candidates) => {
                
        // Scores a wrapper candidate against a provided HTML document.
        // TODO move this out of the page evaulate block
        function simpleScore(candidate, document) {
            let type = candidate.type;
            let element;

            if (!document) {
                throw 'No document provided to score against';
            }

            if (type == 'class') {
                element = document.getElementsByClassName(candidate.name)[0];
            } else if (type == 'id'){
                element = document.getElementById(candidate.name);
            }

            if (!element) {
                throw "Scorer could not find the element indicated by the candidate"; 
            }


            // Start the scoring
            let score = 0;


            let boundingRectangle = element.getBoundingClientRect();
            
            // We should move these into an array of functions that are evaluated for t/f and increase / decrease the score accordingly
            
            if (boundingRectangle.x != 0) {
                // Further away from the left is better??
                score += 1;
            }

            if (boundingRectangle.y !=   0) {
                // Lower on the page is better??
                score += 1;
            }

            if (boundingRectangle.y < 1000) {
                // But being close to the top of the page is good too.
                score += 2 - Math.abs(100-boundingRectangle.y)/1000;
            }

            if (boundingRectangle.width > 300) {
                // Wider is better??
                score += 1;
            }

            if (boundingRectangle.height > 300) {
                // Taller is better??
                score += 1;
            }

            // Get a rough count of th      e number of words in the element and increase the score based on how many this element contains
            let text = element.textContent;
            score += text.split(" ").length / 10000;

            candidate.score = score;
        }

        console.log(candidates.length);
        candidates.forEach((candidate) => {
            let score = 0;

            simpleScore(candidate, document);

            // console.log(`${candidate.type} ${candidate.name}: ${candidate.score}`);


            candidates.sort((a, b) => {
                return b.score - a.score;
            });


        });

        console.log("Sorted candidates:");
        console.log("");
        let count = 0;
        for (let candidate of candidates) {
            console.log(`${candidate.type} ${candidate.name}: ${candidate.score}`);
            count++;
        }
    

    }, candidates);

    await browser.close();

})();

