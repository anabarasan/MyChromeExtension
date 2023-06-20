chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "skip_twitter_redirect",
        title: "Skip Twitter Redirect",
        type: 'normal',
        contexts: ['link'],
    });
});

chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "readcomiconline_li_downloader",
        title: "Download Images",
        type: 'normal',
        contexts: ['page'],
        documentUrlPatterns: [
            "https://readcomiconline.li/Comic/*"
        ]
    });
});

chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "readallcomics_com_downloader",
        title: "Download Images",
        type: 'normal',
        contexts: ['page'],
        documentUrlPatterns: [
            "https://readallcomics.com/*"
        ]
    });
});

contextMenuListeners = {
    'skip_twitter_redirect': skip_twitter_redirect,
    'readcomiconline_li_downloader': initiate_downloader,
    'readallcomics_com_downloader': initiate_downloader,
}

chrome.contextMenus.onClicked.addListener((onClickData, tab) => {
    func_to_call = contextMenuListeners[onClickData.menuItemId];
    func_to_call(onClickData, tab);
});

function skip_twitter_redirect(item, tab) {
    // twitter redirect seems to be broken sometimes.
    // this function is go to proper tweet url from the mail.
    console.debug("Skip Twitter Redirect");
    let url = new URL(decodeURIComponent(item.linkUrl));
    let tweet_url = url.search.substring(5);  // remove `?url=` from the search string
    chrome.tabs.create({ url: tweet_url, index: tab.index + 1, active: false });
}

function send_msg_to_active_tab(message, callback) {
    var query = { active: true, currentWindow: true };
    function query_callback(tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        console.log(currentTab); // also has properties like currentTab.id
        chrome.tabs.sendMesage(currentTab.id, message, callback);
    }
    chrome.tabs.query(query, query_callback);
}

function initiate_downloader(onClickData, tab) {
    console.log("initiate downloader")
    console.log(tab);
    chrome.tabs.sendMessage(
        tab.id,
        {'download': true}
    )
}

function onDownloadStart(id) {
    console.log(`Started downloading: ${id}`);
}

function onDownloadFailed(id) {
    console.error(`Download failed: ${id}`);
}

function onDownloadError(error) {
    console.error("ERROR:", error);
}

function downloader(message, callback) {
    console.debug("downloader:", message.fileName);
    console.debug("downloader:", message);

    let downloadOptions = {
        conflictAction: 'uniquify',
        filename: message.fileName,
        saveAs: false,
        url: message.url
    }

    let downloading = chrome.downloads.download(downloadOptions).then(() => {
        if (callback) {
            callback(message.fileName)
        }
    });

    downloading.then(onDownloadStart, onDownloadFailed);

    downloading.catch(onDownloadError);

    return true;
}

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
    if (message.type == "download") {
        return downloader(message, senderResponse);
    }
    console.log("Unknown message type:", message.type);
});