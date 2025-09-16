import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { analyticsAPI } from '../lib/api';
import { AnalyticsData } from '../types';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (month?: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyticsAPI.getSummary(user.uid, month);
      setAnalyticsData(data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!user) return [];

    try {
      const suggestions = await analyticsAPI.getSuggestions(user.uid);
      return suggestions;
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to fetch optimization suggestions');
      return [];
    }
  };

  const fetchTrends = async (months: number = 6) => {
    if (!user) return [];

    try {
      const trends = await analyticsAPI.getTrends(user.uid, months);
      return trends;
    } catch (error: any) {
      console.error('Error fetching trends:', error);
      toast.error('Failed to fetch trend data');
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return {
    analyticsData,
    loading,
    error,
    fetchAnalytics,
    fetchSuggestions,
    fetchTrends,
    refetch: () => fetchAnalytics()
  };
};