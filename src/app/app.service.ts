import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from '../app/globals';

import { Usuario } from '../app/models/usuario.model';
import { UsuarioService } from '../app/usuarios/usuario.service';


@Injectable()
export class AppService {
    authenticated = false;
    constructor(
        private _router: Router, private _http: HttpClient, private cookieService: CookieService,
        private globals: Globals, private usuarioService: UsuarioService) { }

    obtainAccessToken(loginData) {
        const params = new URLSearchParams();
        params.append('username', loginData.username);
        params.append('password', loginData.password);
        params.append('grant_type', 'password');
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Basic ' + btoa('techlead-angular-frontend-agenda:techleadagenda')
        });

        this._http.post(this.globals.PUBLIC_URL + 'oauth/token',
            params.toString(), { headers: headers })
            .map(res => res)
            .subscribe(
            data => this.saveToken(data, loginData),
            err => alert('Usuário inexistente ou senha inválida.'));
    }

    setUsuarioLogado(usuarioLogin: string) {
        this.usuarioService.buscarPorLogin(usuarioLogin).subscribe(usuario => {
            this.cookieService.set('idUsuario', usuario.idUsuario + '');
            this._router.navigate(['/contato']);
        });
    }

    saveToken(token, loginData: any) {
        const expireDate = new Date().getTime() + (1000 * token.expires_in);
        this.cookieService.set('access_token', token.access_token, expireDate);
        this.cookieService.set('usuarioNome', loginData.username, expireDate);
        this.setUsuarioLogado(loginData.username);
    }

    getResource(resourceUrl): Observable<Usuario> {
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + this.cookieService.get('access_token')
        });
        return this._http.get(resourceUrl, { headers: headers })
            .map((res: any) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    checkCredentials() {
        if (!this.cookieService.check('access_token')) {
            this._router.navigate(['/login']);
            this.authenticated = false;
        } else {
            this.authenticated = true;
        }
    }

    logout() {
        this.cookieService.delete('access_token');
        this.cookieService.delete('usuarioNome');
        this.cookieService.delete('idUsuario');
        this._router.navigate(['/login']);
    }
}
