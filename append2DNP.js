// This is the same as "Go to Today's Journal", but I don't know how
// to define them in one place and share that information
var bjTitle = "# Journal for " + Date.today().toString("yyyy-MM-dd");
var tag = "journal";

var targetDraftUuid = draft.getTemplateTag("targetDraftUuid");

if(targetDraftUuid == "") {
	var currentContent = editor.getText();
}
else {
	var currentContent = Draft.find(targetDraftUuid).content;
}

// If the current draft doesn't start with "-", "*", or "@", then
// add a "- " to the front of it.
if ("-*@".indexOf(currentContent[0]) == -1) {
	currentContent = "- " + currentContent;
}

// If the current draft doesn't end with a newline, then add one.
if (currentContent.slice(-1) != "\n") {
	currentContent = currentContent + "\n";
}

// Look for Today's Journal and complain if there are more than one
// matches.
var drafts = Draft.query(bjTitle, "all", [tag]);
if (drafts.length > 1) {
	app.displayErrorMessage(drafts.length + " drafts have title '" + bjTitle + "'");
    context.fail();
}
else {
    var ourDraft = null;
    if (drafts.length == 0) {
    	ourDraft = Draft.create();
    	ourDraft.content = bjTitle + "\n\n";
    	ourDraft.addTag(tag);
    	ourDraft.update();
    	app.displayInfoMessage("Created a new journal: " + bjTitle);
    }
    else if ((targetDraftUuid == drafts[0].uuid) || (targetDraftUuid == "" && draft.uuid == drafts[0].uuid)) {
    	// It would be bad if we kept adding a draft's contents to itself.
    	// Keep that up a few times and the world would run out of hard
    	// drives to store it.
    	app.displayErrorMessage("Not appending this note to itself.");
        context.fail();
    }
    else {
        ourDraft = drafts[0];
   	}
    
    if (ourDraft != null) {
    	var existingContent = ourDraft.content;
    
    	// If the existing content doesn't end with a newline, then add one.
    	if (existingContent.slice(-1) != "\n") {
    		existingContent = existingContent + "\n"
    	}
    
    	// Append the old draft to Today's Journal and save it.
    	ourDraft.content = existingContent + currentContent;
    	ourDraft.update();
    }
}