import { IPlat } from 'app/entities/jeeProjectAPI1/plat/plat.model';

export interface IBoisson {
  id?: number;
  libelle?: string;
  plats?: IPlat[] | null;
}

export class Boisson implements IBoisson {
  constructor(public id?: number, public libelle?: string, public plats?: IPlat[] | null) {}
}

export function getBoissonIdentifier(boisson: IBoisson): number | undefined {
  return boisson.id;
}
