import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { CarpoolForm } from './components/CarpoolForm';
import { CarpoolSearch } from './components/CarpoolSearch';
import { Car } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState<'host' | 'find'>('find');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">CarpoolHub</span>
            </div>
            {session && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView('find')}
                  className={`px-4 py-2 rounded-md ${
                    view === 'find'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Find Carpool
                </button>
                <button
                  onClick={() => setView('host')}
                  className={`px-4 py-2 rounded-md ${
                    view === 'host'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Host Carpool
                </button>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!session ? (
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold text-center mb-8">
                Welcome to CarpoolHub
              </h1>
              <p className="text-gray-600 text-center mb-8 max-w-2xl">
                Join our community of carpoolers to save money, reduce your carbon footprint,
                and meet new people along the way.
              </p>
              <AuthForm />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {view === 'host' ? <CarpoolForm /> : <CarpoolSearch />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;