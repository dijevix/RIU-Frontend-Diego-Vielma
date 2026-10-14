import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from './modal';

@Component({
  template: '',
  selector: 'app-modal-stub',
})
class ModalStub {}

describe('Modal', () => {
  let service: Modal;
  let dialog: { open: ReturnType<typeof vi.fn>; closeAll: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialog = {
      open: vi.fn().mockReturnValue({ id: 'ref' }),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialog }],
    });
    service = TestBed.inject(Modal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('opens a dialog with the given config', () => {
    const config = { data: { title: 'Test' } };
    const ref = service.openModal(ModalStub, config);

    expect(dialog.open).toHaveBeenCalledWith(ModalStub, config);
    expect(ref).toEqual({ id: 'ref' });
  });

  it('closes all dialogs', () => {
    service.closeModal();
    expect(dialog.closeAll).toHaveBeenCalled();
  });
});
