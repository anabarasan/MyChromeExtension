/*
readcomiconline.li.js

right click on the page and select Download Images (readcomiconline.li) to download the images

If chrome prompts for save location for each image,
then you may have enabled the ask for each download option in settings.  
Go to Settings -> Downloads -> Ask where to save each file before downloading and toggle the button to disable
*/

function download_img_responsive_images() {
    let images = document.querySelectorAll('img[rel=noreferrer]');
    console.log("Number of Pages =>", images.length);
    for (let i = 0; i < images.length; i++) {
        let title = document.getElementsByTagName("title")[0].innerHTML.trim();
        title = title.substring(0, title.search('\n'));
        let invalidChars = '"\'/'
        for (var j=0; j < invalidChars.length; j++){
            title = title.replaceAll(invalidChars[j], "");
        }
        let url = images[i].src;
        let fileName = title + (i + 1).toString().padStart(4, 0) + ".jpg";
        let callback = function (newFileName) {
            console.log("CALLBACK: Downloading", newFileName);
        }
        let message = {
            type: 'download',
            url: url,
            fileName: fileName
        }
        console.log(`requesting download of ${fileName} from ${url}`)
        chrome.runtime.sendMessage(message, callback);
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
    if (message.download) {
        download_img_responsive_images();
    }
});