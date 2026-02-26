import {
  Component, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, ChangeDetectionStrategy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderDocument, WorkOrderStatus, PanelMode } from '../../models';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgbModule],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderPanelComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: PanelMode = 'create';
  @Input() workOrder: WorkOrderDocument | null = null;
  @Input() prefilledDate: string | null = null;
  @Input() workCenterId: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private svc = inject(TimelineService);

  form: FormGroup;
  overlapError = false;

  statusOptions: { value: WorkOrderStatus; label: string; color: string }[] = [
    { value: 'open',        label: 'Open',        color: 'rgba(0, 176, 191, 1)' },
    { value: 'in-progress', label: 'In progress',  color: '#4338ca' },
    { value: 'complete',    label: 'Complete',     color: '#15803d' },
    { value: 'blocked',     label: 'Blocked',      color: '#d97706' },
  ];

  constructor() {
    this.form = this.fb.group({
      name:      ['', Validators.required],
      status:    ['open', Validators.required],
      startDate: [null],
      endDate:   [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.overlapError = false;
      this.form.reset();
      if (this.mode === 'edit' && this.workOrder) {
        this.form.setValue({
          name:      this.workOrder.data.name,
          status:    this.workOrder.data.status,
          startDate: this.isoToDateObj(this.workOrder.data.startDate),
          endDate:   this.isoToDateObj(this.workOrder.data.endDate),
        });
      } else {
        const start = this.prefilledDate ?? new Date().toISOString().split('T')[0];
        const startObj = this.isoToDateObj(start);
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + 7);
        const endObj = this.isoToDateObj(endDate.toISOString().split('T')[0]);
        this.form.setValue({
          name:      '',
          status:    'open',
          startDate: startObj,
          endDate:   endObj,
        });
      }
    }
  }

  private isoToDateObj(iso: string): { year: number; month: number; day: number } | null {
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  private dateObjToIso(dateObj: { year: number; month: number; day: number } | null): string {
    if (!dateObj) return '';
    const { year, month, day } = dateObj;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  get title(): string { return 'Work Order Details'; }
  get subtitle(): string { return 'Specify the dates, name and status for this order'; }
  get submitLabel(): string { return this.mode === 'create' ? 'Create' : 'Save'; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { name, status, startDate, endDate } = this.form.value;
    const startIso = this.dateObjToIso(startDate);
    const endIso   = this.dateObjToIso(endDate);
    const wcId     = this.mode === 'edit' ? this.workOrder!.data.workCenterId : this.workCenterId!;
    const excludeId = this.mode === 'edit' ? this.workOrder!.docId : undefined;

    if (this.svc.hasOverlap(wcId, startIso, endIso, excludeId)) {
      this.overlapError = true;
      return;
    }
    this.overlapError = false;

    if (this.mode === 'create') {
      this.svc.createWorkOrder({ name, status, startDate: startIso, endDate: endIso, workCenterId: wcId });
    } else {
      this.svc.updateWorkOrder(this.workOrder!.docId, {
        name, status, startDate: startIso, endDate: endIso,
        workCenterId: this.workOrder!.data.workCenterId,
      });
    }
    this.saved.emit();
  }

  onCancel(): void { this.closed.emit(); }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('panel-overlay')) {
      this.closed.emit();
    }
  }
}
