import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;

  totalRegistros = 0;
  cargando = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe((resp: any) => {
        this.cargarUsuarios();
      });


  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde).subscribe(

      (resp: any) => {

        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;

        this.cargando = false;

      },
      (err: any) => console.log(err)
    );

  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario(termino: string) {

    console.log(termino);

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino).subscribe(
      (users: Usuario[]) => {
        console.log(users);
        this.usuarios = users;
        this.cargando = false;
      }, (err: any) => console.log(err)
    );

  }

  borrarUsuario(user: Usuario) {

    console.log(user);

    if (user._id === this.usuarioService.usuario._id) {

      Swal.fire('No puede borrar este usuario', 'No te puedes borrar a ti mismo', 'error');
      return;

    }

    Swal.fire({
      title: `Estas seguro de borrar a ${user.nombre} ?`,
      text: 'Despues no podras revertir el cambio!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK, borralo!'
    }).then((result) => {

      if (result.value) {

        this.usuarioService.borrarUsuario(user._id).subscribe(

          (borrado: boolean) => {
            console.log(borrado);
            this.cargarUsuarios();

          }, (err: any) => console.log(err)

        );

      }

    });

  }

  guardarUsuario(usuario: Usuario) {

    this.usuarioService.actualizarUsuario(usuario).subscribe();

  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

}
