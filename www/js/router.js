import { globals, cardManagers } from "./index.js";
import * as Const from "./const.js";
import * as utils from "./utils.js";
const screens = [
    {
        buttonId: Const.navButtonId.resource,
        name: Const.RESOURCE_NAME,
    },
    {
        buttonId: Const.navButtonId.storage,
        name: Const.STORAGE_NAME,
    },
    {
        buttonId: Const.navButtonId.production,
        name: Const.FACILITIES_NAME,
    },
    {
        buttonId: Const.navButtonId.population,
        name: Const.POPULATION_NAME,
    },
];
const stringClasses = "rounded-xl p-2";
const activeColor = ["bg-orange-300"];
const inactiveColor = ["bg-blue-200"];
function createNavButton(screen) {
    //create a button on the navbar
    const navButton = document.createElement("button");
    navButton.textContent = screen.name;
    navButton.className = stringClasses;
    navButton.id = screen.buttonId;
    navButton.addEventListener("click", (e) => {
        e.preventDefault();
        switchScreen(screen.buttonId);
    });
    return navButton;
}
function createNavbar() {
    const navbar = utils.getElement("navbar");
    screens.map((screen) => {
        const button = createNavButton(screen);
        navbar.appendChild(button);
    });
}
export function navbarSetup() {
    createNavbar();
    colorNavbarButtons();
    populateScreen();
}
export function populateScreen() {
    const screen = globals.currentScreen;
    const currentManager = cardManagers.filter((manager) => manager.name === globals.currentScreen)[0];
    currentManager.generateCardsCallback();
    currentManager.updateDisplayCallback();
}
function switchScreen(buttonId) {
    let oldScreen = globals.currentScreen;
    let newScreen = screens.filter((screen) => {
        return screen.buttonId === buttonId;
    })[0];
    //I won't redraw the all DOM if you click on the active navbutton
    if (oldScreen === newScreen.name)
        return;
    globals.currentScreen = newScreen.name;
    clearContainer(oldScreen);
    colorNavbarButtons();
    populateScreen();
    console.log(globals.currentScreen);
}
function colorNavbarButtons() {
    screens.map((screen) => {
        const node = utils.getElement(screen.buttonId);
        utils.removeClasses(node, activeColor);
        if (screen.name === globals.currentScreen) {
            utils.addClasses(node, activeColor);
        }
        else {
            utils.addClasses(node, inactiveColor);
        }
    });
}
function clearContainer(screen) {
    const node = utils.getElement("screen");
    node.innerHTML = "";
}
