var player = null;
var pr = false;

var playerType = 0;

// Run check on which player is loaded (stream or YT)
setTimeout(() => {
    let x = document.getElementById('videoplayeryoutube');
    if (x) {
        playerType = 0
    } else {
        x = document.getElementById('videoplayerstream');
        if (x) {
            console.log("Loading Stream Player")
            playerType = 1
            
            // player = Stream(x);
            // player.addEventListener('play', () => {
            //     console.log('playing!');
            // });

        }
    }
}, 200)


// function onYouTubeIframeAPIReady() {
//     pr = true;
//     setTimeout(() => {
//         try {
//             console.log("YouTube Player is Ready");
//             let id = window.location.href.split('/').pop();
//             console.log("Loading YouTube video with ID", id);

//             player = new YT.Player('videoplayerviewportsector');
//         } catch (e) {
//             console.log(e);
//         }
//     }, 200)
// }