import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Search, Loader } from 'lucide-react';
import { setSelectedPlayer } from '../../features/baseball/baseballSlice';
import { fetchStats } from '../../features/baseball/baseballSlice';
import { searchPlayers } from '../../services/api';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const players = await searchPlayers(searchTerm);
          setResults(players);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const handlePlayerSelect = (player) => {
    dispatch(setSelectedPlayer(player));
    dispatch(fetchStats(player.id));
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a player..."
          className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-2.5">
          {isSearching ? (
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
          {results.map((player) => (
            <div
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium">{player.name}</div>
              {player.team && (
                <div className="text-sm text-gray-500">{player.team}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;