/*
zipcomic.com.js

* Open the comic page in zipcomic.com
* Cancel the Download Images popup
* Select reading mode as All Pages
* Select Ok in popup
* If you want custom starting sequence number for image enter the start number else leave blank
* Select ok

images will be downloaded to the defaut download location.

If chrome prompts for save location for each image,
then you may have enabled the ask for each download option in settings.  
Go to Settings -> Downloads -> Ask where to save each file before downloading and toggle the button to disable
*/

function download_img_responsive_images(start_sequence_number) {
    let images = document.getElementsByClassName('img-responsive');
    console.log(images.length);
    alert("Waiting!")
    for (let i = 0; i < images.length; i++) {
        let title = document.getElementsByTagName("title")[0].innerHTML;
        let url = images[i].src;
        let sequence_number = (start_sequence_number == undefined) ? (i + 1) : (start_sequence_number + i);
        let fileName = title + (sequence_number).toString().padStart(4, 0);
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

function main() {
    var r = confirm("Download Images?");

    if (r == true) {
        let user_start_seq_num = prompt("Enter Starting Sequence Number:")

        if (user_start_seq_num.trim().length == 0) {
            user_start_seq_num = "0";
        }

        let start_num = parseInt(user_start_seq_num);

        if (isNaN(start_num)) {
            alert("Invalid Starting Sequence Number.");
        } else {
            download_img_responsive_images(start_num);
        }
    }
}

main()