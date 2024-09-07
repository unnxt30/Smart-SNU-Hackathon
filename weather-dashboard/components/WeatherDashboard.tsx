import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WeatherData {
  Date: string;
  'Max Deg.C': number;
  'Min Deg.C': number;
  'Humidity (%)': number;
  'Wind Speed (m/s)': number;
}

interface WeatherDashboardProps {
  data: WeatherData[];
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No weather data available</div>;
  }

  const currentWeather = data[0];
  const forecast = data.slice(0, 8); // Current day + next 7 days

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      
      <Card className="mb-4 bg-blue-600">
        <CardHeader className="text-xl font-bold">Current Weather</CardHeader>
        <CardContent>
          <div className="text-4xl">{currentWeather['Max Deg.C'].toFixed(1)}°C</div>
          <div>Humidity: {currentWeather['Humidity (%)'].toFixed(1)}%</div>
          <div>Wind: {currentWeather['Wind Speed (m/s)'].toFixed(1)} m/s</div>
        </CardContent>
      </Card>

      {forecast.length > 0 && (
        <>
          <Card className="mb-4">
            <CardHeader className="text-xl font-bold">8-Day Forecast</CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast}>
                  <XAxis dataKey="Date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="Max Deg.C" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Min Deg.C" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-xl font-bold">Detailed Forecast</CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Max Temp (°C)</TableHead>
                    <TableHead>Min Temp (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Wind Speed (m/s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecast.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell>{day.Date}</TableCell>
                      <TableCell>{day['Max Deg.C'].toFixed(1)}</TableCell>
                      <TableCell>{day['Min Deg.C'].toFixed(1)}</TableCell>
                      <TableCell>{day['Humidity (%)'].toFixed(1)}</TableCell>
                      <TableCell>{day['Wind Speed (m/s)'].toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;