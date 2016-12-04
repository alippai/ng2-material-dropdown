import {
    HostListener,
    Component,
    ContentChild,
    Output,
    EventEmitter
} from '@angular/core';

import { Ng2DropdownButton } from '../button/ng2-dropdown-button';
import { Ng2DropdownMenu } from '../menu/ng2-dropdown-menu';
import { DropdownStateService } from '../../services/dropdown-state.service';

@Component({
    selector: 'ng2-dropdown',
    styles: [require('./style.scss').toString()],
    template: require('./template.html'),
    providers: [DropdownStateService]
})
export class Ng2Dropdown {
    // get children components
    @ContentChild(Ng2DropdownButton) public button: Ng2DropdownButton;
    @ContentChild(Ng2DropdownMenu) public menu: Ng2DropdownMenu;

    // outputs
    @Output() public onItemClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onItemSelected: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onShow: EventEmitter<Ng2Dropdown> = new EventEmitter<Ng2Dropdown>();
    @Output() public onHide: EventEmitter<Ng2Dropdown> = new EventEmitter<Ng2Dropdown>();

    constructor(private state: DropdownStateService) {}

    /**
     * @name toggleMenu
     * @desc toggles menu visibility
     */
    public toggleMenu(position = this.button.getPosition()): void {
        this.state.menuState.isVisible ? this.hide() : this.show(position);
    }

    private hide(): void {
        this.menu.hide();
        this.onHide.emit(this);
    }

    private show(position = this.button.getPosition()): void {
        this.menu.show();

        // update menu position based on its button's
        this.menu.updatePosition(position);
        this.onShow.emit(this);
    }

    @HostListener('window:scroll')
    private scrollListener() {
        if (this.state.menuState.isVisible && this.button) {
            this.menu.updatePosition(this.button.getPosition());
        }
    }

    ngOnInit() {
        this.state.dropdownState.onItemClicked.subscribe(item => {
            this.onItemClicked.emit(item);

            if (item.preventClose) {
                return;
            }

            this.hide.call(this);
        });

        if (this.button) {
            this.button.onMenuToggled.subscribe(() => {
                this.toggleMenu();
            });
        }

        this.state.dropdownState.onItemSelected.subscribe(item => this.onItemSelected.emit(item));
    }
}
