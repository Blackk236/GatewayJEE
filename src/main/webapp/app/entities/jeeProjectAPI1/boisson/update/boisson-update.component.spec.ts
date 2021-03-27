jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BoissonService } from '../service/boisson.service';
import { IBoisson, Boisson } from '../boisson.model';

import { BoissonUpdateComponent } from './boisson-update.component';

describe('Component Tests', () => {
  describe('Boisson Management Update Component', () => {
    let comp: BoissonUpdateComponent;
    let fixture: ComponentFixture<BoissonUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let boissonService: BoissonService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoissonUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BoissonUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoissonUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      boissonService = TestBed.inject(BoissonService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const boisson: IBoisson = { id: 456 };

        activatedRoute.data = of({ boisson });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(boisson));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boisson = { id: 123 };
        spyOn(boissonService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boisson });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boisson }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(boissonService.update).toHaveBeenCalledWith(boisson);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boisson = new Boisson();
        spyOn(boissonService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boisson });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: boisson }));
        saveSubject.complete();

        // THEN
        expect(boissonService.create).toHaveBeenCalledWith(boisson);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const boisson = { id: 123 };
        spyOn(boissonService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ boisson });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(boissonService.update).toHaveBeenCalledWith(boisson);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
