import 'slickgrid/plugins/slick.checkboxselectcolumn';
import 'slickgrid/plugins/slick.rowselectionmodel';
import { Injectable } from '@angular/core';

import { Column, Extension, GridOption } from '../models/index';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare const Slick: any;

@Injectable()
export class CheckboxSelectorExtension implements Extension {
  private _addon: any;
  private _rowSelectionPlugin: any;

  constructor(private sharedService: SharedService) { }

  dispose() {
    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
    }
    this._addon = null;
    if (this._rowSelectionPlugin && this._rowSelectionPlugin.destroy) {
      this._rowSelectionPlugin.destroy();
    }
  }

  /**
   * Create the plugin before the Grid creation, else it will behave oddly.
   * Mostly because the column definitions might change after the grid creation
   */
  create(columnDefinitions: Column[], gridOptions: GridOption) {
    if (Array.isArray(columnDefinitions) && gridOptions) {
      if (!this._addon) {
        this._addon = new Slick.CheckboxSelectColumn(gridOptions.checkboxSelector || {});
      }
      const selectionColumn: Column = this._addon.getColumnDefinition();
      if (typeof selectionColumn === 'object') {
        selectionColumn.excludeFromExport = true;
        selectionColumn.excludeFromColumnPicker = true;
        selectionColumn.excludeFromGridMenu = true;
        selectionColumn.excludeFromQuery = true;
        selectionColumn.excludeFromHeaderMenu = true;
        selectionColumn.maxWidth = selectionColumn.width || 30;

        // column index position in the grid
        const columnPosition = gridOptions && gridOptions.checkboxSelector && gridOptions.checkboxSelector.columnIndexPosition || 0;
        if (columnPosition > 0) {
          columnDefinitions.splice(columnPosition, 0, selectionColumn);
        } else {
          columnDefinitions.unshift(selectionColumn);
        }
      }
      return this._addon;
    }
    return null;
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance() {
    return this._addon;
  }

  register(rowSelectionPlugin?: any) {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
      this.sharedService.grid.registerPlugin(this._addon);

      // this also requires the Row Selection Model to be registered as well
      if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
        rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
        this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
      }

      // user might want to pre-select some rows
      // the setTimeout is because of timing issue with styling (row selection happen but rows aren't highlighted properly)
      if (this.sharedService.gridOptions.preselectedRows && rowSelectionPlugin && this.sharedService.grid.getSelectionModel()) {
        setTimeout(() => this._addon.selectRows(this.sharedService.gridOptions.preselectedRows));
      }

      this._rowSelectionPlugin = rowSelectionPlugin;
      return rowSelectionPlugin;
    }
    return null;
  }
}
