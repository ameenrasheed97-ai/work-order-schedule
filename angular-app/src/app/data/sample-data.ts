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
