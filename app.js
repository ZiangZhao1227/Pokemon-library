//DOM Objects
const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");
const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

//constants and variables
const TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

let prevUrl = "null";
let nextUrl = "null";

//Functions

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function resetScreen() {
  mainScreen.classList.remove("hide");
  for (var i = 0; i < TYPES.length; i++) {
    mainScreen.classList.remove(TYPES[i]);
  }
}

async function pokemonList(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  const results = data["results"];
  const previous = data["previous"];
  const next = data["next"];
  prevUrl = previous;
  nextUrl = next;

  for (let index = 0; index < pokeListItems.length; index++) {
    const pokeListItem = pokeListItems[index];
    const resultData = results[index];

    if (resultData) {
      const name = resultData["name"];
      const url = resultData["url"];
      const urlArray = url.split("/");
      const id = urlArray[urlArray.length - 2];
      pokeListItem.textContent = id + ". " + capitalize(name);
    } else {
      pokeListItem.textContent = "unkown";
    }
  }
}

async function pokemon(id) {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await resp.json();

  resetScreen();

  pokeName.textContent = capitalize(data["name"]);
  pokeId.textContent = "#" + data["id"].toString().padStart(3, "0");
  pokeWeight.textContent = data["weight"];
  pokeHeight.textContent = data["height"];

  const dataTypes = data["types"];
  const dataFirstType = dataTypes[0];
  const dataSecondType = dataTypes[1];
  pokeTypeOne.textContent = capitalize(dataFirstType["type"]["name"]);

  if (dataSecondType) {
    pokeTypeTwo.textContent = capitalize(dataSecondType["type"]["name"]);
  } else {
    pokeTypeTwo.classList.add("hide");
  }
  mainScreen.classList.add(dataFirstType["type"]["name"]);

  pokeFrontImage.src = data["sprites"]["front_default"];
  pokeBackImage.src = data["sprites"]["back_default"];
}

function RightButtonClick() {
  if (nextUrl) {
    pokemonList(nextUrl);
  }
}

function LeftButtonClick() {
  if (prevUrl) {
    pokemonList(prevUrl);
  }
}

function ListItemClick(e) {
  if (!e.target) {
    return;
  }

  const listItem = e.target;
  if (!listItem.textContent) {
    return;
  }

  const textArray = listItem.textContent.split(".")[0];
  pokemon(textArray);
}

//fetch data from pokemon API for the left side of screen

//event listener
rightButton.addEventListener("click", RightButtonClick);

leftButton.addEventListener("click", LeftButtonClick);

pokeListItems.forEach((ListItem) => {
  ListItem.addEventListener("click", ListItemClick);
});

//initialize app
pokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
