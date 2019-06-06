import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/medico/medico.service';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');
  medico: Medico = new Medico('', '', '', '', '');

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {

    activatedRoute.params.subscribe(params => {

      const id = params.id;
      console.log(id);

      if (id !== 'nuevo') {
        this.cargarMedico(id);
        console.log(this.medico);
      }


    });
  }

  ngOnInit() {
    this.hospitalService.cargarHospitales().subscribe(
      (hospitales) => this.hospitales = hospitales
    );

    this.modalUploadService.notificacion
      .subscribe((resp: any) => this.medico.img = resp.medico.img);
  }

  cargarMedico(id: string) {

    this.medicoService.cargarMedico(id)
      .subscribe(medico => {

        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);

      });
  }

  guardarMedico(f: NgForm) {

    console.log(f.valid);
    console.log(f.value);

    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
      .subscribe(medico => {

        this.medico._id = medico._id;

        this.router.navigate(['/medico', medico._id]);
      });

  }

  cambioHospital(id: string) {

    this.hospitalService.obtenerHospital(id)
      .subscribe(hospital => this.hospital = hospital);

  }

  cambiarFoto() {

    this.modalUploadService.mostrarModal('medicos', this.medico._id);

  }

}
