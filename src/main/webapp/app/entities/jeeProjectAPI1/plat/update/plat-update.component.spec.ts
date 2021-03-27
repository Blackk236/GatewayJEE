jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PlatService } from '../service/plat.service';
import { IPlat, Plat } from '../plat.model';
import { IBoisson } from 'app/entities/jeeProjectAPI1/boisson/boisson.model';
import { BoissonService } from 'app/entities/jeeProjectAPI1/boisson/service/boisson.service';

import { PlatUpdateComponent } from './plat-update.component';

describe('Component Tests', () => {
  describe('Plat Management Update Component', () => {
    let comp: PlatUpdateComponent;
    let fixture: ComponentFixture<PlatUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let platService: PlatService;
    let boissonService: BoissonService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PlatUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PlatUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlatUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      platService = TestBed.inject(PlatService);
      boissonService = TestBed.inject(BoissonService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Boisson query and add missing value', () => {
        const plat: IPlat = { id: 456 };
        const boissons: IBoisson[] = [{ id: 23326 }];
        plat.boissons = boissons;

        const boissonCollection: IBoisson[] = [{ id: 76517 }];
        spyOn(boissonService, 'query').and.returnValue(of(new HttpResponse({ body: boissonCollection })));
        const additionalBoissons = [...boissons];
        const expectedCollection: IBoisson[] = [...additionalBoissons, ...boissonCollection];
        spyOn(boissonService, 'addBoissonToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ plat });
        comp.ngOnInit();

        expect(boissonService.query).toHaveBeenCalled();
        expect(boissonService.addBoissonToCollectionIfMissing).toHaveBeenCalledWith(boissonCollection, ...additionalBoissons);
        expect(comp.boissonsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const plat: IPlat = { id: 456 };
        const boissons: IBoisson = { id: 32608 };
        plat.boissons = [boissons];

        activatedRoute.data = of({ plat });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(plat));
        expect(comp.boissonsSharedCollection).toContain(boissons);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plat = { id: 123 };
        spyOn(platService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plat });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: plat }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(platService.update).toHaveBeenCalledWith(plat);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plat = new Plat();
        spyOn(platService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plat });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: plat }));
        saveSubject.complete();

        // THEN
        expect(platService.create).toHaveBeenCalledWith(plat);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plat = { id: 123 };
        spyOn(platService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plat });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(platService.update).toHaveBeenCalledWith(plat);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBoissonById', () => {
        it('Should return tracked Boisson primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBoissonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedBoisson', () => {
        it('Should return option if no Boisson is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedBoisson(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Boisson for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedBoisson(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Boisson is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedBoisson(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
