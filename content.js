console.log("Starting content script");
/* Variables used to store the fields of the Lead */

var fields = ["Name", "Lead Status", "Phone", "Email"];


/* JSON Array with the fields (labels and values) of the Lead */
var leadData = initJsonArray(fields);

    chrome.storage.local.set({
            'leadData': leadData
    });


/* Initializes the JSON Array */
function initJsonArray(fields){
    console.log("Going to init array: " + fields);
    var data = [];

    fields.forEach(function (item, index) {
        var aux = searchFields(item);
        var newItem = {
            'label': item,
            'value': aux.replace('Click to dial disabled','')
        };
        data.push(newItem);
    });
    return data;
}

/* Searches in all the HTML elements by the given field label, returning the content of the value element */
function searchFields(fieldLabel){
    var mainContainer = document.body.getElementsByClassName("windowViewMode-normal active")[0];
    if(mainContainer == null)
        return "";

	var labelElements = mainContainer.getElementsByClassName("test-id__field-label");
	var searchText = fieldLabel;
	var found;
	var fieldValue;

	for (var i = 0; i < labelElements.length; i++) {
	  if (labelElements[i].textContent == searchText) {
	    found = labelElements[i];
	    fieldValue = found.parentElement.parentElement.getElementsByClassName("test-id__field-value")[0];
	    if(fieldValue == null || fieldValue.innerText == ""){
            return "";
	    }
	    break;
	  }
	}
    if(fieldValue == null)
        return "";
    console.log(fieldLabel + " : " + fieldValue);
	return fieldValue.innerText;
}