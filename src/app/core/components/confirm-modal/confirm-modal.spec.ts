import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModal, ConfirmModalData } from './confirm-modal';

describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;
  const data: ConfirmModalData = {
    title: 'Delete hero',
    message: 'Are you sure?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders title and message', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Delete hero');
    expect(text).toContain('Are you sure?');
  });

  it('calls onConfirm when Continue is clicked', () => {
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    expect(data.onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const button = fixture.nativeElement.querySelector('.btn-secondary') as HTMLButtonElement;
    button.click();
    expect(data.onCancel).toHaveBeenCalled();
  });
});
