jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommandeService } from '../service/commande.service';
import { ICommande, Commande } from '../commande.model';
import { IPlat } from 'app/entities/jeeProjectAPI1/plat/plat.model';
import { PlatService } from 'app/entities/jeeProjectAPI1/plat/service/plat.service';

import { CommandeUpdateComponent } from './commande-update.component';

describe('Component Tests', () => {
  describe('Commande Management Update Component', () => {
    let comp: CommandeUpdateComponent;
    let fixture: ComponentFixture<CommandeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commandeService: CommandeService;
    let platService: PlatService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommandeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommandeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommandeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commandeService = TestBed.inject(CommandeService);
      platService = TestBed.inject(PlatService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Plat query and add missing value', () => {
        const commande: ICommande = { id: 456 };
        const plats: IPlat[] = [{ id: 55564 }];
        commande.plats = plats;

        const platCollection: IPlat[] = [{ id: 88609 }];
        spyOn(platService, 'query').and.returnValue(of(new HttpResponse({ body: platCollection })));
        const additionalPlats = [...plats];
        const expectedCollection: IPlat[] = [...additionalPlats, ...platCollection];
        spyOn(platService, 'addPlatToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ commande });
        comp.ngOnInit();

        expect(platService.query).toHaveBeenCalled();
        expect(platService.addPlatToCollectionIfMissing).toHaveBeenCalledWith(platCollection, ...additionalPlats);
        expect(comp.platsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const commande: ICommande = { id: 456 };
        const plats: IPlat = { id: 35418 };
        commande.plats = [plats];

        activatedRoute.data = of({ commande });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(commande));
        expect(comp.platsSharedCollection).toContain(plats);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commande = { id: 123 };
        spyOn(commandeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commande });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commande }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commandeService.update).toHaveBeenCalledWith(commande);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commande = new Commande();
        spyOn(commandeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commande });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commande }));
        saveSubject.complete();

        // THEN
        expect(commandeService.create).toHaveBeenCalledWith(commande);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commande = { id: 123 };
        spyOn(commandeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commande });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commandeService.update).toHaveBeenCalledWith(commande);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPlatById', () => {
        it('Should return tracked Plat primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPlatById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedPlat', () => {
        it('Should return option if no Plat is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedPlat(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Plat for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedPlat(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Plat is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedPlat(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
