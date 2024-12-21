export interface TemperatureRecord {
    fecha_hora: any; // Fecha y hora como string
    temperatura: any; // Temperatura en °C
  }
  
  export interface TemperatureData {
    data_temperatura: TemperatureRecord[]; // Lista de registros de temperatura
  }
  
