import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss'],
})
export class GraficoComponent implements OnInit {
  @Input() votos: number[] = []; // Propiedad para recibir los votos
  @Input() etiquetas: string[] = []; // Propiedad para recibir las etiquetas

  ngOnInit() {
    this.verGraphico();
  }

  verGraphico() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.etiquetas.length ? this.etiquetas : ['Sin etiquetas'], // Usa las etiquetas proporcionadas o un mensaje por defecto
            datasets: [{
              label: '# de Votos',
              data: this.votos.length ? this.votos : [0], // Usa los votos proporcionados o un valor por defecto
              borderWidth: 1,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
              hoverBorderColor: 'rgba(75, 192, 192, 1)',
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(200, 200, 200, 0.5)',
                },
                ticks: {
                  color: 'red',
                }
              },
              x: {
                grid: {
                  color: 'rgba(200, 200, 200, 0.5)',
                },
                ticks: {
                  color: 'blue',
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'purple',
                  font: {
                    size: 14
                  }
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: 'black',
                formatter: (value: number) => {
                  return value;
                }
              }
            }
          }
        });
      }
    }
  }
}
