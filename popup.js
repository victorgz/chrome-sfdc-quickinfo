

var contentDiv = document.getElementById("content"); // Div used to append the fields (label + value) of the Lead
var content; // Variable containing all the fields (label + value) that will be copied into the clipboard

function reload(){
	//var htmlValue = document.getElementsByClassName("slds-page-header__title")[0].innerText;
	//var storedLegal = chrome.storage.local.get('leadData', function (items) {});

	//alert(storedLegal);

	var getHtmlValue = 'document.getElementsByClassName("windowViewMode-normal active")[0].getElementsByClassName("slds-page-header__title")[0].innerText';
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.executeScript(tab.id, {code: getHtmlValue}, function(response){
	  	console.log("Here: " + response);
	  });
	});

	chrome.tabs.getSelected(null, function(tab) {
	  var code = 'window.location.reload();';
	  //chrome.tabs.executeScript(tab.id, {code: code});
	});

	getLeadData();
}
/* Main function. Cleans the content of the extension and gets the Lead Data */
function getLeadData(){
		console.log("Starting process..");
		cleanLeadData();
		/*
		chrome.storage.local.get('leadData', function(items){
			console.log(items.leadData);
			cleanLeadData();
		});
		*/

		// Launch a script to capture data from Salesforce lead + store this data into a variable
		chrome.tabs.executeScript(null, {file: "content.js"}, function(response){
			console.log(response);
		});

		// Display the stored data
		var storedLegal = chrome.storage.local.get('leadData', function (items) {
			for(var i=0; i<items.leadData.length; i++){
				appendElement(items.leadData[i].label, items.leadData[i].value);
			}
		});

		// Display the copy button
		showCopyButton();
}

/* Functionality to copy the data in the clipboard. Necessary to create a temporary input field that it is deleted after the data is copied in the clipboard.
*	It also displays the message saying that data has been copied
*/
function copyData(){
	var input = document.createElement('textarea');
	document.body.appendChild(input);
	input.value = content;
	input.focus();
	input.select();
	document.execCommand('Copy');
	input.remove();
	var text = document.getElementById("copiedText").style.display = "block";
	setTimeout(function(){ document.getElementById("copiedText").style.display = "none" }, 3000);
}

/* Creates <p> element with format, for the fieldName and fieldValue specified */
function appendElement(fieldName, fieldValue){
	var element = document.createElement('p');
	if(fieldValue == "null value")
		var redStyle = 'style="color: red"';
	else
		var redStyle = "";

	element.innerHTML = "<strong>" + fieldName + ": </strong><span " + redStyle + ">" + fieldValue + "</span>";
	contentDiv.appendChild(element);

	// After appending the element, store it in the global variable
	storeIntoGlobalData(fieldName, fieldValue);
}

/* Adds the fieldName and fieldValue specified in params, givin Markdown format, to be copied into clipboard in the future */
function storeIntoGlobalData(fieldName, fieldValue){
	content = content + "**" + fieldName + ":** " + fieldValue + "\n";
}

/* Removes all the fields and values from the previous lead stored */
function cleanLeadData(){
	console.log("Cleaning data...");
	var myNode = document.getElementById("content");
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
	content = "";
	hideCopyButton();
}

/* Hides the button */
function hideCopyButton(){
	var x = document.getElementById("btnCopy");
	x.style.display = "none";
}

/* Displays the button */
function showCopyButton(){
	var x = document.getElementById("btnCopy");
	x.style.display = "none";
}

getLeadData();

document.getElementById("btnGetLeadData").onclick = getLeadData;
document.getElementById("btnCopy").onclick = copyData;