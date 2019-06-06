import Swal from 'sweetalert2';
import { URL_SERVICIOS } from '../../config/config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService) { }

  cargarMedicos() {

    const url = URL_SERVICIOS + '/medico';

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      })
    );
  }

  buscarMedicos(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => resp.medicos)
    );

  }

  cargarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.medico)
    );
  }

  borrarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id + '?token=' + this.usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {

        Swal.fire({
          title: 'Medico Borrado',
          text: 'El medico ha sido borrado correctamente',
          type: 'success'
        });
      })
    );

  }

  guardarMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';
    if (medico._id) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put(url, medico).pipe(
        map((resp: any) => {

          Swal.fire({
            title: 'Medico Actualizado',
            text: 'El medico ha sido actualizado correctamente',
            type: 'success'
          });

          return resp.medico;

        })
      );



    } else {
      // creando

      url += '?token=' + this.usuarioService.token;

      return this.http.post(url, medico).pipe(
        map((resp: any) => {

          Swal.fire({
            title: 'Medico Guardado',
            text: 'El medico ha sido guardado correctamente',
            type: 'success'
          });

          return resp.medico;
        })
      );
    }


  }

}
