chrome.extension.onMessage.addListener(function(msg, _sender, sendResponse) {

    if (msg.action == 'download_video') {
        // Default parameters to grab video info
        let name = "";
        let url = "";
        let id = "";
        let metas = document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; i++) {
            //Piket564 idk but i think that this is unnecessary
            //
            // if (metas[i].getAttribute("name") == "twitter:player:stream") {
            //     console.log(metas[i].getAttribute("content"));
            //     url = (metas[i].getAttribute("content").split('?')[0]);
            // } else if (metas[i].getAttribute("property") == "og:title") {
            //     console.log(metas[i].getAttribute("content"));
            //     name = metas[i].getAttribute("content").split('?')[0];
            // }

            // Search og:url with file_id hoping that Panopto don't change that in the future
            if (metas[i].getAttribute('property') == 'og:url') {
                id = metas[i].getAttribute("content").split('?')[1].replace('id=', '');
                console.log('File ID: ' + id);
            }
        }


        // Piket_564 -> Url from Twitter Card and name = file_id
        name = id;
        // This download url is from Tw Card
        url = 'https://pro.panopto.com/Panopto/Podcast/Download/';


        // Split the name up (remove invalid characters in file names) && add file format
        name = name.split('/').join('_'); // Remove slashes
        name = name.split(' ').join('_'); // Remove spaces
        name = name.split(':').join('-'); // Remove colons
        name = name + ".mp4";
        // Some console.log to provide some basic debugging tool
        console.log('Name: ' + name);
        console.log('Direct download: ' + url + name);

        // Pack into array to send through callback function
        var infoArray = [url, name];

        // Callback function
        sendResponse(infoArray);

    }

});