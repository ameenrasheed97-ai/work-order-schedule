import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimelineService } from '../../services/timeline.service';
import { WorkOrderDocument, WorkCenterDocument, ZoomLevel, PanelMode, WorkOrderStatus } from '../../models';
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
  readonly workOrders = this.svc.workOrders;
  readonly zoomLevel = this.svc.zoomLevel;

  readonly COLUMN_WIDTH = 120;
  readonly TOTAL_COLUMNS = 60;
  readonly ROW_HEIGHT = 52;

  timelineStart!: Date;
  columns: Date[] = [];

  isPanelOpen = false;
  panelMode: PanelMode = 'create';
  editingWorkOrder: WorkOrderDocument | null = null;
  panelPrefilledDate: string | null = null;
  panelWorkCenterId: string | null = null;

  openDropdownId: string | null = null;

  tooltip: { visible: boolean; workOrder: WorkOrderDocument | null; x: number; y: number } = {
    visible: false, workOrder: null, x: 0, y: 0
  };

  hoveredWorkCenterId: string | null = null;

  zoomOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  today = new Date();

  ngOnInit(): void {
    this.rebuildTimeline();
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.onDocumentClick);
    }
    setTimeout(() => this.scrollToToday(), 100);
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  private onDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.actions-menu')) {
      this.openDropdownId = null;
      this.cdr.markForCheck();
    }
  };

  rebuildTimeline(): void {
    const zoom = this.zoomLevel();
    const buffer = zoom === 'day' ? 20 : zoom === 'week' ? 8 : 4;
    this.timelineStart = new Date();
    if (zoom === 'day') this.timelineStart.setDate(this.timelineStart.getDate() - buffer);
    else if (zoom === 'week') this.timelineStart.setDate(this.timelineStart.getDate() - buffer * 7);
    else this.timelineStart.setMonth(this.timelineStart.getMonth() - buffer);
    this.timelineStart.setHours(0, 0, 0, 0);
    this.columns = this.svc.generateColumns(this.timelineStart, this.TOTAL_COLUMNS, zoom);
    this.cdr.markForCheck();
  }

  get totalTimelineWidth(): number {
    return this.TOTAL_COLUMNS * this.COLUMN_WIDTH;
  }

  formatColumn(date: Date): string {
    return this.svc.formatColumnLabel(date, this.zoomLevel());
  }

  isCurrentPeriod(date: Date): boolean {
    const t = this.today;
    const zoom = this.zoomLevel();
    if (zoom === 'day') return date.toDateString() === t.toDateString();
    if (zoom === 'week') {
      const end = new Date(date); end.setDate(date.getDate() + 6);
      return t >= date && t <= end;
    }
    return date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  }

  get todayLineLeft(): number {
    return this.svc.dateToPixel(this.today, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
  }

  getBarsForCenter(workCenterId: string): BarPosition[] {
    return this.svc.getWorkOrdersForCenter(workCenterId).map(wo => {
      const left = this.svc.dateToPixel(wo.data.startDate, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
      const right = this.svc.dateToPixel(wo.data.endDate, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
      return { workOrder: wo, left, width: Math.max(right - left, 60) };
    });
  }

  onZoomChange(zoom: string): void {
    this.svc.setZoomLevel(zoom as ZoomLevel);
    this.rebuildTimeline();
    setTimeout(() => this.scrollToToday(), 50);
  }

  scrollToToday(): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement as HTMLElement;
    const center = this.todayLineLeft - el.clientWidth / 2;
    if (el.scrollTo) {
      el.scrollTo({ left: Math.max(0, center), behavior: 'smooth' });
    } else {
      el.scrollLeft = Math.max(0, center);
    }
  }

  onTimelineClick(event: MouseEvent, workCenter: WorkCenterDocument): void {
    if ((event.target as HTMLElement).closest('.work-order-bar')) return;
    const el = this.scrollContainer.nativeElement;
    const rect = el.getBoundingClientRect();
    const clickX = event.clientX - rect.left + el.scrollLeft;
    const date = this.svc.pixelToDate(clickX, this.timelineStart, this.COLUMN_WIDTH, this.zoomLevel());
    const iso = date.toISOString().split('T')[0];

    this.panelMode = 'create';
    this.editingWorkOrder = null;
    this.panelPrefilledDate = iso;
    this.panelWorkCenterId = workCenter.docId;
    this.isPanelOpen = true;
    this.cdr.markForCheck();
  }

  openEdit(wo: WorkOrderDocument): void {
    this.openDropdownId = null;
    this.panelMode = 'edit';
    this.editingWorkOrder = wo;
    this.panelPrefilledDate = null;
    this.panelWorkCenterId = null;
    this.isPanelOpen = true;
    this.cdr.markForCheck();
  }

  deleteWorkOrder(docId: string): void {
    this.openDropdownId = null;
    this.svc.deleteWorkOrder(docId);
    this.cdr.markForCheck();
  }

  closePanel(): void { this.isPanelOpen = false; this.cdr.markForCheck(); }
  onSaved(): void { this.isPanelOpen = false; this.cdr.markForCheck(); }

  toggleDropdown(event: MouseEvent, docId: string): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === docId ? null : docId;
    this.cdr.markForCheck();
  }

  showTooltip(event: MouseEvent, wo: WorkOrderDocument): void {
    this.tooltip = { visible: true, workOrder: wo, x: event.clientX + 12, y: event.clientY - 8 };
    this.cdr.markForCheck();
  }

  moveTooltip(event: MouseEvent): void {
    this.tooltip.x = event.clientX + 12;
    this.tooltip.y = event.clientY - 8;
    this.cdr.markForCheck();
  }

  hideTooltip(): void { this.tooltip.visible = false; this.cdr.markForCheck(); }

  getStatusLabel(status: WorkOrderStatus): string {
    const map: Record<WorkOrderStatus, string> = {
      'open': 'Open',
      'in-progress': 'In progress',
      'complete': 'Complete',
      'blocked': 'Blocked',
    };
    return map[status];
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  trackByDocId(_: number, item: { docId: string }): string { return item.docId; }
  trackByBar(_: number, bar: BarPosition): string { return bar.workOrder.docId; }
  trackByDate(_: number, d: Date): number { return d.getTime(); }
}
