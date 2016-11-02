import { Pipe, PipeTransform } from '@angular/core';

import { Tag } from './models';

@Pipe({name: 'tagArtistFilter'})
export class TagArtistFilterPipe implements PipeTransform{
    transform(value: Tag[]) {
        return value.filter(x => !x.artist);
    }
}