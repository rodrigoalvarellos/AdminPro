import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir_archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivo: SubirArchivoService) {

    this.cargarStorage();
  }


  estaLogueado() {
    return (this.token.length > 0) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);


  }

  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
    );

  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;

      }),
      catchError(err => {

        Swal.fire({
          title: 'Error al Logearse',
          text: err.error.mensaje,
          type: 'error'
        });

        return throwError(err);
      })
    );

  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {

        Swal.fire({
          title: 'Usuario creado correctamente',
          text: usuario.email,
          type: 'success'
        });

        return resp.usuario;
      }),
      catchError(err => {

        Swal.fire({
          title: err.error.mensaje,
          text: err.error.errors.message,
          type: 'error'
        });

        return throwError(err);
      })
    );

  }

  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {

        if (usuario._id === this.usuario._id) {

          const user: Usuario = resp.usuario;
          this.guardarStorage(user._id, this.token, user, this.menu);
        }

        Swal.fire({
          title: 'Usuario Actualizado correctamente',
          text: usuario.nombre,
          type: 'success'
        });


        return true;

      }

      ),
      catchError(err => {

        Swal.fire({
          title: err.error.mensaje,
          text: err.error.errors.message,
          type: 'error'
        });

        return throwError(err);
      })

    );
  }

  cambiarImagen(archivo: File, id: string) {

    this.subirArchivo.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {

        this.usuario.img = resp.usuario.img;

        Swal.fire({
          title: 'Imagen Actualizada',
          text: this.usuario.nombre,
          type: 'success'
        });

        this.guardarStorage(id, this.token, this.usuario, this.menu);

      })
      .catch(err => {
        console.log(err);
      });

  }

  cargarUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);

  }

  buscarUsuarios(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => resp.usuarios)
    );

  }

  borrarUsuario(id: string) {

    const url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;

    return this.http.delete(url).pipe(
      map((resp: any) => {

        Swal.fire(
          'Usuario Borrado!',
          `El usuario ha sido borrado correctamente.`,
          'success'
        );

        return true;
      }, (err: any) => {

        Swal.fire(
          'ERROR!',
          `No se pudo borrar el usuario.`,
          'error'
        );

        return false;

      }
      )
    );

  }

}
