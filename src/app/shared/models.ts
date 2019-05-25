
export class User {
    public id: number;
    public name: string;
    public email: string;
    public username: string;
    public prefs: Preferences;
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

    constructor(id: number, name: string, artist = false, count = 0) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.type = (this.id === 0) ? 'search' : 'tag';
        this.count = count;
    }

    equal(other: Tag) {
        if (this.id === 0 && other.id === 0) {
            return this.name.toLocaleLowerCase() === other.name.toLocaleLowerCase();
        }
        return this.id === other.id;
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
    thumbnail: string;
    custom_thumbnail: boolean;
    comments?: Comment[];
    description: string;
    selected: boolean;
    like_count: number;
    loaded: boolean;
}

export class CItem implements IItem {
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
    view_count: number;

    public addTag(tag: Tag) {
        if (this.tags.indexOf(tag) === -1) {
            this.tags.push(tag);
        }
    }
    public removeTag(tag: Tag) {
        let index = this.tags.indexOf(tag);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }
}

export class CImage extends CItem {
    image: string;
    small: string;
    panoramic: boolean;
}

export class CVideo extends CItem {
    video: string;
    poster: string;
    framerate: number;
    duration: number;
}

export class CGroup extends CItem {
    children: CItem[];
}

export class Notification {
    public text: string;
    public icon: string;
    public color: string;
    public timeout: number;
    public error: boolean;

    constructor(text: string, icon = '', timeout = 5000) {
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
    hidden: boolean;
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
    largeThumbnails: boolean;
    slideshowRandomize: boolean;
    slideshowPlayVideo: boolean;
    slideshowDuration: number;
    minimap: boolean;
}

export class SiteConfig {
    name: string;
    favicon: string;
    icon: string;
    link: string;
    enable_likes: boolean;
}

export class ReleaseNote {
    id: number;
    date: Date;
    notes: string;
}

export class Result {
    isError: boolean;
    message: string;
    value: any;
    values: any[];
}
