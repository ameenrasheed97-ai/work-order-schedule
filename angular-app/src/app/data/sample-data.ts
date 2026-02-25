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

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1', docType: 'workOrder',
    data: { name: 'Batch Run #4421', workCenterId: 'wc-1', status: 'complete', startDate: daysFromToday(-14), endDate: daysFromToday(-8) }
  },
  {
    docId: 'wo-2', docType: 'workOrder',
    data: { name: 'Polymer Mix A', workCenterId: 'wc-1', status: 'in-progress', startDate: daysFromToday(-3), endDate: daysFromToday(5) }
  },
  {
    docId: 'wo-3', docType: 'workOrder',
    data: { name: 'Frame Cut Order', workCenterId: 'wc-2', status: 'open', startDate: daysFromToday(2), endDate: daysFromToday(9) }
  },
  {
    docId: 'wo-4', docType: 'workOrder',
    data: { name: 'Panel Precision', workCenterId: 'wc-2', status: 'blocked', startDate: daysFromToday(12), endDate: daysFromToday(20) }
  },
  {
    docId: 'wo-5', docType: 'workOrder',
    data: { name: 'Unit Assembly X7', workCenterId: 'wc-3', status: 'in-progress', startDate: daysFromToday(-5), endDate: daysFromToday(3) }
  },
  {
    docId: 'wo-6', docType: 'workOrder',
    data: { name: 'Sub-assembly Batch', workCenterId: 'wc-3', status: 'open', startDate: daysFromToday(7), endDate: daysFromToday(15) }
  },
  {
    docId: 'wo-7', docType: 'workOrder',
    data: { name: 'QC Inspection Lot 9', workCenterId: 'wc-4', status: 'blocked', startDate: daysFromToday(-2), endDate: daysFromToday(4) }
  },
  {
    docId: 'wo-8', docType: 'workOrder',
    data: { name: 'Final Pack Run', workCenterId: 'wc-5', status: 'open', startDate: daysFromToday(6), endDate: daysFromToday(14) }
  },
  {
    docId: 'wo-9', docType: 'workOrder',
    data: { name: 'Weld Frames Batch', workCenterId: 'wc-6', status: 'complete', startDate: daysFromToday(-20), endDate: daysFromToday(-12) }
  },
  {
    docId: 'wo-10', docType: 'workOrder',
    data: { name: 'Structural Weld Job', workCenterId: 'wc-6', status: 'in-progress', startDate: daysFromToday(-4), endDate: daysFromToday(8) }
  },
];
