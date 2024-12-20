import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, Search } from 'lucide-react';

interface Carpool {
  id: string;
  date: string;
  start_location: string;
  destination: string;
  mobile_number: string;
  available_seats: number;
  fare: number;
}

export function CarpoolSearch() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [carpools, setCarpools] = useState<Carpool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let query = supabase
        .from('carpools')
        .select('*')
        .gte('date', date)
        .order('date', { ascending: true });

      if (startLocation) {
        query = query.ilike('start_location', `%${startLocation}%`);
      }
      if (destination) {
        query = query.ilike('destination', `%${destination}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCarpools(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSearch} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-2xl font-bold mb-6">Find a Carpool</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Starting location"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Destination"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {carpools.map((carpool) => (
          <div key={carpool.id} className="bg-white shadow-md rounded p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-semibold">{carpool.start_location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-semibold">{carpool.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{new Date(carpool.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="font-semibold">{carpool.available_seats}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fare per Seat</p>
                <p className="font-semibold">${carpool.fare}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold">{carpool.mobile_number}</p>
              </div>
            </div>
          </div>
        ))}
        
        {carpools.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No carpools found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}