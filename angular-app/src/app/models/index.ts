export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
export type ZoomLevel = 'hour' | 'day' | 'week' | 'month';
export type PanelMode = 'create' | 'edit';

export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string;
    endDate: string;
  };
}

export interface TimelineColumn {
  date: Date;
  label: string;
  isToday: boolean;
  isWeekend?: boolean;
}

export interface WorkOrderBarPosition {
  workOrder: WorkOrderDocument;
  left: number;
  width: number;
  visible: boolean;
}
