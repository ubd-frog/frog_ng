import { shortnameToImage,  } from 'emojione';
import {PipeTransform, Pipe} from "@angular/core";



@Pipe({
    name: 'emojione'
})
export class EmojiOnePipe implements PipeTransform {
    transform(value: string) {
        let converted = shortnameToImage(value);
        return converted;
    }
}
