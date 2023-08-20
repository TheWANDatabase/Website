var player;
var pr = false;

function onYouTubeIframeAPIReady() {
    pr = true;
    setTimeout(() => {
        try {
            console.log("YouTube Player is Ready");
            let id = window.location.href.split('/').pop();
            console.log("Loading YouTube video with ID", id);

            player = new YT.Player('videoplayerviewportsector');
        } catch (e) {
            console.log(e);
        }
    })
}