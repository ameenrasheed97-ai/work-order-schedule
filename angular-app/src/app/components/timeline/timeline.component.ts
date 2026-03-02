import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimelineService } from '../../services/timeline.service';
import {
  WorkOrderDocument, WorkCenterDocument,
  ZoomLevel, PanelMode, WorkOrderStatus
} from '../../models';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

interface BarPosition {
  workOrder: WorkOrderDocument;
  left: number;
  width: number;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private svc = inject(TimelineService);
  private cdr = inject(ChangeDetectorRef);

  readonly workCenters = this.svc.workCenters;
  readonly workOrders  = this.svc.workOrders;
  readonly zoomLevel   = this.svc.zoomLevel;

  readonly ROW_HEIGHT    = 52;
  readonly INITIAL_COLUMNS = 300;
  readonly LOAD_THRESHOLD = 40;
  readonly ADD_COLUMNS = 60;

  private prependedCount = 0;
  private appendedCount = 0;
  private scrollListener: ((e: Event) => void) | null = null;

  get COLUMN_WIDTH(): number {
    const zoom = this.zoomLevel();
    if (zoom === 'hour')  return 80;
    if (zoom === 'day')   return 120;
    if (zoom === 'week')  return 160;
    if (zoom === 'month') return 150;
    return 120;
  }

  timelineStart!: Date;
  columns: Date[] = [];

  isPanelOpen          = false;
  panelMode: PanelMode = 'create';
  editingWorkOrder: WorkOrderDocument | null = null;
  panelPrefilledDate: string | null = null;
  panelWorkCenterId:  string | null = null;

  openDropdownId: string | null = null;
  hoveredWorkCenterId: string | null = null;
  hoveredBarId: string | null = null;

  // ── Ghost box hover state ─────────────────────────────────
  hoverPreview: {
    visible: boolean;
    workCenterId: string | null;
    x: number;
  } = { visible: false, workCenterId: null, x: 0 };

  readonly GHOST_BOX_WIDTH = 113;

  zoomOptions = [
    { value: 'hour',  label: 'Hour'  },
    { value: 'day',   label: 'Day'   },
    { value: 'week',  label: 'Week'  },
    { value: 'month', label: 'Month' },
  ];

  today = new Date();

  ngOnInit(): void {
    this.rebuildTimeline();
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.onDocumentClick);
    }
    setTimeout(() => {
      this.setupScrollListener();
      this.scrollToToday();
    }, 100);
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.onDocumentClick);
    }
    this.removeScrollListener();
  }

  private onDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.actions-menu')) {
      this.openDropdownId = null;
      this.cdr.markForCheck();
    }
  };

  private setupScrollListener(): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement as HTMLElement;
    this.scrollListener = () => this.onScrolling();
    el.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private removeScrollListener(): void {
    if (!this.scrollContainer || !this.scrollListener) return;
    const el = this.scrollContainer.nativeElement as HTMLElement;
    el.removeEventListener('scroll', this.scrollListener);
    this.scrollListener = null;
  }

  private onScrolling(): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement as HTMLElement;
    const zoom = this.zoomLevel();

    // Check if scrolling toward the start (left)
    if (el.scrollLeft < this.LOAD_THRESHOLD * this.COLUMN_WIDTH) {
      this.prependColumns(zoom);
    }

    // Check if scrolling toward the end (right)
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft > maxScroll - this.LOAD_THRESHOLD * this.COLUMN_WIDTH) {
      this.appendColumns(zoom);
    }
  }

  private prependColumns(zoom: ZoomLevel): void {
    // Only prepend if we haven't already recently
    if (this.prependedCount >= 5) return;

    const newStart = new Date(this.timelineStart);
    if      (zoom === 'hour') newStart.setHours(newStart.getHours() - this.ADD_COLUMNS);
    else if (zoom === 'day')  newStart.setDate(newStart.getDate() - this.ADD_COLUMNS);
    else if (zoom === 'week') newStart.setDate(newStart.getDate() - this.ADD_COLUMNS * 7);
    else                      newStart.setMonth(newStart.getMonth() - this.ADD_COLUMNS);

    const newCols = this.svc.generateColumns(newStart, this.ADD_COLUMNS, zoom);
    this.columns = [...newCols, ...this.columns];

    // Adjust scroll position to maintain view
    const el = this.scrollContainer.nativeElement as HTMLElement;
    const scrollAdjust = this.ADD_COLUMNS * this.COLUMN_WIDTH;
    el.scrollLeft += scrollAdjust;

    this.timelineStart = newStart;
    this.prependedCount++;
    this.cdr.markForCheck();
  }

  private appendColumns(zoom: ZoomLevel): void {
    // Only append if we haven't already recently
    if (this.appendedCount >= 5) return;

    const lastCol = this.columns[this.columns.length - 1];
    const newStart = new Date(lastCol);
    
    if      (zoom === 'hour') newStart.setHours(newStart.getHours() + 1);
    else if (zoom === 'day')  newStart.setDate(newStart.getDate() + 1);
    else if (zoom === 'week') newStart.setDate(newStart.getDate() + 7);
    else                      newStart.setMonth(newStart.getMonth() + 1);

    const newCols = this.svc.generateColumns(newStart, this.ADD_COLUMNS, zoom);
    this.columns = [...this.columns, ...newCols];

    this.appendedCount++;
    this.cdr.markForCheck();
  }

  rebuildTimeline(): void {
    const zoom = this.zoomLevel();

    const buffer = zoom === 'hour' ? 48
                 : zoom === 'day'  ? 40
                 : zoom === 'week' ? 16
                 : 8;

    this.timelineStart = new Date();

    if      (zoom === 'hour') this.timelineStart.setHours(this.timelineStart.getHours() - buffer);
    else if (zoom === 'day')  this.timelineStart.setDate(this.timelineStart.getDate() - buffer);
    else if (zoom === 'week') this.timelineStart.setDate(this.timelineStart.getDate() - buffer * 7);
    else                      this.timelineStart.setMonth(this.timelineStart.getMonth() - buffer);

    if (zoom !== 'hour') {
      this.timelineStart.setHours(0, 0, 0, 0);
    } else {
      this.timelineStart.setMinutes(0, 0, 0);
    }

    this.columns = this.svc.generateColumns(this.timelineStart, this.INITIAL_COLUMNS, zoom);
    this.prependedCount = 0;
    this.appendedCount = 0;
    this.cdr.markForCheck();
  }

  get totalTimelineWidth(): number {
    return this.columns.length * this.COLUMN_WIDTH;
  }

  formatColumn(date: Date): string {
    return this.svc.formatColumnLabel(date, this.zoomLevel());
  }

  isCurrentPeriod(date: Date): boolean {
    const t    = this.today;
    const zoom = this.zoomLevel();

    if (zoom === 'hour') {
      return date.toDateString() === t.toDateString() && date.getHours() === t.getHours();
    }
    if (zoom === 'day')  return date.toDateString() === t.toDateString();
    if (zoom === 'week') {
      const end = new Date(date);
      end.setDate(date.getDate() + 6);
      return t >= date && t <= end;
    }
    return date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  }

  get todayLineLeft(): number {
    return this.svc.dateToPixel(this.today, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
  }

  getBarsForCenter(workCenterId: string): BarPosition[] {
    return this.svc.getWorkOrdersForCenter(workCenterId).map(wo => {
      const left  = this.svc.dateToPixel(wo.data.startDate, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
      const right = this.svc.dateToPixel(wo.data.endDate,   this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
      return { workOrder: wo, left, width: Math.max(right - left, 180) };
    });
  }

  onZoomChange(zoom: string): void {
    this.svc.setZoomLevel(zoom as ZoomLevel);
    this.removeScrollListener();
    this.rebuildTimeline();
    setTimeout(() => {
      this.setupScrollListener();
      this.scrollToToday();
    }, 50);
  }

  scrollToToday(): void {
    if (!this.scrollContainer) return;
    const el     = this.scrollContainer.nativeElement as HTMLElement;
    const center = this.todayLineLeft - el.clientWidth / 2;
    if (el.scrollTo) {
      el.scrollTo({ left: Math.max(0, center), behavior: 'smooth' });
    } else {
      el.scrollLeft = Math.max(0, center);
    }
  }

  // ── Ghost box mouse handlers ──────────────────────────────
  onRowMouseEnter(workCenterId: string): void {
    this.hoveredWorkCenterId = workCenterId;
    this.hoverPreview.workCenterId = workCenterId;
    this.cdr.markForCheck();
  }

  onRowMouseLeave(): void {
    this.hoveredWorkCenterId = null;
    this.hoverPreview.visible = false;
    this.hoverPreview.workCenterId = null;
    this.cdr.markForCheck();
  }

  onRowMouseMove(event: MouseEvent, workCenterId: string): void {
    // Don't show ghost if hovering over an existing bar or dropdown
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-bar') || target.closest('.actions-menu')) {
      this.hoverPreview.visible = false;
      this.cdr.markForCheck();
      return;
    }

    const el   = this.scrollContainer.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x    = event.clientX - rect.left + el.scrollLeft;

    this.hoverPreview = {
      visible: true,
      workCenterId,
      x: x - this.GHOST_BOX_WIDTH / 2,
    };
    this.cdr.markForCheck();
  }

  // ── Bar hover tooltip ────────────────────────────────────
  onBarHover(barId: string): void {
    this.hoveredBarId = barId;
    this.cdr.markForCheck();
  }

  onBarHoverOut(): void {
    this.hoveredBarId = null;
    this.cdr.markForCheck();
  }

  // ── Timeline click → open create panel ───────────────────
  onTimelineClick(event: MouseEvent, workCenter: WorkCenterDocument): void {
    if ((event.target as HTMLElement).closest('.work-order-bar')) return;
    if ((event.target as HTMLElement).closest('.actions-menu')) return;

    const el   = this.scrollContainer.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px   = event.clientX - rect.left + el.scrollLeft;
    const date = this.svc.pixelToDate(px, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());

    this.panelPrefilledDate = date.toISOString().split('T')[0];
    this.panelWorkCenterId  = workCenter.docId;
    this.panelMode          = 'create';
    this.editingWorkOrder   = null;
    this.isPanelOpen        = true;
    this.hoverPreview.visible = false;
    this.cdr.markForCheck();
  }

  openEdit(wo: WorkOrderDocument): void {
    this.editingWorkOrder = wo;
    this.panelMode        = 'edit';
    this.isPanelOpen      = true;
    this.openDropdownId   = null;
    this.cdr.markForCheck();
  }

  deleteWorkOrder(docId: string): void {
    this.svc.deleteWorkOrder(docId);
    this.openDropdownId = null;
    this.cdr.markForCheck();
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.cdr.markForCheck();
  }

  onSaved(): void {
    this.isPanelOpen = false;
    this.cdr.markForCheck();
  }

  toggleDropdown(event: MouseEvent, docId: string): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === docId ? null : docId;
    this.cdr.markForCheck();
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const map: Record<WorkOrderStatus, string> = {
      'open':        'Open',
      'in-progress': 'In progress',
      'complete':    'Complete',
      'blocked':     'Blocked',
    };
    return map[status] ?? status;
  }

  formatDate(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${m}.${d}.${y}`;
  }

  trackByDocId(_: number, item: { docId: string }): string { return item.docId; }
  trackByDate(_: number, date: Date): number { return date.getTime(); }
  trackByBar(_: number, bar: BarPosition): string { return bar.workOrder.docId; }
}
