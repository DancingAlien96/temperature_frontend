import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, formatDate } from '@angular/common';
import { ApexOptions, NgxApexchartsModule } from 'ngx-apexcharts';
import { WeatherService } from '../../services/weather.service';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    NgxApexchartsModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public chartOptionsTemperatura: ApexOptions = {}; // Configuración para la temperatura
  public chartOptionsHumedadRelativa: ApexOptions = {}; // Para la humedad relativa
  public chartOptionsHumedadAbsoluta: ApexOptions = {}; // Para la humedad absoluta
  public chartOptionsVelocidadViento: ApexOptions = {}; // Para la velocidad del viento
  public chartOptionsPresion: ApexOptions = {}; // Para la presión barométrica

  // Control para las fechas
  public startDate = new FormControl('');
  public endDate = new FormControl('');

  // Datos de las gráficas
  private allTemperaturaData: any[] = [];
  private allHumedadRelativaData: any[] = [];
  private allHumedadAbsolutaData: any[] = [];
  private allVelocidadVientoData: any[] = [];
  private allPresionData: any[] = [];

  public chartOptions: ApexOptions = {}; // Inicializamos con un objeto vacío

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getTemperatureData().subscribe((data) => {
      const temperaturaData = data?.data_tempertura;

      if (temperaturaData && Array.isArray(temperaturaData)) {
        const latestData = temperaturaData[0]; // Usamos el primer dato como el más reciente
        const maxTemperature = 50; // Define el valor máximo del rango (por ejemplo, 50°C)

        // Calculamos el porcentaje basado en el valor máximo
        const temperaturePercentage =
          (latestData.temperatura / maxTemperature) * 100;

        // Configuración del gráfico
        this.chartOptions = {
          chart: {
            type: 'radialBar', // Tipo de gráfico
            height: 350,
          },
          series: [temperaturePercentage], // Usamos el porcentaje calculado
          labels: ['Temperatura'], // Etiqueta para el gráfico
          plotOptions: {
            radialBar: {
              offsetY: 0,
              startAngle: -90,
              endAngle: 90,
              hollow: {
                margin: 15,
                size: '70%',
                background: 'transparent',
                image: undefined,
              },
              dataLabels: {
                name: {
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: undefined,
                  offsetY: -10,
                },
                value: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#111',
                  formatter: () => `${latestData.temperatura}°C`, // Mostramos el valor de la temperatura en °C
                },
              },
            },
          },
          fill: {
            colors: ['#00E396'],
          },
        };
      } else {
        console.error('No se encontraron datos de temperatura.');
      }
    }); //fin de deteccion de ultima temperatura o temperatura actual


    
    // Para la temperatura
    this.weatherService.getTemperatureData().subscribe((data) => {
      const temperaturaData = data?.data_tempertura;

      if (temperaturaData && Array.isArray(temperaturaData)) {
        this.allTemperaturaData = temperaturaData; // Guardamos los datos completos
        this.updateTemperatureChart(); // Inicializamos el gráfico
      } else {
        console.error('No se encontraron datos de temperatura.');
      }
    });

    // Para la humedad relativa
    this.weatherService.gethumedad_relativa().subscribe((data) => {
      const humedadRelativaData = data?.data_humedad_relativa;

      if (humedadRelativaData && Array.isArray(humedadRelativaData)) {
        this.allHumedadRelativaData = humedadRelativaData; // Guardamos los datos completos
        this.updateHumedadRelativaChart(); // Inicializamos el gráfico
      }
    });

    // Para la humedad absoluta
    this.weatherService.gethumedad_absoluta().subscribe((data) => {
      const humedadAbsolutaData = data?.data_humedad_absoluta;

      if (humedadAbsolutaData && Array.isArray(humedadAbsolutaData)) {
        this.allHumedadAbsolutaData = humedadAbsolutaData; // Guardamos los datos completos
        this.updateHumedadAbsolutaChart(); // Inicializamos el gráfico
      }
    });

    // Para la velocidad del viento
    this.weatherService.getvelocidad_viento().subscribe((data) => {
      const velocidadVientoData = data?.data_velocidad_viento;

      if (velocidadVientoData && Array.isArray(velocidadVientoData)) {
        this.allVelocidadVientoData = velocidadVientoData; // Guardamos los datos completos
        this.updateVelocidadVientoChart(); // Inicializamos el gráfico
      }
    });

    // Para la presión barométrica
    this.weatherService.getpresion_barometrica().subscribe((data) => {
      const presionData = data?.data_presion_barometrica;

      if (presionData && Array.isArray(presionData)) {
        this.allPresionData = presionData; // Guardamos los datos completos
        this.updatePresionChart(); // Inicializamos el gráfico
      }
    });
  }

  // Función para actualizar la gráfica de temperatura
  updateTemperatureChart(): void {
    const filteredData = this.filterDataByDate(this.allTemperaturaData);
    const fechas = filteredData.map((item) =>
      formatDate(item.fecha_hora, 'yyyy-MM-dd', 'en-US')
    );
    const temperaturas = filteredData.map((item) => item.temperatura);

    this.chartOptionsTemperatura = {
      chart: {
        type: 'line',
        height: 350,
      },
      series: [
        {
          name: 'Temperatura (°C)',
          data: temperaturas,
        },
      ],
      xaxis: {
        categories: fechas,
      },
      colors: ['#FF5733'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
    };
  }

  // Función para actualizar la gráfica de humedad relativa
  updateHumedadRelativaChart(): void {
    const filteredData = this.filterDataByDate(this.allHumedadRelativaData);
    const fechas = filteredData.map((item) =>
      formatDate(item.fecha_hora, 'yyyy-MM-dd', 'en-US')
    );
    const humedadRelativa = filteredData.map((item) => item.humedad_relativa);

    this.chartOptionsHumedadRelativa = {
      chart: {
        type: 'area',
        height: 350,
      },
      series: [
        {
          name: 'Humedad Relativa (%)',
          data: humedadRelativa,
        },
      ],
      xaxis: {
        categories: fechas,
      },
      colors: ['#008080'],
      fill: {
        opacity: 0.3,
      },
    };
  }

  // Función para actualizar la gráfica de humedad absoluta
  updateHumedadAbsolutaChart(): void {
    const filteredData = this.filterDataByDate(this.allHumedadAbsolutaData);
    const fechas = filteredData.map((item) =>
      formatDate(item.fecha_hora, 'yyyy-MM-dd', 'en-US')
    );
    const humedadAbsoluta = filteredData.map((item) => item.humedad_absoluta);

    this.chartOptionsHumedadAbsoluta = {
      chart: {
        type: 'bar',
        height: 350,
      },
      series: [
        {
          name: 'Humedad Absoluta (kg/m³)',
          data: humedadAbsoluta,
        },
      ],
      xaxis: {
        categories: fechas,
      },
      colors: ['#1E90FF'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
    };
  }

  // Función para actualizar la gráfica de velocidad del viento
  updateVelocidadVientoChart(): void {
    const filteredData = this.filterDataByDate(this.allVelocidadVientoData);
    const fechas = filteredData.map((item) =>
      formatDate(item.fecha_hora, 'yyyy-MM-dd', 'en-US')
    );
    const velocidadViento = filteredData.map(
      (item) => item['velocidad de viento']
    );

    this.chartOptionsVelocidadViento = {
      chart: {
        type: 'line',
        height: 350,
      },
      series: [
        {
          name: 'Velocidad del Viento (m/s)',
          data: velocidadViento,
        },
      ],
      xaxis: {
        categories: fechas,
      },
      colors: ['#FFD700'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
    };
  }

  // Función para actualizar la gráfica de presión barométrica pero esta aun no funciona por la ruta
  updatePresionChart(): void {
    const filteredData = this.filterDataByDate(this.allPresionData);
    const fechas = filteredData.map((item) =>
      formatDate(item.fecha_hora, 'yyyy-MM-dd', 'en-US')
    );
    const presion = filteredData.map((item) => item.presion_barometrica);

    this.chartOptionsPresion = {
      chart: {
        type: 'line',
        height: 350,
      },
      series: [
        {
          name: 'Presión Barométrica (hPa)',
          data: presion,
        },
      ],
      xaxis: {
        categories: fechas,
      },
      colors: ['#32CD32'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
    };
  }

  // Filtra los datos según el rango de fechas
  filterDataByDate(data: any[]): any[] {
    const start = this.startDate.value
      ? new Date(this.startDate.value)
      : new Date(0); // Si no se selecciona fecha, no se aplica filtro
    const end = this.endDate.value ? new Date(this.endDate.value) : new Date();

    return data.filter((item) => {
      const itemDate = new Date(item.fecha_hora);
      return itemDate >= start && itemDate <= end;
    });
  }
}
