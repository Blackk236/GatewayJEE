import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBoisson, Boisson } from '../boisson.model';

import { BoissonService } from './boisson.service';

describe('Service Tests', () => {
  describe('Boisson Service', () => {
    let service: BoissonService;
    let httpMock: HttpTestingController;
    let elemDefault: IBoisson;
    let expectedResult: IBoisson | IBoisson[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BoissonService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        libelle: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Boisson', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Boisson()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Boisson', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libelle: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Boisson', () => {
        const patchObject = Object.assign(
          {
            libelle: 'BBBBBB',
          },
          new Boisson()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Boisson', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libelle: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Boisson', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBoissonToCollectionIfMissing', () => {
        it('should add a Boisson to an empty array', () => {
          const boisson: IBoisson = { id: 123 };
          expectedResult = service.addBoissonToCollectionIfMissing([], boisson);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boisson);
        });

        it('should not add a Boisson to an array that contains it', () => {
          const boisson: IBoisson = { id: 123 };
          const boissonCollection: IBoisson[] = [
            {
              ...boisson,
            },
            { id: 456 },
          ];
          expectedResult = service.addBoissonToCollectionIfMissing(boissonCollection, boisson);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Boisson to an array that doesn't contain it", () => {
          const boisson: IBoisson = { id: 123 };
          const boissonCollection: IBoisson[] = [{ id: 456 }];
          expectedResult = service.addBoissonToCollectionIfMissing(boissonCollection, boisson);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boisson);
        });

        it('should add only unique Boisson to an array', () => {
          const boissonArray: IBoisson[] = [{ id: 123 }, { id: 456 }, { id: 49822 }];
          const boissonCollection: IBoisson[] = [{ id: 123 }];
          expectedResult = service.addBoissonToCollectionIfMissing(boissonCollection, ...boissonArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const boisson: IBoisson = { id: 123 };
          const boisson2: IBoisson = { id: 456 };
          expectedResult = service.addBoissonToCollectionIfMissing([], boisson, boisson2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(boisson);
          expect(expectedResult).toContain(boisson2);
        });

        it('should accept null and undefined values', () => {
          const boisson: IBoisson = { id: 123 };
          expectedResult = service.addBoissonToCollectionIfMissing([], null, boisson, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(boisson);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
