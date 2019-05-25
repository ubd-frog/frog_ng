import { Pipe, PipeTransform } from '@angular/core';

import { Tag } from '../shared/models';


@Pipe({ name: 'tagArtistFilter' })
export class AritstTagPipe implements PipeTransform {
    transform(value: Tag[]) {
        return value.filter(x => !x.artist);
    }
}
