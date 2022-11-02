function toasterNotification(success, message, endpointUrl) {
    var toaster = document.querySelector('#toast');
    document.getElementById('toastMessage').innerHTML = message;
    if (endpointUrl) {
        document.getElementById('copyUrl').innerHTML = endpointUrl;
    }
    else {
        document.getElementById('copyUrl').innerHTML = '';
    }
    if (success == true) {
        toaster.className = 'success show';
        setTimeout(function () {
            toaster.className = toaster.className.replace('success show', '');
        }, 5000);
    }
    else {
        toaster.className = 'fail show';
        setTimeout(function () {
            toaster.className = toaster.className.replace('fail show', '');
        }, 5000);
    }
}
// Removes any surrounding whitespace and Replaces any spaces with commas for use with the wrapper endpoint.
function formatTarget(target) {
    return target.trim().replaceAll(' ', ',');
}
var storageValue = localStorage.length;
function displayStorage(idName) {
    //Keeps a record of the endpoints you've made in the past
    var li = document.createElement('li');
    var copyButton = document.createElement('button');
    var label = document.createElement('label');
    label.innerHTML = localStorage.getItem(idName);
    copyButton.className = 'copyButton calc-button';
    li.id = idName;
    copyButton.onclick = function () {
        navigator.clipboard.writeText(localStorage.getItem(idName));
        toasterNotification(true, 'Copied to your clipboard', label.innerHTML);
    };
    document.getElementById('list').prepend(li);
    document.getElementById(idName).prepend(label);
    document.getElementById(idName).prepend(copyButton);
}
function constructEndpoint(elementType) {
    var urlSelector = document.getElementById('url');
    var elementName = document.getElementById('elementName');
    var output = document.getElementById('output');
    var h1yn, title;
    var urlValue = urlSelector.value;
    var element = elementName.value;
    elementName.value = element;
    if (urlValue == '') {
        toasterNotification(false, 'You must enter a URL');
    }
    else if (isValidHttpUrl(urlValue) != true) {
        toasterNotification(false, "Your URL doesn't look right... Did you include the protocal?");
    }
    else {
        if (element == '') {
            toasterNotification(false, 'You must choose a page element');
        }
        else {
            var title_1 = document.querySelector('#title').nodeValue;
            if (title_1 != '') {
                title_1 = '&title=' + title_1;
            }
            else {
                title_1 = '';
            }
            var h1yn_1;
            if (document.querySelector('#h1ignoreCheck').checked ==
                true) {
                h1yn_1 = '&h1Ignore=Y';
            }
            else {
                h1yn_1 = '&h1Ignore=N';
            }
            output.value = buildEndpoint(elementType, urlValue, element, title_1, h1yn_1);
            output.setAttribute('value', buildEndpoint(elementType, urlValue, element, title_1, h1yn_1));
            navigator.clipboard.writeText(output.value);
            toasterNotification(true, "Copied to your clipboard", "".concat(elementType.toUpperCase(), " selected \"").concat(element, "\" for \"").concat(urlSelector.value, "\""));
            addToLocalStorage(localStorage.length + 1, output);
        }
    }
}
function buildEndpoint(elementType, urlValue, element, title, h1yn) {
    var totalSelector;
    switch (elementType) {
        case 'class':
            urlValue = 'wrapper-v2?site=' + urlValue;
            totalSelector = '&target=class&class=' + element;
            break;
        case 'id':
            urlValue = 'wrapper-v2?site=' + urlValue;
            totalSelector = '&target=id&id=' + element;
            break;
        case 'duda':
            urlValue = 'duda?site=' + urlValue;
            totalSelector = '&target=id&id=' + element;
            break;
        case 'element':
            urlValue = 'wrapper-v2?site=' + urlValue;
            totalSelector = '&target=element&el=' + element;
            break;
        default:
            break;
    }
    //displays wrapper endpoint url
    return ('https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/' +
        urlValue +
        totalSelector +
        title +
        h1yn);
}
function addToLocalStorage(storageValue, output) {
    localStorage.setItem(storageValue.toString(), output.value);
    displayStorage(storageValue.toString());
    storageValue++;
}
function clearForm() {
    document.querySelector('#url').value = '';
    document.querySelector('#elementName').value = '';
    document.querySelector('#output').value = '';
}
function clearStorage() {
    localStorage.clear();
    var outputtedList = document.getElementById('list');
    outputtedList.innerHTML = '';
    // hide the modal
    var modal = document.getElementById('id01');
    modal.style.display = 'none';
    storageValue = 1;
}
// Run on load to grab old endpoints from storage
function loadStorage() {
    for (var i = storageValue - 1; i >= 0; i--) {
        displayStorage(localStorage.key(i));
    }
    storageValue = localStorage.length + 1;
}
function copyFromStorage(target) {
    navigator.clipboard.writeText(localStorage.getItem(target));
}
function isValidHttpUrl(string) {
    var url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
