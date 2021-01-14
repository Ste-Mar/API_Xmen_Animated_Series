const URL = "https://xmenapiheroku.herokuapp.com/api/characters";
const uris =
    "https://xmenapiheroku.herokuapp.com/api/characters?perPage=100";
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


const fetchCharactersCount = async (url = URL) => {
    try {
        const response = await fetch(url);
        const { info } = await response.json();
        let characterCount = info.count;
        document.getElementById("count").insertAdjacentHTML("beforeend", characterCount);
        document.getElementById("count-json").insertAdjacentHTML("beforeend", characterCount);

    } catch (err) {
        console.error(err);
    }
};


async function start() {
    fetchCharactersCount();
}


window.onload = start;