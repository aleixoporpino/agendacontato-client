import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';



import { Contato } from '../models/contato.model';
import { Usuario } from '../models/usuario.model';
import { HttpReturnMessage } from '../models/httpreturnmessage.model';
import { Globals } from '../globals';
import { AppService } from '../app.service';

@Injectable()
export class ContatoService {

    private URL = 'contato';
    private usuario = new Usuario();

    constructor(
        protected httpClient: HttpClient, private globals: Globals,
        private cookieService: CookieService, private appService: AppService
    ) {
        this.URL = globals.PRIVATE_URL + this.URL;
    }

    public salvar(contato: Contato): Observable<HttpReturnMessage> {
        this.appService.checkCredentials();
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });
        contato.usuario = new Usuario();
        contato.usuario.idUsuario = +this.cookieService.get('idUsuario');
        return this.httpClient.post(this.URL + '/salvar', contato, { headers: headers })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    public excluir(contato: Contato): Observable<HttpReturnMessage> {
        this.appService.checkCredentials();
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });
        return this.httpClient.delete(this.URL + '/excluir/' + contato.idContato, { headers: headers })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public listar(): Observable<Array<Contato>> {
        this.appService.checkCredentials();
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });
        return this.httpClient.get(this.URL + '/porusuario/' + +this.cookieService.get('idUsuario'), { headers: headers })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public listarPorNome(nome: String): Observable<Array<Contato>> {
        this.appService.checkCredentials();
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });

        return this.httpClient.get(this.URL + '/pornome/' + nome + '/' + +this.cookieService.get('idUsuario'), { headers: headers })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    public editar(contato: Contato): Observable<HttpReturnMessage> {
        this.appService.checkCredentials();
        contato.usuario = new Usuario();
        contato.usuario.idUsuario = +this.cookieService.get('idUsuario');
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });
        return this.httpClient.put(this.URL + '/editar/' + contato.idContato, contato, { headers: headers })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(alert('Erro desconhecido, entre em contato com o administrador do sistema.') || error));
    }

}
