import { Usuario } from '../models/usuario.model';

export class Contato {
    idContato: number;
    usuario: Usuario;
    nome: string;
    sobrenome?: string;
    email?: string;
    endereco?: string;
    dataNascimento?: string;
    telefone?: string;
    celular?: string;
    celular2?: string;
}
