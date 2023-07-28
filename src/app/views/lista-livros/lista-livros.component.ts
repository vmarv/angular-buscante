import { Component, OnDestroy } from '@angular/core';
import { LivroService } from "../../service/livro.service";
import {catchError, debounceTime, filter, map, of, Subscription, switchMap, tap, throwError} from "rxjs";
import {Item, Livro, LivrosResultado} from "../../models/interfaces";
import { LivroVolumeInfo } from "../../models/livroVolumeInfo";
import { FormControl } from "@angular/forms";

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  //listaLivros: Livro[];
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  //subscription: Subscription;
  //livro: Livro;

  constructor(
    private service: LivroService
  ) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(error => {
      console.log(error);
      return of();
    })
  );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap((retornoApi) => console.log(retornoApi)),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError(erro => {
      console.log(erro);
      return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro, recarregue a aplicação'));
    })
  );

  /*ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }*/

  /*buscarLivros() {
    console.log("requisições");
    this.subscription = this.service.buscar(this.campoBusca).subscribe({
      next: (items) => {
        this.listaLivros = this.livrosResultadoParaLivros(items)
      },
      error: error => console.error(error)
    });
  }*/

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    });
  }

}



