import { useQuery } from 'react-query';
import axiosInstance from '../api/axios';

export const useGetData = (endpoint) => {
  return useQuery(endpoint, async () => {
    const { data } = await axiosInstance.get(endpoint);
    return data;
  });
};
