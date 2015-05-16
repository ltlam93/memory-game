var tiles = new Array(),
    flips = new Array('tb', 'bt', 'lr', 'rl'),
    counter = new Counter();
    sFlippedTile = 0 ,
    iTimer = 0,
    iScore = 0,
    iInterval = 100,
    iPeekTime = 3000,
    iFlippedTile = null, 
    iTileBeingFlippedId = null,
    tileAllocation = null;
    
$(document).ready(function () { //Chuong trinh da san sang
    document.getElementById('audioEngine').play();
    
    initTiles();
    initPeek();
});

function initState() {

    /* Reset the tile */
    tileAllocation = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

    while (tiles.length > 0) {
        tiles.pop();
    }

    $('#board').empty();
    iTimer = 0;

}

function initTiles() {

    var currentTile = null;

    initState();

    // Randomly create twenty tiles and render to board
    for (var i = 0; i < 20; i++) {

        currentTile = createTile(i);

        $('#board').append(currentTile.getHTML());

        tiles.push(currentTile);
    }
}


function getRandomImageForTile() {

    var iRandomImage = Math.floor((Math.random() * tileAllocation.length)),//0-9
        iMaxImageUse = 2;

    while (tileAllocation[iRandomImage] >= iMaxImageUse) {

        iRandomImage++;

        if (iRandomImage >= tileAllocation.length) {

            iRandomImage = 0;
        }
    }

    return iRandomImage;
}

function createTile(i) {

    var currentTile = new tile("tile" + i),
        iRandomImage = getRandomImageForTile();

    tileAllocation[iRandomImage]++;
    console.log('----------------------');
    console.log(tileAllocation,iRandomImage)

    currentTile.setFrontColor("tileColor" + Math.floor((Math.random() * 5) + 1));//1-5
    currentTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));  //500-2500
    currentTile.setFlipMethod(flips[Math.floor(Math.random() * 4)]);  //0-3
    currentTile.setBackContentImage("images/" + (iRandomImage + 1) + ".jpg");

    return currentTile;
}

function initPeek(){
    setTimeout(function () {
        revealTiles(function () {
            onPeekStart();
        });
    }, iInterval);
}

function revealTiles(callback) {

    var bTileNotFlipped = false;

    for (var i = 0; i < tiles.length; i++) {

        if (tiles[i].getFlipped() === false) {

            if (iTimer > tiles[i].getStartAt()) {
                tiles[i].flip();
            }
            else {
                bTileNotFlipped = true;
            }
        }
    }

    iTimer = iTimer + iInterval;

    if (bTileNotFlipped === true) {
        setTimeout(function () {
            revealTiles(callback);
        }, iInterval);
    } else {
        callback();
    }
}

function onPeekStart() {
    setTimeout(function () {
        hideTiles(function () {
            onPeekComplete();
        });
    }, iPeekTime);
}

function hideTiles(callback) {

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].revertFlip();
    }
    callback();
}

function onPeekComplete() {
    document.getElementById('audioEngine').pause();
    console.log("starting...")
    counter.start();

    $('div.tile').click(function () {

        iTileBeingFlippedId = this.id.substring("tile".length);

        if (tiles[iTileBeingFlippedId].getFlipped() === false) {

            tiles[iTileBeingFlippedId].addFlipCompleteCallback(function () {
                checkMatch();
            });
            tiles[iTileBeingFlippedId].flip();            
        }
    });
}

function checkMatch() {

    if (iFlippedTile === null) {

        iFlippedTile = iTileBeingFlippedId;

    } else {

        if (tiles[iFlippedTile].getBackContentImage() !== tiles[iTileBeingFlippedId].getBackContentImage()) {

            var x = tiles[iFlippedTile], y = tiles[iTileBeingFlippedId];

            setTimeout(function () {
                x.revertFlip();
            }, 2000);

            setTimeout(function () {
                y.revertFlip();
            }, 2000);

            playAudio("mp3/no.mp3");

        } else {
            playAudio("mp3/applause.mp3");
            sFlippedTile++;
            
            if (sFlippedTile === (tiles.length / 2)) {
                console.log("stopping...");
                counter.stop();
                popup();
            }
        }

        iFlippedTile = null;
        iTileBeingFlippedId = null;
    }
}

function popup() {

    // get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // calculate the values for center alignment
    var dialogTop = (maskHeight / 3) - ($('#dialog-me').height());
    var dialogLeft = (maskWidth / 2) - ($('#dialog-me').width() / 2);

    // assign values to the overlay and dialog box
    $('#overlay').css({height: maskHeight, width: maskWidth}).show();
    $('#dialog-me').css({top: dialogTop, left: dialogLeft});

    //show clip effect
    $('#dialog-me').show('clip', {}, 1000);

    $('#score').val(iScore);

    $('#play').click(function () {
        $('#overlay').hide();
        $('#dialog-me').hide();
        reset();
        start();
    })
}

function reset(){    
        sFlippedTile = 0;
        iScore= 0;
        $('#iScore').html(iScore);
}


function Counter() {
    var iCounter;

    this.start = function () {
        clearInterval(iCounter);
        iCounter = setInterval(function () {
            iScore++;
            $('#iScore').html(iScore);
        }, 1000);
    }

    this.stop = function () {
        clearInterval(iCounter);
    }
}

function playAudio(sAudio) {

    var audioElement = document.getElementById('audioEngine');

    if (audioElement !== null) {

        audioElement.src = sAudio;
        audioElement.play();
    }
}