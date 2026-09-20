/**
 * Major world cities, for the night-side lights on the Lab globe.
 *
 * Coordinates are city-centre latitude/longitude in degrees, rounded to two
 * decimals — roughly a kilometre, far finer than a globe a few hundred pixels
 * across can resolve. The list is weighted towards large metropolitan areas so
 * the night side reads as the familiar pattern of lit coastlines and river
 * valleys rather than an even sprinkle.
 */

export interface City {
  name: string;
  lat: number;
  lon: number;
  /** Relative brightness, 0..1 — a stand-in for metropolitan size. */
  weight: number;
}

export const worldCities: City[] = [
  // --- East and Southeast Asia ---
  { name: 'Tokyo', lat: 35.68, lon: 139.69, weight: 1 },
  { name: 'Osaka', lat: 34.69, lon: 135.5, weight: 0.7 },
  { name: 'Seoul', lat: 37.57, lon: 126.98, weight: 0.9 },
  { name: 'Beijing', lat: 39.9, lon: 116.41, weight: 0.95 },
  { name: 'Shanghai', lat: 31.23, lon: 121.47, weight: 1 },
  { name: 'Guangzhou', lat: 23.13, lon: 113.26, weight: 0.85 },
  { name: 'Shenzhen', lat: 22.54, lon: 114.06, weight: 0.85 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17, weight: 0.8 },
  { name: 'Chongqing', lat: 29.56, lon: 106.55, weight: 0.8 },
  { name: 'Chengdu', lat: 30.57, lon: 104.07, weight: 0.75 },
  { name: 'Wuhan', lat: 30.59, lon: 114.31, weight: 0.7 },
  { name: "Xi'an", lat: 34.34, lon: 108.94, weight: 0.65 },
  { name: 'Harbin', lat: 45.8, lon: 126.53, weight: 0.6 },
  { name: 'Taipei', lat: 25.03, lon: 121.57, weight: 0.7 },
  { name: 'Manila', lat: 14.6, lon: 120.98, weight: 0.85 },
  { name: 'Jakarta', lat: -6.21, lon: 106.85, weight: 0.95 },
  { name: 'Bangkok', lat: 13.76, lon: 100.5, weight: 0.85 },
  { name: 'Ho Chi Minh City', lat: 10.82, lon: 106.63, weight: 0.85 },
  { name: 'Hanoi', lat: 21.03, lon: 105.85, weight: 0.75 },
  { name: 'Singapore', lat: 1.35, lon: 103.82, weight: 0.75 },
  { name: 'Kuala Lumpur', lat: 3.14, lon: 101.69, weight: 0.7 },
  { name: 'Yangon', lat: 16.87, lon: 96.2, weight: 0.55 },
  { name: 'Phnom Penh', lat: 11.56, lon: 104.93, weight: 0.45 },

  // --- South and Central Asia ---
  { name: 'Delhi', lat: 28.61, lon: 77.21, weight: 1 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88, weight: 0.95 },
  { name: 'Kolkata', lat: 22.57, lon: 88.36, weight: 0.85 },
  { name: 'Chennai', lat: 13.08, lon: 80.27, weight: 0.75 },
  { name: 'Bengaluru', lat: 12.97, lon: 77.59, weight: 0.8 },
  { name: 'Hyderabad', lat: 17.39, lon: 78.49, weight: 0.7 },
  { name: 'Dhaka', lat: 23.81, lon: 90.41, weight: 0.9 },
  { name: 'Karachi', lat: 24.86, lon: 67.01, weight: 0.9 },
  { name: 'Lahore', lat: 31.55, lon: 74.34, weight: 0.8 },
  { name: 'Colombo', lat: 6.93, lon: 79.86, weight: 0.45 },
  { name: 'Kathmandu', lat: 27.72, lon: 85.32, weight: 0.4 },
  { name: 'Tashkent', lat: 41.3, lon: 69.24, weight: 0.5 },
  { name: 'Almaty', lat: 43.24, lon: 76.89, weight: 0.45 },

  // --- West Asia ---
  { name: 'Istanbul', lat: 41.01, lon: 28.98, weight: 0.85 },
  { name: 'Tehran', lat: 35.69, lon: 51.39, weight: 0.8 },
  { name: 'Baghdad', lat: 33.31, lon: 44.36, weight: 0.7 },
  { name: 'Riyadh', lat: 24.71, lon: 46.68, weight: 0.65 },
  { name: 'Dubai', lat: 25.2, lon: 55.27, weight: 0.6 },
  { name: 'Tel Aviv', lat: 32.08, lon: 34.78, weight: 0.5 },

  // --- Russia ---
  { name: 'Moscow', lat: 55.76, lon: 37.62, weight: 0.9 },
  { name: 'Saint Petersburg', lat: 59.93, lon: 30.34, weight: 0.65 },
  { name: 'Novosibirsk', lat: 55.01, lon: 82.93, weight: 0.45 },
  { name: 'Vladivostok', lat: 43.12, lon: 131.89, weight: 0.35 },

  // --- Europe ---
  { name: 'London', lat: 51.51, lon: -0.13, weight: 0.95 },
  { name: 'Manchester', lat: 53.48, lon: -2.24, weight: 0.5 },
  { name: 'Dublin', lat: 53.35, lon: -6.26, weight: 0.4 },
  { name: 'Paris', lat: 48.86, lon: 2.35, weight: 0.9 },
  { name: 'Brussels', lat: 50.85, lon: 4.35, weight: 0.5 },
  { name: 'Amsterdam', lat: 52.37, lon: 4.9, weight: 0.55 },
  { name: 'Berlin', lat: 52.52, lon: 13.4, weight: 0.7 },
  { name: 'Munich', lat: 48.14, lon: 11.58, weight: 0.5 },
  { name: 'Zurich', lat: 47.37, lon: 8.54, weight: 0.4 },
  { name: 'Vienna', lat: 48.21, lon: 16.37, weight: 0.5 },
  { name: 'Prague', lat: 50.08, lon: 14.44, weight: 0.45 },
  { name: 'Warsaw', lat: 52.23, lon: 21.01, weight: 0.55 },
  { name: 'Budapest', lat: 47.5, lon: 19.04, weight: 0.45 },
  { name: 'Bucharest', lat: 44.43, lon: 26.1, weight: 0.45 },
  { name: 'Kyiv', lat: 50.45, lon: 30.52, weight: 0.6 },
  { name: 'Madrid', lat: 40.42, lon: -3.7, weight: 0.65 },
  { name: 'Barcelona', lat: 41.39, lon: 2.17, weight: 0.55 },
  { name: 'Lisbon', lat: 38.72, lon: -9.14, weight: 0.45 },
  { name: 'Rome', lat: 41.9, lon: 12.5, weight: 0.6 },
  { name: 'Milan', lat: 45.46, lon: 9.19, weight: 0.55 },
  { name: 'Athens', lat: 37.98, lon: 23.73, weight: 0.45 },
  { name: 'Stockholm', lat: 59.33, lon: 18.07, weight: 0.4 },
  { name: 'Oslo', lat: 59.91, lon: 10.75, weight: 0.35 },
  { name: 'Copenhagen', lat: 55.68, lon: 12.57, weight: 0.4 },
  { name: 'Helsinki', lat: 60.17, lon: 24.94, weight: 0.35 },

  // --- Africa ---
  { name: 'Cairo', lat: 30.04, lon: 31.24, weight: 0.95 },
  { name: 'Khartoum', lat: 15.5, lon: 32.56, weight: 0.5 },
  { name: 'Lagos', lat: 6.52, lon: 3.38, weight: 0.9 },
  { name: 'Abidjan', lat: 5.36, lon: -4.01, weight: 0.55 },
  { name: 'Accra', lat: 5.6, lon: -0.19, weight: 0.5 },
  { name: 'Kinshasa', lat: -4.44, lon: 15.27, weight: 0.8 },
  { name: 'Luanda', lat: -8.84, lon: 13.23, weight: 0.55 },
  { name: 'Nairobi', lat: -1.29, lon: 36.82, weight: 0.55 },
  { name: 'Addis Ababa', lat: 9.03, lon: 38.74, weight: 0.55 },
  { name: 'Dar es Salaam', lat: -6.79, lon: 39.21, weight: 0.5 },
  { name: 'Johannesburg', lat: -26.2, lon: 28.05, weight: 0.65 },
  { name: 'Cape Town', lat: -33.92, lon: 18.42, weight: 0.5 },
  { name: 'Casablanca', lat: 33.57, lon: -7.59, weight: 0.5 },
  { name: 'Algiers', lat: 36.75, lon: 3.06, weight: 0.5 },
  { name: 'Tunis', lat: 36.81, lon: 10.18, weight: 0.4 },

  // --- North America ---
  { name: 'New York', lat: 40.71, lon: -74.01, weight: 1 },
  { name: 'Boston', lat: 42.36, lon: -71.06, weight: 0.5 },
  { name: 'Montreal', lat: 45.5, lon: -73.57, weight: 0.5 },
  { name: 'Toronto', lat: 43.65, lon: -79.38, weight: 0.65 },
  { name: 'Chicago', lat: 41.88, lon: -87.63, weight: 0.7 },
  { name: 'Atlanta', lat: 33.75, lon: -84.39, weight: 0.5 },
  { name: 'Miami', lat: 25.76, lon: -80.19, weight: 0.55 },
  { name: 'Houston', lat: 29.76, lon: -95.37, weight: 0.6 },
  { name: 'Dallas', lat: 32.78, lon: -96.8, weight: 0.6 },
  { name: 'Denver', lat: 39.74, lon: -104.99, weight: 0.45 },
  { name: 'Phoenix', lat: 33.45, lon: -112.07, weight: 0.5 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24, weight: 0.9 },
  { name: 'San Francisco', lat: 37.77, lon: -122.42, weight: 0.6 },
  { name: 'Seattle', lat: 47.61, lon: -122.33, weight: 0.5 },
  { name: 'Vancouver', lat: 49.28, lon: -123.12, weight: 0.45 },
  { name: 'Mexico City', lat: 19.43, lon: -99.13, weight: 0.95 },
  { name: 'Guadalajara', lat: 20.67, lon: -103.35, weight: 0.5 },
  { name: 'Havana', lat: 23.11, lon: -82.37, weight: 0.4 },
  { name: 'Panama City', lat: 8.98, lon: -79.52, weight: 0.4 },

  // --- South America ---
  { name: 'Bogota', lat: 4.71, lon: -74.07, weight: 0.7 },
  { name: 'Medellin', lat: 6.24, lon: -75.58, weight: 0.45 },
  { name: 'Caracas', lat: 10.48, lon: -66.9, weight: 0.5 },
  { name: 'Quito', lat: -0.18, lon: -78.47, weight: 0.4 },
  { name: 'Lima', lat: -12.05, lon: -77.04, weight: 0.7 },
  { name: 'Sao Paulo', lat: -23.55, lon: -46.63, weight: 1 },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17, weight: 0.75 },
  { name: 'Brasilia', lat: -15.79, lon: -47.88, weight: 0.5 },
  { name: 'Buenos Aires', lat: -34.6, lon: -58.38, weight: 0.8 },
  { name: 'Santiago', lat: -33.45, lon: -70.67, weight: 0.6 },
  { name: 'Montevideo', lat: -34.9, lon: -56.16, weight: 0.4 },

  // --- Oceania ---
  { name: 'Sydney', lat: -33.87, lon: 151.21, weight: 0.65 },
  { name: 'Melbourne', lat: -37.81, lon: 144.96, weight: 0.6 },
  { name: 'Brisbane', lat: -27.47, lon: 153.03, weight: 0.45 },
  { name: 'Perth', lat: -31.95, lon: 115.86, weight: 0.4 },
  { name: 'Auckland', lat: -36.85, lon: 174.76, weight: 0.4 },
];
