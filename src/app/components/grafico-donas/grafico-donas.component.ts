import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-donas',
  templateUrl: './grafico-donas.component.html',
  styles: []
})
export class GraficoDonasComponent implements OnInit {

  @Input() ChartLabels: Label[] = [];
  @Input() ChartData: number[] = [];
  @Input() ChartType: ChartType = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
