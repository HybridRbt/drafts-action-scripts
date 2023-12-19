// locate DNP

const dateFormat = draft.processTemplate("[[dateFormat]]");
const dateString = draft.processTemplate("[[created|" + dateFormat + "]]") + " " + draft.processTemplate("[[draftTitleSuffix]]")
const workspaceName = draft.processTemplate("[[workspaceName]]")
const pinOnSuccess = draft.processTemplate("[[pinOnSuccess]]")
const templateContent = draft.processTemplate("[[templateContent]]")
var content = draft.processTemplate("[[content]]")

let dailyDraft = Draft.queryByTitle(dateString)

if (dailyDraft.length == 0) {
    //create daily draft
    let d = new Draft()
    d.content = "# " + dateString + "\n\n" + templateContent;
    addContent(d)
} else if (dailyDraft.length == 1) {
    let d = dailyDraft[0]
    addContent(d)
} else {
    //more than one found, merge it
    let d = new Draft()
	d.content = dailyDraft.join("\n");
    addContent(d)
}

if (device.systemName == 'iOS') {
    app.hideActionList();
}
applyWorkspace()
pinDraft()

function applyWorkspace() {
    if (workspaceName.length != 0) {
        let workspace = Workspace.find(workspaceName);
        if (workspace) {
            app.applyWorkspace(workspace)
        } else {
            const warning = "configured workspace \"" + workspaceName + "\" not found";
            app.displayWarningMessage(warning);
            context.cancel()
        }

    }
}

function pinDraft() {
    if (pinOnSuccess == "true") {
        editor.pinningEnabled = true;
        editor.activate()
    }
}

function addContent(toDraft) {
    // If the current draft doesn't end with a newline, then add one.
    if (content.slice(-1) != "\n") {
	    content = content + "\n\n";
    }

    var existingContent = toDraft.content;
    // If the existing content doesn't end with a newline, then add one.
    if (existingContent.slice(-1) != "\n") {
        existingContent = existingContent + "\n\n"
    }

    // Append and save it.
    toDraft.content = existingContent + content;
    toDraft.update();
}