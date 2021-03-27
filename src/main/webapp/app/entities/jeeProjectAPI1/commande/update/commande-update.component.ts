import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommande, Commande } from '../commande.model';
import { CommandeService } from '../service/commande.service';
import { IPlat } from 'app/entities/jeeProjectAPI1/plat/plat.model';
import { PlatService } from 'app/entities/jeeProjectAPI1/plat/service/plat.service';

@Component({
  selector: 'jhi-commande-update',
  templateUrl: './commande-update.component.html',
})
export class CommandeUpdateComponent implements OnInit {
  isSaving = false;

  platsSharedCollection: IPlat[] = [];

  editForm = this.fb.group({
    id: [],
    numero: [null, [Validators.required]],
    date: [null, [Validators.required]],
    plats: [],
  });

  constructor(
    protected commandeService: CommandeService,
    protected platService: PlatService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commande }) => {
      this.updateForm(commande);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commande = this.createFromForm();
    if (commande.id !== undefined) {
      this.subscribeToSaveResponse(this.commandeService.update(commande));
    } else {
      this.subscribeToSaveResponse(this.commandeService.create(commande));
    }
  }

  trackPlatById(index: number, item: IPlat): number {
    return item.id!;
  }

  getSelectedPlat(option: IPlat, selectedVals?: IPlat[]): IPlat {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommande>>): void {
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

  protected updateForm(commande: ICommande): void {
    this.editForm.patchValue({
      id: commande.id,
      numero: commande.numero,
      date: commande.date,
      plats: commande.plats,
    });

    this.platsSharedCollection = this.platService.addPlatToCollectionIfMissing(this.platsSharedCollection, ...(commande.plats ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.platService
      .query()
      .pipe(map((res: HttpResponse<IPlat[]>) => res.body ?? []))
      .pipe(map((plats: IPlat[]) => this.platService.addPlatToCollectionIfMissing(plats, ...(this.editForm.get('plats')!.value ?? []))))
      .subscribe((plats: IPlat[]) => (this.platsSharedCollection = plats));
  }

  protected createFromForm(): ICommande {
    return {
      ...new Commande(),
      id: this.editForm.get(['id'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      date: this.editForm.get(['date'])!.value,
      plats: this.editForm.get(['plats'])!.value,
    };
  }
}
