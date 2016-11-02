import { Component, OnInit, AfterViewInit, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';

import { SelectionService } from '../shared/selection.service';
import { IItem, Tag } from '../shared/models';
import { TagsComponent } from '../shared/tags.component';
import { TagsService } from '../shared/tags.service';
import { TagArtistFilterPipe } from '../shared/tag-artist-filter.pipe';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { UserService } from '../user/user.service';

import { WorksService } from './works.service';

declare var $:any;

@Component({
    selector: 'selection-detail',
    template: `
    <ul [@panelState]="visible" id="selection_sidenav" class="side-nav grey darken-4 grey-text text-lighten-1">
        <div>
            <i (click)="toggle()" class="material-icons right">close</i>
        </div>
        <li class="stack">
            <img *ngFor="let item of items | slice:0:10; let i = index" [style.left.px]="offset(i)" [style.top.px]="offset(i)" class="z-depth-1" src="{{item.thumbnail}}">
        </li>
        <h4 class="title">
            <i class="material-icons green-text">photo_size_select_large</i> {{items.length}} Selected Items
        </h4>
        <div class="row">
            <div class="col s6">
                <a href="/frog/download?guids={{guids}}" class="waves-effect waves-light btn blue"><i class="material-icons">cloud_download</i> Download</a>
            </div>
            <div class="col s6">
                <a (click)="favorite()" class="waves-effect waves-light btn blue"><i class="material-icons">favorite</i> Favorite</a>
            </div>
        </div>
        <li>
            <div class="tags">
                <h4 class="title">
                    <i class="material-icons green-text">label</i> Tags
                </h4>
                <tag *ngFor="let tag of (tags | tagArtistFilter)" [item]="tag.id" [dark]="true" (onClick)="navigateToTag($event)" (onClose)="removeTag($event)"></tag>
                <autocomplete (onSelect)="addTag($event)"></autocomplete>
            </div>
        </li>
    </ul>
    <div id="selection_actions" [hidden]="!enabled">
        <!--
        <a id="remove_button" (click)="removePrompt()" class="btn-floating waves-effect waves-light red modal-trigger"><i class="material-icons">delete</i></a>
        <a id="selection_button" (click)="visible = 'show'" class="btn-floating waves-effect waves-light green"><i class="material-icons">menu</i></a>
        -->
        <div class="fixed-action-btn horizontal">
            <a class="btn-floating btn-large cyan">
                <i class="large material-icons">more_horiz</i>
            </a>
            <ul>
                <li><a (click)="removePrompt()" class="btn-floating red"><i class="material-icons">delete</i></a></li>
                <li><a (click)="visible='show'" class="btn-floating yellow darken-1"><i class="material-icons">info_outline</i></a></li>
                <!--<li><a class="btn-floating green"><i class="material-icons">content_copy</i></a></li>
                <li><a class="btn-floating blue"><i class="material-icons">content_cut</i></a></li>-->
            </ul>
        </div>
    </div>
    <div id="remove_prompt" class="modal">
        <div class="modal-content">
            <h4>Remove Items From Gallery?</h4>
            <p>Are you sure you wish to remove ({{items.length || 0}}) from the current gallery?</p>
            <small>This does not delete anything, it simply removes the items</small>
        </div>
        <div class="modal-footer">
            <a (click)="removeItems()" class=" modal-action modal-close waves-effect waves-green btn-flat">Ok</a>
            <a (click)="cancelPrompt()" class=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
        </div>
    </div>
    `,
    styles: [
        '.fixed-action-btn { top: 82px; right: 24px; height: 55px; }',
        '#remove_prompt { z-index: 1000; }',
        '#selection_sidenav { padding: 20px 25px 20px 20px; width: 360px; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        '.tags > a { display: inline-block; line-height: inherit; position: relative; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        '.stack { position: relative; height: 256px; }',
        '.stack img { position: absolute; width: 128px; border: 1px solid #ccc; border-bottom-width: 20px; }',
        'a.btn { line-height: 36px !important; height: 36px !important; padding: inherit; margin: inherit !important; }',
        'i { vertical-align: middle; }',
        'ul > div:first-child { overflow: auto; }'
    ],
    animations: [
        trigger('panelState', [
            state('show', style({
                transform: 'translate(0px)'
            })),
            state('hide', style({
                transform: 'translate(-360px)'
            })),
            transition('show => hide', animate('100ms ease-in')),
            transition('hide => show', animate('100ms ease-out'))
        ])
    ]
})
export class SelectionDetailComponent {
    enabled: boolean = false;
    private items: IItem[];
    private tags: Tag[];
    private guids: string;
    public visible: string = 'hide';

    constructor(private service: SelectionService, private works: WorksService, private tagssservice: TagsService, private userservice: UserService, private router: Router) {
        this.tags = [];
        this.items = [];
        service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.guids = this.items.map(function(_) {return _.guid}).join(',');
            this.aggregateTags();
            if (this.items.length == 0) {
                this.visible = 'hide';
            }
        });
    }
    zIndex() {
        return (this.enabled) ? 950 : 0;
    }
    aggregateTags() {
        let tags = [];
        let ids = [];
        
        for (let item of this.items) {
            for (let tag of item.tags) {
                if (ids.indexOf(tag.id) == -1) {
                    tags.push(<Tag>tag);
                    ids.push(tag.id);
                }
            }
        }

        this.tags = tags;
    }
    removePrompt() {
        $('#remove_prompt').openModal();
    }
    cancelPrompt() {
        $('#remove_prompt').closeModal();
    }
    removeItems() {
        this.cancelPrompt();
        this.works.remove(this.items);
        this.service.clear();
    }
    addTag(event: any) {
        this.tagssservice.create(event.tag.name).subscribe(tag => {
            this.works.editTags(this.items, [tag], []).subscribe(() => {
                let found = false;
                let tags = this.tags.slice(0);
                
                for (let t of this.tags) {
                    if (tag.id == t.id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    tags.push(tag);
                }

                if (tags.length != this.tags.length) {
                    this.tags = tags;
                }
            });
        });
    }
    removeTag(tag) {
        this.works.editTags(this.items, [], [tag]).subscribe();
    }
    offset(index: number) {
        return index * 8 + 12;
    }
    navigateToTag(tag: Tag) {
        this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
    }
    toggle() {
        this.visible = (this.visible == 'hide') ? 'show': 'hide';
    }
    favorite() {
        let guids = this.items.map(item => item.guid);
        this.works.copyItems(guids, 2);
    }
}