export interface IClient {
  id?: number;
  nom?: string;
  prenom?: string;
  cni?: string;
  adresse?: string;
}

export class Client implements IClient {
  constructor(public id?: number, public nom?: string, public prenom?: string, public cni?: string, public adresse?: string) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
