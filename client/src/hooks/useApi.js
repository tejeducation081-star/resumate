import { useState, useCallback } from 'react';
import { API_TIMEOUT } from '../constants';

/**
 * Custom hook for making API requests with loading and error states
 * @param {Function} apiCall - The API function to execute
 * @returns {Object} - { execute, isLoading, error, data }
 */
export const useApi = (apiCall) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await Promise.race([
                apiCall(...args),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
                )
            ]);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [apiCall]);

    return { execute, isLoading, error, data };
};

export default useApi;
