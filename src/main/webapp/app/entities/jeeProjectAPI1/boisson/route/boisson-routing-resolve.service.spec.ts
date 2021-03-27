jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBoisson, Boisson } from '../boisson.model';
import { BoissonService } from '../service/boisson.service';

import { BoissonRoutingResolveService } from './boisson-routing-resolve.service';

describe('Service Tests', () => {
  describe('Boisson routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BoissonRoutingResolveService;
    let service: BoissonService;
    let resultBoisson: IBoisson | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BoissonRoutingResolveService);
      service = TestBed.inject(BoissonService);
      resultBoisson = undefined;
    });

    describe('resolve', () => {
      it('should return IBoisson returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoisson = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBoisson).toEqual({ id: 123 });
      });

      it('should return new IBoisson if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoisson = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBoisson).toEqual(new Boisson());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoisson = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBoisson).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
