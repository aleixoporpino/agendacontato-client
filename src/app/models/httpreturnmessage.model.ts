export class HttpReturnMessage {
    codigoErro: number; // 0 - OK, 1 - Erro de validação, 2 - Exception
    mensagem?: string;
    objeto?: any;
}
