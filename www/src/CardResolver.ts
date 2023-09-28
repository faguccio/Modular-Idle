import { GeneralElement } from "./interfaces.js";
import * as utils from "./utils.js";
import * as Const from "./const.js";

/* 
Each screen has cards. 
    - Those cards can be created (as a router function)   
    - Cards can recieve the clock signal
    - Their display can be updated

In this module I get all the needed callback from different type of cards just
    to produce a CardManager which has a name (important to be chosen based on the screen) 
    and a 3 callbacks. 

This way all the GeneralElements must expone ElementRequiredInfo and must agree with
    how the 3 callbacks are generated. Some code is saved across but I don't know
    if I am generalizing or overcomplicating. The buttonPayAndGetCallback and buttonPayAndGetCallback are
    used to manage the buttons. The tickRecivedCallback manages the underling state and updateDisplayCallback
    changes the DOM. I have updateButtonDisplayCallback so that it's real time and not just when a display
    refresh happen
*/

export interface CardManager {
  name: string;
  generateCardsCallback: () => void;
  tickRecivedCallback: () => void;
  updateDisplayCallback: () => void;
}

interface ElementRequiredInfo {
  name: string;
  buttonValues: number[];
  elementList: GeneralElement[];
  templateCardId: string;
  buttonContainedId: string;
  createCardCallback: (
    templateFragment: any,
    params: GeneralElement
  ) => HTMLElement;
  tickRecivedCallback: (el: GeneralElement) => void;
  updateDisplayCallback: (el: GeneralElement) => void;
  buttonPayAndGetCallback: (el: GeneralElement, purchraseSize: number) => void;
  updateButtonDisplayCallback: (el: GeneralElement) => void;
}

// I made a mess with names. Basically the tickRecievedCallback simply run the function for
// all the elements of the list. But yeah it sucks with this kind of naming
export function generateCardsManager(elem: ElementRequiredInfo): CardManager {
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

function generateCards(elem: ElementRequiredInfo): void {
  const template = utils.getElement(elem.templateCardId);
  const container = utils.getElement(Const.screenId);

  elem.elementList.map((element) => {
    //@ts-ignore
    const clone = template.content.cloneNode(true);
    const cardNode = elem.createCardCallback(clone, element);
    container.appendChild(cardNode);

    const buttonContainer = utils.getElement(
      elem.buttonContainedId + ` ${element.id}`
    );
    generateButtons(
      buttonContainer,
      elem.buttonValues,
      (amountToBeBuyed: number) => {
        elem.buttonPayAndGetCallback(element, amountToBeBuyed);
      },
      () => {
        elem.updateButtonDisplayCallback(element);
      }
    );
  });
}

function generateButtons(
  buttonContainer: HTMLElement,
  buttonValues: number[],
  payAndGetCallback: (purchraseSize: number) => void,
  updateButtonDisplayCallback: () => void
) {
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
