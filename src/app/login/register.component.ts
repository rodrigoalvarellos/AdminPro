import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// import * as _swal from 'sweetalert';
// import { SweetAlert } from 'sweetalert/typings/core';
// const swal: SweetAlert = _swal as any;

// import swal from 'sweetalert';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';


declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.noSonIguales('password', 'password2') });

    // this.forma.setValue({
    //   nombre: 'Rodrigo',
    //   correo: 'rodri.alvarellos@gmail.com',
    //   password: '123456',
    //   password2: '123456',
    //   condiciones: true
    // });

  }

  registrarUsuario() {

    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      // console.log('Debe de aceptar las condiciones');
      // swal('Importante!', 'Debe aceptar las condiciones', 'warning');
      Swal.fire({
        title: 'Importante!!',
        text: 'Debe aceptar las condiciones',
        type: 'warning'
      });
      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
    );

    this.usuarioService.crearUsuario(usuario).subscribe(resp => this.router.navigate(['/login']));


  }

  noSonIguales(campo1: string, campo2: string) {


    return (group: FormGroup) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }


      return {
        sonIguales: true
      };


    };

  }

}
