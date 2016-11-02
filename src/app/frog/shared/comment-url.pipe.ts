import { Pipe, PipeTransform } from '@angular/core';


const RE_URL = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

@Pipe({
    name: 'commentUrl'
})
export class CommentURLPipe implements PipeTransform {
    transform(value: string) {
        let matches = value.match(RE_URL) || [];
        matches.forEach(link => {
            let a = `<a href="${link}" target="_blank" rel="noopener">${link}</a>`;
            value = value.replace(link, a);
        });

        return value;
    }
}