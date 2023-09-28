import {
  resourceData,
  populationData,
  storageData,
  facilityData,
} from "./data";

const resourceNames: string[] = [];
const workerTypes: string[] = [];
const storageNames: string[] = [];
const facilityNames: string[] = [];
const resourceProducedByFacilities: string[] = [];
const resourceStoredByStorage: string[] = [];
const workerTypeNamesRequired: string[] = [];

function addWorkerTypes() {
  populationData.map((pop) => {
    workerTypes.push(pop.name);
  });
}

function addResNames() {
  resourceData.map((res) => {
    resourceNames.push(res.name);
    if (!workerTypes.includes(res.workerType))
      throw new Error(
        `Worker type ${res.workerType} does not exists (required for ${res.name})`
      );
    workerTypeNamesRequired.push(res.workerType);
    res.cost.map((prim) => {
      if (!resourceNames.includes(prim.name))
        throw new Error(
          `Resource cost ${prim.name} is not a resource. Did you define it afetr defining ${res.name}?`
        );
    });
  });
}

function addStorageNames() {
  storageData.map((strg) => {
    storageNames.push(strg.name);
    if (strg.amount < 0) throw new Error(`${strg.name} has negative amount`);
    if (strg.capacity < 0)
      throw new Error(`${strg.name} has negative capacity ${strg.capacity}`);
    if (!resourceNames.includes(strg.target))
      throw new Error(`${strg.name} has negative no target`);

    resourceStoredByStorage.push(strg.target);
    strg.OTcost.map((cost) => {
      if (!resourceNames.includes(cost.name))
        throw new Error(`${strg.name}: no resource cost named ${cost.name}`);
      if (!workerTypes.includes(cost.workerRequirement.workerType))
        throw new Error(
          `${strg.name}: no worker type cost named ${cost.workerRequirement.workerType}`
        );
      workerTypeNamesRequired.push(cost.workerRequirement.workerType);
    });
  });
}

function addFacilityNames() {
  facilityData.map((fac) => {
    facilityNames.push(fac.name);
    if (fac.amount < 0) throw new Error(`${fac.name} has negative amount`);
    if (fac.capacity < 0)
      throw new Error(`${fac.name} has negative capacity ${fac.capacity}`);
    if (!resourceNames.includes(fac.target))
      throw new Error(`${fac.name} has negative no target`);

    resourceProducedByFacilities.push(fac.target);

    fac.OTcost.map((cost) => {
      if (!resourceNames.includes(cost.name))
        throw new Error(`${fac.name}: no resource cost named ${cost.name}`);
      if (!workerTypes.includes(cost.workerRequirement.workerType))
        throw new Error(
          `${fac.name}: no worker type cost named ${cost.workerRequirement.workerType}`
        );
      workerTypeNamesRequired.push(cost.workerRequirement.workerType);
    });
  });
}

function resourceHaveStorageAndFacility() {
  resourceNames.map((res) => {
    if (!resourceProducedByFacilities.includes(res))
      console.log(`\x1b[33m`, `Warning: ${res} is not produced by anyone`);
    if (!resourceStoredByStorage.includes(res))
      console.log(`\x1b[33m`, `Warning: ${res} is not stored by anyone`);
  });
}

function workerAreUseful() {
  workerTypes.map((worker) => {
    if (!workerTypeNamesRequired.includes(worker))
      console.log(`\x1b[33m`, `Warning: ${worker} will be forever unemplyed`);
  });
}

addWorkerTypes();
addResNames();
addStorageNames();
addFacilityNames();
resourceHaveStorageAndFacility();
console.log(`\x1b[32m`, "Check completed succesfully");
