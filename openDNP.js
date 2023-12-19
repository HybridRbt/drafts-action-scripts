// open DNP

const dateFormat = draft.processTemplate("[[dateFormat]]");
const dateString = draft.processTemplate("[[created|" + dateFormat + "]]") + " " + draft.processTemplate("[[draftTitleSuffix]]")
const workspaceName = draft.processTemplate("[[workspaceName]]")
const pinOnSuccess = draft.processTemplate("[[pinOnSuccess]]")
const templateContent = draft.processTemplate("[[templateContent]]")

let dailyDraft = Draft.queryByTitle(dateString)

if (dailyDraft.length == 0) {
    //create daily draft
    let d = new Draft()
    d.content = "# " + dateString + "\n\n" + templateContent;
    d.update()
    editor.load(d);
} else if (dailyDraft.length == 1) {
    let d = dailyDraft[0]
    editor.load(d);
} else {
    //more than one found, merge it
    let d = new Draft()
	d.content = dailyDraft.join("\n");
	d.update();
    editor.load(d);
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