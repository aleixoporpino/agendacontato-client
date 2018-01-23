import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { AppService } from '../app.service';
import { RegistroUsuarioService } from '../usuarios/registro-usuario.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
    selector: 'app-template-login',
    templateUrl: './template-login.component.html',
    styleUrls: ['./template-login.component.css']
})
export class TemplateLoginComponent implements OnInit {
    alertMessage: String = '';
    boAlertMessage = false;

    isCadastrando = false;
    novoUsuario: Usuario;
    public loginData = { username: '', password: '' };

    constructor(private appService: AppService, private registroUsuarioService: RegistroUsuarioService) { }

    ngOnInit() {

    }

    novoUsuarioForm(usuario: Usuario) {
        this.isCadastrando = true;
        this.novoUsuario = new Usuario();
    }

    login() {
        this.appService.obtainAccessToken(this.loginData);
    }

    salvarUsuario(usuario: Usuario): void {
        this.registroUsuarioService
            .salvar(usuario)
            .subscribe((res) => {
                if (res.codigoErro === 0) {
                    this.alertMessage = res.mensagem;
                    this.boAlertMessage = true;
                    this.isCadastrando = false;
                } else if (res.codigoErro === 1) {
                    alert(res.mensagem);
                }
            });
    }

    cancelarCadastroUsuario() {
        this.isCadastrando = false;
    }

}
