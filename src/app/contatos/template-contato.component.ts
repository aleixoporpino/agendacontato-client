import { Component, OnInit, AfterViewInit, Pipe, PipeTransform, Inject} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

import { Contato } from '../models/contato.model';
import { Usuario } from '../models/usuario.model';
import { Operacao } from '../enums/operacao';
import { ContatoService } from '../contatos/contato.service';
import { AppService } from '../app.service';

@Component({
    selector: 'app-template-contato',
    templateUrl: './template-contato.component.html',
    styleUrls: ['./template-contato.component.css']
})
export class TemplateContatoComponent implements OnInit, AfterViewInit {
    contatos: Contato[] = [];

    pesqNome: String = '';

    alertMessage: String = '';
    boAlertMessage = false;
    confirmacaoExclusao = false;

    operacao: Operacao = Operacao.LISTANDO;

    novoContato: any = {};
    constructor(private contatoService: ContatoService, private appService: AppService,
        private cookieService: CookieService, public dialog: MatDialog) {
    }

    ngAfterViewInit() {
        this.listarContato();
    }

    ngOnInit() {
        this.appService.checkCredentials();
        this.listarContato();
    }

    listarContato() {
        this.contatoService.listar().subscribe(contatos => {
            this.contatos = contatos;
        });
    }

    pesquisarContatoPorNome(pesqNome: string) {
        if (pesqNome.length > 0) {
            this.contatoService.listarPorNome(pesqNome).subscribe(contatos => {
                this.contatos = contatos;
            });
        } else {
            this.listarContato();
        }
    }

    novoContatoForm(contato: Contato) {
        // Reseta o form se for editado um contato
        if (this.contatos.length) {
            this.novoContato = {};
        }
        this.operacao = Operacao.CADASTRANDO;
    }

    editarContatoForm(contato: Contato) {
        if (!contato) {
            this.operacao = Operacao.LISTANDO;
            return;
        }
        this.operacao = Operacao.EDITANDO;
        this.novoContato = new Contato();
        this.novoContato = contato;
    }

    visualizarContatoForm(contato: Contato) {
        this.operacao = Operacao.VISUALIZANDO;
        this.novoContato = contato;
    }

    salvarContato(contato: Contato) {
        const datePipe = new DatePipe('en-US');
        contato.dataNascimento = datePipe.transform(contato.dataNascimento, 'dd/MM/yyyy');
        if (this.operacao === Operacao.CADASTRANDO) {
            this.contatoService
                .salvar(contato)
                .subscribe((res) => {
                    if (res.codigoErro === 0) {
                        this.listarContato();
                        this.operacao = Operacao.LISTANDO;
                        this.novoContato = contato;
                        this.boAlertMessage = true;
                        this.alertMessage = res.mensagem;
                    } else {
                        alert(res.mensagem);
                    }
                });
        } else {
            this.contatoService
                .editar(contato)
                .subscribe((res) => {
                    if (res.codigoErro === 0) {
                        this.listarContato();
                        this.operacao = Operacao.LISTANDO;
                        this.novoContato = contato;
                        this.boAlertMessage = true;
                        this.alertMessage = res.mensagem;
                    } else {
                        alert(res.mensagem);
                    }
                });
        }

    }

    excluirContato(contato: Contato) {
        this.contatoService
            .excluir(contato)
            .subscribe((res) => {
                if (res.codigoErro === 0) {
                    this.listarContato();
                    this.operacao = Operacao.LISTANDO;
                    this.boAlertMessage = true;
                    this.alertMessage = res.mensagem;
                } else {
                    alert(res.mensagem);
                }
            });

    }

    cancelarCadastroContato() {
        this.operacao = Operacao.LISTANDO;
        this.listarContato();
    }

}
