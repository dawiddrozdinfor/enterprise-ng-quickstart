import {
  Component,
  HostBinding,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import 'ids-enterprise-wc/components/ids-text/ids-text';

import {
  SohoPersonalizeDirective,
  SohoRenderLoopService,
  SohoApplicationMenuComponent,
  SohoAccordionComponent,
  SohoSearchFieldComponent,
  SohoModuleNavContainerComponent,
  SohoModuleNavSwitcherComponent,
  SohoModuleNavSettingsComponent,
  SohoModuleNavComponent,
  SohoDataGridComponent,
  SohoInputComponent
} from 'ids-enterprise-ng';

const defaultRoles: Array<SohoModuleNavSwitcherRoleRecord> = [
  { text: 'Admin', value: 'admin', icon: 'app-ac' },
  { text: 'Job Console', value: 'job-console', icon: 'app-jo' },
  { text: 'Landing Page Designer', value: 'landing-page-designer', icon: 'app-ssm' },
  { text: 'Process Server Admin', value: 'process-server-admin', icon: 'app-um' },
  { text: 'Proxy Management', value: 'proxy-management', icon: 'app-pm' },
  { text: 'Security System Management', value: 'security-system-management', icon: 'app-psa' },
  { text: 'User Management', value: 'user-management', icon: 'app-lmd' }
];

@Component({
  selector: 'body', // eslint-disable-line
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild(SohoModuleNavSwitcherComponent) moduleNavSwitcher?: SohoModuleNavSwitcherComponent;
  @ViewChild(SohoModuleNavContainerComponent) moduleNavContainer?: SohoModuleNavContainerComponent;
  @ViewChild(SohoDataGridComponent, { static: true }) dataGrid?: SohoDataGridComponent;

  /**
   * Local Storage Key
   */
  private static isMenuOpen = 'is-application-menu-open';

  @ViewChild(SohoModuleNavComponent, { static: true })
  public moduleNav!: SohoModuleNavComponent;

  @ViewChild(SohoPersonalizeDirective, { static: true }) personalize?: SohoPersonalizeDirective;

  @HostBinding('class.no-scroll') get isNoScroll() { return true; }

  /**
   * Include the new icons only if required by the current theme, this
   * is not quite perfect, as we need to listen for the theme change here.
   * Maybe wrap all the icons into their own component?
   */
  public useNewIcons = true;

  public personalizeOptions: SohoPersonalizeOptions = {};

  public options!: SohoDataGridOptions;
  public newRowData!: string;
  public tooltipOptions: SohoTooltipOptions = {
    placement: 'top'
  }

  public tooltipCompressor: SohoTooltipOptions = {
    placement: 'bottom'
  }

  constructor(private readonly renderLoop: SohoRenderLoopService) {
    // Init render loop manually for Angular applications
    // Ensures requestAnimationFrame is running outside of Angular Zone
    this.renderLoop.start();
  }

  public model = {
    displayMode: 'collapsed',
    selectedRole: 'admin',
    roles: defaultRoles
  }

  ngOnInit(): void {
    this.setGridOptions();
  }

  ngAfterViewInit(): void {
    this.moduleNavSwitcher?.setRoles(this.model.roles);
  }

  toggleModuleNavDisplayMode(e: MouseEvent) {
    if (!this.moduleNavContainer) return;

    const isCurrentlyCollapsed = this.model.displayMode === 'collapsed';
    this.model.displayMode = isCurrentlyCollapsed ? 'expanded' : 'collapsed';
  }

  onChangeTheme(ev: SohoPersonalizeEvent) {
    this.useNewIcons = ev.data.theme === 'theme-new-light'
      || ev.data.theme === 'theme-new-dark'
      || ev.data.theme === 'theme-new-contrast';
  }

  private setGridOptions(): void {
    const columns = [
      {
        id: 'name',
        name: 'Name',
        field: 'name',
        // width: 80,
        sortable: true,
        headerTooltip: 'Name Column',
        tooltipOptions: this.tooltipOptions,
        formatter: Soho.Formatters.Ellipsis,
      },
      {
        id: 'compressor',
        name: 'Compressor',
        field: 'compressor',
        // width: 80,
        sortable: true,
        headerTooltip: 'Compressor Column',
        tooltipOptions: this.tooltipCompressor,
        formatter: Soho.Formatters.Ellipsis,
      },
      {
        id: 'quantity',
        name: 'Quantity',
        field: 'quantity',
        // width: 80,
        sortable: true,
        headerTooltip: 'Quantity Column',
        tooltipOptions: this.tooltipOptions,
        formatter: Soho.Formatters.Ellipsis,
      },
      {
        id: 'open',
        name: 'Actions',
        // width: 80,
        sortable: false,
        formatter: Soho.Formatters.Button,
        icon: 'info',
        menuId: 'card-options',
        click: (_: Event, data: SohoDataGridColumnClickData[]) => {
          console.info(data);
          console.info(data[0].item);
        },
      },
    ];
    this.options = {
      dataset: [{ name: 'Lorem', compressor: 'Compressor 1', quantity: 24 }, { name: 'Foo', compressor: 'Compressor 2', quantity: 22 }],
      columns,
      enableTooltips: true
    };
  }

  count = 0;

  addRow() {
    this.count++;
    this.dataGrid?.addRow({ name: `New Row ${this.count}` }, 'bottom');
  }
}
