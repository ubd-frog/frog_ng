import { IItem } from "../shared/models";

export class UploadFile{
    public file: File;
    public name: string;
    public size: number;
    public created: Date;
    public progress: number = 0;
    public status: string;
    public unique: boolean = true;
    public data: IItem;
    public extension: string;

    constructor(file: File) {
        this.file = file;
        this.name = file.name.slice(0, file.name.lastIndexOf('.'));
        this.size = file.size;
        this.created = new Date();
        this.extension = file.name.split('.').pop();
    }

    filename() {
        return this.name + '.' + this.extension;
    }
}
