import { shortnameToImage,  } from 'emojione';
import {PipeTransform, Pipe} from "@angular/core";



@Pipe({
    name: 'emojione'
})
export class EmojiOnePipe implements PipeTransform {
    transform(value: string) {
        if (!value) {
            return value;
        }
        let converted = shortnameToImage(value);
        return converted;
    }
}
