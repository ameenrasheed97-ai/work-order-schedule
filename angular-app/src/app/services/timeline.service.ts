import { Injectable, signal } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '../models';
import { WORK_CENTERS, WORK_ORDERS } from '../data/sample-data';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private _workCenters = signal<WorkCenterDocument[]>(this.loadWorkCenters());
  private _workOrders  = signal<WorkOrderDocument[]>(this.loadWorkOrders());
  private _zoomLevel   = signal<ZoomLevel>('month');

  readonly workCenters = this._workCenters.asReadonly();
  readonly workOrders  = this._workOrders.asReadonly();
  readonly zoomLevel   = this._zoomLevel.asReadonly();

  private loadWorkCenters(): WorkCenterDocument[] {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('workCenters');
      return stored ? JSON.parse(stored) : WORK_CENTERS;
    }
    return WORK_CENTERS;
  }

  private loadWorkOrders(): WorkOrderDocument[] {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('workOrders');
      return stored ? JSON.parse(stored) : WORK_ORDERS;
    }
    return WORK_ORDERS;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('workCenters', JSON.stringify(this._workCenters()));
      localStorage.setItem('workOrders',  JSON.stringify(this._workOrders()));
    }
  }

  setZoomLevel(level: ZoomLevel): void {
    this._zoomLevel.set(level);
  }

  getWorkOrdersForCenter(workCenterId: string): WorkOrderDocument[] {
    return this._workOrders().filter(wo => wo.data.workCenterId === workCenterId);
  }

  hasOverlap(
    workCenterId: string,
    startDate: string,
    endDate: string,
    excludeDocId?: string
  ): boolean {
    const orders = this.getWorkOrdersForCenter(workCenterId)
      .filter(wo => wo.docId !== excludeDocId);
    const newStart = new Date(startDate).getTime();
    const newEnd   = new Date(endDate).getTime();
    return orders.some(wo => {
      const s = new Date(wo.data.startDate).getTime();
      const e = new Date(wo.data.endDate).getTime();
      return newStart <= e && newEnd >= s;
    });
  }

  createWorkOrder(data: WorkOrderDocument['data']): void {
    const newOrder: WorkOrderDocument = {
      docId: `wo-${Date.now()}`,
      docType: 'workOrder',
      data,
    };
    this._workOrders.update(orders => [...orders, newOrder]);
    this.persist();
  }

  updateWorkOrder(docId: string, data: WorkOrderDocument['data']): void {
    this._workOrders.update(orders =>
      orders.map(wo => wo.docId === docId ? { ...wo, data } : wo)
    );
    this.persist();
  }

  deleteWorkOrder(docId: string): void {
    this._workOrders.update(orders => orders.filter(wo => wo.docId !== docId));
    this.persist();
  }

  // ─── Column generation ──────────────────────────────────────
  generateColumns(startDate: Date, count: number, zoom: ZoomLevel): Date[] {
    const cols: Date[] = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(startDate);
      if      (zoom === 'hour') d.setHours(d.getHours() + i);
      else if (zoom === 'day')  d.setDate(d.getDate() + i);
      else if (zoom === 'week') d.setDate(d.getDate() + i * 7);
      else                      d.setMonth(d.getMonth() + i);
      cols.push(d);
    }
    return cols;
  }

  // ─── Column label formatting ────────────────────────────────
  formatColumnLabel(date: Date, zoom: ZoomLevel): string {
    if (zoom === 'hour') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    if (zoom === 'day') {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    if (zoom === 'week') {
      const end = new Date(date);
      end.setDate(end.getDate() + 6);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    // month
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // ─── Coordinate conversion ──────────────────────────────────
  private msPerUnit(zoom: ZoomLevel): number {
    switch (zoom) {
      case 'hour':  return 3_600_000;
      case 'day':   return 86_400_000;
      case 'week':  return 86_400_000 * 7;
      case 'month': return 86_400_000 * 30.44;
    }
  }

  dateToPixel(
    date: Date | string,
    startDate: Date,
    columnWidth: number,
    zoom: ZoomLevel
  ): number {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diffMs = d.getTime() - startDate.getTime();
    return (diffMs / this.msPerUnit(zoom)) * columnWidth;
  }

  pixelToDate(
    px: number,
    startDate: Date,
    columnWidth: number,
    zoom: ZoomLevel
  ): Date {
    const ms = (px / columnWidth) * this.msPerUnit(zoom);
    return new Date(startDate.getTime() + ms);
  }
}
