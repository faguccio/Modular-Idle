import { globals } from "./index.js";
import * as utils from "./utils.js";
import * as Const from "./const.js";
import { updateDisplay, modifyWorkers, workersWidgetUpdate, } from "./ResourceBuilder.js";
const workerButtons = ["-100", "-10", "-1", "1", "10", "100"];
const container = utils.getElement(Const.screenId);
export function generateResourceCards(resList) {
    const screen = globals.currentScreen;
    const template = utils.getElement("resource-card-template");
    resList.map((res) => {
        //@ts-ignore
        const clone = template.content.cloneNode(true);
        clone.getElementById(`title`).textContent = res.name;
        clone.getElementById(`amount`).id = `amount ${res.id}`;
        clone.getElementById(`max-amount`).textContent = res.maxAmount;
        clone.getElementById(`max-amount`).id = `max-amount ${res.id}`;
        clone.getElementById(`rate`).id = `rate ${res.id}`;
        clone.getElementById(`bar`).style["width"] =
            (res.amount * 100) / res.maxAmount;
        const buttonContainer = clone.getElementById(`workers-button-container`);
        workerButtons.map((wbutton) => {
            const newbutton = document.createElement("button");
            buttonContainer.appendChild(newbutton);
            //newbutton.setAttribute("disabled", true);
            utils.addClasses(newbutton, [
                "bg-slate-100",
                "p-2",
                "rounded-xl",
                "shadow-lg",
            ]);
            newbutton.textContent = wbutton;
            newbutton.addEventListener("click", (e) => {
                e.preventDefault();
                modifyWorkers(res, wbutton);
                workersWidgetUpdate(res);
            });
        });
        buttonContainer.id = `workers-button-container ${res.id}`;
        clone.getElementById("workers-amount").textContent = res.workersAmount;
        clone.getElementById("workers-amount").id = `workers-amount ${res.id}`;
        clone.getElementById(`bar`).id = `bar ${res.id}`;
        container.appendChild(clone);
        updateDisplay(res);
        workersWidgetUpdate(res);
    });
}
export function generatePlaceHolder() {
    const screen = globals.currentScreen;
    const div = document.createElement("div");
    div.textContent = screen;
    container.appendChild(div);
}
export function generatePopulationManager() {
    const screen = globals.currentScreen;
    const template = document.getElementById("population-manager-template");
    //@ts-ignore
    const clone = template.content.cloneNode(true);
    //clone.getElementById("simple-worker").textContent =
    //  globals.workers.simpleWorkers;
    container.appendChild(clone);
}
