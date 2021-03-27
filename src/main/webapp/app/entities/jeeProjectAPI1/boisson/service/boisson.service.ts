import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoisson, getBoissonIdentifier } from '../boisson.model';

export type EntityResponseType = HttpResponse<IBoisson>;
export type EntityArrayResponseType = HttpResponse<IBoisson[]>;

@Injectable({ providedIn: 'root' })
export class BoissonService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/boissons', 'jeeprojectapi1');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(boisson: IBoisson): Observable<EntityResponseType> {
    return this.http.post<IBoisson>(this.resourceUrl, boisson, { observe: 'response' });
  }

  update(boisson: IBoisson): Observable<EntityResponseType> {
    return this.http.put<IBoisson>(`${this.resourceUrl}/${getBoissonIdentifier(boisson) as number}`, boisson, { observe: 'response' });
  }

  partialUpdate(boisson: IBoisson): Observable<EntityResponseType> {
    return this.http.patch<IBoisson>(`${this.resourceUrl}/${getBoissonIdentifier(boisson) as number}`, boisson, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBoisson>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoisson[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBoissonToCollectionIfMissing(boissonCollection: IBoisson[], ...boissonsToCheck: (IBoisson | null | undefined)[]): IBoisson[] {
    const boissons: IBoisson[] = boissonsToCheck.filter(isPresent);
    if (boissons.length > 0) {
      const boissonCollectionIdentifiers = boissonCollection.map(boissonItem => getBoissonIdentifier(boissonItem)!);
      const boissonsToAdd = boissons.filter(boissonItem => {
        const boissonIdentifier = getBoissonIdentifier(boissonItem);
        if (boissonIdentifier == null || boissonCollectionIdentifiers.includes(boissonIdentifier)) {
          return false;
        }
        boissonCollectionIdentifiers.push(boissonIdentifier);
        return true;
      });
      return [...boissonsToAdd, ...boissonCollection];
    }
    return boissonCollection;
  }
}
