'use client'

import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import WeatherDashboard from '@/components/WeatherDashboard';

interface WeatherData {
  Date: string;
  'Max Deg.C': number;
  'Min Deg.C': number;
  'Humidity (%)': number;
  'Wind Speed (m/s)': number;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          complete: (result) => {
            const parsedData = parseWeatherData(result.data);
            setWeatherData(parsedData);
          },
          header: true,
          dynamicTyping: true,
        });
      } else if (fileExtension === 'xlsx') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          const parsedData = parseWeatherData(jsonData);
          setWeatherData(parsedData);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Please upload a CSV or Excel file.');
      }
    }
  };

  const parseWeatherData = (data: any[]): WeatherData[] => {
    return data.map((row: any) => ({
      Date: row.Date,
      'Max Deg.C': parseFloat(row['Max Deg.C']),
      'Min Deg.C': parseFloat(row['Min Deg.C']),
      'Humidity (%)': parseFloat(row['Humidity (%)']),
      'Wind Speed (m/s)': parseFloat(row['Wind Speed (m/s)']),
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {weatherData.length > 0 ? (
          <WeatherDashboard data={weatherData} />
        ) : (
          <p>Please upload a CSV or Excel file to view the weather dashboard.</p>
        )}
      </div>
    </main>
  );
}