import * as dayjs from 'dayjs';
import { IPlat } from 'app/entities/jeeProjectAPI1/plat/plat.model';

export interface ICommande {
  id?: number;
  numero?: string;
  date?: dayjs.Dayjs;
  plats?: IPlat[] | null;
}

export class Commande implements ICommande {
  constructor(public id?: number, public numero?: string, public date?: dayjs.Dayjs, public plats?: IPlat[] | null) {}
}

export function getCommandeIdentifier(commande: ICommande): number | undefined {
  return commande.id;
}
