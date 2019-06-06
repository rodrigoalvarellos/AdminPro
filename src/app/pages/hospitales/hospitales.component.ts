import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando = false;
  hospitales: Hospital[] = [];

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe(
      () => this.cargarHospitales()
    );
  }



  cargarHospitales() {

    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(
      (hospitales: Hospital[]) => {

        this.hospitales = hospitales;
        this.cargando = false;
      }
    );
  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscarHospital(termino).subscribe(
      (hospitales: Hospital[]) => this.hospitales = hospitales
    );

  }

  guardarHospital(hospital: Hospital) {

    this.hospitalService.actualizarHospital(hospital).subscribe();

  }

  borrarHospital(hospital: Hospital) {

    this.hospitalService.borrarHospital(hospital._id).subscribe(
      () => this.cargarHospitales()
    );

  }

  crearHospital() {

    Swal.fire({

      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital:',
      type: 'info',
      input: 'text',
      showConfirmButton: true,
      showCancelButton: true

    }).then((valor) => {

      if (!valor.value || valor.value.lenght === 0) {
        return;
      }

      this.hospitalService.crearHospital(valor.value).subscribe(
        () => this.cargarHospitales()
      );


    });

  }

  actualizarImagen(hospital: Hospital) {

    this.modalUploadService.mostrarModal('hospitales', hospital._id);



  }

}
