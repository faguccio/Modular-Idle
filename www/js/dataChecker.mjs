import { resourceData, populationData } from "./data.mts";
const resourceNames = [];
const workerTypes = [];
function addWorkerTypes() {
    populationData.map((pop) => {
        workerTypes.push(pop.name);
    });
}
function addResNames() {
    resourceData.map((res) => {
        resourceNames.push(res.name);
        if (!workerTypes.includes(res.workerType))
            throw new Error(`Worker type ${res.workerType} does not exists (required for ${res.name})`);
        res.cost.map((prim) => {
            if (!resourceNames.includes(prim.name))
                throw new Error(`Resource cost ${prim.name} is not a resource. Did you define it afetr defining ${res.name}?`);
        });
    });
}
addWorkerTypes();
addResNames();
console.log(`\x1b[32m`, "Check completed succesfully");
