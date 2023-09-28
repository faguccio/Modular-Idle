export class Element {
    constructor(data) { }
}
function validOrThrowError(x, msg) {
    if (x == null)
        throw new Error(`Error about ${x}, ${msg}`);
}
