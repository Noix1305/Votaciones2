import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Votacion } from 'src/app/models/votacion';
import { Votos } from 'src/app/models/voto';
import { VotacionService } from 'src/app/services/votacionService/votacion.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa el plugin

@Component({
  selector: 'app-ver-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-resultados.component.html',
  styleUrls: ['./ver-resultados.component.scss']
})
export class VerResultadosComponent implements OnInit {

  votos: Votos[] = []; // Array de votos
  etiquetas: string[] = ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Púrpura', 'Naranja'];
  seleccionada: Votacion | null = null;
  votaciones: Votacion[] = [
    // tus datos de ejemplo
  ];
  chart: Chart | undefined;


  constructor(
    private _votacionService: VotacionService
  ) { }
  async ngOnInit() {
    await this.cargarVotaciones();
    Chart.register(...registerables, ChartDataLabels);
  }

  async verResultados(votacion: any) {
    this.seleccionada = votacion;
    if (this.seleccionada) {
      // Espera a obtener los votos y luego renderiza el gráfico
      await this.obtenerVotosPorId(this.seleccionada.id_votacion);
    }
  }

  async obtenerVotosPorId(id_votacion: number) {
    console.log('ID votacion: ' + id_votacion)
    this._votacionService.obtenerVotosPorVotacion(id_votacion).subscribe({
      next: votos => {
        this.votos = votos; // Asigna los votos obtenidos al array votaciones
        console.log('Votos obtenidos:', this.votos); // Muestra el array actualizado

        // Llama a verGraphico después de que los votos han sido obtenidos
        this.verGraphico(this.votos);
      },
      error: error => {
        console.error('Error al obtener los votos:', error);
      }
    });
  }

  async cargarVotaciones() {
    console.log('Cargando Votaciones')
    this._votacionService.obtenerTodasLasVotaciones().subscribe({
      next: (votaciones) => {
        this.votaciones = votaciones; // Asigna las votaciones activas
      },
      error: (error) => {
        console.error('Error al cargar votaciones:', error);
      },
      complete: () => {
        console.log('Carga de votaciones completada');
      }
    });
  }

  verGraphico(votos: Votos[]) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        console.log('Votos para el gráfico:', votos);

        // Agrupar los votos por id_candidato
        const resultados = votos.reduce((acc, voto) => {
          acc[voto.id_candidato] = (acc[voto.id_candidato] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const totalVotos = votos.length;

        const etiquetas = Object.keys(resultados).map(id => `Candidato ${id}`);
        const votosPorCandidato = Object.values(resultados);

        console.log('Etiquetas (candidatos):', etiquetas);
        console.log('Votos por candidato:', votosPorCandidato);

        if (this.chart) {
          this.chart.destroy(); // Limpia el gráfico anterior
        }

        if (etiquetas.length === 0 || votosPorCandidato.length === 0) {
          console.warn('No hay datos suficientes para mostrar el gráfico.');
          return;
        }

        // Crear el gráfico con los votos y etiquetas de candidatos
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: etiquetas,
            datasets: [{
              label: votos.length + ' Votos',
              data: votosPorCandidato,
              borderWidth: 2,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
              hoverBorderColor: 'rgba(75, 192, 192, 1)',
            }]
          },
          options: {
            plugins: {
              legend: {
                labels: {
                  color: 'purple',
                  font: {
                    size: 20
                  }
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value, context) => {
                  const percentage = (value / totalVotos * 100).toFixed(2);
                  return `${percentage}%`;
                },
                color: 'black',
                font: {
                  weight: 'bold',
                  size: 20
                }
              }
            },
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
            }
          }
        });
      } else {
        console.error('No se pudo obtener el contexto 2D del canvas.');
      }
    } else {
      console.error('No se encontró el elemento canvas con id "myChart".');
    }
  }
}
