import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico/medico.service';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor(public medicoService: MedicoService) { }

  ngOnInit() {

    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos().subscribe(medicos => this.medicos = medicos);
  }

  buscarMedicos(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedicos(termino).subscribe(
      (medicos) => this.medicos = medicos
    );

  }

  borrarMedico(medico: Medico) {

    this.medicoService.borrarMedico(medico._id).subscribe(
      () => this.cargarMedicos()
    );
  }


}
