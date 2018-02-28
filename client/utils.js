// @flow

export function nestedIndexBy(arr: Array<Object>, fields: Array<string>) {
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        let currentLevel = map;
        for (let j = 0; j < fields.length - 1; j++) {
            const field = fields[j];
            if (!currentLevel[field]) {
                currentLevel[field] = {};
            }
            currentLevel = currentLevel[field];
        }
        currentLevel[fields[fields.length - 1]] = arr[i];
    }
    return map;
}

export function delimIndexBy<T:Object>(
    arr: Array<T>,
    fields: Array<string>,
    delim: string = ':'
): {[string]: T} {
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        let key = elem[fields[0]];
        for (let j = 1; j < fields.length; j++) {
            const field = fields[j];
            key += delim + elem[field];
        }
        map[key] = arr[i];
    }
    return map;
}
