export class UploadFile{
    public file: File;
    public name: string;
    public size: number;
    public created: Date;
    public progress: number = 0;
    public status: string;
    public unique: boolean = true;

    constructor(file: File) {
        this.file = file;
        this.name = file.name;
        this.size = file.size;
        this.created = new Date();
    }
}