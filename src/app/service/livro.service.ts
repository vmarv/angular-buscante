import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Item, LivrosResultado} from "../models/interfaces";

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';

  constructor(
    private http: HttpClient
  ) { }

  buscar(valorDigitado: string): Observable<LivrosResultado> {
    const params = new HttpParams().append('q', valorDigitado);
    return this.http.get<LivrosResultado>(this.API, { params })
      //.pipe(
      //tap(retornoApi => console.log('fluxo tap', retornoApi)),
      //map(resultado => resultado.items ?? []),
      //tap(resultado => console.log('fluxo apos map', resultado))
    //);
  }

}
