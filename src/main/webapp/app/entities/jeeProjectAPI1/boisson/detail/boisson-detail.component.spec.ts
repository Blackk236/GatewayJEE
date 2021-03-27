import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BoissonDetailComponent } from './boisson-detail.component';

describe('Component Tests', () => {
  describe('Boisson Management Detail Component', () => {
    let comp: BoissonDetailComponent;
    let fixture: ComponentFixture<BoissonDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BoissonDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ boisson: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BoissonDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BoissonDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load boisson on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.boisson).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
