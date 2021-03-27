import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BoissonComponent } from '../list/boisson.component';
import { BoissonDetailComponent } from '../detail/boisson-detail.component';
import { BoissonUpdateComponent } from '../update/boisson-update.component';
import { BoissonRoutingResolveService } from './boisson-routing-resolve.service';

const boissonRoute: Routes = [
  {
    path: '',
    component: BoissonComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BoissonDetailComponent,
    resolve: {
      boisson: BoissonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BoissonUpdateComponent,
    resolve: {
      boisson: BoissonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BoissonUpdateComponent,
    resolve: {
      boisson: BoissonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(boissonRoute)],
  exports: [RouterModule],
})
export class BoissonRoutingModule {}
