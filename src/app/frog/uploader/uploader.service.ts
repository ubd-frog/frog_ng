import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IItem, User, Tag } from '../shared/models';
import { UploadFile } from './models';
import { WorksService } from '../works/works.service';

@Injectable()
export class UploaderService {
    public requested: Subject<boolean>;
    public fileList: ReplaySubject<UploadFile[]>;
    private file: UploadFile;
    private files: UploadFile[];
    private items: IItem[];

    constructor(private http: Http, private service: WorksService) {
        this.requested = new Subject<boolean>();
        this.fileList = new ReplaySubject<UploadFile[]>(1);
        this.items = [];
    }
    show() {
        this.requested.next(true);
    }
    isUnique(name: string) {
        let url = '/frog/isunique';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('path', name);
        return this.http.get(url, options).map(this.extractValue);
    }
    addFiles(files: FileList) {
        if (files.length === 0) {
            return;
        }
        let filelist = [];
        for (let i = 0; i < files.length; i++) {
            filelist.push(new UploadFile(files[i]));
        }
        this.fileList.next(filelist);
        this.requested.next(true);
    }
    upload(files: UploadFile[], tags: Tag[]) {
        this.files = files;

        return Observable.create(observer => {
            let tagstring = tags.map(function(_) { return _.name; }).join(',');
            this.uploadFile(this.files[0], tagstring, observer);
        });
    }
    private extractValue(res: Response) {
        let body = res.json();
        return body.value || null;
    }
    private uploadFile(file: UploadFile, tags: string, observer: Observer<UploadFile[]>) {
        let url: string = '/frog/';
        let fd: FormData = new FormData();
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        this.file = file;
        
        fd.append('file', file.file, this.file.name);
        fd.append('tags', tags)
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    this.files.shift();
                    let item = <IItem>JSON.parse(xhr.response).value;
                    if (item) {
                        this.items.push(item);
                    }
                    
                    if (this.files.length) {
                        this.uploadFile(this.files[0], tags, observer);
                    }
                    else {
                        observer.complete();
                        this.service.addItems(this.items);
                        this.items = [];
                    }
                }
                else {
                    observer.error(xhr.response);
                }
            }
        }
        xhr.upload.onprogress = (event) => {
            this.file.progress = Math.round(event.loaded / event.total * 100);
            if (this.file.progress == 100) {
                this.file.status = 'Processing...';
            }
            observer.next(this.files);
        }

        xhr.open('POST', url, true);
        xhr.withCredentials = true;
        xhr.send(fd);
    }
}