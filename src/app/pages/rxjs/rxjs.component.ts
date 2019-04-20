import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    // el retry es para que vuelva a intentar en caso de error
    this.subscription = this.regresaObservable().pipe(
      retry(2)
    ).subscribe(
      numero => console.log('Sub', numero ), // resolucion de next
      error => console.error('Error', error ), // el error
      () => console.log('El  Obs termino') // el complete
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La pagina se va a cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {

    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      const intervalo = setInterval( () => {

        contador++;

        const salida = {
          valor: contador
        };

        observer.next( salida );
        // Comentado para probar el unsubscribe
        // if ( contador === 3 ) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }

      }, 1000);

    }).pipe(
      map( resp => resp.valor ),
      filter((valor) => {
        if (( valor % 2 ) === 1) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      })
    );

  }

}
