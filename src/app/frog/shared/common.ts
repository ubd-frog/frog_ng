import {Response} from "@angular/http";

export function extractValues(res: Response) {
  let body = res.json();
  return body.values || [];
}

export function extractValue(res: Response) {
  let body = res.json();
  return body.value || null;
}

export function extractData(res: Response) {
  let body = res.json();
  return body || null;
}

export function isInt(value: any) {
    if (typeof value === 'number') {
        return true;
    }
    return parseFloat(value) % 1 === 0 && value.indexOf('.') === -1 && value.match(/[A-Za-z]+/ig) === null;
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}
