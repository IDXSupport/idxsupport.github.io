const http = require("http");
const hostname = "0.0.0.0";
const port = 5732;

const puppeteer = require('puppeteer');
const express = require('express');

const expressApp = express();

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

async function getBrowser() {
    return await puppeteer.launch({args: ['--single-process', '--no-zygote', '--no-sandbox', '--disable-setuid-sandbox']});
}

expressApp.use(express.static('public'));       

expressApp.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
expressApp.get('/generateStatic', async (req, res) => {
    let url = req.query.url;
    let targetType = req.query.type;
    let targetName = req.query.name;
    let targetRemoveScripts = req.query?.removeScripts;
    let targetInsertSs = req.query?.insertSs;

    let targetElement;

    let browser = await getBrowser();
    const page = await browser.newPage();

    // Setup console out
    page.on('console', consoleMessage => console.log(consoleMessage.text()));
    page.on('pageerror', err => console.log(err));

    try {
        await page.goto(url);
    } catch (e) {
        console.log(e);
        res.send({
            status: RESPONSE_STATUSES.failure,
            message: e.message
        });
        return false;
    }

    let processedHTML = await page.evaluate((target) => {

        // Rename title
        let title = document.getElementsByTagName('title')[0];
        title.innerHTML = 'Property Search';

        // Fix links
        let as = document.getElementsByTagName('a');
        for (let i=0; i<as.length; i++) {
            let link = as[i];
            let oldLink = link.getAttribute('href');
            let absoluteLink = link.href;
            if (oldLink != absoluteLink) {
                console.log(`Changing ${link.getAttribute('href')} to ${link.href}`);
                link.setAttribute('href', link.href);
            }
        }

        let links = document.getElementsByTagName('link');
        for (let i=0; i<links.length; i++) {
            let link = links[i];
            let oldLink = link.getAttribute('href');
            let absoluteLink = link.href;
            if (oldLink != absoluteLink) {  
                console.log(`Changing ${link.getAttribute('href')} to ${link.href}`);
                link.setAttribute('href', link.href);
            }
        }

        let images = document.getElementsByTagName('img');
        for (let i=0; i<images.length; i++) {
            let img = images[i];
            let oldImageSrc = img.getAttribute('src');
            let absoluteImageSrc = img.src;
            if (oldImageSrc != absoluteImageSrc) {
                console.log(`Changing ${img.getAttribute('src')} to ${img.src}`);
                img.setAttribute('src', img.href);
            }
        }

        if (target.removeScripts) {
            let scripts = document.getElementsByTagName('script');
            // Count backwards because removing elements will change the length of the html collection.
            for (let i=scripts.length-1; i>=0; i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
           }
        }

        // TODO don't have this function duplicated 3+ times ... should be a way to avoid this.
        function getElementForCandidate(candidate, document) {
            let type = candidate.type;
            let element;
            if (type == 'class') {
                element = document.getElementsByClassName(candidate.name)[0];
            } else if (type == 'id'){
                element = document.getElementById(candidate.name);
            }
            return element;
        }

        let targetElement = getElementForCandidate(target, document);
        if (target.insertSs) {
            targetElement.innerHTML = "\n<div id=\"idxStart\"></div>\n<div id=\"idxStop\"></div>\n";
        } else {
            targetElement.innerHTML = "***splithere***";
        }

        return document.children[0].innerHTML;
    }, {
        type: targetType,
        name: targetName,
        removeScripts: targetRemoveScripts,
        insertSs: targetInsertSs 
    });
    
    // We don't want the output to render.  
    res.type('txt');
    processedHTML = `<!DOCTYPE html>${processedHTML}`;
    res.send(processedHTML);

    browser.close();
});

expressApp.get('/analyze', async (req, res) => {
    let url = decodeURIComponent(req.query.url);

    res.type('json');

    // See if a url was provided.
    if (!url) {
        res.send({
            status: RESPONSE_STATUSES.failure,
            message: 'URL missing.'
        });
        return;
    } 

    // The browser seems to use too much memory unless we make a new instance with puppeteer for every request...  
    let browser = await getBrowser(); //Fix sandbox when possible
    
    const page = await browser.newPage();

    await page.setViewport({
        width: 1024,
        height: 1280
    })    

    // Setup console out
    page.on('console', consoleMessage => console.log(consoleMessage.text()));
    page.on('pageerror', err => console.log(err));

    try {
        await page.goto(url);
    } catch (e) {
        console.log(e);
        res.send({
            status: RESPONSE_STATUSES.failure,
            message: e.message
        });
        return false;   
    }

    let candidates = await findCandidates(page);

    await page.addStyleTag({content: '.idx-page-analyzer-candidate {border: 5px solid red !important;}'});

    
    // Returns the filename of the screenshot if successful
    async function screenshotCandidate(candidate, page) {

        let href = await page.evaluate((candidate) => {
            function getElementForCandidate(candidate, document) {
                let type = candidate.type;
                let element;
                if (type == 'class') {
                    element = document.getElementsByClassName(candidate.name)[0];
                } else if (type == 'id'){
                    element = document.getElementById(candidate.name);
                }
                return element;
            }
            
            let element = getElementForCandidate(candidate, document);
            element.classList.add("idx-page-analyzer-candidate");

            return document.location.href;
        }, candidate);


        let sanitizedUrl = href.replace(/\/|\.|:|\?/g,'');
        let filename =  `${sanitizedUrl}-${candidate.name}-${candidate.type}.jpg`;

        console.log(`saving screenshot: ${filename}`);
        await page.screenshot({
            path: `./public/screenshots/${filename}`,
            fullPage: true
        });         

        await page.evaluate((candidate) => {
            function getElementForCandidate(candidate, document) {
                let type = candidate.type;
                let element;
                if (type == 'class') {
                    element = document.getElementsByClassName(candidate.name)[0];
                } else if (type == 'id'){
                    element = document.getElementById(candidate.name);
                }
                return element;
            }
            
            let element = getElementForCandidate(candidate, document);
            element.classList.remove("idx-page-analyzer-candidate");

        }, candidate);

        return filename;
    }


    // Score each candidade 
    let scoredCandidatesJson = await page.evaluate((candidates) => {
        
        function getElementForCandidate(candidate, document) {
            let type = candidate.type;
            let element;
            if (type == 'class') {
                element = document.getElementsByClassName(candidate.name)[0];
            } else if (type == 'id'){
                element = document.getElementById(candidate.name);
            }
            return element;
        }

        // Adds useful proeprties to the candidate that will be used later for various purposes (mostly on the front-end )
        function addDetails(candidate, document) {
            let element = getElementForCandidate(candidate, document);
            if (element) {
                let boundingRectangle = element.getBoundingClientRect();
                candidate.width = boundingRectangle.width;
                candidate.height = boundingRectangle.height;
            }
        }

        // Scores a wrapper candidate against a provided HTML document.
        // TODO move this out of the page evaulate block
        function simpleScore(candidate, document) {
            let type = candidate.type;
            let element;

            if (!document) {
                throw 'No document provided to score against';
            }

            element = getElementForCandidate(candidate, document);

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

            if (boundingRectangle.width > 500) {
                score += 0.5;
            }

            if (boundingRectangle.height > 300) {
                // Taller is better??
                score += 1;
            }

            // Reduce score by how "unbalanced" the element's distance from the left and right parts of the viewpart are
            let rightDistance = window.innerWidth - boundingRectangle.right;
            score -= Math.abs(boundingRectangle.left - rightDistance)/250;

            // Get a rough count of the number of words in the element and increase the score based on how many this element contains
            let text = element.textContent;
            score += text.split(" ").length / 10000;

            let computedStyle = getComputedStyle(element);
            
            // Increase the score a bit if there's a margin around the element.
            if (parseInt(computedStyle.marginTop) > 0) {
                score += 0.25;
            }

            if (parseInt(computedStyle.marginRight) > 0) {
                score += 0.25;
            }

            if (parseInt(computedStyle.marginBottom) > 0) {
                score += 0.25;
            }

            if (parseInt(computedStyle.marginLeft) > 0) {
                score += 0.25;
            }

            // Increase the score if the element is smaller than its parent
            
            if (element.parentElement) {
                let parentStyle = getComputedStyle(element.parentElement);
                if (parentStyle) {
                    if (parentStyle.width != computedStyle.width) {
                        score += 0.05;
                    }
                    if (parentStyle.height != computedStyle.height) {
                        score += 0.05;
                    }
                }
            }

            candidate.score = score;
        }

        console.log(candidates.length);

        // Sort our candidates from most scoring to least.
        for (let i=0; i<candidates.length; i++) {
            let candidate = candidates[i];
            addDetails(candidate, document);
            try {
                simpleScore(candidate, document);
            } catch (e) {
                console.log(e.message);
                candidate.score = -100;
            }

            // Add other attributes to the candidate that might be relevant
        }
        
        candidates.sort((a, b) => {
            return b.score - a.score;
        });

        /*
        candidates.forEach(async (candidate) => {
            let score = 0;

            simpleScore(candidate, document);
            await screenshotCandidate(candidate, document);

            // console.log(`${candidate.type} ${candidate.name}: ${candidate.score}`);

        });*/

        console.log("Sorted candidates:");
        console.log("");

        for (let candidate of candidates) {
            console.log(`${candidate.type} ${candidate.name}: ${candidate.score}`);
        }

        return JSON.stringify(candidates);
    
    }, candidates);

    let scoredCandidates = JSON.parse(scoredCandidatesJson);
    let scoreScreenshotSet = new Set();

    let startingTime = process.uptime();
    let maxTime = 45;

    for (let i=0; i<scoredCandidates.length/2; i++) {
        let score = scoredCandidates[i].score;
        if (!scoreScreenshotSet.has(score.toFixed(2))) {
            scoredCandidates[i].hasScreenshot = true;
            let sanitizedUrl = await screenshotCandidate(scoredCandidates[i], page);
            scoredCandidates[i].imageUrl = '/screenshots/' + sanitizedUrl;
            scoreScreenshotSet.add(score.toFixed(2));
        } else {
            scoredCandidates[i].hasScreenshot = false;
        }
        let currentTime = process.uptime();

        // Only take sreenshots for the indicated amount of seconds.
        if (currentTime - startingTime > maxTime) {
            console.log("Maximum time taking screenshots reached.");    
            break;
        }
    }


    res.send(scoredCandidates);

    // Close the browser once we're done sending our response. 
    await browser.close();

});

expressApp.listen(port, () => {
	console.log("Starting server");
});
