//add creation time
var currentContent = draft.processTemplate("[[created|%H:%M:%S]]\n") + draft.content;

// If the current draft doesn't end with a newline, then add one.
if (currentContent.slice(-1) != "\n") {
	currentContent = currentContent + "\n\n";
}

// find record's DNP; create if none exist
var title = "# " + draft.createdAt.toString("yyyy-MM-dd\n");
title += "**"+draft.processTemplate("[[created|%A]]")+"**\n";
title += "#"+ draft.processTemplate("[[created|%Y]]/W[[created|%W]]");

var drafts = Draft.query(title, "inbox");

if (drafts.length > 1) {
    // if multiple drafts are found, merge them
    let dNew = Draft.create();
	dNew.content = drafts.join("\n");
	dNew.update();

    var target = dNew;
}
else if (drafts.length == 0) {
    // none found, create one
	var target = Draft.create();
	target.content = title + "\n\n";
	target.update();
	app.displayInfoMessage("Created a new journal: " + title);
}
else {
    // just found 1, this is the target
	var target = drafts[0];
}

var existingContent = target.content;

// If the existing content doesn't end with a newline, then add one.
if (existingContent.slice(-1) != "\n") {
    existingContent = existingContent + "\n\n"
}

// Append the old draft to Today's Journal and save it.
target.content = existingContent + currentContent;
target.update();
