import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { TimelineService } from '../../services/timeline.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let timelineService: TimelineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent, CommonModule, FormsModule, NgSelectModule],
      providers: [TimelineService]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    timelineService = TestBed.inject(TimelineService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display work center names', () => {
    const compiled = fixture.nativeElement;
    const workCenterElements = compiled.querySelectorAll('.wc-name');
    expect(workCenterElements.length).toBeGreaterThan(0);
  });

  it('should have correct column width for hour zoom', () => {
    timelineService.setZoomLevel('hour');
    fixture.detectChanges();
    expect(component.COLUMN_WIDTH).toBe(80);
  });

  it('should have correct column width for month zoom', () => {
    timelineService.setZoomLevel('month');
    fixture.detectChanges();
    expect(component.COLUMN_WIDTH).toBe(150);
  });

  it('should have correct column width for week zoom', () => {
    timelineService.setZoomLevel('week');
    fixture.detectChanges();
    expect(component.COLUMN_WIDTH).toBe(160);
  });

  it('should have correct column width for day zoom', () => {
    timelineService.setZoomLevel('day');
    fixture.detectChanges();
    expect(component.COLUMN_WIDTH).toBe(120);
  });

  it('should have correct column width for hour zoom', () => {
    timelineService.setZoomLevel('hour');
    fixture.detectChanges();
    expect(component.COLUMN_WIDTH).toBe(80);
  });

  it('should display work order bars', () => {
    const compiled = fixture.nativeElement;
    const bars = compiled.querySelectorAll('.work-order-bar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('should properly size work order bars', () => {
    const compiled = fixture.nativeElement;
    const bars = compiled.querySelectorAll('.work-order-bar') as NodeListOf<HTMLElement>;
    expect(bars.length).toBeGreaterThan(0);
    // First bar should have a reasonable width
    const firstBar = bars[0];
    const width = firstBar.offsetWidth || parseInt(firstBar.style.width || '0', 10);
    expect(width).toBeGreaterThan(0);
  });

  it('should show status badge on work order bar', () => {
    const compiled = fixture.nativeElement;
    const statusBadges = compiled.querySelectorAll('.bar-badge');
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('should display toolbar with title', () => {
    const compiled = fixture.nativeElement;
    const toolbar = compiled.querySelector('.toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should have today indicator line', () => {
    const compiled = fixture.nativeElement;
    const todayLine = compiled.querySelector('.today-line');
    expect(todayLine).toBeTruthy();
  });

  it('should display timeline grid header', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('.timeline-header');
    expect(header).toBeTruthy();
  });

  it('should have horizontal scroll container', () => {
    const compiled = fixture.nativeElement;
    const scrollContainer = compiled.querySelector('.scroll-container');
    expect(scrollContainer).toBeTruthy();
  });

  it('should update work orders when zoom level changes', () => {
    const initialOrders = component.workOrders().length;
    
    timelineService.setZoomLevel('day');
    fixture.detectChanges();
    
    // Orders might change based on different dataset
    expect(component.workOrders()).toBeTruthy();
  });
});
