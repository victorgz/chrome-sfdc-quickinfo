console.log("Starting content script");
/* Variables used to store the fields of the Lead */
var field1 = searchFields("Name");
var field2 = searchFields("Lead Status");
var field3 = searchFields("Phone");
var field4 = searchFields("Email");


/* JSON Array with the fields (labels and values) of the Lead */
var leadData = [
	{
    	'label': "Lead Name",
    	'value': field1
    },
    {
    	'label': "Status",
    	'value': field2
    },
    {
    	'label': "Phone number",
    	'value': field3
    },
    {
    	'label': "Email",
    	'value': field4
    }
    ];

    chrome.storage.local.set({
            'leadData': leadData
    });


/* Searches in all the HTML elements by the given field label, returning the content of the value element */
function searchFields(fieldLabel){
	var labelElements = document.body.getElementsByClassName("windowViewMode-normal active")[0].getElementsByClassName("test-id__field-label");
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