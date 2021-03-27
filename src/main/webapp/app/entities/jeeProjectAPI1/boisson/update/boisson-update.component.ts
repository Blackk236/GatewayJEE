import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBoisson, Boisson } from '../boisson.model';
import { BoissonService } from '../service/boisson.service';

@Component({
  selector: 'jhi-boisson-update',
  templateUrl: './boisson-update.component.html',
})
export class BoissonUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required]],
  });

  constructor(protected boissonService: BoissonService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boisson }) => {
      this.updateForm(boisson);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boisson = this.createFromForm();
    if (boisson.id !== undefined) {
      this.subscribeToSaveResponse(this.boissonService.update(boisson));
    } else {
      this.subscribeToSaveResponse(this.boissonService.create(boisson));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoisson>>): void {
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

  protected updateForm(boisson: IBoisson): void {
    this.editForm.patchValue({
      id: boisson.id,
      libelle: boisson.libelle,
    });
  }

  protected createFromForm(): IBoisson {
    return {
      ...new Boisson(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
    };
  }
}
