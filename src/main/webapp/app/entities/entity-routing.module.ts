import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'boisson',
        data: { pageTitle: 'jeeProjectGatApp.jeeProjectApi1Boisson.home.title' },
        loadChildren: () => import('./jeeProjectAPI1/boisson/boisson.module').then(m => m.JeeProjectApi1BoissonModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'jeeProjectGatApp.jeeProjectApi2Client.home.title' },
        loadChildren: () => import('./jeeProjectAPI2/client/client.module').then(m => m.JeeProjectApi2ClientModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'jeeProjectGatApp.jeeProjectApi1Commande.home.title' },
        loadChildren: () => import('./jeeProjectAPI1/commande/commande.module').then(m => m.JeeProjectApi1CommandeModule),
      },
      {
        path: 'plat',
        data: { pageTitle: 'jeeProjectGatApp.jeeProjectApi1Plat.home.title' },
        loadChildren: () => import('./jeeProjectAPI1/plat/plat.module').then(m => m.JeeProjectApi1PlatModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
