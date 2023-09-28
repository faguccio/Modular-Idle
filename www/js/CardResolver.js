import * as utils from "./utils.js";
import * as Const from "./const.js";
// I made a mess with names. Basically the tickRecievedCallback simply run the function for
// all the elements of the list. But yeah it sucks with this kind of naming
export function generateCardsManager(elem) {
    return {
        name: elem.name,
        generateCardsCallback: () => {
            generateCards(elem);
        },
        tickRecivedCallback: () => {
            elem.elementList.map((element) => {
                elem.tickRecivedCallback(element);
            });
        },
        updateDisplayCallback: () => {
            elem.elementList.map((element) => {
                elem.updateDisplayCallback(element);
            });
        },
    };
}
function generateCards(elem) {
    const template = utils.getElement(elem.templateCardId);
    const container = utils.getElement(Const.screenId);
    elem.elementList.map((element) => {
        //@ts-ignore
        const clone = template.content.cloneNode(true);
        const cardNode = elem.createCardCallback(clone, element);
        container.appendChild(cardNode);
        const buttonContainer = utils.getElement(elem.buttonContainedId + ` ${element.id}`);
        generateButtons(buttonContainer, elem.buttonValues, (amountToBeBuyed) => {
            elem.buttonPayAndGetCallback(element, amountToBeBuyed);
        }, () => {
            elem.updateButtonDisplayCallback(element);
        });
    });
}
function generateButtons(buttonContainer, buttonValues, payAndGetCallback, updateButtonDisplayCallback) {
    buttonValues.map((val) => {
        const newbutton = document.createElement("button");
        buttonContainer.appendChild(newbutton);
        utils.addClasses(newbutton, [
            "bg-slate-100",
            "py-2",
            "px-3",
            "rounded-xl",
            "shadow-lg",
            "text-sm",
        ]);
        newbutton.textContent = val.toString();
        newbutton.addEventListener("click", (e) => {
            e.preventDefault();
            //if the button is available, it means that it's possible to pay (somebody made that check)
            payAndGetCallback(val);
            updateButtonDisplayCallback();
        });
    });
}
