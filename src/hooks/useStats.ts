import { useEffect, useState } from 'react';
import apiClient from '../config/axios';

interface GlobalStats {
  total_recipes: number;
  total_likes: number;
}

export function useStats() {
  const [stats, setStats] = useState<GlobalStats>({ total_recipes: 0, total_likes: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/metrics/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
