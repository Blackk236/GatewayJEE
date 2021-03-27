import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBoisson } from '../boisson.model';

@Component({
  selector: 'jhi-boisson-detail',
  templateUrl: './boisson-detail.component.html',
})
export class BoissonDetailComponent implements OnInit {
  boisson: IBoisson | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boisson }) => {
      this.boisson = boisson;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
