import { IItem } from '../shared/models';


export class UploadFile {
    public file: File;
    public files: Map<string, File>;
    public name: string;
    public size: number;
    public created: Date;
    public progress: number;
    public status: string;
    public unique: boolean;
    public data: IItem;
    public extension: string;
    public description: string;

    constructor(file: File) {
        this.files = new Map<string, File>();
        this.file = file;
        this.unique = true;
        this.name = file.name.slice(0, file.name.lastIndexOf('.'));
        this.size = file.size;
        this.created = new Date();
        this.extension = file.name.split('.').pop();
    }

    filename() {
        return this.name + '.' + this.extension;
    }

    append(file: File, key: string) {
        this.files[key] = file;
    }

    remove(key: string) {
        if (this.files.has(key)) {
            delete this.files[key];
        }
    }
}
