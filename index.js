
const URL = "https://xmenapiheroku.herokuapp.com/api/characters";
const uris =
    "https://xmenapiheroku.herokuapp.com/api/characters?perPage=100";


let characters = [];
let filterCharacters = [];
let speakerState = 0;
let allCharacters = {};
let searchBox = [];


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




const fetchCharacters = async (url = URL) => {
    try {
        const response = await fetch(url);
        const { results: characters } = await response.json();
        return characters;
    } catch (err) {
        console.error(err);
    }
};




const fetchAllCharacters = async (url = uris) => {
    try {
        const response = await fetch(url);
        const { results: allCharacters } = await response.json();
        return allCharacters;
    } catch (err) {
        console.error(err);
    }
};


const searchBoxLabels = () => {
    for (let character of allCharacters) {
        character.name !== "" ?
            searchBox.push(character.name)
            : null;
        character.alias === "" || character.alias === character.name ?
            null
            : searchBox.push(character.alias);
    }
    return searchBox
};



const searchCharacter = () => {




    let message = document.getElementById("message");
    let { value: name } = document.getElementById("input");
    let mensaje = `<div  id="noCharacter"> <span style="color:red"> ${name}</span> is non-existent</div> `;
    filterCharacters = allCharacters.filter((character) => (character.alias.toLowerCase().includes(name.toLowerCase()) || character.name.toLowerCase().includes(name.toLowerCase())));
    filterCharacters.length > 0 ? null : (clearNode(), message.insertAdjacentHTML("beforeend", mensaje));
    iterateCharacters(filterCharacters);
}

const sendURL = async (page) => {
    let newURL = `${URL}?page=${page}`;
    try {
        clearNode();
        const response = await fetch(newURL);
        const { results: characters } = await response.json();
        iterateCharacters(characters);
        return characters;
    } catch (err) {
        console.error(err);
    }
};

const activeClass = (id) => {
    let formerActive = document.getElementsByClassName("active")[0];
    formerActive.classList.remove("active");
    let newActive = document.getElementById(id);
    newActive.classList.add("active");
    defaultBtn();
}

const next = () => {
    let activePageNumber = parseInt(document.getElementsByClassName("active")[0].id.match(/\d+/)[0])
    let nextPageId = `btn-${activePageNumber + 1}`;
    sendURL(`${activePageNumber + 1}`);
    activeClass(nextPageId);
    defaultBtn();

}

const prev = () => {
    let activePageNumber = parseInt(document.getElementsByClassName("active")[0].id.match(/\d+/)[0])
    let nextPageId = `btn-${activePageNumber - 1}`;
    sendURL(`${activePageNumber - 1}`);
    activeClass(nextPageId);
    defaultBtn();

}

const defaultBtn = () => {
    let prevBtn = document.getElementById("btn-prev");
    let btnPage1 = document.getElementById("btn-1");
    let btnPage2 = document.getElementById("btn-2");
    let nextBtn = document.getElementById("btn-next");
    nextBtn.style.display = "";
    btnPage1.classList.contains("active") ? prevBtn.style.display = "none" : prevBtn.style.display = "";
    btnPage2.classList.contains("active") ? nextBtn.style.display = "none" : nextBtn.style.display = "";

}
const visiblePagination = () => {
    let input = document.getElementById("input");
    let btnPage2 = document.getElementById("btn-2");
    let nextBtn = document.getElementById("btn-next");
    let prevBtn = document.getElementById("btn-prev");
    input.value != "" ?
        (btnPage2.style.display = "none", nextBtn.style.display = "none", prevBtn.style.display = "none")
        : (btnPage2.style.display = "block", nextBtn.style.display = "block", prevBtn.style.display = "block", defaultBtn());

}
const emptySearch = () => {
    let input = document.getElementById("input");
    let btnPage2 = document.getElementById("btn-2");
    let nextBtn = document.getElementById("btn-next");
    let prevBtn = document.getElementById("btn-prev");
    input.value == "" ?
        (btnPage2.style.display = "initial",
            nextBtn.removeAttribute('disabled'),
            prevBtn.removeAttribute('disabled'),
            sendURL("1"))
        : null;
}


const searching = () => {
    clearMessage();
    searchCharacter();
    visiblePagination();
    emptySearch();
}


const clearNode = () => {
    let card = document.getElementById('apiR');
    card.innerHTML = '';
}

const clearMessage = () => {
    let message = document.getElementById('message');
    message.innerHTML = '';
}


const createNode = ({ id, img, name, alias, powers }) => {

    if (filterCharacters[0] === undefined) {

        const filterOnePower = (Math.floor(Math.random() * powers.length));

        let onePower;

        if (typeof (powers) !== "string") {
            onePower = ` ${powers[filterOnePower]} `
        } else if ((powers) === "") {
            onePower = "None"
        } else {
            onePower = `${powers} `

        };

        const node = `
      
        <div class="col-md-6 col-12 mt-2 center-col-character" id="${id}">
            <div class="back-character mt-2 mb-2">
                 <div class="row" >
                    <div class="col-md-6 col-12 character">
                        <img style="width:100%" src="${img}" />
                    </div>
                  
                    <div class="col-md-6 col-12 description">
                        <h2 class="title_character">${alias === "" ? name : alias}</h2> 
                        <h4 class="name_character"> <u style="font-size:22px">Name:<br>
                        </u> ${alias === "" || alias === name ? "Same as alias" : name}   </h4> 
                        <div class="powers">
                            <p><u class="title-powers"> Power/ability</u>: <br> <span style="font-size:18px">${onePower}</span>  <p> 
                        </div >
                    </div> 
                </div> 
            </div >
        </div >
        `;
        document.getElementById("apiR").insertAdjacentHTML("beforeend", node);

    } else {

        document.getElementById("apiR").innerHTML = " ";

        const filterOnePower = (Math.floor(Math.random() * powers.length));

        if (typeof (powers) !== "string") {
            const onePower = ` ${powers[filterOnePower]} `
        } else if ((powers) === "string") {
            const onePower = `${powers} `
        } else if (powers === undefined) {
            const onePower = "None"
        }



        if (typeof (powers) !== "string") {
            onePower = ` ${powers[filterOnePower]} `
        } else if ((powers) === "") {
            onePower = "None"
        } else {
            onePower = `${powers} `

        };

        const node = `
      
        <div class="col-md-6 col-12 mt-2 center-col-character" id="${id}">
            <div class="back-character mt-2 mb-2">
                 <div class="row" >
                    <div class="col-md-6 col-12 character">
                        <img style="width:100%" src="${img}"/>
                    </div>
                  
                    <div class="col-md-6 col-12 description">
                        <h2 class="title_character">${alias === "" ? name : alias}</h2> 
                        <h4 class="name_character"> <u style="font-size:22px">Name:<br>
                        </u> ${alias === "" || alias === name ? "Same as alias" : name}   </h4> 
                        <div class="powers">
                            <p><u class="title-powers"> Power/ability</u>: <br> <span style="font-size:18px">${onePower}</span>  <p> 
                        </div >
                    </div> 
                </div> 
            </div >
        </div >
        `;
        document.getElementById("apiR").insertAdjacentHTML("beforeend", node);
        filterCharacters = [];

    }



};




const iterateCharacters = (arrayCharacters) => {
    if (arrayCharacters[0] != undefined) {
        arrayCharacters.map((characters) => createNode(characters));
    } else {

        document.getElementById("apiR").innerHTML = " ";

    }
}




const clearInput = () => {
    Array.prototype.forEach.call(document.querySelectorAll('.clearable-input'), function (el) {
        let input = el.querySelector('input');

        conditionallyHideClearIcon();
        input.addEventListener('input', conditionallyHideClearIcon);
        el.querySelector('[data-clear-input]').addEventListener('click', function (e) {
            input.value = '';
            conditionallyHideClearIcon();
            searching();

        });

        function conditionallyHideClearIcon(e) {
            let target = (e && e.target) || input;
            target.nextElementSibling.style.display = target.value ? 'block' : 'none';
        }
    });
};

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item contains some of the letters as the text field value:*/
            if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                //          if (arr[i].toLowerCase().includes(val.toLowerCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                let input = arr[i].match(RegExp(val, "i"))[0].toString();
                let name = arr[i].match(RegExp(val, "i")).input.toString();
                let result = name.replace(input, `<strong>${input}</strong>`)
                b.innerHTML = result;
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    filterCharacters = allCharacters.filter((character => character.alias.includes(document.getElementById("input").value) || character.name.includes(document.getElementById("input").value)));
                    searching();
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);

            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);

    });
}




async function start() {
    characters = await fetchCharacters();
    iterateCharacters(characters);


    allCharacters = await fetchAllCharacters();
    searchBox = searchBoxLabels();
    defaultBtn();
    autocomplete(document.getElementById("input"), searchBox);
    clearInput();
    document.getElementById("input").addEventListener("input", () => {
        searching();
    });
    document.getElementById("btn-1").addEventListener("click", () => {
        sendURL("1");
        activeClass("btn-1");
    });
    document.getElementById("btn-2").addEventListener("click", () => {
        sendURL("2");
        activeClass("btn-2");
    });
    document.getElementById("btn-next").addEventListener("click", () => {
        next();
    });
    document.getElementById("btn-prev").addEventListener("click", () => {
        prev();
    });
    document.getElementById("input").addEventListener("keydown", () => {
        clearMessage();
    });




}


window.onload = start;