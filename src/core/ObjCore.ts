///Рекурсивная ф-я устновки значения поля объекта по указанному пути
export const getObject = (obj: any, path: string, value: any): any => {
    let temp = path.match(/[^.]+/g);
    if (!temp)
        return value;
    let prop = temp.reverse().pop();
    let reg;
    if (prop) {
        reg = prop.match(/\[([\d\w]+)\]/);
        if (reg) {
            let index = reg[1];
            let propWInd = prop.replace(reg[0], '');
            obj[propWInd][index] = getObject(obj[propWInd][index] || {}, temp.reverse().join('.'), value);
        } else {
            obj[prop] = getObject(obj[prop] || {}, temp.reverse().join('.'), value);
        }
    }
    return obj;
}

export const hasVal = (id: string): string | undefined => {
    let trimmedId = (id || '').trim().toLowerCase();
    let empt: any = {};
    let arr = (window.location.hash || '').replace('#', '').split('&').map(x => {
        if (!x)
            return;
        let temp = x.split('=');
        return { id: temp[0], val: temp[1] };
    });
    if (!arr)
        return undefined;

    let tempVal = (arr.filter(x => x && (x.id || '').toLowerCase() === trimmedId)[0] || empt).val;
    if (tempVal)
        return decodeURI(tempVal);
    return tempVal;
}