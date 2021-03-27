import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoisson } from '../boisson.model';
import { BoissonService } from '../service/boisson.service';

@Component({
  templateUrl: './boisson-delete-dialog.component.html',
})
export class BoissonDeleteDialogComponent {
  boisson?: IBoisson;

  constructor(protected boissonService: BoissonService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.boissonService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
