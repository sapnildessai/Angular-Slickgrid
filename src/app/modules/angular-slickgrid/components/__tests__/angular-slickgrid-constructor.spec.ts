import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';

import { AngularSlickgridComponent } from '../angular-slickgrid.component';
import { ExtensionUtility } from '../../extensions';
import {
  ExcelExportService,
  ExportService,
  ExtensionService,
  FilterService,
  GraphqlService,
  GridService,
  GridEventService,
  GridStateService,
  GroupingAndColspanService,
  PaginationService,
  ResizerService,
  SharedService,
  SortService,
  TreeDataService,
} from '../../services';
import { Column, CurrentFilter, CurrentPinning, CurrentSorter, Formatter, GraphqlPaginatedResult, GraphqlServiceApi, GraphqlServiceOption, GridOption, GridState, GridStateChange, GridStateType, Pagination, ServicePagination } from '../../models';
import { Filters } from '../../filters';
import { Editors } from '../../editors';
import * as slickVanillaUtilities from '../slick-vanilla-utilities';
import * as utilities from '../../services/backend-utilities';


const mockAutoAddCustomEditorFormatter = jest.fn();
const mockExecuteBackendProcess = jest.fn();
const mockRefreshBackendDataset = jest.fn();
// @ts-ignore
utilities.executeBackendProcessesCallback = mockExecuteBackendProcess;
// @ts-ignore
utilities.refreshBackendDataset = mockRefreshBackendDataset;
(slickVanillaUtilities.autoAddEditorFormatterToColumnsWithEditor as any) = mockAutoAddCustomEditorFormatter;


const mockBackendError = jest.fn();
// @ts-ignore
utilities.onBackendError = mockBackendError;

declare const Slick: any;
jest.mock('flatpickr', () => { });
const sharedService = new SharedService();

const excelExportServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as ExcelExportService;

const exportServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as ExportService;

const extensionServiceStub = {
  bindDifferentExtensions: jest.fn(),
  createExtensionsBeforeGridCreation: jest.fn(),
  dispose: jest.fn(),
  renderColumnHeaders: jest.fn(),
  translateCellMenu: jest.fn(),
  translateColumnHeaders: jest.fn(),
  translateColumnPicker: jest.fn(),
  translateContextMenu: jest.fn(),
  translateGridMenu: jest.fn(),
  translateHeaderMenu: jest.fn(),
} as unknown as ExtensionService;

const mockExtensionUtility = {
  translateItems: jest.fn(),
} as unknown as ExtensionUtility;

const groupingAndColspanServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  translateGroupingAndColSpan: jest.fn(),
} as unknown as GroupingAndColspanService;

const mockGraphqlService = {
  getDatasetName: jest.fn(),
  buildQuery: jest.fn(),
  init: jest.fn(),
  updateFilters: jest.fn(),
  updateSorters: jest.fn(),
  updatePagination: jest.fn(),
} as unknown as GraphqlService;

const filterServiceStub = {
  clearFilters: jest.fn(),
  dispose: jest.fn(),
  init: jest.fn(),
  bindBackendOnFilter: jest.fn(),
  bindLocalOnFilter: jest.fn(),
  bindLocalOnSort: jest.fn(),
  bindBackendOnSort: jest.fn(),
  populateColumnFilterSearchTermPresets: jest.fn(),
  refreshTreeDataFilters: jest.fn(),
  getColumnFilters: jest.fn(),
} as unknown as FilterService;

const gridEventServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  bindOnCellChange: jest.fn(),
  bindOnClick: jest.fn(),
} as unknown as GridEventService;

const gridServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  setSelectedRows: jest.fn(),
} as unknown as GridService;

const gridStateServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  getAssociatedGridColumns: jest.fn(),
  getCurrentGridState: jest.fn(),
  needToPreserveRowSelection: jest.fn(),
  onGridStateChanged: new Subject<GridStateChange>(),
} as unknown as GridStateService;

const paginationServiceStub = {
  totalItems: 0,
  init: jest.fn(),
  dispose: jest.fn(),
  updateTotalItems: jest.fn(),
  onPaginationVisibilityChanged: new Subject<boolean>(),
  onPaginationChanged: new Subject<ServicePagination>(),
} as unknown as PaginationService;

Object.defineProperty(paginationServiceStub, 'totalItems', {
  get: jest.fn(() => 0),
  set: jest.fn()
});

const resizerServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  bindAutoResizeDataGrid: jest.fn(),
  resizeGrid: jest.fn(),
  resizeColumnsByCellContent: jest.fn(),
} as unknown as ResizerService;

const sortServiceStub = {
  bindBackendOnSort: jest.fn(),
  bindLocalOnSort: jest.fn(),
  dispose: jest.fn(),
  loadGridSorters: jest.fn(),
  processTreeDataInitialSort: jest.fn(),
  sortHierarchicalDataset: jest.fn(),
} as unknown as SortService;

const treeDataServiceStub = {
  convertFlatParentChildToTreeDataset: jest.fn(),
  init: jest.fn(),
  convertFlatParentChildToTreeDatasetAndSort: jest.fn(),
  dispose: jest.fn(),
  handleOnCellClick: jest.fn(),
  sortHierarchicalDataset: jest.fn(),
  toggleTreeDataCollapse: jest.fn(),
} as unknown as TreeDataService;

const mockGroupItemMetaProvider = {
  init: jest.fn(),
  destroy: jest.fn(),
  defaultGroupCellFormatter: jest.fn(),
  defaultTotalsCellFormatter: jest.fn(),
  handleGridClick: jest.fn(),
  handleGridKeyDown: jest.fn(),
  getGroupRowMetadata: jest.fn(),
  getTotalsRowMetadata: jest.fn(),
};

const mockDataView = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  getItem: jest.fn(),
  getItemCount: jest.fn(),
  getItems: jest.fn(),
  getLength: jest.fn(),
  getItemMetadata: jest.fn(),
  getPagingInfo: jest.fn(),
  mapIdsToRows: jest.fn(),
  mapRowsToIds: jest.fn(),
  onRowsOrCountChanged: jest.fn(),
  onSetItemsCalled: new Slick.Event(),
  reSort: jest.fn(),
  setItems: jest.fn(),
  syncGridSelection: jest.fn(),
};

const mockDraggableGrouping = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
};

const mockSlickCore = {
  handlers: [],
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
};

const mockGetEditorLock = {
  isActive: () => true,
  commitCurrentEdit: jest.fn(),
};

const mockGrid = {
  autosizeColumns: jest.fn(),
  destroy: jest.fn(),
  init: jest.fn(),
  invalidate: jest.fn(),
  getActiveCellNode: jest.fn(),
  getColumns: jest.fn(),
  getData: () => mockDataView,
  getSelectionModel: jest.fn(),
  getEditorLock: () => mockGetEditorLock,
  getOptions: jest.fn(),
  getScrollbarDimensions: jest.fn(),
  getUID: jest.fn(),
  render: jest.fn(),
  resizeCanvas: jest.fn(),
  setColumns: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  setSelectedRows: jest.fn(),
  onRendered: jest.fn(),
  onScroll: jest.fn(),
  onSelectedRowsChanged: new Slick.Event(),
};

const mockSlickCoreImplementation = jest.fn().mockImplementation(() => (mockSlickCore));
const mockDataViewImplementation = jest.fn().mockImplementation(() => (mockDataView));
const mockGroupItemMetaProviderImplementation = jest.fn().mockImplementation(() => (mockGroupItemMetaProvider));
const mockGridImplementation = jest.fn().mockImplementation(() => (mockGrid));
const mockDraggableGroupingImplementation = jest.fn().mockImplementation(() => (mockDraggableGrouping));

jest.mock('slickgrid/slick.core', () => mockSlickCoreImplementation);
jest.mock('slickgrid/slick.grid', () => mockGridImplementation);
jest.mock('slickgrid/plugins/slick.draggablegrouping', () => mockDraggableGroupingImplementation);
Slick.Grid = mockGridImplementation;
Slick.EventHandler = mockSlickCoreImplementation;
Slick.Data = { DataView: mockDataViewImplementation, GroupItemMetadataProvider: mockGroupItemMetaProviderImplementation };
Slick.DraggableGrouping = mockDraggableGroupingImplementation;

describe('Angular-Slickgrid Custom Component instantiated via Constructor', () => {
  let component: AngularSlickgridComponent;
  let divContainer: HTMLDivElement;
  let cellDiv: HTMLDivElement;
  let mockElementRef: ElementRef;
  let translate: TranslateService;
  let mockChangeDetectorRef: ChangeDetectorRef;

  const template = `
  <div id="grid1" style="height: 800px; width: 600px;">
      <div id="slickGridContainer-grid1" class="gridPane" style="width: 100%;">
      </div>
    </div>
  <angular-slickgrid
    grid-id="grid1"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </angular-slickgrid>`;

  beforeEach(() => {
    divContainer = document.createElement('div');
    cellDiv = document.createElement('div');
    divContainer.innerHTML = template;
    divContainer.appendChild(cellDiv);
    document.body.appendChild(divContainer);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    translate = TestBed.inject(TranslateService);

    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    } as unknown as ChangeDetectorRef;

    mockElementRef = {
      nativeElement: divContainer
    } as ElementRef;

    component = new AngularSlickgridComponent(
      mockChangeDetectorRef,
      mockElementRef,
      excelExportServiceStub,
      exportServiceStub,
      extensionServiceStub,
      mockExtensionUtility,
      filterServiceStub,
      gridEventServiceStub,
      gridServiceStub,
      gridStateServiceStub,
      groupingAndColspanServiceStub,
      paginationServiceStub,
      resizerServiceStub,
      sharedService,
      sortServiceStub,
      treeDataServiceStub,
      translate,
      {} as GridOption
    );

    component.gridId = 'grid1';
    component.columnDefinitions = [{ id: 'name', field: 'name' }];
    component.dataset = [];
    component.gridOptions = { enableExcelExport: false, dataView: null } as unknown as GridOption;
    component.gridHeight = 600;
    component.gridWidth = 800;
  });

  it('should make sure Angular-Slickgrid is defined', () => {
    expect(component).toBeTruthy();
  });

  it('should create a grid and expect multiple Event Aggregator being called', () => {
    const onBeforeGridCreateSpy = jest.spyOn(component.onBeforeGridCreate, 'emit');
    const onDataViewCreatedSpy = jest.spyOn(component.onDataviewCreated, 'emit');
    const onGridCreatedSpy = jest.spyOn(component.onGridCreated, 'emit');
    const onBeforeGridDestroySpy = jest.spyOn(component.onBeforeGridDestroy, 'emit');
    const onAfterGridDestroyedSpy = jest.spyOn(component.onAfterGridDestroyed, 'emit');

    component.ngOnInit();
    component.ngAfterViewInit();
    expect(onBeforeGridCreateSpy).toHaveBeenCalled();
    expect(onDataViewCreatedSpy).toHaveBeenCalled();
    expect(onGridCreatedSpy).toHaveBeenCalled();

    component.ngOnDestroy();
    expect(onBeforeGridDestroySpy).toHaveBeenCalled();
    expect(onAfterGridDestroyedSpy).toHaveBeenCalled();
  });

  it('should load enable jquery mousewheel scrolling when using a frozen grid', () => {
    component.gridOptions.enableMouseWheelScrollHandler = undefined;
    component.gridOptions.frozenColumn = 3;

    component.ngOnInit();
    component.ngAfterViewInit();

    expect(component.gridOptions.enableMouseWheelScrollHandler).toBeTrue();
  });

  it('should keep frozen column index reference (via frozenVisibleColumnId) when grid is a frozen grid', () => {
    const sharedFrozenIndexSpy = jest.spyOn(SharedService.prototype, 'frozenVisibleColumnId', 'set');
    component.gridOptions.frozenColumn = 0;

    component.ngOnInit();
    component.ngAfterViewInit();

    expect(sharedFrozenIndexSpy).toHaveBeenCalledWith('name');
  });

  describe('initialization method', () => {
    const customEditableInputFormatter: Formatter = (_row, _cell, value, columnDef) => {
      const isEditableLine = !!columnDef.editor;
      value = (value === null || value === undefined) ? '' : value;
      return isEditableLine ? `<div class="editing-field">${value}</div>` : value;
    };

    describe('autoAddCustomEditorFormatter grid option', () => {
      it('should initialize the grid and automatically add custom Editor Formatter when provided in the grid options', () => {
        const autoAddFormatterSpy = jest.spyOn(slickVanillaUtilities, 'autoAddEditorFormatterToColumnsWithEditor');

        component.gridOptions.autoAddCustomEditorFormatter = customEditableInputFormatter;
        component.ngOnInit();
        component.ngAfterViewInit();

        expect(autoAddFormatterSpy).toHaveBeenCalledWith([{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }], customEditableInputFormatter);
      });
    });

    describe('columns definitions changed', () => {
      it('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(component, 'updateColumnDefinitionsList');
        const renderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        component.gridOptions.enableTranslate = true;
        component.ngOnInit();
        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        expect(component.columnDefinitions).toEqual(mockColDefs);
        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
        expect(renderSpy).toHaveBeenCalledWith(false, mockColDefs);
      });

      it('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(component, 'updateColumnDefinitionsList');
        const renderSpy = jest.spyOn(extensionServiceStub, 'renderColumnHeaders');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        component.ngOnInit();
        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
        expect(renderSpy).toHaveBeenCalledWith(mockColDefs, true);
      });
    });

    describe('dataset changed', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should call "getItems" method from the DataView when user calls the "dataset" Getter', () => {
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        component.gridOptions = { showHeaderRow: false } as GridOption;
        const gridSpy = jest.spyOn(mockDataView, 'getItems').mockReturnValue(mockData);

        component.dataset = mockData;
        component.ngAfterViewInit();

        expect(component.dataset).toEqual(mockData);
      });

      it('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(component, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        component.gridOptions.autoFitColumnsOnFirstLoad = true;
        component.ngAfterViewInit();
        component.dataset = mockData;

        expect(autosizeSpy).toHaveBeenCalledTimes(2); // 1x by datasetChanged and 2x by bindResizeHook
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(component, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        component.gridOptions.autoFitColumnsOnFirstLoad = false;
        component.ngAfterViewInit();
        component.dataset = mockData;

        expect(autosizeSpy).not.toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should expect "resizeColumnsByCellContent" being called when "enableAutoResizeColumnsByCellContent" is set and we changing column definitions via its SETTER', () => {
        const resizeContentSpy = jest.spyOn(resizerServiceStub, 'resizeColumnsByCellContent');
        const refreshSpy = jest.spyOn(component, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];
        jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

        component.columnDefinitions = mockColDefs;
        component.gridOptions.autoFitColumnsOnFirstLoad = false;
        component.gridOptions.enableAutoSizeColumns = false;
        component.gridOptions.autosizeColumnsByCellContentOnFirstLoad = true;
        component.gridOptions.enableAutoResizeColumnsByCellContent = true;
        component.ngAfterViewInit();
        component.dataset = mockData;
        component.columnDefinitions = mockColDefs;

        expect(resizeContentSpy).toHaveBeenCalledTimes(1);
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should throw an error if we try to enable both auto resize type at same time with "autoFitColumnsOnFirstLoad" and "autosizeColumnsByCellContentOnFirstLoad"', (done) => {
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

        component.gridOptions.autoFitColumnsOnFirstLoad = true;
        component.gridOptions.autosizeColumnsByCellContentOnFirstLoad = true;

        try {
          component.ngAfterViewInit();
          component.dataset = mockData;
        } catch (e) {
          expect(e.toString()).toContain('[Angular-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
          component.destroy();
          done();
        }
      });

      it('should throw an error if we try to enable both auto resize type at same time with "enableAutoSizeColumns" and "enableAutoResizeColumnsByCellContent"', (done) => {
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

        component.gridOptions.enableAutoSizeColumns = true;
        component.gridOptions.enableAutoResizeColumnsByCellContent = true;

        try {
          component.ngAfterViewInit();
          component.dataset = mockData;
        } catch (e) {
          expect(e.toString()).toContain('[Angular-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
          component.destroy();
          done();
        }
      });
    });

    describe('with editors', () => {
      it('should display a console error when any of the column definition ids include a dot notation', () => {
        const consoleSpy = jest.spyOn(global.console, 'error').mockReturnValue();
        const mockColDefs = [{ id: 'user.gender', field: 'user.gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];

        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        expect(consoleSpy).toHaveBeenCalledWith('[Angular-Slickgrid] Make sure that none of your Column Definition "id" property includes a dot in its name because that will cause some problems with the Editors. For example if your column definition "field" property is "user.firstName" then use "firstName" as the column "id".');
      });

      it('should be able to load async editors with a regular Promise', (done) => {
        const mockCollection = ['male', 'female'];
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: of(mockCollection) } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(component.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
          expect(component.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
          expect(component.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
          done();
        });
      });
    });

    describe('use grouping', () => {
      it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        component.gridOptions.draggableGrouping = {};
        component.ngAfterViewInit();

        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything(), inlineFilters: false });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        component.destroy();
      });

      it('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        component.gridOptions.enableGrouping = true;
        component.ngAfterViewInit();

        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything(), inlineFilters: false });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        component.destroy();
      });
    });

    describe('dataView options', () => {
      afterEach(() => {
        component.destroy();
        jest.clearAllMocks();
      });

      it('should call the onDataviewCreated emitter', () => {
        const spy = jest.spyOn(component.onDataviewCreated, 'emit');

        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(expect.any(Object));
      });

      it('should call the "executeAfterDataviewCreated" and "loadGridSorters" methods and Sorter Presets are provided in the Grid Options', () => {
        const spy = jest.spyOn(component.onDataviewCreated, 'emit');
        const sortSpy = jest.spyOn(sortServiceStub, 'loadGridSorters');

        component.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as GridOption;
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(expect.any(Object));
        expect(sortSpy).toHaveBeenCalled();
      });

      it('should call the DataView "syncGridSelection" method with 2nd argument as True when the "dataView.syncGridSelection" grid option is enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, true);
      });

      it('should call the DataView "syncGridSelection" method with 2nd argument as False when the "dataView.syncGridSelection" grid option is disabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = { dataView: { syncGridSelection: false }, enableRowSelection: true } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, false);
      });

      it('should call the DataView "syncGridSelection" method with 3 arguments when the "dataView" grid option is provided as an object', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = {
          dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
          enableRowSelection: true
        } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, true, false);
      });

      it('should call the DataView "syncGridSelection" method when using BackendServiceApi and "syncGridSelectionWithBackendService" when the "dataView.syncGridSelection" grid option is enabled as well', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: true },
          enableRowSelection: true
        } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, true);
      });

      it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" BUT the "dataView.syncGridSelection" grid option is disabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: false, syncGridSelectionWithBackendService: true },
          enableRowSelection: true
        } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, false);
      });

      it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" disabled and the "dataView.syncGridSelection" grid option is enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        component.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: false },
          enableRowSelection: true
        } as GridOption;
        component.ngAfterViewInit();

        expect(syncSpy).toHaveBeenCalledWith(component.grid, false);
      });

      it('should destroy customElement and its DOM element when requested', () => {
        const spy = jest.spyOn(component, 'emptyGridContainerElm');

        component.gridOptions = { enableFiltering: true } as GridOption;
        component.ngAfterViewInit();
        component.destroy(true);

        expect(spy).toHaveBeenCalledWith();
      });


      it('should bind local filter when "enableFiltering" is set', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        component.gridOptions = { enableFiltering: true } as GridOption;
        component.ngAfterViewInit();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should bind local sort when "enableSorting" is set', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        component.gridOptions = { enableSorting: true } as GridOption;
        component.ngAfterViewInit();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });
    });

    describe('flag checks', () => {
      afterEach(() => {
        jest.clearAllMocks();
        component.destroy();
      });

      it('should call "showHeaderRow" method with false when its flag is disabled', () => {
        const gridSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        component.gridOptions = { showHeaderRow: false } as GridOption;
        component.ngAfterViewInit();

        expect(gridSpy).toHaveBeenCalledWith(false, false);
      });

      it('should initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is disabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        component.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(mockGrid, mockDataView);
      });

      it('should not initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is also enabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        component.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: true } as GridOption;
        component.ngAfterViewInit();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should call "translateColumnHeaders" from ExtensionService when "enableTranslate" is set', () => {
        const spy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');

        component.gridOptions = { enableTranslate: true } as GridOption;
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalled();
      });

      it('should initialize ExportService when "enableExport" is set', () => {
        const spy = jest.spyOn(exportServiceStub, 'init');

        component.gridOptions = { enableExport: true } as GridOption;
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalled();
      });

      it('should initialize excelExportService when "enableExcelExport" is set', () => {
        const spy = jest.spyOn(excelExportServiceStub, 'init');

        component.gridOptions = { enableExcelExport: true } as GridOption;
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalled();
      });

      it('should destroy component and its DOM element when requested', () => {
        const spy = jest.spyOn(component, 'emptyGridContainerElm');

        component.ngAfterViewInit();
        component.destroy(true);

        expect(spy).toHaveBeenCalled();
      });

      it('should refresh a local grid and change pagination options pagination when a preset for it is defined in grid options', (done) => {
        const expectedPageNumber = 2;
        const expectedTotalItems = 2;
        const refreshSpy = jest.spyOn(component, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        component.gridOptions = {
          enablePagination: true,
          presets: { pagination: { pageSize: 2, pageNumber: expectedPageNumber } }
        };
        component.paginationOptions = { pageSize: 2, pageNumber: 2, pageSizes: [2, 10, 25, 50], totalItems: 100 };

        component.dataset = mockData;
        component.ngAfterViewInit();

        setTimeout(() => {
          expect(component.paginationOptions!.pageSize).toBe(2);
          expect(component.paginationOptions!.pageNumber).toBe(expectedPageNumber);
          expect(component.paginationOptions!.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          done();
        });
      });

      it('should refresh a local grid defined and change pagination options pagination when a preset is defined in grid options and total rows is different when Filters are applied', (done) => {
        const expectedPageNumber = 3;
        const expectedTotalItems = 15;
        const refreshSpy = jest.spyOn(component, 'refreshGridData');
        const getPagingSpy = jest.spyOn(mockDataView, 'getPagingInfo').mockReturnValue({ pageNum: 1, totalRows: expectedTotalItems });

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        component.gridOptions = {
          enablePagination: true,
          enableFiltering: true,
          presets: { pagination: { pageSize: 10, pageNumber: expectedPageNumber } }
        };
        component.paginationOptions = { pageSize: 10, pageNumber: 2, pageSizes: [10, 25, 50], totalItems: 100 };

        component.ngAfterViewInit();
        component.dataset = mockData;

        setTimeout(() => {
          expect(getPagingSpy).toHaveBeenCalled();
          expect(component.paginationOptions!.pageSize).toBe(10);
          expect(component.paginationOptions!.pageNumber).toBe(expectedPageNumber);
          expect(component.paginationOptions!.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          done();
        });
      });
    });

    describe('Backend Service API', () => {
      beforeEach(() => {
        component.gridOptions = {
          backendServiceApi: {
            onInit: jest.fn(),
            service: mockGraphqlService,
            preProcess: jest.fn(),
            postProcess: jest.fn(),
            process: jest.fn(),
          }
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call the "createBackendApiInternalPostProcessCallback" method when Backend Service API is defined with a Graphql Service', () => {
        const spy = jest.spyOn(component, 'createBackendApiInternalPostProcessCallback');

        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalled();
        expect(component.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" with Pagination', () => {
        jest.spyOn(component.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(component, 'refreshGridData');

        component.ngAfterViewInit();
        component.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).toHaveBeenCalled();
        expect(component.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback and expect totalItems to be updated in the PaginationService when "refreshGridData" is called on the 2nd time', () => {
        jest.spyOn(component.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
        const refreshSpy = jest.spyOn(component, 'refreshGridData');
        const paginationSpy = jest.spyOn(paginationServiceStub, 'totalItems', 'set');
        const mockDataset = [{ firstName: 'John' }, { firstName: 'Jane' }];

        component.ngAfterViewInit();
        component.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: mockDataset, totalCount: mockDataset.length } } } as GraphqlPaginatedResult);
        component.refreshGridData(mockDataset, 1);
        component.refreshGridData(mockDataset, 1);

        expect(refreshSpy).toHaveBeenCalledTimes(3);
        expect(paginationSpy).toHaveBeenCalledWith(2);
        expect(component.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" without Pagination (when disabled)', () => {
        component.gridOptions.enablePagination = false;
        jest.spyOn(component.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(component, 'refreshGridData');

        component.ngAfterViewInit();
        component.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: [{ firstName: 'John' }] } });

        expect(spy).toHaveBeenCalled();
        expect(component.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
      });

      xit('should execute the "internalPostProcess" callback method but return an empty dataset when dataset name does not match "getDatasetName"', () => {
        component.gridOptions.enablePagination = true;
        jest.spyOn(component.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(component, 'refreshGridData');

        component.ngAfterViewInit();
        component.gridOptions.backendServiceApi!.internalPostProcess!({ data: { notUsers: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).not.toHaveBeenCalled();
        expect(component.dataset).toEqual([]);
      });

      it('should invoke "updateFilters" method with filters returned from "getColumnFilters" of the Filter Service when there is no Presets defined', () => {
        const mockColumnFilter = { name: { columnId: 'name', columnDef: { id: 'name', field: 'name', filter: { model: Filters.autoComplete } }, operator: 'EQ', searchTerms: ['john'] } };
        // @ts-ignore
        jest.spyOn(filterServiceStub, 'getColumnFilters').mockReturnValue(mockColumnFilter);
        const backendSpy = jest.spyOn(mockGraphqlService, 'updateFilters');

        component.ngAfterViewInit();
        component.gridOptions.presets = undefined;

        expect(backendSpy).toHaveBeenCalledWith(mockColumnFilter, false);
      });

      it('should override frozen grid options when "pinning" is defined in the "presets" property', () => {
        const pinningMock = { frozenBottom: false, frozenColumn: -1, frozenRow: -1 } as CurrentPinning;

        component.gridOptions.presets = { pinning: pinningMock };
        component.ngAfterViewInit();

        expect(component.gridOptions).toEqual({ ...component.gridOptions, ...pinningMock });
      });

      it('should call the "updateFilters" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updateFilters');
        const mockFilters = [{ columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }] as CurrentFilter[];

        component.gridOptions.presets = { filters: mockFilters };
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(mockFilters, true);
      });

      it('should call the "updateSorters" method when sorters are defined in the "presets" property with multi-column sort enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
        const mockSorters = [{ columnId: 'firstName', direction: 'asc' }, { columnId: 'lastName', direction: 'desc' }] as CurrentSorter[];

        component.gridOptions.presets = { sorters: mockSorters };
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(undefined, mockSorters);
      });

      it('should call the "updateSorters" method with ONLY 1 column sort when multi-column sort is disabled and user provided multiple sorters in the "presets" property', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true as any);
        const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
        const mockSorters = [{ columnId: 'firstName', direction: 'asc' }, { columnId: 'lastName', direction: 'desc' }] as CurrentSorter[];

        component.gridOptions.multiColumnSort = false;
        component.gridOptions.presets = { sorters: mockSorters };
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(undefined, [mockSorters[0]]);
      });

      it('should call the "updatePagination" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updatePagination');

        component.gridOptions.presets = { pagination: { pageNumber: 2, pageSize: 20 } };
        component.ngAfterViewInit();

        expect(spy).toHaveBeenCalledWith(2, 20);
      });

      it('should refresh the grid and change pagination options pagination when a preset for it is defined in grid options', () => {
        const expectedPageNumber = 3;
        const refreshSpy = jest.spyOn(component, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        component.gridOptions.enablePagination = true;
        component.gridOptions.presets = { pagination: { pageSize: 10, pageNumber: expectedPageNumber } };
        component.paginationOptions = { pageSize: 10, pageNumber: 1, pageSizes: [10, 25, 50], totalItems: 100 };

        component.ngAfterViewInit();
        component.dataset = mockData;

        expect(component.paginationOptions.pageSize).toBe(10);
        expect(component.paginationOptions.pageNumber).toBe(expectedPageNumber);
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with a Promise and Pagination enabled', (done) => {
        const now = new Date();
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processResult = {
          data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const promise = new Promise((resolve) => setTimeout(() => resolve(processResult), 1));
        const processSpy = jest.spyOn((component.gridOptions as any).backendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn((component.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        (component.gridOptions as any).backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        component.ngAfterViewInit();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, component.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with an Observable and Pagination enabled', (done) => {
        const now = new Date();
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processResult = {
          data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const processSpy = jest.spyOn((component.gridOptions as any).backendServiceApi, 'process').mockReturnValue(of(processResult));
        jest.spyOn((component.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        (component.gridOptions as any).backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        component.ngAfterViewInit();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, component.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with an Observable but without Pagination (when disabled)', (done) => {
        const now = new Date();
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processResult = {
          data: { users: [] },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const processSpy = jest.spyOn((component.gridOptions as any).backendServiceApi, 'process').mockReturnValue(of(processResult));
        jest.spyOn((component.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        (component.gridOptions as any).backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        component.ngAfterViewInit();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, component.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      it('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options from a Promise', (done) => {
        const mockError = { error: '404' };
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const promise = new Promise((resolve, reject) => setTimeout(() => reject(mockError), 1));
        const processSpy = jest.spyOn((component.gridOptions as any).backendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn((component.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        (component.gridOptions as any).backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        component.ngAfterViewInit();

        expect(processSpy).toHaveBeenCalled();

        promise.catch((e) => {
          expect(e).toBe(mockError);
          done();
        });
      });

      it('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options from an Observable', (done) => {
        const mockError = { error: '404' };
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processSpy = jest.spyOn((component.gridOptions as any).backendServiceApi, 'process').mockReturnValue(throwError(mockError));
        jest.spyOn((component.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        (component.gridOptions as any).backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        component.ngAfterViewInit();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockBackendError).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('bindDifferentHooks private method called by "ngAfterViewInit"', () => {
      beforeEach(() => {
        component.columnDefinitions = [{ id: 'firstName', field: 'firstName' }];
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should reflect columns in the grid', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCols = [{ id: 'firstName', field: 'firstName' }];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue(mockCols);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        component.gridOptions = { presets: { columns: mockColsPresets } } as GridOption;
        component.ngAfterViewInit();

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      it('should reflect columns with an extra checkbox selection column in the grid when "enableCheckboxSelector" is set', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCol = { id: 'firstName', field: 'firstName' };
        const mockCols = [{ id: '_checkbox_selector', field: '_checkbox_selector', editor: undefined, internalColumnEditor: {} }, mockCol];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        component.columnDefinitions = mockCols;
        component.gridOptions = { enableCheckboxSelector: true, presets: { columns: mockColsPresets } } as GridOption;
        component.ngAfterViewInit();

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      it('should execute backend service "init" method when set', () => {
        const mockPagination = { pageNumber: 1, pageSizes: [10, 25, 50], pageSize: 10, totalItems: 100 };
        const mockGraphqlOptions = { datasetName: 'users', extraQueryArguments: [{ field: 'userId', value: 123 }] } as GraphqlServiceOption;
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');
        const mockGraphqlService2 = { ...mockGraphqlService, init: jest.fn() } as unknown as GraphqlService;
        const initSpy = jest.spyOn(mockGraphqlService2, 'init');

        component.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService2,
            options: mockGraphqlOptions,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve({ data: { users: { nodes: [], totalCount: 100 } } })),
          } as GraphqlServiceApi,
          pagination: mockPagination,
        } as GridOption;
        component.ngAfterViewInit();

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(initSpy).toHaveBeenCalledWith(mockGraphqlOptions, mockPagination, mockGrid, sharedService);
      });

      it('should call bind backend sorting when "enableSorting" is set', () => {
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');

        component.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve('process resolved')),
          }
        } as GridOption;
        component.ngAfterViewInit();

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should call bind local sorting when "enableSorting" is set and "useLocalSorting" is set as well', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        component.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalSorting: true,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve('process resolved')),
          }
        } as GridOption;
        component.ngAfterViewInit();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should call bind backend filtering when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        component.gridOptions = { enableFiltering: true } as GridOption;
        component.ngAfterViewInit();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      it('should call bind local filtering when "enableFiltering" is set and "useLocalFiltering" is set as well', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        component.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalFiltering: true,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve('process resolved')),
          }
        } as GridOption;
        component.ngAfterViewInit();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should reflect column filters when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindBackendSpy = jest.spyOn(filterServiceStub, 'bindBackendOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        component.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve('process resolved')),
          }
        } as GridOption;
        component.ngAfterViewInit();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      it('should reflect column filters and populate filter search terms when "enableFiltering" is set and preset filters are defined', () => {
        const mockPresetFilters = [{ columnId: 'firstName', operator: 'IN', searchTerms: ['John', 'Jane'] }] as CurrentFilter[];
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        component.gridOptions = { enableFiltering: true, presets: { filters: mockPresetFilters } } as GridOption;
        component.ngAfterViewInit();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).toHaveBeenCalledWith(mockPresetFilters);
      });

      it('should return null when "getItemMetadata" is called without a colspan callback defined', () => {
        const itemSpy = jest.spyOn(mockDataView, 'getItem');

        component.gridOptions = { colspanCallback: undefined } as GridOption;
        component.ngAfterViewInit();
        mockDataView.getItemMetadata(2);

        expect(itemSpy).not.toHaveBeenCalled();
      });

      it('should execute colspan callback when defined in the grid options and "getItemMetadata" is called', () => {
        const mockCallback = jest.fn();
        const mockItem = { firstName: 'John', lastName: 'Doe' };
        const itemSpy = jest.spyOn(mockDataView, 'getItem').mockReturnValue(mockItem);

        component.gridOptions = { colspanCallback: mockCallback } as GridOption;
        component.ngAfterViewInit();
        mockDataView.getItemMetadata(2);

        expect(itemSpy).toHaveBeenCalledWith(2);
        expect(mockCallback).toHaveBeenCalledWith(mockItem);
      });

      it('should call multiple translate methods when locale changes', (done) => {
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        component.gridOptions = { enableTranslate: true, createPreHeaderPanel: false, enableDraggableGrouping: false } as GridOption;
        component.ngAfterViewInit();

        translate.use('fr');

        setTimeout(() => {
          expect(setHeaderRowSpy).not.toHaveBeenCalled();
          expect(transGroupingColSpanSpy).not.toHaveBeenCalled();
          expect(transCellMenuSpy).toHaveBeenCalled();
          expect(transColHeaderSpy).toHaveBeenCalled();
          expect(transColPickerSpy).toHaveBeenCalled();
          expect(transContextMenuSpy).toHaveBeenCalled();
          expect(transGridMenuSpy).toHaveBeenCalled();
          expect(transHeaderMenuSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should call "setHeaderRowVisibility", "translateGroupingAndColSpan" and other methods when locale changes', (done) => {
        component.columnDefinitions = [{ id: 'firstName', field: 'firstName', filterable: true }];
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');

        component.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        component.ngAfterViewInit();

        translate.use('fr');

        setTimeout(() => {
          expect(transGroupingColSpanSpy).toHaveBeenCalled();
          expect(transCellMenuSpy).toHaveBeenCalled();
          expect(transColHeaderSpy).toHaveBeenCalled();
          expect(transColPickerSpy).toHaveBeenCalled();
          expect(transContextMenuSpy).toHaveBeenCalled();
          expect(transGridMenuSpy).toHaveBeenCalled();
          expect(transHeaderMenuSpy).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('setHeaderRowVisibility grid method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should show the header row when "showHeaderRow" is called with argument True', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        component.ngAfterViewInit();
        component.showHeaderRow(true);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(true, false);
        expect(setColumnSpy).toHaveBeenCalledTimes(1);
      });

      it('should show the header row when "showHeaderRow" is called with argument False', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        component.ngAfterViewInit();
        component.showHeaderRow(false);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(false, false);
        expect(setColumnSpy).not.toHaveBeenCalled();
      });
    });

    describe('pagination events', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should merge paginationOptions when some already exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [] };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        component.ngAfterViewInit();
        component.paginationOptions = mockPagination;

        expect(component.paginationOptions).toEqual({ ...mockPagination, totalItems: 0 });
        expect(paginationSrvSpy).toHaveBeenCalledWith(0, true);
      });

      it('should set brand new paginationOptions when none previously exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [], totalItems: 1 };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        component.ngAfterViewInit();
        component.paginationOptions = undefined;
        component.paginationOptions = mockPagination;

        expect(component.paginationOptions).toEqual(mockPagination);
        expect(paginationSrvSpy).toHaveBeenNthCalledWith(2, 1, true);
      });

      it('should call trigger a gridStage change event when pagination change is triggered', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const spy = jest.spyOn(gridStateServiceStub.onGridStateChanged, 'next');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        component.ngAfterViewInit();
        component.paginationChanged(mockPagination);

        expect(spy).toHaveBeenCalledWith({
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      it('should call trigger a gridStage change event when "onPaginationChanged" from the Pagination Service is triggered', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const mockServicePagination = {
          ...mockPagination,
          dataFrom: 5,
          dataTo: 10,
          pageCount: 1,
          pageSizes: [5, 10, 15, 20],
        } as ServicePagination;
        const spy = jest.spyOn(gridStateServiceStub.onGridStateChanged, 'next');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        component.ngAfterViewInit();
        paginationServiceStub.onPaginationChanged.next(mockServicePagination);

        expect(spy).toHaveBeenCalledWith({
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      it('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableRowSelection" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const stateChangedSpy = jest.spyOn(gridStateServiceStub.onGridStateChanged, 'next');
        const setRowSpy = jest.spyOn(gridServiceStub, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        component.gridOptions = { enableRowSelection: true } as GridOption;
        component.ngAfterViewInit();
        component.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(stateChangedSpy).toHaveBeenCalledWith({
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      it('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableCheckboxSelector" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const stateChangedSpy = jest.spyOn(gridStateServiceStub.onGridStateChanged, 'next');
        const setRowSpy = jest.spyOn(gridServiceStub, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        component.gridOptions = { enableCheckboxSelector: true } as GridOption;
        component.ngAfterViewInit();
        component.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(stateChangedSpy).toHaveBeenCalledWith({
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });
    });

    describe('Custom Footer', () => {
      it('should have a Custom Footer when "showCustomFooter" is enabled and there are no Pagination used', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        component.gridOptions.enableTranslate = true;
        component.gridOptions.showCustomFooter = true;
        component.ngOnInit();
        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(component.columnDefinitions).toEqual(mockColDefs);
          expect(component.showCustomFooter).toBeTrue();
          expect(component.customFooterOptions).toEqual({
            dateFormat: 'yyyy-MM-dd, hh:mm aaaaa\'m\'',
            hideRowSelectionCount: false,
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 20,
            leftContainerClass: 'col-xs-12 col-sm-5',
            metricSeparator: '|',
            metricTexts: {
              items: 'items',
              itemsKey: 'ITEMS',
              itemsSelected: 'items selected',
              itemsSelectedKey: 'ITEMS_SELECTED',
              of: 'of',
              ofKey: 'OF',
            },
            rightContainerClass: 'col-xs-6 col-sm-7',
          });
          done();
        });
      });

      it('should have a Custom Footer and custom texts when "showCustomFooter" is enabled with different metricTexts defined', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        component.gridOptions.enableTranslate = false;
        component.gridOptions.showCustomFooter = true;
        component.gridOptions.customFooterOptions = {
          metricTexts: {
            items: 'some items',
            lastUpdate: 'some last update',
            of: 'some of'
          }
        }
        component.ngOnInit();
        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(component.columnDefinitions).toEqual(mockColDefs);
          expect(component.showCustomFooter).toBeTrue();
          expect(component.customFooterOptions).toEqual({
            dateFormat: 'yyyy-MM-dd, hh:mm aaaaa\'m\'',
            hideRowSelectionCount: false,
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 20,
            leftContainerClass: 'col-xs-12 col-sm-5',
            metricSeparator: '|',
            metricTexts: {
              items: 'some items',
              itemsKey: 'ITEMS',
              itemsSelected: 'items selected',
              itemsSelectedKey: 'ITEMS_SELECTED',
              lastUpdate: 'some last update',
              of: 'some of',
              ofKey: 'OF',
            },
            rightContainerClass: 'col-xs-6 col-sm-7',
          });
          done();
        });
      });

      it('should NOT have a Custom Footer when "showCustomFooter" is enabled WITH Pagination in use', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        component.gridOptions.enablePagination = true;
        component.gridOptions.showCustomFooter = true;
        component.ngOnInit();
        component.ngAfterViewInit();
        component.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(component.columnDefinitions).toEqual(mockColDefs);
          expect(component.showCustomFooter).toBeFalse();
          done();
        });
      });
    });

    describe('loadRowSelectionPresetWhenExists method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should call the "mapIdsToRows" from the DataView then "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [2];
        const selectedRowIds = [99];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const dataviewSpy = jest.spyOn(mockDataView, 'mapIdsToRows').mockReturnValue(selectedGridRows);
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        component.gridOptions.enableCheckboxSelector = true;
        component.gridOptions.presets = { rowSelection: { dataContextIds: selectedRowIds } };
        component.ngAfterViewInit();
        component.dataset = mockData;

        setTimeout(() => {
          expect(dataviewSpy).toHaveBeenCalled();
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      it('should call the "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        component.gridOptions.enableRowSelection = true;
        component.gridOptions.presets = { rowSelection: { gridRowIndexes: selectedGridRows } };
        component.dataset = mockData;
        component.ngAfterViewInit();

        setTimeout(() => {
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      it('should NOT call the "setSelectedRows" when the Grid has Local Pagination and there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        component.gridOptions.enableRowSelection = true;
        component.gridOptions.enablePagination = true;
        (component.gridOptions as any).backendServiceApi = null;
        component.gridOptions.presets = { rowSelection: { dataContextIds: selectedGridRows } };
        component.dataset = mockData;
        component.ngAfterViewInit();

        setTimeout(() => {
          expect(selectRowSpy).not.toHaveBeenCalled();
          done();
        }, 2);
      });
    });

    describe('onPaginationVisibilityChanged event', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should change "showPagination" flag when "onPaginationVisibilityChanged" from the Pagination Service is triggered', (done) => {
        component.gridOptions.enablePagination = true;
        (component.gridOptions as any).backendServiceApi = null;
        component.ngAfterViewInit();
        paginationServiceStub.onPaginationVisibilityChanged.next({ visible: false });
        setTimeout(() => {
          expect(component.showPagination).toBeFalsy();
          done();
        });
      });

      it('should call the backend service API to refresh the dataset', (done) => {
        component.gridOptions.enablePagination = true;
        component.ngAfterViewInit();
        paginationServiceStub.onPaginationVisibilityChanged.next({ visible: false });
        setTimeout(() => {
          expect(mockRefreshBackendDataset).toHaveBeenCalled();
          expect(component.showPagination).toBeFalsy();
          done();
        });
      });
    });

    describe('Tree Data View', () => {
      afterEach(() => {
        component.destroy();
        jest.clearAllMocks();
      });

      it('should change flat dataset and expect "convertFlatParentChildToTreeDatasetAndSort" being called with other methods', (done) => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const treeConvertAndSortSpy = jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDatasetAndSort').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });
        const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

        component.gridOptions = {
          enableTreeData: true,
          treeDataOptions: {
            columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files',
            initialSort: { columndId: 'file', direction: 'ASC' }
          }
        } as unknown as GridOption;
        component.ngAfterViewInit();
        component.dataset = mockFlatDataset;

        setTimeout(() => {
          expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
          expect(refreshTreeSpy).toHaveBeenCalled();
          expect(treeConvertAndSortSpy).toHaveBeenCalled();
          done();
        })
      });

      it('should change flat dataset and expect "convertFlatParentChildToTreeDataset" being called (without sorting) and other methods as well', () => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const treeConvertSpy = jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDataset').mockReturnValue(mockHierarchical as any[]);
        const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

        component.gridOptions = {
          enableTreeData: true, treeDataOptions: {
            columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files'
          }
        } as unknown as GridOption;
        component.ngAfterViewInit();
        component.dataset = mockFlatDataset;

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(refreshTreeSpy).toHaveBeenCalled();
        expect(treeConvertSpy).toHaveBeenCalled();
      });

      it('should change hierarchical dataset and expect processTreeDataInitialSort being called with other methods', (done) => {
        const mockHierarchical = [{ file: 'documents', files: [{ file: 'vacation.txt' }] }];
        jest.spyOn(mockDataView, 'getItemCount').mockReturnValue(1);
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
        const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
        const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');
        const refreshFilterSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

        component.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file' } } as unknown as GridOption;
        component.ngAfterViewInit();
        component.datasetHierarchical = mockHierarchical;

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(clearFilterSpy).toHaveBeenCalled();
        expect(processSpy).toHaveBeenCalled();
        expect(setItemsSpy).toHaveBeenCalledWith([], 'id');
        setTimeout(() => {
          expect(refreshFilterSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should preset hierarchical dataset before the initialization and expect sortHierarchicalDataset to be called', () => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
        const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
        const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');
        const refreshFilterSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');
        const sortHierarchicalSpy = jest.spyOn(treeDataServiceStub, 'sortHierarchicalDataset').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });

        component.destroy();
        component.gridOptions = {
          enableTreeData: true,
          treeDataOptions: {
            columnId: 'file', initialSort: { columndId: 'file', direction: 'ASC' }
          }
        } as unknown as GridOption;
        component.datasetHierarchical = mockHierarchical;
        component.ngAfterViewInit();

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(clearFilterSpy).toHaveBeenCalled();
        expect(processSpy).not.toHaveBeenCalled();
        expect(setItemsSpy).toHaveBeenCalledWith(mockFlatDataset, 'id');
        expect(sortHierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
      });

      it('should expect "refreshTreeDataFilters" method to be called when our flat dataset was already set and it just got changed a 2nd time', () => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDatasetAndSort').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });
        const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

        component.dataset = [{ id: 0, file: 'documents' }];
        component.gridOptions = {
          enableTreeData: true,
          treeDataOptions: {
            columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files', initialSort: { columndId: 'file', direction: 'ASC' }
          }
        } as unknown as GridOption;
        component.ngAfterViewInit();
        component.dataset = mockFlatDataset;

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(refreshTreeSpy).toHaveBeenCalled();
      });
    });
  });
});
