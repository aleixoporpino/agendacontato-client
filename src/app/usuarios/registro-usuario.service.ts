import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Usuario } from '../models/usuario.model';
import { HttpReturnMessage } from '../models/httpreturnmessage.model';
import { Globals } from '../globals';

@Injectable()
export class RegistroUsuarioService {
    private URL = 'registro';

    constructor(
        protected httpClient: HttpClient, private globals: Globals
    ) {
        this.URL = globals.PUBLIC_URL + this.URL;
    }

    private handleError(error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

    public salvar(usuario: Usuario): Observable<HttpReturnMessage> {
        return this.httpClient.post<HttpReturnMessage>(this.URL + '/salvar', usuario)
            .catch(this.handleError);
    }
}
