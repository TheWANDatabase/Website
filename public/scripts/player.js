var player = null;
var pr = false;

setTimeout(() => {
    player = new Plyr('#player', {
        ratio: '16:9'
    });
}, 200)