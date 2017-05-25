
export class User {
    public id: number;
    public name: string;
    public email: string;
    public username: string;
    public prefs: Object;
    public isManager: boolean;
}

export class Comment {
    public id: number;
    public date: Date;
    public comment: string;
    public user: User;
}

export class Tag {
    public id: number;
    public name: string;
    public artist: boolean;
    public type: string;
    public count: number;
    public added: boolean;

    constructor(id: number, name: string, artist: boolean=false, count: number=0) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.type = (this.id === 0) ? 'search' : 'tag';
        this.count = count;
    }
}

export interface IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    height: number;
    guid: string;
    id: number;
    title: string;
    author: User;
    modified: Date;
    created: Date;
    width: number;
    comment_count: number;
    source: string;
    small: string;
    thumbnail: string;
    custom_thumbnail: boolean;
    comments?: Comment[];
    description: string;
    selected: boolean;
    like_count: number;
    loaded: boolean;
}


export class CImage implements IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    image: string;
    height: number;
    guid: string;
    id: number;
    title: string;
    author: User;
    modified: Date;
    created: Date;
    width: number;
    comment_count: number;
    source: string;
    small: string;
    thumbnail: string;
    custom_thumbnail: boolean;
    comments: Comment[];
    description: string;
    selected: boolean;
    like_count: number;
    loaded: boolean;
}


export class CVideo implements IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    video: string;
    height: number;
    guid: string;
    id: number;
    title: string;
    author: User;
    modified: Date;
    created: Date;
    width: number;
    comment_count: number;
    source: string;
    small: string;
    thumbnail: string;
    custom_thumbnail: boolean;
    poster: string;
    comments: Comment[];
    description: string;
    selected: boolean;
    framerate: number;
    like_count: number;
    loaded: boolean;
}


export class Notification {
    public text: string;
    public icon: string;
    public color: string;
    public timeout: number;
    public error: boolean;

    constructor(text: string, icon: string = '', timeout: number = 5000) {
        this.text = text;
        this.icon = icon;
        this.timeout = timeout;
        this.error = false;
    }
}


export class Gallery {
    id: number;
    title: string;
    security: number;
    image_count: number;
    video_count: number;
    owner: User;
    description: string;
    uploads: boolean;
    parent: Gallery;
}


export class Preferences {
    backgroundColor: string;
    tileCount: number;
    emailComments: boolean;
    emailLikes: boolean;
    thumbnailPadding: number;
    semiTransparent: boolean;
    showTags: boolean;
    orderby: string;
}


export class SiteConfig {
    name: string;
    favicon: string;
    icon: string;
    link: string;
}
