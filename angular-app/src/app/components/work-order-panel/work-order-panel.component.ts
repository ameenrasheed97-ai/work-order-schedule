import {
  Component, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, ChangeDetectionStrategy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrderDocument, WorkOrderStatus, PanelMode } from '../../models';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
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
    { value: 'open',        label: 'Open',        color: '#4338ca' },
    { value: 'in-progress', label: 'In progress',  color: '#4338ca' },
    { value: 'complete',    label: 'Complete',     color: '#15803d' },
    { value: 'blocked',     label: 'Blocked',      color: '#d97706' },
  ];

  constructor() {
    this.form = this.fb.group({
      name:      ['', Validators.required],
      status:    ['open', Validators.required],
      startDate: ['', [Validators.required, this.dateFormatValidator]],
      endDate:   ['', [Validators.required, this.dateFormatValidator]],
    }, { validators: this.dateRangeValidator });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.overlapError = false;
      this.form.reset();
      if (this.mode === 'edit' && this.workOrder) {
        this.form.setValue({
          name:      this.workOrder.data.name,
          status:    this.workOrder.data.status,
          startDate: this.isoToDisplay(this.workOrder.data.startDate),
          endDate:   this.isoToDisplay(this.workOrder.data.endDate),
        });
      } else {
        const start = this.prefilledDate ?? new Date().toISOString().split('T')[0];
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + 7);
        this.form.setValue({
          name:      '',
          status:    'open',
          startDate: this.isoToDisplay(start),
          endDate:   this.isoToDisplay(endDate.toISOString().split('T')[0]),
        });
      }
    }
  }

  private isoToDisplay(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${m}.${d}.${y}`;
  }

  private displayToIso(display: string): string {
    const parts = display.split('.');
    if (parts.length !== 3) return '';
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }

  private dateFormatValidator(ctrl: AbstractControl): ValidationErrors | null {
    const val = ctrl.value as string;
    if (!val) return null;
    const parts = val.split('.');
    if (parts.length !== 3) return { dateFormat: true };
    const [m, d, y] = parts.map(Number);
    if (isNaN(m) || isNaN(d) || isNaN(y)) return { dateFormat: true };
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2000) return { dateFormat: true };
    return null;
  }

  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value as string;
    const end   = group.get('endDate')?.value as string;
    if (!start || !end) return null;
    const toDate = (v: string) => {
      const parts = v.split('.');
      if (parts.length !== 3) return null;
      const [m, d, y] = parts.map(Number);
      return new Date(y, m - 1, d);
    };
    const s = toDate(start);
    const e = toDate(end);
    if (s && e && e <= s) return { dateRange: true };
    return null;
  }

  get title(): string { return 'Work Order Details'; }
  get subtitle(): string { return 'Specify the dates, name and status for this order'; }
  get submitLabel(): string { return this.mode === 'create' ? 'Create' : 'Save'; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { name, status, startDate, endDate } = this.form.value;
    const startIso = this.displayToIso(startDate);
    const endIso   = this.displayToIso(endDate);
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

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
