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
