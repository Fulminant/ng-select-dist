/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, forwardRef, ChangeDetectorRef, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation, HostListener, HostBinding, ViewChild, ElementRef, ChangeDetectionStrategy, Inject, ContentChildren, QueryList, InjectionToken, Attribute } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, startWith, tap, debounceTime, map, filter } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { NgOptionTemplateDirective, NgLabelTemplateDirective, NgHeaderTemplateDirective, NgFooterTemplateDirective, NgOptgroupTemplateDirective, NgNotFoundTemplateDirective, NgTypeToSearchTemplateDirective, NgLoadingTextTemplateDirective, NgMultiLabelTemplateDirective, NgTagTemplateDirective, NgLoadingSpinnerTemplateDirective } from './ng-templates.directive';
import { ConsoleService } from './console.service';
import { isDefined, isFunction, isPromise, isObject } from './value-utils';
import { ItemsList } from './items-list';
import { KeyCode } from './ng-select.types';
import { newId } from './id';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectConfig } from './config.service';
/** @type {?} */
export const SELECTION_MODEL_FACTORY = new InjectionToken('ng-select-selection-model');
/** @typedef {?} */
var DropdownPosition;
export { DropdownPosition };
/** @typedef {?} */
var AutoCorrect;
export { AutoCorrect };
/** @typedef {?} */
var AutoCapitalize;
export { AutoCapitalize };
/** @typedef {?} */
var AddTagFn;
export { AddTagFn };
/** @typedef {?} */
var CompareWithFn;
export { CompareWithFn };
/** @typedef {?} */
var GroupValueFn;
export { GroupValueFn };
export class NgSelectComponent {
    /**
     * @param {?} classes
     * @param {?} tabIndex
     * @param {?} autoFocus
     * @param {?} config
     * @param {?} newSelectionModel
     * @param {?} _elementRef
     * @param {?} _cd
     * @param {?} _console
     */
    constructor(classes, tabIndex, autoFocus, config, newSelectionModel, _elementRef, _cd, _console) {
        this.classes = classes;
        this.tabIndex = tabIndex;
        this.autoFocus = autoFocus;
        this._cd = _cd;
        this._console = _console;
        this.markFirst = true;
        this.dropdownPosition = 'auto';
        this.loading = false;
        this.closeOnSelect = true;
        this.hideSelected = false;
        this.selectOnTab = false;
        this.bufferAmount = 4;
        this.selectableGroup = false;
        this.selectableGroupAsModel = true;
        this.searchFn = null;
        this.trackByFn = null;
        this.excludeGroupsFromDefaultSelection = false;
        this.clearOnBackspace = true;
        this.readonly = false;
        this.labelForId = null;
        this.autoCorrect = 'off';
        this.autoCapitalize = 'off';
        this.multiple = false;
        this.addTag = false;
        this.searchable = true;
        this.clearable = true;
        this.isOpen = false;
        // output events
        this.blurEvent = new EventEmitter();
        this.focusEvent = new EventEmitter();
        this.changeEvent = new EventEmitter();
        this.openEvent = new EventEmitter();
        this.closeEvent = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.clearEvent = new EventEmitter();
        this.addEvent = new EventEmitter();
        this.removeEvent = new EventEmitter();
        this.scroll = new EventEmitter();
        this.scrollToEnd = new EventEmitter();
        this.disabled = false;
        this.viewPortItems = [];
        this.filterValue = null;
        this.dropdownId = newId();
        this._items = [];
        this._defaultLabel = 'label';
        this._pressedKeys = [];
        this._destroy$ = new Subject();
        this._keyPress$ = new Subject();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this.clearItem = (item) => {
            /** @type {?} */
            const option = this.selectedItems.find(x => x.value === item);
            this.unselect(option);
        };
        this.trackByOption = (_, item) => {
            if (this.trackByFn) {
                return this.trackByFn(item.value);
            }
            return null;
        };
        this._mergeGlobalConfig(config);
        this.itemsList = new ItemsList(this, newSelectionModel());
        this.element = _elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    get items() { return this._items; }
    ;
    /**
     * @param {?} value
     * @return {?}
     */
    set items(value) {
        this._itemsAreUsed = true;
        this._items = value;
    }
    ;
    /**
     * @return {?}
     */
    get compareWith() { return this._compareWith; }
    /**
     * @param {?} fn
     * @return {?}
     */
    set compareWith(fn) {
        if (!isFunction(fn)) {
            throw Error('`compareWith` must be a function.');
        }
        this._compareWith = fn;
    }
    /**
     * @return {?}
     */
    get clearSearchOnAdd() { return isDefined(this._clearSearchOnAdd) ? this._clearSearchOnAdd : this.closeOnSelect; }
    ;
    /**
     * @param {?} value
     * @return {?}
     */
    set clearSearchOnAdd(value) {
        this._clearSearchOnAdd = value;
    }
    ;
    /**
     * @return {?}
     */
    get filtered() { return !!this.filterValue && this.searchable; }
    ;
    /**
     * @return {?}
     */
    get selectedItems() {
        return this.itemsList.selectedItems;
    }
    /**
     * @return {?}
     */
    get selectedValues() {
        return this.selectedItems.map(x => x.value);
    }
    /**
     * @return {?}
     */
    get hasValue() {
        return this.selectedItems.length > 0;
    }
    /**
     * @return {?}
     */
    get currentPanelPosition() {
        if (this.dropdownPanel) {
            return this.dropdownPanel.currentPosition;
        }
        return undefined;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._handleKeyPresses();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["multiple"]) {
            this.itemsList.clearSelected();
        }
        if (changes["items"]) {
            this._setItems(changes["items"].currentValue || []);
        }
        if (changes["isOpen"]) {
            this._manualOpen = isDefined(changes["isOpen"].currentValue);
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this._itemsAreUsed) {
            this._setItemsFromNgOptions();
        }
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleKeyDown($event) {
        if (KeyCode[$event.which]) {
            switch ($event.which) {
                case KeyCode.ArrowDown:
                    this._handleArrowDown($event);
                    break;
                case KeyCode.ArrowUp:
                    this._handleArrowUp($event);
                    break;
                case KeyCode.Space:
                    this._handleSpace($event);
                    break;
                case KeyCode.Enter:
                    this._handleEnter($event);
                    break;
                case KeyCode.Tab:
                    this._handleTab($event);
                    break;
                case KeyCode.Esc:
                    this.close();
                    $event.preventDefault();
                    break;
                case KeyCode.Backspace:
                    this._handleBackspace();
                    break;
            }
        }
        else if ($event.key && $event.key.length === 1) {
            this._keyPress$.next($event.key.toLocaleLowerCase());
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleMousedown($event) {
        /** @type {?} */
        const target = /** @type {?} */ ($event.target);
        if (target.tagName !== 'INPUT') {
            $event.preventDefault();
        }
        if (target.classList.contains('ng-clear-wrapper')) {
            this.handleClearClick();
            return;
        }
        if (target.classList.contains('ng-arrow-wrapper')) {
            this.handleArrowClick();
            return;
        }
        if (target.classList.contains('ng-value-icon')) {
            return;
        }
        if (!this.focused) {
            this.focus();
        }
        if (this.searchable) {
            this.open();
        }
        else {
            this.toggle();
        }
    }
    /**
     * @return {?}
     */
    handleArrowClick() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * @return {?}
     */
    handleClearClick() {
        if (this.hasValue) {
            this.itemsList.clearSelected(true);
            this._updateNgModel();
        }
        this._clearSearch();
        this.focus();
        if (this._isTypeahead) {
            this.typeahead.next(null);
        }
        this.clearEvent.emit();
    }
    /**
     * @return {?}
     */
    clearModel() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this._updateNgModel();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.itemsList.clearSelected();
        this._handleWriteValue(value);
        this._cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._cd.markForCheck();
    }
    /**
     * @return {?}
     */
    toggle() {
        if (!this.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    open() {
        if (this.disabled || this.isOpen || this.itemsList.maxItemsSelected || this._manualOpen || this.readonly) {
            return;
        }
        if (!this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markSelectedOrDefault(this.markFirst);
        this.openEvent.emit();
        if (!this.filterValue) {
            this.focus();
        }
        this.detectChanges();
    }
    /**
     * @return {?}
     */
    close() {
        if (!this.isOpen || this._manualOpen) {
            return;
        }
        this.isOpen = false;
        this._clearSearch();
        this._onTouched();
        this.closeEvent.emit();
        this._cd.markForCheck();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    toggleItem(item) {
        if (!item || item.disabled || this.disabled) {
            return;
        }
        if (this.multiple && item.selected) {
            this.unselect(item);
        }
        else {
            this.select(item);
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    select(item) {
        if (!item.selected) {
            this.itemsList.select(item);
            if (this.clearSearchOnAdd) {
                this._clearSearch();
            }
            if (this.multiple) {
                this.addEvent.emit(item.value);
            }
            this._updateNgModel();
        }
        if (this.closeOnSelect || this.itemsList.noItemsToSelect) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    focus() {
        this.filterInput.nativeElement.focus();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    unselect(item) {
        if (!item) {
            return;
        }
        this.itemsList.unselect(item);
        this.focus();
        this._updateNgModel();
        this.removeEvent.emit(item);
    }
    /**
     * @return {?}
     */
    selectTag() {
        /** @type {?} */
        let tag;
        if (isFunction(this.addTag)) {
            tag = (/** @type {?} */ (this.addTag))(this.filterValue);
        }
        else {
            tag = this._primitive ? this.filterValue : { [this.bindLabel]: this.filterValue };
        }
        /** @type {?} */
        const handleTag = (item) => this._isTypeahead || !this.isOpen ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item);
        if (isPromise(tag)) {
            tag.then(item => this.select(handleTag(item))).catch(() => { });
        }
        else if (tag) {
            this.select(handleTag(tag));
        }
    }
    /**
     * @return {?}
     */
    showClear() {
        return this.clearable && (this.hasValue || this.filterValue) && !this.disabled;
    }
    /**
     * @return {?}
     */
    get showAddTag() {
        if (!this.filterValue) {
            return false;
        }
        /** @type {?} */
        const term = this.filterValue.toLowerCase();
        return this.addTag &&
            (!this.itemsList.filteredItems.some(x => x.label.toLowerCase() === term) &&
                (!this.hideSelected && this.isOpen || !this.selectedItems.some(x => x.label.toLowerCase() === term))) &&
            !this.loading;
    }
    /**
     * @return {?}
     */
    showNoItemsFound() {
        /** @type {?} */
        const empty = this.itemsList.filteredItems.length === 0;
        return ((empty && !this._isTypeahead && !this.loading) ||
            (empty && this._isTypeahead && this.filterValue && !this.loading)) &&
            !this.showAddTag;
    }
    /**
     * @return {?}
     */
    showTypeToSearch() {
        /** @type {?} */
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this._isTypeahead && !this.filterValue && !this.loading;
    }
    /**
     * @param {?} term
     * @return {?}
     */
    filter(term) {
        this.filterValue = term;
        if (this._isTypeahead) {
            this.typeahead.next(this.filterValue);
        }
        else {
            this.itemsList.filter(this.filterValue);
            if (this.isOpen) {
                this.itemsList.markSelectedOrDefault(this.markFirst);
            }
        }
        this.searchEvent.emit({ term, items: this.itemsList.filteredItems.map(x => x.value) });
        this.open();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputFocus($event) {
        if (this.focused || this.readonly) {
            return;
        }
        this.element.classList.add('ng-select-focused');
        this.focusEvent.emit($event);
        this.focused = true;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputBlur($event) {
        this.element.classList.remove('ng-select-focused');
        this.blurEvent.emit($event);
        if (!this.isOpen && !this.disabled) {
            this._onTouched();
        }
        this.focused = false;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    onItemHover(item) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
    }
    /**
     * @return {?}
     */
    detectChanges() {
        if (!(/** @type {?} */ (this._cd)).destroyed) {
            this._cd.detectChanges();
        }
    }
    /**
     * @return {?}
     */
    updateDropdownPosition() {
        if (this.dropdownPanel) {
            this.dropdownPanel.updateDropdownPosition();
        }
    }
    /**
     * @param {?} items
     * @return {?}
     */
    _setItems(items) {
        /** @type {?} */
        const firstItem = items[0];
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive || this.bindLabel === this._defaultLabel;
        this.itemsList.setItems(items);
        if (items.length > 0 && this.hasValue) {
            this.itemsList.mapSelectedItems();
        }
        if (this.isOpen && isDefined(this.filterValue) && !this._isTypeahead) {
            this.itemsList.filter(this.filterValue);
        }
        if (this._isTypeahead || this.isOpen) {
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }
    /**
     * @return {?}
     */
    _setItemsFromNgOptions() {
        /** @type {?} */
        const handleNgOptions = (options) => {
            this.items = options.map(option => ({
                $ngOptionValue: option.value,
                $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                disabled: option.disabled
            }));
            this.itemsList.setItems(this.items);
            if (this.hasValue) {
                this.itemsList.mapSelectedItems();
            }
            this.detectChanges();
        };
        /** @type {?} */
        const handleOptionChange = () => {
            /** @type {?} */
            const changedOrDestroyed = merge(this.ngOptions.changes, this._destroy$);
            merge(...this.ngOptions.map(option => option.stateChange$))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(option => {
                /** @type {?} */
                const item = this.itemsList.findItem(option.value);
                item.disabled = option.disabled;
                this._cd.markForCheck();
            });
        };
        this.ngOptions.changes
            .pipe(startWith(this.ngOptions), takeUntil(this._destroy$))
            .subscribe(options => {
            this.bindLabel = this._defaultLabel;
            handleNgOptions(options);
            handleOptionChange();
        });
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _isValidWriteValue(value) {
        if (!isDefined(value) || (this.multiple && value === '') || Array.isArray(value) && value.length === 0) {
            return false;
        }
        /** @type {?} */
        const validateBinding = (item) => {
            if (!isDefined(this.compareWith) && isObject(item) && this.bindValue) {
                this._console.warn(`Binding object(${JSON.stringify(item)}) with bindValue is not allowed.`);
                return false;
            }
            return true;
        };
        if (this.multiple) {
            if (!Array.isArray(value)) {
                this._console.warn('Multiple select ngModel should be array.');
                return false;
            }
            return value.every(item => validateBinding(item));
        }
        else {
            return validateBinding(value);
        }
    }
    /**
     * @param {?} ngModel
     * @return {?}
     */
    _handleWriteValue(ngModel) {
        if (!this._isValidWriteValue(ngModel)) {
            return;
        }
        /** @type {?} */
        const select = (val) => {
            /** @type {?} */
            let item = this.itemsList.findItem(val);
            if (item) {
                this.itemsList.select(item);
            }
            else {
                /** @type {?} */
                const isValObject = isObject(val);
                /** @type {?} */
                const isPrimitive = !isValObject && !this.bindValue;
                if ((isValObject || isPrimitive)) {
                    this.itemsList.select(this.itemsList.mapItem(val, null));
                }
                else if (this.bindValue) {
                    item = {
                        [this.bindLabel]: null,
                        [this.bindValue]: val
                    };
                    this.itemsList.select(this.itemsList.mapItem(item, null));
                }
            }
        };
        if (this.multiple) {
            (/** @type {?} */ (ngModel)).forEach(item => select(item));
        }
        else {
            select(ngModel);
        }
    }
    /**
     * @return {?}
     */
    _handleKeyPresses() {
        if (this.searchable) {
            return;
        }
        this._keyPress$
            .pipe(takeUntil(this._destroy$), tap(letter => this._pressedKeys.push(letter)), debounceTime(200), filter(() => this._pressedKeys.length > 0), map(() => this._pressedKeys.join('')))
            .subscribe(term => {
            /** @type {?} */
            const item = this.itemsList.findByLabel(term);
            if (item) {
                if (this.isOpen) {
                    this.itemsList.markItem(item);
                    this._cd.markForCheck();
                }
                else {
                    this.select(item);
                }
            }
            this._pressedKeys = [];
        });
    }
    /**
     * @return {?}
     */
    _updateNgModel() {
        /** @type {?} */
        const model = [];
        for (const item of this.selectedItems) {
            if (this.bindValue) {
                /** @type {?} */
                let value = null;
                if (item.children) {
                    /** @type {?} */
                    const groupKey = this.groupValue ? this.bindValue : /** @type {?} */ (this.groupBy);
                    value = item.value[groupKey || /** @type {?} */ (this.groupBy)];
                }
                else {
                    value = this.itemsList.resolveNested(item.value, this.bindValue);
                }
                model.push(value);
            }
            else {
                model.push(item.value);
            }
        }
        /** @type {?} */
        const selected = this.selectedItems.map(x => x.value);
        if (this.multiple) {
            this._onChange(model);
            this.changeEvent.emit(selected);
        }
        else {
            this._onChange(isDefined(model[0]) ? model[0] : null);
            this.changeEvent.emit(selected[0]);
        }
        this._cd.markForCheck();
    }
    /**
     * @return {?}
     */
    _clearSearch() {
        if (!this.filterValue) {
            return;
        }
        this.filterValue = null;
        this.itemsList.resetFilteredItems();
    }
    /**
     * @return {?}
     */
    _scrollToMarked() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollInto(this.itemsList.markedItem);
    }
    /**
     * @return {?}
     */
    _scrollToTag() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollIntoTag();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _handleTab($event) {
        if (this.isOpen === false && !isDefined(this.addTag)) {
            return;
        }
        if (this.selectOnTab) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
                $event.preventDefault();
            }
            else if (this.showAddTag) {
                this.selectTag();
                $event.preventDefault();
            }
            else {
                this.close();
            }
        }
        else {
            this.close();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _handleEnter($event) {
        if (this.isOpen || this._manualOpen) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
            }
            else if (this.showAddTag) {
                this.selectTag();
            }
        }
        else if (this.openOnEnter) {
            this.open();
        }
        else {
            return;
        }
        $event.preventDefault();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _handleSpace($event) {
        if (this.isOpen || this._manualOpen) {
            return;
        }
        this.open();
        $event.preventDefault();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _handleArrowDown($event) {
        if (this._nextItemIsTag(+1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markNextItem();
            this._scrollToMarked();
        }
        this.open();
        $event.preventDefault();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _handleArrowUp($event) {
        if (!this.isOpen) {
            return;
        }
        if (this._nextItemIsTag(-1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markPreviousItem();
            this._scrollToMarked();
        }
        $event.preventDefault();
    }
    /**
     * @param {?} nextStep
     * @return {?}
     */
    _nextItemIsTag(nextStep) {
        /** @type {?} */
        const nextIndex = this.itemsList.markedIndex + nextStep;
        return this.addTag && this.filterValue
            && this.itemsList.markedItem
            && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length);
    }
    /**
     * @return {?}
     */
    _handleBackspace() {
        if (this.filterValue || !this.clearable || !this.clearOnBackspace || !this.hasValue) {
            return;
        }
        if (this.multiple) {
            this.unselect(this.itemsList.lastSelectedItem);
        }
        else {
            this.clearModel();
        }
    }
    /**
     * @return {?}
     */
    get _isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    _mergeGlobalConfig(config) {
        this.placeholder = this.placeholder || config.placeholder;
        this.notFoundText = this.notFoundText || config.notFoundText;
        this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
        this.addTagText = this.addTagText || config.addTagText;
        this.loadingText = this.loadingText || config.loadingText;
        this.clearAllText = this.clearAllText || config.clearAllText;
        this.virtualScroll = isDefined(this.virtualScroll)
            ? this.virtualScroll
            : isDefined(config.disableVirtualScroll) ? !config.disableVirtualScroll : false;
        this.openOnEnter = isDefined(this.openOnEnter) ? this.openOnEnter : config.openOnEnter;
    }
}
NgSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-select',
                template: "<div (mousedown)=\"handleMousedown($event)\" [class.ng-has-value]=\"hasValue\" class=\"ng-select-container\">\n    <div class=\"ng-value-container\">\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\n\n        <ng-container *ngIf=\"!multiLabelTemplate && selectedItems.length > 0\">\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\n                <ng-template #defaultLabelTemplate>\n                    <span class=\"ng-value-icon left\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\n                    <span class=\"ng-value-label\">{{item.label}}</span>\n                </ng-template>\n\n                <ng-template\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\n                </ng-template>\n            </div>\n        </ng-container>\n\n        <ng-template *ngIf=\"multiLabelTemplate && selectedValues.length > 0\"\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\n        </ng-template>\n\n        <div class=\"ng-input\">\n            <input #filterInput\n                   type=\"text\"\n                   [attr.autocomplete]=\"labelForId ? 'off' : dropdownId\"\n                   [attr.id]=\"labelForId\"\n                   [attr.tabindex]=\"tabIndex\"\n                   [attr.autocorrect]=\"autoCorrect\"\n                   [attr.autocapitalize]=\"autoCapitalize\"\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected || readonly\"\n                   [disabled]=\"disabled\"\n                   [value]=\"filterValue ? filterValue : ''\"\n                   (input)=\"filter(filterInput.value)\"\n                   (focus)=\"onInputFocus($event)\"\n                   (blur)=\"onInputBlur($event)\"\n                   (change)=\"$event.stopPropagation()\"\n                   role=\"combobox\"\n                   [attr.aria-expanded]=\"isOpen\"\n                   [attr.aria-owns]=\"isOpen ? dropdownId : null\"\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\">\n        </div>\n    </div>\n\n    <ng-container *ngIf=\"loading\">\n        <ng-template #defautlLoadingSpinnerTemplate>\n            <div class=\"ng-spinner-loader\"></div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defautlLoadingSpinnerTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <span *ngIf=\"showClear()\" class=\"ng-clear-wrapper\" title=\"{{clearAllText}}\">\n        <span class=\"ng-clear\" aria-hidden=\"true\">\u00D7</span>\n    </span>\n\n    <span class=\"ng-arrow-wrapper\">\n        <span class=\"ng-arrow\"></span>\n    </span>\n</div>\n\n<ng-dropdown-panel *ngIf=\"isOpen\"\n    class=\"ng-dropdown-panel\"\n    [virtualScroll]=\"virtualScroll\"\n    [bufferAmount]=\"bufferAmount\"\n    [appendTo]=\"appendTo\"\n    [position]=\"dropdownPosition\"\n    [headerTemplate]=\"headerTemplate\"\n    [footerTemplate]=\"footerTemplate\"\n    [filterValue]=\"filterValue\"\n    [items]=\"itemsList.filteredItems\"\n    [markedItem]=\"itemsList.markedItem\"\n    (update)=\"viewPortItems = $event\"\n    (scroll)=\"scroll.emit($event)\"\n    (scrollToEnd)=\"scrollToEnd.emit($event)\"\n    (outsideClick)=\"close()\"\n    [class.ng-select-multiple]=\"multiple\"\n    [ngClass]=\"appendTo ? classes : null\"\n    [id]=\"dropdownId\">\n\n    <ng-container>\n        <div class=\"ng-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\n                [class.ng-option-disabled]=\"item.disabled\"\n                [class.ng-option-selected]=\"item.selected\"\n                [class.ng-optgroup]=\"item.children\"\n                [class.ng-option]=\"!item.children\"\n                [class.ng-option-child]=\"!!item.parent\"\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\n                [attr.aria-selected]=\"item.selected\"\n                [attr.id]=\"item?.htmlId\">\n\n            <ng-template #defaultOptionTemplate>\n                <span class=\"ng-option-label\">{{item.label}}</span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: filterValue }\">\n            </ng-template>\n        </div>\n\n        <div class=\"ng-option\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\n            <ng-template #defaultTagTemplate>\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span>\"{{filterValue}}\"</span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\n                [ngTemplateOutletContext]=\"{ searchTerm: filterValue }\">\n            </ng-template>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"showNoItemsFound()\">\n        <ng-template #defaultNotFoundTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: filterValue }\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"showTypeToSearch()\">\n        <ng-template #defaultTypeToSearchTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\n        <ng-template #defaultLoadingTextTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: filterValue }\">\n        </ng-template>\n    </ng-container>\n\n</ng-dropdown-panel>\n",
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgSelectComponent),
                        multi: true
                    }],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'role': 'listbox',
                    'class': 'ng-select',
                    '[class.ng-select-single]': '!multiple',
                },
                styles: [".ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{color:#333;cursor:default;display:flex;outline:0;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none;border:0;box-shadow:none;outline:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute;z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-animation:.8s linear infinite load8;animation:.8s linear infinite load8}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@-webkit-keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:700;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}"]
            }] }
];
/** @nocollapse */
NgSelectComponent.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['class',] }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: undefined, decorators: [{ type: Attribute, args: ['autofocus',] }] },
    { type: NgSelectConfig },
    { type: undefined, decorators: [{ type: Inject, args: [SELECTION_MODEL_FACTORY,] }] },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: ConsoleService }
];
NgSelectComponent.propDecorators = {
    bindLabel: [{ type: Input }],
    bindValue: [{ type: Input }],
    markFirst: [{ type: Input }],
    placeholder: [{ type: Input }],
    notFoundText: [{ type: Input }],
    typeToSearchText: [{ type: Input }],
    addTagText: [{ type: Input }],
    loadingText: [{ type: Input }],
    clearAllText: [{ type: Input }],
    dropdownPosition: [{ type: Input }],
    appendTo: [{ type: Input }],
    loading: [{ type: Input }],
    closeOnSelect: [{ type: Input }],
    hideSelected: [{ type: Input }],
    selectOnTab: [{ type: Input }],
    openOnEnter: [{ type: Input }],
    maxSelectedItems: [{ type: Input }],
    groupBy: [{ type: Input }],
    groupValue: [{ type: Input }],
    bufferAmount: [{ type: Input }],
    virtualScroll: [{ type: Input }],
    selectableGroup: [{ type: Input }],
    selectableGroupAsModel: [{ type: Input }],
    searchFn: [{ type: Input }],
    trackByFn: [{ type: Input }],
    excludeGroupsFromDefaultSelection: [{ type: Input }],
    clearOnBackspace: [{ type: Input }],
    readonly: [{ type: Input }],
    labelForId: [{ type: Input }],
    autoCorrect: [{ type: Input }],
    autoCapitalize: [{ type: Input }],
    typeahead: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-typeahead',] }],
    multiple: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-multiple',] }],
    addTag: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-taggable',] }],
    searchable: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-searchable',] }],
    clearable: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-clearable',] }],
    isOpen: [{ type: Input }, { type: HostBinding, args: ['class.ng-select-opened',] }],
    items: [{ type: Input }],
    compareWith: [{ type: Input }],
    clearSearchOnAdd: [{ type: Input }],
    blurEvent: [{ type: Output, args: ['blur',] }],
    focusEvent: [{ type: Output, args: ['focus',] }],
    changeEvent: [{ type: Output, args: ['change',] }],
    openEvent: [{ type: Output, args: ['open',] }],
    closeEvent: [{ type: Output, args: ['close',] }],
    searchEvent: [{ type: Output, args: ['search',] }],
    clearEvent: [{ type: Output, args: ['clear',] }],
    addEvent: [{ type: Output, args: ['add',] }],
    removeEvent: [{ type: Output, args: ['remove',] }],
    scroll: [{ type: Output, args: ['scroll',] }],
    scrollToEnd: [{ type: Output, args: ['scrollToEnd',] }],
    optionTemplate: [{ type: ContentChild, args: [NgOptionTemplateDirective, { read: TemplateRef },] }],
    optgroupTemplate: [{ type: ContentChild, args: [NgOptgroupTemplateDirective, { read: TemplateRef },] }],
    labelTemplate: [{ type: ContentChild, args: [NgLabelTemplateDirective, { read: TemplateRef },] }],
    multiLabelTemplate: [{ type: ContentChild, args: [NgMultiLabelTemplateDirective, { read: TemplateRef },] }],
    headerTemplate: [{ type: ContentChild, args: [NgHeaderTemplateDirective, { read: TemplateRef },] }],
    footerTemplate: [{ type: ContentChild, args: [NgFooterTemplateDirective, { read: TemplateRef },] }],
    notFoundTemplate: [{ type: ContentChild, args: [NgNotFoundTemplateDirective, { read: TemplateRef },] }],
    typeToSearchTemplate: [{ type: ContentChild, args: [NgTypeToSearchTemplateDirective, { read: TemplateRef },] }],
    loadingTextTemplate: [{ type: ContentChild, args: [NgLoadingTextTemplateDirective, { read: TemplateRef },] }],
    tagTemplate: [{ type: ContentChild, args: [NgTagTemplateDirective, { read: TemplateRef },] }],
    loadingSpinnerTemplate: [{ type: ContentChild, args: [NgLoadingSpinnerTemplateDirective, { read: TemplateRef },] }],
    dropdownPanel: [{ type: ViewChild, args: [forwardRef(() => NgDropdownPanelComponent),] }],
    ngOptions: [{ type: ContentChildren, args: [NgOptionComponent, { descendants: true },] }],
    filterInput: [{ type: ViewChild, args: ['filterInput',] }],
    disabled: [{ type: HostBinding, args: ['class.ng-select-disabled',] }],
    filtered: [{ type: HostBinding, args: ['class.ng-select-filtered',] }],
    handleKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    NgSelectComponent.prototype.bindLabel;
    /** @type {?} */
    NgSelectComponent.prototype.bindValue;
    /** @type {?} */
    NgSelectComponent.prototype.markFirst;
    /** @type {?} */
    NgSelectComponent.prototype.placeholder;
    /** @type {?} */
    NgSelectComponent.prototype.notFoundText;
    /** @type {?} */
    NgSelectComponent.prototype.typeToSearchText;
    /** @type {?} */
    NgSelectComponent.prototype.addTagText;
    /** @type {?} */
    NgSelectComponent.prototype.loadingText;
    /** @type {?} */
    NgSelectComponent.prototype.clearAllText;
    /** @type {?} */
    NgSelectComponent.prototype.dropdownPosition;
    /** @type {?} */
    NgSelectComponent.prototype.appendTo;
    /** @type {?} */
    NgSelectComponent.prototype.loading;
    /** @type {?} */
    NgSelectComponent.prototype.closeOnSelect;
    /** @type {?} */
    NgSelectComponent.prototype.hideSelected;
    /** @type {?} */
    NgSelectComponent.prototype.selectOnTab;
    /** @type {?} */
    NgSelectComponent.prototype.openOnEnter;
    /** @type {?} */
    NgSelectComponent.prototype.maxSelectedItems;
    /** @type {?} */
    NgSelectComponent.prototype.groupBy;
    /** @type {?} */
    NgSelectComponent.prototype.groupValue;
    /** @type {?} */
    NgSelectComponent.prototype.bufferAmount;
    /** @type {?} */
    NgSelectComponent.prototype.virtualScroll;
    /** @type {?} */
    NgSelectComponent.prototype.selectableGroup;
    /** @type {?} */
    NgSelectComponent.prototype.selectableGroupAsModel;
    /** @type {?} */
    NgSelectComponent.prototype.searchFn;
    /** @type {?} */
    NgSelectComponent.prototype.trackByFn;
    /** @type {?} */
    NgSelectComponent.prototype.excludeGroupsFromDefaultSelection;
    /** @type {?} */
    NgSelectComponent.prototype.clearOnBackspace;
    /** @type {?} */
    NgSelectComponent.prototype.readonly;
    /** @type {?} */
    NgSelectComponent.prototype.labelForId;
    /** @type {?} */
    NgSelectComponent.prototype.autoCorrect;
    /** @type {?} */
    NgSelectComponent.prototype.autoCapitalize;
    /** @type {?} */
    NgSelectComponent.prototype.typeahead;
    /** @type {?} */
    NgSelectComponent.prototype.multiple;
    /** @type {?} */
    NgSelectComponent.prototype.addTag;
    /** @type {?} */
    NgSelectComponent.prototype.searchable;
    /** @type {?} */
    NgSelectComponent.prototype.clearable;
    /** @type {?} */
    NgSelectComponent.prototype.isOpen;
    /** @type {?} */
    NgSelectComponent.prototype.blurEvent;
    /** @type {?} */
    NgSelectComponent.prototype.focusEvent;
    /** @type {?} */
    NgSelectComponent.prototype.changeEvent;
    /** @type {?} */
    NgSelectComponent.prototype.openEvent;
    /** @type {?} */
    NgSelectComponent.prototype.closeEvent;
    /** @type {?} */
    NgSelectComponent.prototype.searchEvent;
    /** @type {?} */
    NgSelectComponent.prototype.clearEvent;
    /** @type {?} */
    NgSelectComponent.prototype.addEvent;
    /** @type {?} */
    NgSelectComponent.prototype.removeEvent;
    /** @type {?} */
    NgSelectComponent.prototype.scroll;
    /** @type {?} */
    NgSelectComponent.prototype.scrollToEnd;
    /** @type {?} */
    NgSelectComponent.prototype.optionTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.optgroupTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.labelTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.multiLabelTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.headerTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.footerTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.notFoundTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.typeToSearchTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.loadingTextTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.tagTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.loadingSpinnerTemplate;
    /** @type {?} */
    NgSelectComponent.prototype.dropdownPanel;
    /** @type {?} */
    NgSelectComponent.prototype.ngOptions;
    /** @type {?} */
    NgSelectComponent.prototype.filterInput;
    /** @type {?} */
    NgSelectComponent.prototype.disabled;
    /** @type {?} */
    NgSelectComponent.prototype.itemsList;
    /** @type {?} */
    NgSelectComponent.prototype.viewPortItems;
    /** @type {?} */
    NgSelectComponent.prototype.filterValue;
    /** @type {?} */
    NgSelectComponent.prototype.dropdownId;
    /** @type {?} */
    NgSelectComponent.prototype.element;
    /** @type {?} */
    NgSelectComponent.prototype.focused;
    /** @type {?} */
    NgSelectComponent.prototype._items;
    /** @type {?} */
    NgSelectComponent.prototype._itemsAreUsed;
    /** @type {?} */
    NgSelectComponent.prototype._defaultLabel;
    /** @type {?} */
    NgSelectComponent.prototype._primitive;
    /** @type {?} */
    NgSelectComponent.prototype._manualOpen;
    /** @type {?} */
    NgSelectComponent.prototype._pressedKeys;
    /** @type {?} */
    NgSelectComponent.prototype._compareWith;
    /** @type {?} */
    NgSelectComponent.prototype._clearSearchOnAdd;
    /** @type {?} */
    NgSelectComponent.prototype._destroy$;
    /** @type {?} */
    NgSelectComponent.prototype._keyPress$;
    /** @type {?} */
    NgSelectComponent.prototype._onChange;
    /** @type {?} */
    NgSelectComponent.prototype._onTouched;
    /** @type {?} */
    NgSelectComponent.prototype.clearItem;
    /** @type {?} */
    NgSelectComponent.prototype.trackByOption;
    /** @type {?} */
    NgSelectComponent.prototype.classes;
    /** @type {?} */
    NgSelectComponent.prototype.tabIndex;
    /** @type {?} */
    NgSelectComponent.prototype.autoFocus;
    /** @type {?} */
    NgSelectComponent.prototype._cd;
    /** @type {?} */
    NgSelectComponent.prototype._console;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1zZWxlY3Qvbmctc2VsZWN0LyIsInNvdXJjZXMiOlsibmctc2VsZWN0L25nLXNlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBSVQsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osV0FBVyxFQUNYLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osV0FBVyxFQUNYLFNBQVMsRUFDVCxVQUFVLEVBQ1YsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFFTixlQUFlLEVBQ2YsU0FBUyxFQUNULGNBQWMsRUFDZCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RGLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRDLE9BQU8sRUFDSCx5QkFBeUIsRUFDekIsd0JBQXdCLEVBQ3hCLHlCQUF5QixFQUN6Qix5QkFBeUIsRUFDekIsMkJBQTJCLEVBQzNCLDJCQUEyQixFQUMzQiwrQkFBK0IsRUFDL0IsOEJBQThCLEVBQzlCLDZCQUE2QixFQUM3QixzQkFBc0IsRUFDdEIsaUNBQWlDLEVBQ3BDLE1BQU0sMEJBQTBCLENBQUM7QUFFbEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFN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QUUsV0FBVyxFQUFFO21DQUMvRCxZQUFZLFNBQUMsK0JBQStCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2tDQUNuRSxZQUFZLFNBQUMsOEJBQThCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFOzBCQUNsRSxZQUFZLFNBQUMsc0JBQXNCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO3FDQUMxRCxZQUFZLFNBQUMsaUNBQWlDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFOzRCQUVyRSxTQUFTLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDO3dCQUNwRCxlQUFlLFNBQUMsaUJBQWlCLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFOzBCQUN4RCxTQUFTLFNBQUMsYUFBYTt1QkFFdkIsV0FBVyxTQUFDLDBCQUEwQjt1QkFDdEMsV0FBVyxTQUFDLDBCQUEwQjs0QkE2RnRDLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25DaGFuZ2VzLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgZm9yd2FyZFJlZixcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgVmlld0NoaWxkLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgSW5qZWN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBJbmplY3Rpb25Ub2tlbixcbiAgICBBdHRyaWJ1dGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHN0YXJ0V2l0aCwgdGFwLCBkZWJvdW5jZVRpbWUsIG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgU3ViamVjdCwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgICBOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBOZ0hlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nRm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nTm90Rm91bmRUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBOZ1R5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nTG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBOZ011bHRpTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBOZ1RhZ1RlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nTG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZVxufSBmcm9tICcuL25nLXRlbXBsYXRlcy5kaXJlY3RpdmUnO1xuXG5pbXBvcnQgeyBDb25zb2xlU2VydmljZSB9IGZyb20gJy4vY29uc29sZS5zZXJ2aWNlJztcbmltcG9ydCB7IGlzRGVmaW5lZCwgaXNGdW5jdGlvbiwgaXNQcm9taXNlLCBpc09iamVjdCB9IGZyb20gJy4vdmFsdWUtdXRpbHMnO1xuaW1wb3J0IHsgSXRlbXNMaXN0IH0gZnJvbSAnLi9pdGVtcy1saXN0JztcbmltcG9ydCB7IE5nT3B0aW9uLCBLZXlDb2RlIH0gZnJvbSAnLi9uZy1zZWxlY3QudHlwZXMnO1xuaW1wb3J0IHsgbmV3SWQgfSBmcm9tICcuL2lkJztcbmltcG9ydCB7IE5nRHJvcGRvd25QYW5lbENvbXBvbmVudCB9IGZyb20gJy4vbmctZHJvcGRvd24tcGFuZWwuY29tcG9uZW50JztcbmltcG9ydCB7IE5nT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1vcHRpb24uY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7IE5nU2VsZWN0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTZWxlY3Rpb25Nb2RlbEZhY3Rvcnk+KCduZy1zZWxlY3Qtc2VsZWN0aW9uLW1vZGVsJyk7XG5leHBvcnQgdHlwZSBEcm9wZG93blBvc2l0aW9uID0gJ2JvdHRvbScgfCAndG9wJyB8ICdhdXRvJztcbmV4cG9ydCB0eXBlIEF1dG9Db3JyZWN0ID0gJ29mZicgfCAnb24nO1xuZXhwb3J0IHR5cGUgQXV0b0NhcGl0YWxpemUgPSAnb2ZmJyB8ICdvbic7XG5leHBvcnQgdHlwZSBBZGRUYWdGbiA9ICgodGVybTogc3RyaW5nKSA9PiBhbnkgfCBQcm9taXNlPGFueT4pO1xuZXhwb3J0IHR5cGUgQ29tcGFyZVdpdGhGbiA9IChhOiBhbnksIGI6IGFueSkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEdyb3VwVmFsdWVGbiA9IChrZXk6IHN0cmluZyB8IG9iamVjdCwgY2hpbGRyZW46IGFueVtdKSA9PiBzdHJpbmcgfCBvYmplY3Q7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmctc2VsZWN0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbmctc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9uZy1zZWxlY3QuY29tcG9uZW50LnNjc3MnXSxcbiAgICBwcm92aWRlcnM6IFt7XG4gICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ1NlbGVjdENvbXBvbmVudCksXG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgfV0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBob3N0OiB7XG4gICAgICAgICdyb2xlJzogJ2xpc3Rib3gnLFxuICAgICAgICAnY2xhc3MnOiAnbmctc2VsZWN0JyxcbiAgICAgICAgJ1tjbGFzcy5uZy1zZWxlY3Qtc2luZ2xlXSc6ICchbXVsdGlwbGUnLFxuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdTZWxlY3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQElucHV0KCkgYmluZExhYmVsOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmluZFZhbHVlOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFya0ZpcnN0ID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG5vdEZvdW5kVGV4dDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHR5cGVUb1NlYXJjaFRleHQ6IHN0cmluZztcbiAgICBASW5wdXQoKSBhZGRUYWdUZXh0OiBzdHJpbmc7XG4gICAgQElucHV0KCkgbG9hZGluZ1RleHQ6IHN0cmluZztcbiAgICBASW5wdXQoKSBjbGVhckFsbFRleHQ6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcm9wZG93blBvc2l0aW9uOiBEcm9wZG93blBvc2l0aW9uID0gJ2F1dG8nO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbG9hZGluZyA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGNsb3NlT25TZWxlY3QgPSB0cnVlO1xuICAgIEBJbnB1dCgpIGhpZGVTZWxlY3RlZCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIHNlbGVjdE9uVGFiID0gZmFsc2U7XG4gICAgQElucHV0KCkgb3Blbk9uRW50ZXI6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbWF4U2VsZWN0ZWRJdGVtczogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGdyb3VwQnk6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGdyb3VwVmFsdWU6IEdyb3VwVmFsdWVGbjtcbiAgICBASW5wdXQoKSBidWZmZXJBbW91bnQgPSA0O1xuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGw6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwQXNNb2RlbCA9IHRydWU7XG4gICAgQElucHV0KCkgc2VhcmNoRm4gPSBudWxsO1xuICAgIEBJbnB1dCgpIHRyYWNrQnlGbiA9IG51bGw7XG4gICAgQElucHV0KCkgZXhjbHVkZUdyb3Vwc0Zyb21EZWZhdWx0U2VsZWN0aW9uID0gZmFsc2U7XG4gICAgQElucHV0KCkgY2xlYXJPbkJhY2tzcGFjZSA9IHRydWU7XG4gICAgQElucHV0KCkgcmVhZG9ubHkgPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGxhYmVsRm9ySWQgPSBudWxsO1xuICAgIEBJbnB1dCgpIGF1dG9Db3JyZWN0OiBBdXRvQ29ycmVjdCA9ICdvZmYnO1xuICAgIEBJbnB1dCgpIGF1dG9DYXBpdGFsaXplOiBBdXRvQ2FwaXRhbGl6ZSA9ICdvZmYnO1xuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LXR5cGVhaGVhZCcpIHR5cGVhaGVhZDogU3ViamVjdDxzdHJpbmc+O1xuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LW11bHRpcGxlJykgbXVsdGlwbGUgPSBmYWxzZTtcbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC10YWdnYWJsZScpIGFkZFRhZzogYm9vbGVhbiB8IEFkZFRhZ0ZuID0gZmFsc2U7XG4gICAgQElucHV0KCkgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3Qtc2VhcmNoYWJsZScpIHNlYXJjaGFibGUgPSB0cnVlO1xuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LWNsZWFyYWJsZScpIGNsZWFyYWJsZSA9IHRydWU7XG4gICAgQElucHV0KCkgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3Qtb3BlbmVkJykgaXNPcGVuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGdldCBpdGVtcygpIHsgcmV0dXJuIHRoaXMuX2l0ZW1zIH07XG4gICAgc2V0IGl0ZW1zKHZhbHVlOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl9pdGVtc0FyZVVzZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICAgIH07XG5cbiAgICBASW5wdXQoKVxuICAgIGdldCBjb21wYXJlV2l0aCgpIHsgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoOyB9XG4gICAgc2V0IGNvbXBhcmVXaXRoKGZuOiBDb21wYXJlV2l0aEZuKSB7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdgY29tcGFyZVdpdGhgIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGNsZWFyU2VhcmNoT25BZGQoKSB7IHJldHVybiBpc0RlZmluZWQodGhpcy5fY2xlYXJTZWFyY2hPbkFkZCkgPyB0aGlzLl9jbGVhclNlYXJjaE9uQWRkIDogdGhpcy5jbG9zZU9uU2VsZWN0OyB9O1xuICAgIHNldCBjbGVhclNlYXJjaE9uQWRkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoT25BZGQgPSB2YWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gb3V0cHV0IGV2ZW50c1xuICAgIEBPdXRwdXQoJ2JsdXInKSBibHVyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgnZm9jdXMnKSBmb2N1c0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ29wZW4nKSBvcGVuRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgnY2xvc2UnKSBjbG9zZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ3NlYXJjaCcpIHNlYXJjaEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjx7dGVybTogc3RyaW5nLCBpdGVtczogYW55W119PigpO1xuICAgIEBPdXRwdXQoJ2NsZWFyJykgY2xlYXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCdhZGQnKSBhZGRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCdyZW1vdmUnKSByZW1vdmVFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCdzY3JvbGwnKSBzY3JvbGwgPSBuZXcgRXZlbnRFbWl0dGVyPHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXIgfT4oKTtcbiAgICBAT3V0cHV0KCdzY3JvbGxUb0VuZCcpIHNjcm9sbFRvRW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLy8gY3VzdG9tIHRlbXBsYXRlc1xuICAgIEBDb250ZW50Q2hpbGQoTmdPcHRpb25UZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBvcHRpb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nT3B0Z3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBvcHRncm91cFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGxhYmVsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ011bHRpTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBtdWx0aUxhYmVsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ0hlYWRlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdGb290ZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nTm90Rm91bmRUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBub3RGb3VuZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdUeXBlVG9TZWFyY2hUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSB0eXBlVG9TZWFyY2hUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nTG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBsb2FkaW5nVGV4dFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdUYWdUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSB0YWdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nTG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBsb2FkaW5nU3Bpbm5lclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZChmb3J3YXJkUmVmKCgpID0+IE5nRHJvcGRvd25QYW5lbENvbXBvbmVudCkpIGRyb3Bkb3duUGFuZWw6IE5nRHJvcGRvd25QYW5lbENvbXBvbmVudDtcbiAgICBAQ29udGVudENoaWxkcmVuKE5nT3B0aW9uQ29tcG9uZW50LCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIG5nT3B0aW9uczogUXVlcnlMaXN0PE5nT3B0aW9uQ29tcG9uZW50PjtcbiAgICBAVmlld0NoaWxkKCdmaWx0ZXJJbnB1dCcpIGZpbHRlcklucHV0OiBFbGVtZW50UmVmO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3QtZGlzYWJsZWQnKSBkaXNhYmxlZCA9IGZhbHNlO1xuICAgIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LWZpbHRlcmVkJykgZ2V0IGZpbHRlcmVkKCkgeyByZXR1cm4gISF0aGlzLmZpbHRlclZhbHVlICYmIHRoaXMuc2VhcmNoYWJsZSB9O1xuXG4gICAgaXRlbXNMaXN0OiBJdGVtc0xpc3Q7XG4gICAgdmlld1BvcnRJdGVtczogTmdPcHRpb25bXSA9IFtdO1xuICAgIGZpbHRlclZhbHVlOiBzdHJpbmcgPSBudWxsO1xuICAgIGRyb3Bkb3duSWQgPSBuZXdJZCgpO1xuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIF9pdGVtcyA9IFtdO1xuICAgIHByaXZhdGUgX2l0ZW1zQXJlVXNlZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9kZWZhdWx0TGFiZWwgPSAnbGFiZWwnO1xuICAgIHByaXZhdGUgX3ByaW1pdGl2ZTtcbiAgICBwcml2YXRlIF9tYW51YWxPcGVuOiBib29sZWFuO1xuICAgIHByaXZhdGUgX3ByZXNzZWRLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHByaXZhdGUgX2NvbXBhcmVXaXRoOiBDb21wYXJlV2l0aEZuO1xuICAgIHByaXZhdGUgX2NsZWFyU2VhcmNoT25BZGQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfa2V5UHJlc3MkID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4geyB9O1xuICAgIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHsgfTtcblxuICAgIGNsZWFySXRlbSA9IChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmZpbmQoeCA9PiB4LnZhbHVlID09PSBpdGVtKTtcbiAgICAgICAgdGhpcy51bnNlbGVjdChvcHRpb24pO1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEF0dHJpYnV0ZSgnY2xhc3MnKSBwdWJsaWMgY2xhc3Nlczogc3RyaW5nLFxuICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHB1YmxpYyB0YWJJbmRleDogc3RyaW5nLFxuICAgICAgICBAQXR0cmlidXRlKCdhdXRvZm9jdXMnKSBwcml2YXRlIGF1dG9Gb2N1czogYW55LFxuICAgICAgICBjb25maWc6IE5nU2VsZWN0Q29uZmlnLFxuICAgICAgICBASW5qZWN0KFNFTEVDVElPTl9NT0RFTF9GQUNUT1JZKSBuZXdTZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWxGYWN0b3J5LFxuICAgICAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSBfY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIF9jb25zb2xlOiBDb25zb2xlU2VydmljZVxuICAgICkge1xuICAgICAgICB0aGlzLl9tZXJnZUdsb2JhbENvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLml0ZW1zTGlzdCA9IG5ldyBJdGVtc0xpc3QodGhpcywgbmV3U2VsZWN0aW9uTW9kZWwoKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0IHNlbGVjdGVkSXRlbXMoKTogTmdPcHRpb25bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zTGlzdC5zZWxlY3RlZEl0ZW1zO1xuICAgIH1cblxuICAgIGdldCBzZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQgaGFzVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBnZXQgY3VycmVudFBhbmVsUG9zaXRpb24oKTogRHJvcGRvd25Qb3NpdGlvbiB7XG4gICAgICAgIGlmICh0aGlzLmRyb3Bkb3duUGFuZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRyb3Bkb3duUGFuZWwuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUtleVByZXNzZXMoKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXMuaXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldEl0ZW1zKGNoYW5nZXMuaXRlbXMuY3VycmVudFZhbHVlIHx8IFtdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX21hbnVhbE9wZW4gPSBpc0RlZmluZWQoY2hhbmdlcy5pc09wZW4uY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pdGVtc0FyZVVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldEl0ZW1zRnJvbU5nT3B0aW9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVmaW5lZCh0aGlzLmF1dG9Gb2N1cykpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9kZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgaGFuZGxlS2V5RG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKEtleUNvZGVbJGV2ZW50LndoaWNoXSkge1xuICAgICAgICAgICAgc3dpdGNoICgkZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtleUNvZGUuQXJyb3dEb3duOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVBcnJvd0Rvd24oJGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLZXlDb2RlLkFycm93VXA6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUFycm93VXAoJGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLZXlDb2RlLlNwYWNlOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVTcGFjZSgkZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtleUNvZGUuRW50ZXI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVudGVyKCRldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS2V5Q29kZS5UYWI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVRhYigkZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtleUNvZGUuRXNjOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtleUNvZGUuQmFja3NwYWNlOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVCYWNrc3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGV2ZW50LmtleSAmJiAkZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fa2V5UHJlc3MkLm5leHQoJGV2ZW50LmtleS50b0xvY2FsZUxvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU1vdXNlZG93bigkZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gJGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZy1jbGVhci13cmFwcGVyJykpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xlYXJDbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25nLWFycm93LXdyYXBwZXInKSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVBcnJvd0NsaWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbmctdmFsdWUtaWNvbicpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQXJyb3dDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUNsZWFyQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTmdNb2RlbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoKCk7XG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgaWYgKHRoaXMuX2lzVHlwZWFoZWFkKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGVhaGVhZC5uZXh0KG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJFdmVudC5lbWl0KCk7XG4gICAgfVxuXG4gICAgY2xlYXJNb2RlbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsZWFyYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LmNsZWFyU2VsZWN0ZWQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTmdNb2RlbCgpO1xuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LmNsZWFyU2VsZWN0ZWQoKTtcbiAgICAgICAgdGhpcy5faGFuZGxlV3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgICAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3BlbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5pc09wZW4gfHwgdGhpcy5pdGVtc0xpc3QubWF4SXRlbXNTZWxlY3RlZCB8fCB0aGlzLl9tYW51YWxPcGVuIHx8IHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5faXNUeXBlYWhlYWQgJiYgIXRoaXMuYWRkVGFnICYmIHRoaXMuaXRlbXNMaXN0Lm5vSXRlbXNUb1NlbGVjdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcbiAgICAgICAgdGhpcy5vcGVuRXZlbnQuZW1pdCgpO1xuICAgICAgICBpZiAoIXRoaXMuZmlsdGVyVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbiB8fCB0aGlzLl9tYW51YWxPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2goKTtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICAgIHRoaXMuY2xvc2VFdmVudC5lbWl0KCk7XG4gICAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHRvZ2dsZUl0ZW0oaXRlbTogTmdPcHRpb24pIHtcbiAgICAgICAgaWYgKCFpdGVtIHx8IGl0ZW0uZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy51bnNlbGVjdChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0KGl0ZW06IE5nT3B0aW9uKSB7XG4gICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KGl0ZW0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xlYXJTZWFyY2hPbkFkZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFdmVudC5lbWl0KGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTmdNb2RlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xvc2VPblNlbGVjdCB8fCB0aGlzLml0ZW1zTGlzdC5ub0l0ZW1zVG9TZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB0aGlzLmZpbHRlcklucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICB1bnNlbGVjdChpdGVtOiBOZ09wdGlvbikge1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU5nTW9kZWwoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudC5lbWl0KGl0ZW0pO1xuICAgIH1cblxuICAgIHNlbGVjdFRhZygpIHtcbiAgICAgICAgbGV0IHRhZztcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpcy5hZGRUYWcpKSB7XG4gICAgICAgICAgICB0YWcgPSAoPEFkZFRhZ0ZuPnRoaXMuYWRkVGFnKSh0aGlzLmZpbHRlclZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhZyA9IHRoaXMuX3ByaW1pdGl2ZSA/IHRoaXMuZmlsdGVyVmFsdWUgOiB7IFt0aGlzLmJpbmRMYWJlbF06IHRoaXMuZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhbmRsZVRhZyA9IChpdGVtKSA9PiB0aGlzLl9pc1R5cGVhaGVhZCB8fCAhdGhpcy5pc09wZW4gPyB0aGlzLml0ZW1zTGlzdC5tYXBJdGVtKGl0ZW0sIG51bGwpIDogdGhpcy5pdGVtc0xpc3QuYWRkSXRlbShpdGVtKTtcbiAgICAgICAgaWYgKGlzUHJvbWlzZSh0YWcpKSB7XG4gICAgICAgICAgICB0YWcudGhlbihpdGVtID0+IHRoaXMuc2VsZWN0KGhhbmRsZVRhZyhpdGVtKSkpLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFnKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdChoYW5kbGVUYWcodGFnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Q2xlYXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsZWFyYWJsZSAmJiAodGhpcy5oYXNWYWx1ZSB8fCB0aGlzLmZpbHRlclZhbHVlKSAmJiAhdGhpcy5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICB0cmFja0J5T3B0aW9uID0gKF86IG51bWJlciwgaXRlbTogTmdPcHRpb24pID0+IHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2tCeUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0J5Rm4oaXRlbS52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgZ2V0IHNob3dBZGRUYWcoKSB7XG4gICAgICAgIGlmICghdGhpcy5maWx0ZXJWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGVybSA9IHRoaXMuZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkVGFnICYmXG4gICAgICAgICAgICAoIXRoaXMuaXRlbXNMaXN0LmZpbHRlcmVkSXRlbXMuc29tZSh4ID0+IHgubGFiZWwudG9Mb3dlckNhc2UoKSA9PT0gdGVybSkgJiZcbiAgICAgICAgICAgICAgICAoIXRoaXMuaGlkZVNlbGVjdGVkICYmIHRoaXMuaXNPcGVuIHx8ICF0aGlzLnNlbGVjdGVkSXRlbXMuc29tZSh4ID0+IHgubGFiZWwudG9Mb3dlckNhc2UoKSA9PT0gdGVybSkpKSAmJlxuICAgICAgICAgICAgIXRoaXMubG9hZGluZztcbiAgICB9XG5cbiAgICBzaG93Tm9JdGVtc0ZvdW5kKCkge1xuICAgICAgICBjb25zdCBlbXB0eSA9IHRoaXMuaXRlbXNMaXN0LmZpbHRlcmVkSXRlbXMubGVuZ3RoID09PSAwO1xuICAgICAgICByZXR1cm4gKChlbXB0eSAmJiAhdGhpcy5faXNUeXBlYWhlYWQgJiYgIXRoaXMubG9hZGluZykgfHxcbiAgICAgICAgICAgIChlbXB0eSAmJiB0aGlzLl9pc1R5cGVhaGVhZCAmJiB0aGlzLmZpbHRlclZhbHVlICYmICF0aGlzLmxvYWRpbmcpKSAmJlxuICAgICAgICAgICAgIXRoaXMuc2hvd0FkZFRhZztcbiAgICB9XG5cbiAgICBzaG93VHlwZVRvU2VhcmNoKCkge1xuICAgICAgICBjb25zdCBlbXB0eSA9IHRoaXMuaXRlbXNMaXN0LmZpbHRlcmVkSXRlbXMubGVuZ3RoID09PSAwO1xuICAgICAgICByZXR1cm4gZW1wdHkgJiYgdGhpcy5faXNUeXBlYWhlYWQgJiYgIXRoaXMuZmlsdGVyVmFsdWUgJiYgIXRoaXMubG9hZGluZztcbiAgICB9XG5cbiAgICBmaWx0ZXIodGVybTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWUgPSB0ZXJtO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc1R5cGVhaGVhZCkge1xuICAgICAgICAgICAgdGhpcy50eXBlYWhlYWQubmV4dCh0aGlzLmZpbHRlclZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LmZpbHRlcih0aGlzLmZpbHRlclZhbHVlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtTZWxlY3RlZE9yRGVmYXVsdCh0aGlzLm1hcmtGaXJzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlYXJjaEV2ZW50LmVtaXQoeyB0ZXJtLCBpdGVtczogdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKSB9KTtcblxuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG5cbiAgICBvbklucHV0Rm9jdXMoJGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmZvY3VzZWQgfHwgdGhpcy5yZWFkb25seSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25nLXNlbGVjdC1mb2N1c2VkJyk7XG4gICAgICAgIHRoaXMuZm9jdXNFdmVudC5lbWl0KCRldmVudCk7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25JbnB1dEJsdXIoJGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCduZy1zZWxlY3QtZm9jdXNlZCcpO1xuICAgICAgICB0aGlzLmJsdXJFdmVudC5lbWl0KCRldmVudCk7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4gJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSXRlbUhvdmVyKGl0ZW06IE5nT3B0aW9uKSB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya0l0ZW0oaXRlbSk7XG4gICAgfVxuXG4gICAgZGV0ZWN0Q2hhbmdlcygpIHtcbiAgICAgICAgaWYgKCEoPGFueT50aGlzLl9jZCkuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVEcm9wZG93blBvc2l0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kcm9wZG93blBhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duUGFuZWwudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0SXRlbXMoaXRlbXM6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IGl0ZW1zWzBdO1xuICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuYmluZExhYmVsIHx8IHRoaXMuX2RlZmF1bHRMYWJlbDtcbiAgICAgICAgdGhpcy5fcHJpbWl0aXZlID0gaXNEZWZpbmVkKGZpcnN0SXRlbSkgPyAhaXNPYmplY3QoZmlyc3RJdGVtKSA6IHRoaXMuX3ByaW1pdGl2ZSB8fCB0aGlzLmJpbmRMYWJlbCA9PT0gdGhpcy5fZGVmYXVsdExhYmVsO1xuICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZXRJdGVtcyhpdGVtcyk7XG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwICYmIHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc09wZW4gJiYgaXNEZWZpbmVkKHRoaXMuZmlsdGVyVmFsdWUpICYmICF0aGlzLl9pc1R5cGVhaGVhZCkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QuZmlsdGVyKHRoaXMuZmlsdGVyVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc1R5cGVhaGVhZCB8fCB0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3NldEl0ZW1zRnJvbU5nT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlTmdPcHRpb25zID0gKG9wdGlvbnM6IFF1ZXJ5TGlzdDxOZ09wdGlvbkNvbXBvbmVudD4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gKHtcbiAgICAgICAgICAgICAgICAkbmdPcHRpb25WYWx1ZTogb3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICAgICRuZ09wdGlvbkxhYmVsOiBvcHRpb24uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uLmRpc2FibGVkXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZXRJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlT3B0aW9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZE9yRGVzdHJveWVkID0gbWVyZ2UodGhpcy5uZ09wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSQpO1xuICAgICAgICAgICAgbWVyZ2UoLi4udGhpcy5uZ09wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uc3RhdGVDaGFuZ2UkKSlcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zTGlzdC5maW5kSXRlbShvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmRpc2FibGVkID0gb3B0aW9uLmRpc2FibGVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm5nT3B0aW9ucy5jaGFuZ2VzXG4gICAgICAgICAgICAucGlwZShzdGFydFdpdGgodGhpcy5uZ09wdGlvbnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuX2RlZmF1bHRMYWJlbDtcbiAgICAgICAgICAgICAgICBoYW5kbGVOZ09wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgaGFuZGxlT3B0aW9uQ2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc1ZhbGlkV3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSB8fCAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSA9PT0gJycpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdGVCaW5kaW5nID0gKGl0ZW06IGFueSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodGhpcy5jb21wYXJlV2l0aCkgJiYgaXNPYmplY3QoaXRlbSkgJiYgdGhpcy5iaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25zb2xlLndhcm4oYEJpbmRpbmcgb2JqZWN0KCR7SlNPTi5zdHJpbmdpZnkoaXRlbSl9KSB3aXRoIGJpbmRWYWx1ZSBpcyBub3QgYWxsb3dlZC5gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUud2FybignTXVsdGlwbGUgc2VsZWN0IG5nTW9kZWwgc2hvdWxkIGJlIGFycmF5LicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5ldmVyeShpdGVtID0+IHZhbGlkYXRlQmluZGluZyhpdGVtKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVCaW5kaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVdyaXRlVmFsdWUobmdNb2RlbDogYW55IHwgYW55W10pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1ZhbGlkV3JpdGVWYWx1ZShuZ01vZGVsKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWxlY3QgPSAodmFsOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc0xpc3QuZmluZEl0ZW0odmFsKTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KGl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1ZhbE9iamVjdCA9IGlzT2JqZWN0KHZhbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNQcmltaXRpdmUgPSAhaXNWYWxPYmplY3QgJiYgIXRoaXMuYmluZFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICgoaXNWYWxPYmplY3QgfHwgaXNQcmltaXRpdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LnNlbGVjdCh0aGlzLml0ZW1zTGlzdC5tYXBJdGVtKHZhbCwgbnVsbCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5iaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0aGlzLmJpbmRMYWJlbF06IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBbdGhpcy5iaW5kVmFsdWVdOiB2YWxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KHRoaXMuaXRlbXNMaXN0Lm1hcEl0ZW0oaXRlbSwgbnVsbCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgKDxhbnlbXT5uZ01vZGVsKS5mb3JFYWNoKGl0ZW0gPT4gc2VsZWN0KGl0ZW0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdChuZ01vZGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZUtleVByZXNzZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2tleVByZXNzJFxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSxcbiAgICAgICAgICAgICAgICB0YXAobGV0dGVyID0+IHRoaXMuX3ByZXNzZWRLZXlzLnB1c2gobGV0dGVyKSksXG4gICAgICAgICAgICAgICAgZGVib3VuY2VUaW1lKDIwMCksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuX3ByZXNzZWRLZXlzLmxlbmd0aCA+IDApLFxuICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLl9wcmVzc2VkS2V5cy5qb2luKCcnKSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHRlcm0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zTGlzdC5maW5kQnlMYWJlbCh0ZXJtKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVzc2VkS2V5cyA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlTmdNb2RlbCgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmluZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cEtleSA9IHRoaXMuZ3JvdXBWYWx1ZSA/IHRoaXMuYmluZFZhbHVlIDogPHN0cmluZz50aGlzLmdyb3VwQnk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZVtncm91cEtleSB8fCA8c3RyaW5nPnRoaXMuZ3JvdXBCeV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLml0ZW1zTGlzdC5yZXNvbHZlTmVzdGVkKGl0ZW0udmFsdWUsIHRoaXMuYmluZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZGVsLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRXZlbnQuZW1pdChzZWxlY3RlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShpc0RlZmluZWQobW9kZWxbMF0pID8gbW9kZWxbMF0gOiBudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRXZlbnQuZW1pdChzZWxlY3RlZFswXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGVhclNlYXJjaCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpbHRlclZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QucmVzZXRGaWx0ZXJlZEl0ZW1zKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2Nyb2xsVG9NYXJrZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuZHJvcGRvd25QYW5lbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJvcGRvd25QYW5lbC5zY3JvbGxJbnRvKHRoaXMuaXRlbXNMaXN0Lm1hcmtlZEl0ZW0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Njcm9sbFRvVGFnKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuIHx8ICF0aGlzLmRyb3Bkb3duUGFuZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyb3Bkb3duUGFuZWwuc2Nyb2xsSW50b1RhZygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVRhYigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuID09PSBmYWxzZSAmJiAhaXNEZWZpbmVkKHRoaXMuYWRkVGFnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9uVGFiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG93QWRkVGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlRW50ZXIoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzT3BlbiB8fCB0aGlzLl9tYW51YWxPcGVuKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG93QWRkVGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wZW5PbkVudGVyKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVNwYWNlKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4gfHwgdGhpcy5fbWFudWFsT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVBcnJvd0Rvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLl9uZXh0SXRlbUlzVGFnKCsxKSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5tYXJrSXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9UYWcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtOZXh0SXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9NYXJrZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlQXJyb3dVcCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX25leHRJdGVtSXNUYWcoLTEpKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC51bm1hcmtJdGVtKCk7XG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxUb1RhZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1ByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9NYXJrZWQoKTtcbiAgICAgICAgfVxuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9uZXh0SXRlbUlzVGFnKG5leHRTdGVwOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gdGhpcy5pdGVtc0xpc3QubWFya2VkSW5kZXggKyBuZXh0U3RlcDtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkVGFnICYmIHRoaXMuZmlsdGVyVmFsdWVcbiAgICAgICAgICAgICYmIHRoaXMuaXRlbXNMaXN0Lm1hcmtlZEl0ZW1cbiAgICAgICAgICAgICYmIChuZXh0SW5kZXggPCAwIHx8IG5leHRJbmRleCA9PT0gdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5sZW5ndGgpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlQmFja3NwYWNlKCkge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJWYWx1ZSB8fCAhdGhpcy5jbGVhcmFibGUgfHwgIXRoaXMuY2xlYXJPbkJhY2tzcGFjZSB8fCAhdGhpcy5oYXNWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMudW5zZWxlY3QodGhpcy5pdGVtc0xpc3QubGFzdFNlbGVjdGVkSXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyTW9kZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IF9pc1R5cGVhaGVhZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZWFoZWFkICYmIHRoaXMudHlwZWFoZWFkLm9ic2VydmVycy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21lcmdlR2xvYmFsQ29uZmlnKGNvbmZpZzogTmdTZWxlY3RDb25maWcpIHtcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXIgfHwgY29uZmlnLnBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLm5vdEZvdW5kVGV4dCA9IHRoaXMubm90Rm91bmRUZXh0IHx8IGNvbmZpZy5ub3RGb3VuZFRleHQ7XG4gICAgICAgIHRoaXMudHlwZVRvU2VhcmNoVGV4dCA9IHRoaXMudHlwZVRvU2VhcmNoVGV4dCB8fCBjb25maWcudHlwZVRvU2VhcmNoVGV4dDtcbiAgICAgICAgdGhpcy5hZGRUYWdUZXh0ID0gdGhpcy5hZGRUYWdUZXh0IHx8IGNvbmZpZy5hZGRUYWdUZXh0O1xuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0ID0gdGhpcy5sb2FkaW5nVGV4dCB8fCBjb25maWcubG9hZGluZ1RleHQ7XG4gICAgICAgIHRoaXMuY2xlYXJBbGxUZXh0ID0gdGhpcy5jbGVhckFsbFRleHQgfHwgY29uZmlnLmNsZWFyQWxsVGV4dDtcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsID0gaXNEZWZpbmVkKHRoaXMudmlydHVhbFNjcm9sbClcbiAgICAgICAgICAgID8gdGhpcy52aXJ0dWFsU2Nyb2xsXG4gICAgICAgICAgICA6IGlzRGVmaW5lZChjb25maWcuZGlzYWJsZVZpcnR1YWxTY3JvbGwpID8gIWNvbmZpZy5kaXNhYmxlVmlydHVhbFNjcm9sbCA6IGZhbHNlO1xuICAgICAgICB0aGlzLm9wZW5PbkVudGVyID0gaXNEZWZpbmVkKHRoaXMub3Blbk9uRW50ZXIpID8gdGhpcy5vcGVuT25FbnRlciA6IGNvbmZpZy5vcGVuT25FbnRlcjtcbiAgICB9XG59XG4iXX0=