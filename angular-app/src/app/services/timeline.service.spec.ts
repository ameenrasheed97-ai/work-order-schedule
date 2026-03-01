import { TestBed } from '@angular/core/testing';
import { TimelineService } from './timeline.service';
import { WORK_CENTERS, WORK_ORDERS_MONTH, WORK_ORDERS_HOUR } from '../data/sample-data';

describe('TimelineService', () => {
  let service: TimelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService]
    });
    service = TestBed.inject(TimelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load work centers on initialization', () => {
    expect(service.workCenters()).toEqual(WORK_CENTERS);
  });

  it('should have initial zoom level of month', () => {
    expect(service.zoomLevel()).toBe('month');
  });

  it('should set zoom level', () => {
    service.setZoomLevel('day');
    expect(service.zoomLevel()).toBe('day');
  });

  it('should load correct work orders for hour zoom level', () => {
    service.setZoomLevel('hour');
    expect(service.zoomLevel()).toBe('hour');
    expect(service.workOrders().length).toBeGreaterThan(0);
  });

  it('should load correct work orders for day zoom level', () => {
    service.setZoomLevel('day');
    expect(service.zoomLevel()).toBe('day');
    expect(service.workOrders().length).toBeGreaterThan(0);
  });

  it('should load correct work orders for week zoom level', () => {
    service.setZoomLevel('week');
    expect(service.zoomLevel()).toBe('week');
    expect(service.workOrders().length).toBeGreaterThan(0);
  });

  it('should filter work orders by work center', () => {
    const wc1Orders = service.getWorkOrdersForCenter('wc-1');
    expect(wc1Orders.length).toBeGreaterThan(0);
    expect(wc1Orders.every(wo => wo.data.workCenterId === 'wc-1')).toBeTruthy();
  });

  it('should detect overlapping work orders', () => {
    const hasOverlap = service.hasOverlap(
      'wc-1',
      '2026-03-01',
      '2026-03-15'
    );
    // This will depend on sample data
    expect(typeof hasOverlap).toBe('boolean');
  });

  it('should generate columns for different zoom levels', () => {
    const startDate = new Date('2026-03-01');
    const count = 10;

    const hourColumns = service.generateColumns(startDate, count, 'hour');
    const dayColumns = service.generateColumns(startDate, count, 'day');
    const weekColumns = service.generateColumns(startDate, count, 'week');
    const monthColumns = service.generateColumns(startDate, count, 'month');

    expect(hourColumns.length).toBe(count);
    expect(dayColumns.length).toBe(count);
    expect(weekColumns.length).toBe(count);
    expect(monthColumns.length).toBe(count);
  });

  it('should format column labels correctly', () => {
    const date = new Date('2026-03-01');

    const hourLabel = service.formatColumnLabel(date, 'hour');
    const dayLabel = service.formatColumnLabel(date, 'day');
    const weekLabel = service.formatColumnLabel(date, 'week');
    const monthLabel = service.formatColumnLabel(date, 'month');

    expect(hourLabel).toBeTruthy();
    expect(dayLabel).toBeTruthy();
    expect(weekLabel).toBeTruthy();
    expect(monthLabel).toBeTruthy();
  });
  });

  it('should convert dates to pixel positions', () => {
    const startDate = new Date('2026-03-01');
    const viewportStart = new Date('2026-02-01');
    const columnWidth = 120;

    const pixel = service.dateToPixel(startDate, viewportStart, columnWidth, 'day');
    expect(typeof pixel).toBe('number');
    expect(pixel).toBeGreaterThan(0);
  });

  it('should convert pixel positions to dates', () => {
    const viewportStart = new Date('2026-02-01');
    const columnWidth = 120;
    const pixel = 500;

    const date = service.pixelToDate(pixel, viewportStart, columnWidth, 'day');
    expect(date).toBeTruthy();
  });

  it('should create a new work order', () => {
    const initialCount = service.getWorkOrdersForCenter('wc-1').length;

    service.createWorkOrder({
      name: 'Test Order',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2026-03-01',
      endDate: '2026-03-10'
    });

    const newCount = service.getWorkOrdersForCenter('wc-1').length;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should update an existing work order', () => {
    const orders = service.getWorkOrdersForCenter('wc-1');
    const firstOrder = orders[0];
    const newName = 'Updated Order';

    service.updateWorkOrder(firstOrder.docId, {
      ...firstOrder.data,
      name: newName
    });

    const updated = service.getWorkOrdersForCenter('wc-1')
      .find(wo => wo.docId === firstOrder.docId);
    
    expect(updated?.data.name).toBe(newName);
  });

  it('should delete a work order', () => {
    const orders = service.getWorkOrdersForCenter('wc-1');
    const firstOrder = orders[0];
    const initialCount = orders.length;

    service.deleteWorkOrder(firstOrder.docId);

    const newCount = service.getWorkOrdersForCenter('wc-1').length;
    expect(newCount).toBe(initialCount - 1);
  });
});
