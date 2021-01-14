let speakerState = 0;


const Volume = (id) => {


    if (speakerState % 2 == 0) {
        document.getElementById(id).className = "speaker fas fa-volume-up";
        document.getElementById("play").play();
        document.getElementById("play").muted = false;
        speakerState++;

    } else {
        document.getElementById(id).className = "speaker fas fa-volume-mute";
        document.getElementById("play").muted = true;
        speakerState++;
    }
}