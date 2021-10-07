
// Event Listeners function for Add button
document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

// Event Listeners function for Search button
document.getElementById('form-search').addEventListener('submit', filterIssues);

// Genearet uniquie issueId 
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Save Issue Method
function saveIssue(e) {

    console.log("Inside saveIssue()")
    var issueDesc = document.getElementById('issueDescInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    var issueOpenDate = document.getElementById('issueDateInput').value;
    var issueId = uuidv4();
    var issueStatus = 'Open';

    var issue = {
        id: issueId,
        description: issueDesc,
        severity: issueSeverity,
        assignedTo: issueAssignedTo,
        status: issueStatus,
        openedDate: issueOpenDate
    }
    console.log("Issue object created: ", issue);

    if (localStorage.getItem('issues') == null) {
        var issues = [];
        issues.push(issue);
        localStorage.setItem('issues', JSON.stringify(issues));
    } else {
        var issues = JSON.parse(localStorage.getItem('issues'));
        issues.push(issue);
        localStorage.setItem('issues', JSON.stringify(issues));
    }

    document.getElementById('issueInputForm').reset();

    fetchIssues();

    e.preventDefault();
}

// change Status of Issue
function setStatus(id) {

    console.log("Inside setStatus()")
    var action = document.getElementById("action").value;
    console.log("id: ", id)
    console.log("action: ", action)
    var issues = JSON.parse(localStorage.getItem('issues'));

    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id == id) {
            issues[i].status = action;
        }
    }

    localStorage.setItem('issues', JSON.stringify(issues));

    //alert(`Issue ${id} status changed to ${action} successfuly...`)

    fetchIssues();
}

// delete issues 
function deleteIssue(id) {

    console.log("Inside deleteIssue()")
    console.log("id: ", id)
    var issues = JSON.parse(localStorage.getItem('issues'));
    console.log("issues before delete: ", issues);
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id == id) {
            issues.splice(i, 1);
        }
    }

    localStorage.setItem('issues', JSON.stringify(issues));
    console.log("issues after delete: ", issues);

    //alert(`Issue ${id} deleted successfuly...`)
    fetchIssues();
}

// Render Issue in html
function setIssue(list, issue) {


    console.log("Inside setIssue()")
    //console.log(list,issue);

    list.innerHTML += `<div class="card" >
                                <div class="card-header">
                                <h5><strong> Issue ID: ${issue.id} </Strong></h5>
                                <h3><span class="label label-info"> Status: ${ issue.status}  </span></h3>
                                <hr style="height:100px%>
                                </div>
                                <div class="card-body">
                                  <h5>  Description: ${issue.description} </h5>
                                  <p><span class="glyphicon glyphicon-time"></span> Severity: ${issue.severity}  </p>
                                  <p><span class="glyphicon glyphicon-user"></span>  Assigned To: ${issue.assignedTo}  </p>
                                  <p><span class="glyphicon glyphicon-calendar"></span>  Opened Date: ${issue.openedDate}  </p>
                                  <select class="form-control" id="action" onchange="setStatus(\'${issue.id}'\)" >
                                    <option value='Open'>Open</option>
                                    <option value='Close'>Close</option>
                                    <option value='Hold'>Hold</option>
                                  </select>
                                  <button id="delete-btn"onclick="deleteIssue(\'${issue.id}'\)" class="btn btn-danger">Delete</button>
                                </div>
                              </div>`;
    if (issue.status === 'Hold')
        var btn = document.getElementById('delete-btn')
    if (btn != null) btn.disabled = true;

}

// Get issue array from local storage 
function fetchIssues() {

    console.log("Inside fetchIssues()")

    var issues = JSON.parse(localStorage.getItem('issues'));
    var issuesList = document.getElementById('issuesList');

    issuesList.innerHTML = '';

    if (issues != null) {
        for (var i = 0; i < issues.length; i++) {
            setIssue(issuesList, issues[i]);
        }
    } else {
        issuesList.innerHTML = '<h3>No Issues Added</h3>'
    }
}

// Filter and Search Method
function filterIssues(e) {

    console.log("Inside filterIssues")

    var issues = JSON.parse(localStorage.getItem('issues'));
    var issuesList = document.getElementById('issuesList');

    console.log("issues:", issues);
    console.log("issueList:", issuesList);

    var searchText = document.getElementById('search-issue').value;
    var severity = document.getElementById('search-severity').value;
    var startDate = document.getElementById('search-start-date').value;
    var endDate = document.getElementById('search-end-date').value;

    console.log("severity", severity);
    console.log("searchText", searchText);
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    issues = issues.filter((issue) => {

        if ((severity.length > 0 && String(issue.severity).includes(severity)) || (searchText.length > 0 && String(issue).includes(searchText)) ||
            (searchText.length > 0 && String(issue.assignedTo).includes(searchText) ||
                (Date.parse(issue.openedDate) >= Date.parse(startDate) && Date.parse(issue.openedDate) <= Date.parse(endDate))
            )
        ) {
            return issue;
        }

    }).sort((a, b) => Date.parse(a.openedDate) - Date.parse(b.openedDate));

    console.log("issues:", issues);

    issuesList.innerHTML = ''
    for (var i = 0; i < issues.length; i++) {
        console.log("Inside for loop")
        setIssue(issuesList, issues[i])
    }

    document.getElementById('form-search').reset();

    e.preventDefault();
}