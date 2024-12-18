import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Votacion } from 'src/app/models/votacion';
import { Votos } from 'src/app/models/voto';
import { VotacionService } from 'src/app/services/votacionService/votacion.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa el plugin
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/services/canditatoService/candidato.service';

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
  votaciones: Votacion[] = [];
  chart: Chart | undefined;
  candidatos: Candidato[] | null = null;

  constructor(
    private _votacionService: VotacionService,
    private _candidatoService: CandidatoService
  ) { }

  async ngOnInit() {
    await this.cargarVotaciones();
    Chart.register(...registerables, ChartDataLabels);
  }

  async verResultados(votacion: Votacion) {
    this.seleccionada = votacion;
    if (this.seleccionada) {
      await this.obtenerVotosPorId(this.seleccionada.id_votacion);
      this.obtenerCandidatosPorVotacion(this.seleccionada.id_votacion);
    }
  }

  async obtenerVotosPorId(id_votacion: number) {
    console.log('ID votacion: ' + id_votacion);
    this._votacionService.obtenerVotosPorVotacion(id_votacion).subscribe({
      next: votos => {
        this.votos = votos; // Asigna los votos obtenidos al array votaciones
        console.log('Votos obtenidos:', this.votos);
      },
      error: error => {
        console.error('Error al obtener los votos:', error);
      }
    });
  }

  obtenerCandidatosPorVotacion(id_votacion: number) {
    this._candidatoService.obtenerCandidatosConFoto(id_votacion).subscribe({
      next: candidatos => {
        this.candidatos = candidatos;
        console.log("Datos de candidatos obtenidos:", this.candidatos);
        this.verGraphico(this.votos); // Asegúrate de que this.votos esté asignado previamente
      },
      error: error => {
        console.error('Error al obtener los candidatos:', error);
      }
    });
  }

  async cargarVotaciones() {
    console.log('Cargando Votaciones');
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
        const resultados = votos.reduce((acc, voto) => {
          acc[voto.id_candidato] = (acc[voto.id_candidato] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const totalVotos = votos.length;

        const etiquetas = Object.keys(resultados).map(id_candidato => {
          const candidato = this.candidatos?.find(c => c.id_candidato === Number(id_candidato));
          return candidato ? `${candidato.usuario.pnombre} ${candidato.usuario.appaterno}` : `Candidato desconocido`;
        });

        const votosPorCandidato = Object.values(resultados);

        if (this.chart) {
          this.chart.destroy(); // Limpia el gráfico anterior
        }

        // Configuración del gráfico
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: etiquetas,
            datasets: [{
              label: `${votos.length} Votos`,
              data: votosPorCandidato,
              borderWidth: 1,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: 'purple',
                  font: { size: 14 }
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: 'black',
                font: { weight: 'bold', size: 12 },
                padding: {
                  top: 30,
                  bottom: 10
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(200, 200, 200, 0.5)' },
                ticks: { color: 'red' }
              },
              x: {
                grid: { color: 'rgba(200, 200, 200, 0.5)' },
                ticks: { color: 'blue' }
              }
            },
          },
          plugins: [{
            id: 'foto_portada',
            afterDatasetsDraw: (chart: Chart) => {
              const ctx = chart.ctx;

              // Asegúrate de que las etiquetas sean de tipo string
              const labels = chart.data.labels as string[];

              const images = labels.map((label, index) => {
                const candidato = this.candidatos?.[index];
                if (candidato && candidato.usuario && candidato.usuario.foto_portada) {
                  return new Promise<{ img: HTMLImageElement; index: number } | null>((resolve) => {
                    const img = new Image();
                    img.src = candidato.usuario.foto_portada;
                    img.onload = () => resolve({ img, index });
                    img.onerror = () => {
                      console.error(`Error al cargar la imagen: ${candidato.usuario.foto_portada}`);
                      resolve(null); // Resolviendo en caso de error para continuar
                    };
                  });
                } else {
                  return Promise.resolve(null);
                }
              });

              Promise.all(images).then(results => {
                results.forEach(result => {
                  if (result) {
                    const { img, index } = result; // Aquí ahora TypeScript reconoce correctamente los tipos
                    const meta = chart.getDatasetMeta(0);
                    if (meta && meta.data && meta.data[index]) {
                      const x = meta.data[index].x - 50; // Ajusta la posición horizontal
                      const y = meta.data[index].y - 40; // Ajusta la posición vertical
                      const size = 100; // Tamaño de la imagen

                      // Dibuja un círculo para recortar la imagen
                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
                      ctx.clip();
                      ctx.drawImage(img, x, y, size, size);
                      ctx.restore();
                    }
                  }
                });
              });
            }
          }]
        });
      } else {
        console.error('No se pudo obtener el contexto 2D del canvas.');
      }
    } else {
      console.error('No se encontró el elemento canvas con id "myChart".');
    }
  }

}
