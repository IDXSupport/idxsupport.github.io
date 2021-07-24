const http = require("http");
const hostname = "0.0.0.0";
const port = 5732;

const puppeteer = require('puppeteer');
const express = require('express');

const expressApp = express();
let browser;

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
 * @param {*} page, the puppeteer page we want to analyze to determine its wrapper capability
 * @returns An array of unscored wrapper candidates
 */
async function findCandidates(page) {

    let out = {};

    /**
     * A map of class => number of occurrences
     */
    let candidatesJson = await page.evaluate(() => {

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

        // See which classes and ids have only occurred once on the page.
        let uniques = [];

        classes.forEach((value, key) => {
            if (value == 1) {
                uniques.push({type: 'class', name: key});
            }
        });
    
        ids.forEach((value, key) => {
            if (value == 1) {
                uniques.push({type: 'id', name: key});
            }
        });

        console.log(uniques.length);    

        // We can only return serializable objects from page.evaluate.
        return JSON.stringify(uniques);
    });

    let uniqueCandidates = JSON.parse(candidatesJson);

    console.log(uniqueCandidates);

    return uniqueCandidates;
}

const RESPONSE_STATUSES = {
    success: 'success',
    failure: 'failure'
}

class ServerResponse {
    constructor(status) {
        this.status = status;
    }
}

expressApp.get('/analyze', async (req, res) => {
    let url = req.query.url;

    res.type('json');

    // See if a url was provided.
    if (!url) {
        res.send({
            status: RESPONSE_STATUSES.failure,
            message: 'URL missing.'
        });
        return;
    } 

    // See if we've initialized the browser yet.
    if (!browser) {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}); //Fix sandbox when possible
    }
    
    const page = await browser.newPage();

    // Setup console out
    page.on('console', consoleMessage => console.log(consoleMessage.text()));
    page.on('pageerror', err => console.log(err));

    await page.goto(url);

    let candidates = await findCandidates(page);

    // Score each candidade 
    
    let scoredCandidatesJson = await page.evaluate((candidates) => {
                
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

        console.log("ummmmm ok");
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

        for (let candidate of candidates) {
            console.log(`${candidate.type} ${candidate.name}: ${candidate.score}`);
        }

        return JSON.stringify(candidates);
    
    }, candidates);

    res.send(JSON.parse(scoredCandidatesJson));

});

expressApp.listen(port, () => {
	console.log("Starting server");
});
