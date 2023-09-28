import { gameData } from "./interfaces.js";
import { navbarSetup } from "./router.js";
import * as Const from "./const.js";
import * as ResourceKit from "./ResourceBuilder.js";
import * as PopulationKit from "./PopulationBuilder.js";
import { CardManager } from "./CardResolver.js";

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

export const globals: gameData = {
  currentScreen: "error",
  resourceList: [],
  populationList: [],
};

export const cardManagers: CardManager[] = [];

function onDeviceReady() {
  // @ts-ignore
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  ResourceKit.generateResources();
  cardManagers.push(ResourceKit.produceResourceCardManager());
  PopulationKit.generatePopulations();
  cardManagers.push(PopulationKit.producePopulationCardManager());

  globals.currentScreen = Const.POPULATION_NAME;

  navbarSetup();
  setInterval(clockTick, 1000);
  console.log(globals);
}

function clockTick() {
  cardManagers.map((manager) => {
    manager.tickRecivedCallback();
  });
  cardManagers
    .filter((manager) => manager.name === globals.currentScreen)[0]
    .updateDisplayCallback();
}
