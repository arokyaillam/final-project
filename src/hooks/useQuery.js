import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Example hook for fetching data
export const useFetchData = (endpoint, queryKey, options = {}) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
    ...options,
  });
};

// Example hook for creating data
export const useCreateData = (endpoint, queryKey, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(endpoint, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    ...options,
  });
};

// Example hook for updating data
export const useUpdateData = (endpoint, queryKey, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    ...options,
  });
};

// Example hook for deleting data
export const useDeleteData = (endpoint, queryKey, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    ...options,
  });
};
