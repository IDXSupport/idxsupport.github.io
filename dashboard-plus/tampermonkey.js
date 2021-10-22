// ==UserScript==
// @name         Lain's Dashboard+
// @namespace    https://lain.tools/
// @version      0.1
// @description  Adds additional functionality to MW for Support purposes.
// @author       Lain Malka Vineyard
// @match        https://middleware.idxbroker.com/mgmt/*
// @connect      s3.amazonaws.com
// @icon         https://www.google.com/s2/favicons?domain=force.com
// @require https://unpkg.com/papaparse@latest/papaparse.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    // The navigation on the left is loaded dynamically... so keep checking until we see the element we're looking for.
    let dbpInterval = setInterval(() => {
        // Should be the main container element for the lefthand navigation when using the Dashboard
        let nav = document.getElementsByClassName('idx-mw-nav-list')[0];

        // If we haven't found a nav element yet, the page isn't ready.
        if (!nav) {
            return;
        } else {
            clearInterval(dbpInterval);
        }

        // Otherwise, assuming we're good to go...

        // Add confirm button to clear payment info button
        idx('#clearPaymentInfo').off('click');
        idx('#clearPaymentInfo').on('click', () => {
            if (confirm('Really clear the payment information on this account?')) {
                // Copied out of billing.js
                var options = {"action":"clearPaymentInfo","clientPartner":clientPartner,"accountID":accountID};

                idx.getJSON(ajaxURL,options,function(data) {
                    if (!data.error)
                    {
                        idx.jGrowl('Payment information cleared successfully.', { life: 3000, growlClass: 'success' });
                        window.location.reload();
                    }
                });        
            }
        });

        // A button that lets the user toggle the display of the enhancements enabled by this userscript;
        let plusNavLink = document.createElement('li');
        plusNavLink.className = 'idx-mw-nav-list--iten';

        let plusNavText = document.createElement('span');
        plusNavText.className = "idx-mw-v-nav--item dbp-navigation-item";
        plusNavText.textContent = 'Dashboard+';

        plusNavLink.prepend(plusNavText);

        nav.prepend(plusNavLink);

        // Is it better to just build the HTML like this?
        let dbpContainerHtml = `<div id="dbp-container" class="tab-content dbp-container dbp-container-hidden">
            This is where some extra cool stuff will happen. <br>

            <div class="dbp-listing-comparison">
                <div class="dbp-listing-comparison-side dbp-aol-search">
                    mlsId: <input id="dbp-aol-search-mls-id-input" type="text"> <br>
                    listingId <input id="dbp-aol-search-mls-listing-id-input" type="text"> <br>
                    <button id="dbp-aol-search-button">Search AOL</button>
                    <div id="dbp-aol-output" class="dbp-listing-comparison-output">
                    </div>
                </div>
                <div class="dbp-listing-comparison-side dbp-dora-search">
                    <button id="dbp-dora-search-button">Search DORA</button>
                    <div id="dbp-dora-output" class="dbp-dora-output">
                    </div>
                </div>
            </div>
        </div>`;

        document.getElementById('main-content').insertAdjacentHTML('afterbegin', dbpContainerHtml);

        // Lookup the listing in AOL.
        // cb will called with the response.
        function aolQuery(mlsId, listingId, cb) {
            jQuery.post('https://middleware.idxbroker.com/mgmt/ajax/listingmgmt.php', {
                action: 'listingData',
                mlsID: mlsId,
                listingID: listingId
            }, (response) => {
                cb(response);
            });
            //jQuery.post('https://middleware.idxbroker.com/mgmt/ajax/listingmgmt.php', {action: 'listingData', mlsID: 'd003', listingID: 'U8139659'}, (response) => {console.log(response)});
        }

        // Returns an HTMLElement that can be appened to a page based on the data retrieved from
         function createAolHtmlElement(aolData) {
            let container = document.createElement('div');
            container.className = 'dbp-aol-data-container';
            
            let coreFieldsConatiner = document.createElement('div');
            let coreFields = aolData.core;
            for (let field in coreFields) {
                let fieldElement = document.createElement('div');
                fieldElement.textContent = `${field}: ${coreFields[field]}`;
                coreFieldsConatiner.append(fieldElement);
            }
            container.append(coreFieldsConatiner);

            let advancedFieldsContainer = document.createElement('div');
            let advancedFields = aolData.advanced;
            for (let field in advancedFields) {
                let fieldElement = document.createElement('div');
                fieldElement.textContent = `${field}: ${advancedFields[field]}`;
                advancedFieldsContainer.append(fieldElement);
            }

            return container;
        }
        


        document.getElementById('dbp-aol-search-button').onclick = function() {
            let mlsId = document.getElementById('dbp-aol-search-mls-id-input').value;
            let listingId = document.getElementById('dbp-aol-search-mls-listing-id-input').value;
            aolQuery(mlsId, listingId, function (response) {
                console.log(response);
                document.getElementById('dbp-aol-output').textContent = JSON.parse(response).data;
                let aolElement = createAolHtmlElement(JSON.parse(response).data);
                document.getElementById('dbp-aol-output').append(aolElement);
            })
        }

        function doraQuery() {
            jQuery.get(`https://middleware.idxbroker.com/mgmt/mls/d003/transactions/run/single?transaction[resource]=PropertyResi&transaction[dataType]=property&transaction[class]=PropertyResi&&transaction[query]=(OriginatingSystemName eq 'mfrmls') and (ListingId eq 'MFRU8139659')&transaction[select]=&transaction[limit]=5&transaction[dateField]=&transaction[dateStart]=&transaction[usePost]=&transaction[useOffsetField]=&transaction[offsetField]=&transaction[offsetType]=&transaction[offsetRange]=`, (response) => {
                console.log(response);
                let fileUrl = response.s3Filename.replace(`http://`, `https://`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: fileUrl,
                    onload: (args) => {
                        console.log(Papa.parse(args.responseText, {
                            complete: (results) => {
                                console.log(results.data);
                            }
                        }))
                        document.getElementById("dbp-dora-output").textContent = args.responseText;
                    }
                });/*
                jQuery.get(fileUrl, (fileResponse) => {
                })*/
            });
        }

        // Setup some listeners...
        document.getElementById('dbp-dora-search-button').onclick = doraQuery;

        // Toggle showingo our content div when the navigation option on the left is clicked.
        plusNavText.onclick = function () {
            document.getElementById('dbp-container').classList.toggle('dbp-container-hidden');
        }

        // Add our fancy custom CSS
        document.head.insertAdjacentHTML('beforeend', `<style>
            .dbp-navigation-item {
                background-color: #0066ff;
            }
            .dbp-container {
                border: 3px solid #0066ff;
            }
            .dbp-container-hidden {
                display: none;
            }
        </style>`);



    }, 500);


})();