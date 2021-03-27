import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BoissonComponent } from './list/boisson.component';
import { BoissonDetailComponent } from './detail/boisson-detail.component';
import { BoissonUpdateComponent } from './update/boisson-update.component';
import { BoissonDeleteDialogComponent } from './delete/boisson-delete-dialog.component';
import { BoissonRoutingModule } from './route/boisson-routing.module';

@NgModule({
  imports: [SharedModule, BoissonRoutingModule],
  declarations: [BoissonComponent, BoissonDetailComponent, BoissonUpdateComponent, BoissonDeleteDialogComponent],
  entryComponents: [BoissonDeleteDialogComponent],
})
export class JeeProjectApi1BoissonModule {}
