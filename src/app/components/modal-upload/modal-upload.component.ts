import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir_archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public subirArchivo: SubirArchivoService,
    public modalUploadService: ModalUploadService) {

  }

  ngOnInit() {
  }

  seleccionImagen(archivo: File) {


    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {

      Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;


    console.log(archivo);

  }

  subirImagen() {

    this.subirArchivo
      .subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then((resp: any) => {

        this.modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch((resp: any) => console.log('Error en la carga...'));

  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

}
