import { IBoisson } from 'app/entities/jeeProjectAPI1/boisson/boisson.model';
import { ICommande } from 'app/entities/jeeProjectAPI1/commande/commande.model';

export interface IPlat {
  id?: number;
  libelle?: string;
  prixUnitaire?: number;
  quantite?: number;
  boissons?: IBoisson[] | null;
  commandes?: ICommande[] | null;
}

export class Plat implements IPlat {
  constructor(
    public id?: number,
    public libelle?: string,
    public prixUnitaire?: number,
    public quantite?: number,
    public boissons?: IBoisson[] | null,
    public commandes?: ICommande[] | null
  ) {}
}

export function getPlatIdentifier(plat: IPlat): number | undefined {
  return plat.id;
}
