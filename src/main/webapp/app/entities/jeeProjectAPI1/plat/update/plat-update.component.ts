import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPlat, Plat } from '../plat.model';
import { PlatService } from '../service/plat.service';
import { IBoisson } from 'app/entities/jeeProjectAPI1/boisson/boisson.model';
import { BoissonService } from 'app/entities/jeeProjectAPI1/boisson/service/boisson.service';

@Component({
  selector: 'jhi-plat-update',
  templateUrl: './plat-update.component.html',
})
export class PlatUpdateComponent implements OnInit {
  isSaving = false;

  boissonsSharedCollection: IBoisson[] = [];

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required]],
    prixUnitaire: [null, [Validators.required]],
    quantite: [null, [Validators.required]],
    boissons: [],
  });

  constructor(
    protected platService: PlatService,
    protected boissonService: BoissonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plat }) => {
      this.updateForm(plat);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plat = this.createFromForm();
    if (plat.id !== undefined) {
      this.subscribeToSaveResponse(this.platService.update(plat));
    } else {
      this.subscribeToSaveResponse(this.platService.create(plat));
    }
  }

  trackBoissonById(index: number, item: IBoisson): number {
    return item.id!;
  }

  getSelectedBoisson(option: IBoisson, selectedVals?: IBoisson[]): IBoisson {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlat>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(plat: IPlat): void {
    this.editForm.patchValue({
      id: plat.id,
      libelle: plat.libelle,
      prixUnitaire: plat.prixUnitaire,
      quantite: plat.quantite,
      boissons: plat.boissons,
    });

    this.boissonsSharedCollection = this.boissonService.addBoissonToCollectionIfMissing(
      this.boissonsSharedCollection,
      ...(plat.boissons ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.boissonService
      .query()
      .pipe(map((res: HttpResponse<IBoisson[]>) => res.body ?? []))
      .pipe(
        map((boissons: IBoisson[]) =>
          this.boissonService.addBoissonToCollectionIfMissing(boissons, ...(this.editForm.get('boissons')!.value ?? []))
        )
      )
      .subscribe((boissons: IBoisson[]) => (this.boissonsSharedCollection = boissons));
  }

  protected createFromForm(): IPlat {
    return {
      ...new Plat(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      prixUnitaire: this.editForm.get(['prixUnitaire'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      boissons: this.editForm.get(['boissons'])!.value,
    };
  }
}
