function toasterNotification(success, message, endpointUrl) {
	toaster = document.getElementById('toast')
	document.getElementById('toastMessage').innerHTML = message
	if (endpointUrl) {
		document.getElementById('copyUrl').innerHTML = endpointUrl
	} else {
		document.getElementById('copyUrl').innerHTML = ''
	}

	if (success == true) {
		toaster.className = 'success show'
		setTimeout(function () {
			toaster.className = toast.className.replace('success show', '')
		}, 5000)
	} else {
		toaster.className = 'fail show'
		setTimeout(function () {
			toaster.className = toast.className.replace('fail show', '')
		}, 5000)
	}
}

// Removes any surrounding whitespace and Replaces any spaces with commas for use with the wrapper endpoint.
function formatTarget(target) {
	return target.trim().replaceAll(' ', ',')
}

let storageValue = localStorage.length

function displayStorage(idName) {
	//Keeps a record of the endpoints you've made in the past
	let li = document.createElement('li')
	let copyButton = document.createElement('button')
	let label = document.createElement('label')
	label.innerHTML = localStorage.getItem(idName)
	copyButton.className = 'copyButton calc-button'
	li.id = idName

	copyButton.onclick = function () {
		navigator.clipboard.writeText(localStorage.getItem(idName))
		toasterNotification(true, 'Copied to your clipboard', label.innerHTML)
	}
	document.getElementById('list').prepend(li)
	document.getElementById(idName).prepend(label)
	document.getElementById(idName).prepend(copyButton)
}

function constructEndpoint(elementType) {
	const urlSelector = document.getElementById('url')
	const elementName = document.getElementById('elementName')
	const output = document.getElementById('output')
	let h1yn, title
	let urlValue = urlSelector.value
	let element = formatTarget(elementName.value)
	elementName.value = element

	if (urlValue == '') {
		toasterNotification(false, 'You must enter a URL')
	} else if (isValidHttpUrl(urlValue) != true) {
		toasterNotification(
			false,
			"Your URL doesn't look right... Did you include the protocal?"
		)
	} else {
		if (element == '') {
			toasterNotification(false, 'You must choose a page element')
		} else {
			if (document.getElementById('title').value != '') {
				title = '&title=' + document.getElementById('title').value
			} else {
				title = ''
			}

			if (document.getElementById('h1ignoreCheck').checked == 1) {
				h1yn = '&h1Ignore=Y'
			} else {
				h1yn = '&h1Ignore=N'
			}

			output.value = buildEndpoint(elementType, urlValue, element, title, h1yn)
			navigator.clipboard.writeText(output.value)

			toasterNotification(
				true,
				`Copied to your clipboard`,
				`${elementType.toUpperCase()} selected "${element}" for "${
					urlSelector.value
				}"`
			)
			addToLocalStorage(localStorage.length + 1, output)
		}
	}
}

function buildEndpoint(elementType, urlValue, element, title, h1yn) {
	switch (elementType) {
		case 'class':
			urlValue = 'wrapper-v2?site=' + urlValue
			totalSelector = '&target=class&class=' + element
			break
		case 'id':
			urlValue = 'wrapper-v2?site=' + urlValue
			totalSelector = '&target=id&id=' + element
			break
		case 'duda':
			urlValue = 'duda?site=' + urlValue
			totalSelector = '&target=id&id=' + element
			break
		case 'element':
			urlValue = 'wrapper-v2?site=' + urlValue
			totalSelector = '&target=element&el=' + element
			break
		default:
			break
	}

	//displays wrapper endpoint url
	return (
		'https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/' +
		urlValue +
		totalSelector +
		title +
		h1yn
	)
}
function addToLocalStorage(storageValue, output) {
	localStorage.setItem(storageValue, output.value)
	displayStorage(storageValue)
	storageValue++
}
function clearForm() {
	document.getElementById('url').value = ''
	document.getElementById('elementName').value = ''
	document.getElementById('output').value = ''
}

function clearStorage() {
	localStorage.clear()
	let outputtedList = document.getElementById('list')
	outputtedList.innerHTML = ''
	// hide the modal
	let modal = document.getElementById('id01')
	modal.style.display = 'none'
	storageValue = 1
}

// Run on load to grab old endpoints from storage
function loadStorage() {
	for (let i = storageValue - 1; i >= 0; i--) {
		displayStorage(localStorage.key(i))
	}
	storageValue = localStorage.length + 1
}

function copyFromStorage(target) {
	navigator.clipboard.writeText(localStorage.getItem(target))
}

function isValidHttpUrl(string) {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}
