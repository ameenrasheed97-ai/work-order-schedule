import { WorkCenterDocument, WorkOrderDocument } from '../models';

function daysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
  { docId: 'wc-6', docType: 'workCenter', data: { name: 'Welding Bay' } },
];

// Work orders for MONTH view (longer durations)
export const WORK_ORDERS_MONTH: WorkOrderDocument[] = [
  {
    docId: 'wo-1', docType: 'workOrder',
    data: { name: 'Batch Run #4421', workCenterId: 'wc-1', status: 'complete', startDate: daysFromToday(-150), endDate: daysFromToday(-50) }
  },
  {
    docId: 'wo-2', docType: 'workOrder',
    data: { name: 'Polymer Mix A', workCenterId: 'wc-1', status: 'in-progress', startDate: daysFromToday(0), endDate: daysFromToday(150) }
  },
  {
    docId: 'wo-3', docType: 'workOrder',
    data: { name: 'Frame Cut Order', workCenterId: 'wc-2', status: 'open', startDate: daysFromToday(-30), endDate: daysFromToday(150) }
  },
  {
    docId: 'wo-4', docType: 'workOrder',
    data: { name: 'Panel Precision', workCenterId: 'wc-2', status: 'blocked', startDate: daysFromToday(40), endDate: daysFromToday(180) }
  },
  {
    docId: 'wo-5', docType: 'workOrder',
    data: { name: 'Unit Assembly X7', workCenterId: 'wc-3', status: 'in-progress', startDate: daysFromToday(-60), endDate: daysFromToday(120) }
  },
  {
    docId: 'wo-6', docType: 'workOrder',
    data: { name: 'Sub-assembly Batch', workCenterId: 'wc-3', status: 'open', startDate: daysFromToday(20), endDate: daysFromToday(170) }
  },
  {
    docId: 'wo-7', docType: 'workOrder',
    data: { name: 'QC Inspection Lot 9', workCenterId: 'wc-4', status: 'blocked', startDate: daysFromToday(-40), endDate: daysFromToday(130) }
  },
  {
    docId: 'wo-8', docType: 'workOrder',
    data: { name: 'Final Pack Run', workCenterId: 'wc-5', status: 'open', startDate: daysFromToday(30), endDate: daysFromToday(160) }
  },
  {
    docId: 'wo-9', docType: 'workOrder',
    data: { name: 'Weld Frames Batch', workCenterId: 'wc-6', status: 'complete', startDate: daysFromToday(-180), endDate: daysFromToday(-80) }
  },
  {
    docId: 'wo-10', docType: 'workOrder',
    data: { name: 'Structural Weld Job', workCenterId: 'wc-6', status: 'in-progress', startDate: daysFromToday(-50), endDate: daysFromToday(100) }
  },
];

// Work orders for WEEK view (medium durations)
export const WORK_ORDERS_WEEK: WorkOrderDocument[] = [
  {
    docId: 'wo-1', docType: 'workOrder',
    data: { name: 'Batch Run #4421', workCenterId: 'wc-1', status: 'complete', startDate: daysFromToday(-30), endDate: daysFromToday(-5) }
  },
  {
    docId: 'wo-2', docType: 'workOrder',
    data: { name: 'Polymer Mix A', workCenterId: 'wc-1', status: 'in-progress', startDate: daysFromToday(-3), endDate: daysFromToday(20) }
  },
  {
    docId: 'wo-3', docType: 'workOrder',
    data: { name: 'Frame Cut Order', workCenterId: 'wc-2', status: 'open', startDate: daysFromToday(-15), endDate: daysFromToday(15) }
  },
  {
    docId: 'wo-4', docType: 'workOrder',
    data: { name: 'Panel Precision', workCenterId: 'wc-2', status: 'blocked', startDate: daysFromToday(5), endDate: daysFromToday(30) }
  },
  {
    docId: 'wo-5', docType: 'workOrder',
    data: { name: 'Unit Assembly X7', workCenterId: 'wc-3', status: 'in-progress', startDate: daysFromToday(-20), endDate: daysFromToday(10) }
  },
  {
    docId: 'wo-6', docType: 'workOrder',
    data: { name: 'Sub-assembly Batch', workCenterId: 'wc-3', status: 'open', startDate: daysFromToday(0), endDate: daysFromToday(25) }
  },
  {
    docId: 'wo-7', docType: 'workOrder',
    data: { name: 'QC Inspection Lot 9', workCenterId: 'wc-4', status: 'blocked', startDate: daysFromToday(-10), endDate: daysFromToday(20) }
  },
  {
    docId: 'wo-8', docType: 'workOrder',
    data: { name: 'Final Pack Run', workCenterId: 'wc-5', status: 'open', startDate: daysFromToday(10), endDate: daysFromToday(35) }
  },
  {
    docId: 'wo-9', docType: 'workOrder',
    data: { name: 'Weld Frames Batch', workCenterId: 'wc-6', status: 'complete', startDate: daysFromToday(-40), endDate: daysFromToday(-15) }
  },
  {
    docId: 'wo-10', docType: 'workOrder',
    data: { name: 'Structural Weld Job', workCenterId: 'wc-6', status: 'in-progress', startDate: daysFromToday(-25), endDate: daysFromToday(5) }
  },
];

// Work orders for DAY view (short durations)
export const WORK_ORDERS_DAY: WorkOrderDocument[] = [
  {
    docId: 'wo-1', docType: 'workOrder',
    data: { name: 'Batch Run #4421', workCenterId: 'wc-1', status: 'complete', startDate: daysFromToday(-8), endDate: daysFromToday(-2) }
  },
  {
    docId: 'wo-2', docType: 'workOrder',
    data: { name: 'Polymer Mix A', workCenterId: 'wc-1', status: 'in-progress', startDate: daysFromToday(-1), endDate: daysFromToday(5) }
  },
  {
    docId: 'wo-3', docType: 'workOrder',
    data: { name: 'Frame Cut Order', workCenterId: 'wc-2', status: 'open', startDate: daysFromToday(-4), endDate: daysFromToday(3) }
  },
  {
    docId: 'wo-4', docType: 'workOrder',
    data: { name: 'Panel Precision', workCenterId: 'wc-2', status: 'blocked', startDate: daysFromToday(1), endDate: daysFromToday(7) }
  },
  {
    docId: 'wo-5', docType: 'workOrder',
    data: { name: 'Unit Assembly X7', workCenterId: 'wc-3', status: 'in-progress', startDate: daysFromToday(-5), endDate: daysFromToday(2) }
  },
  {
    docId: 'wo-6', docType: 'workOrder',
    data: { name: 'Sub-assembly Batch', workCenterId: 'wc-3', status: 'open', startDate: daysFromToday(0), endDate: daysFromToday(6) }
  },
  {
    docId: 'wo-7', docType: 'workOrder',
    data: { name: 'QC Inspection Lot 9', workCenterId: 'wc-4', status: 'blocked', startDate: daysFromToday(-3), endDate: daysFromToday(4) }
  },
  {
    docId: 'wo-8', docType: 'workOrder',
    data: { name: 'Final Pack Run', workCenterId: 'wc-5', status: 'open', startDate: daysFromToday(2), endDate: daysFromToday(8) }
  },
  {
    docId: 'wo-9', docType: 'workOrder',
    data: { name: 'Weld Frames Batch', workCenterId: 'wc-6', status: 'complete', startDate: daysFromToday(-9), endDate: daysFromToday(-3) }
  },
  {
    docId: 'wo-10', docType: 'workOrder',
    data: { name: 'Structural Weld Job', workCenterId: 'wc-6', status: 'in-progress', startDate: daysFromToday(-6), endDate: daysFromToday(1) }
  },
];

// Helper function to generate dates with specific hours
function hoursFromNow(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString().split('T')[0];
}

// Work orders for HOUR view (very short durations in hours)
export const WORK_ORDERS_HOUR: WorkOrderDocument[] = [
  {
    docId: 'wo-1', docType: 'workOrder',
    data: { name: 'Rapid Setup #1', workCenterId: 'wc-1', status: 'in-progress', startDate: hoursFromNow(-3), endDate: hoursFromNow(1) }
  },
  {
    docId: 'wo-2', docType: 'workOrder',
    data: { name: 'Quick Cycle Test', workCenterId: 'wc-1', status: 'open', startDate: hoursFromNow(2), endDate: hoursFromNow(6) }
  },
  {
    docId: 'wo-3', docType: 'workOrder',
    data: { name: 'Precision Cut A', workCenterId: 'wc-2', status: 'in-progress', startDate: hoursFromNow(-2), endDate: hoursFromNow(2) }
  },
  {
    docId: 'wo-4', docType: 'workOrder',
    data: { name: 'Slot Milling Job', workCenterId: 'wc-2', status: 'open', startDate: hoursFromNow(3), endDate: hoursFromNow(7) }
  },
  {
    docId: 'wo-5', docType: 'workOrder',
    data: { name: 'Sub-assembly CHK', workCenterId: 'wc-3', status: 'complete', startDate: hoursFromNow(-5), endDate: hoursFromNow(-1) }
  },
  {
    docId: 'wo-6', docType: 'workOrder',
    data: { name: 'Final Inspection', workCenterId: 'wc-3', status: 'in-progress', startDate: hoursFromNow(0), endDate: hoursFromNow(4) }
  },
  {
    docId: 'wo-7', docType: 'workOrder',
    data: { name: 'Quality Verify X', workCenterId: 'wc-4', status: 'open', startDate: hoursFromNow(1), endDate: hoursFromNow(5) }
  },
  {
    docId: 'wo-8', docType: 'workOrder',
    data: { name: 'Pack & Ship', workCenterId: 'wc-5', status: 'blocked', startDate: hoursFromNow(-1), endDate: hoursFromNow(3) }
  },
  {
    docId: 'wo-9', docType: 'workOrder',
    data: { name: 'Weld Prep', workCenterId: 'wc-6', status: 'complete', startDate: hoursFromNow(-6), endDate: hoursFromNow(-2) }
  },
  {
    docId: 'wo-10', docType: 'workOrder',
    data: { name: 'Stress Test Run', workCenterId: 'wc-6', status: 'open', startDate: hoursFromNow(4), endDate: hoursFromNow(8) }
  },
];

// Default export for backward compatibility (MONTH view)
export const WORK_ORDERS: WorkOrderDocument[] = WORK_ORDERS_MONTH;
