// Message listener
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0].url.indexOf("panopto.com") > 1 || tabs[0].url.indexOf("panopto.eu") > 1) {
            if (tabs[0].url.indexOf("Embed.aspx") > 1) {
                var newurl = tabs[0].url.replace('/Embed.aspx', '/Viewer.aspx');
                chrome.tabs.update(tabs[0].id, { url: newurl });
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (info.status === 'complete' && tabId === tabs[0].id) {
                        chrome.tabs.onUpdated.removeListener(listener);
                        chrome.tabs.sendMessage(tabs[0].id, { action: "download_video" }, downloadCallback);
                    }
                });
            } else {
                chrome.tabs.sendMessage(tabs[0].id, { action: "download_video" }, downloadCallback);
            }
        } else if (tabs[0].url.indexOf("panopto.com") == -1 || tabs[0].url.indexOf("panopto.eu") == -1) {
            alert("Sorry, but I didn't find any videos. Are you sure the address in the search bar is with \"panopto.eu\" or \"panopto.com\" ?");
        }
    })
});

// Callback to download video
function downloadCallback(infoArray) {
    if (typeof infoArray != "undefined") {

        var url = infoArray[0];
        var name = infoArray[1];

        // chrome.downloads.download({
        //     url: url,
        //     filename: name,
        //     saveAs: true
        // });
        //Piket564: Some error with the window/ios downloader, do something with copy/paste

        copyTextToClipboard(infoArray[0] + infoArray[1])
        alert('Paste your download link in a browser.');


    } else {
        alert('Video Info\'s error!');
    }
}


//Piket564
//From https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension

function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to. 
    var copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur(). 
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}