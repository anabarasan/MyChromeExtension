/*
readcomiconline.li.js

* Open the comic page in readcomiconline.li
* Cancel the Download Images popup
* Select reading Type as All Pages
* Select Ok in popup

images will be downloaded to the defaut download location.

If chrome prompts for save location for each image,
then you may have enabled the ask for each download option in settings.  
Go to Settings -> Downloads -> Ask where to save each file before downloading and toggle the button to disable
*/

function download_img_responsive_images() {
    let images = document.querySelectorAll('img');
    console.log("Number of Pages =>", images.length - 2);
    // do not consider the first and last item in the images list.
    // remove the first item which is the page banner
    // remove the last item which is the footer banner
    for (var i = 1; i < (images.length-1); i++) {
        let title = document.getElementsByTagName("title")[0].innerHTML.trim();
        title = title.substring(0, title.search('ReadAllComics')-2).trim();
        let invalidChars = '"\'/'
        for (var j=0; j < invalidChars.length; j++){
            title = title.replaceAll(invalidChars[j], "");
        }
        let url = images[i].src;
        let fileName = title + "-" + (i + 1).toString().padStart(4, 0) + ".jpg";
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
    console.log("readallcomics reciever");
    if (message.download) {
        download_img_responsive_images();
    }
});