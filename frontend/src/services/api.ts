/**
 * API Client for Recipe AI
 * Handles all HTTP requests to the FastAPI backend
 */

// API Response types based on standardized format
export interface ApiResponse<T> {
    data: T;
    meta: {
        timestamp: string;
        total?: number;
    };
}

export interface ApiError {
    error: {
        message: string;
        status_code: number;
    };
    meta: {
        timestamp: string;
    };
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class APIClientError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public timestamp?: string
    ) {
        super(message);
        this.name = 'APIClientError';
    }
}

/**
 * Request configuration options
 */
interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

/**
 * API Client class
 */
class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Build URL with query parameters
     */
    private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
        const url = new URL(endpoint, this.baseURL);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        return url.toString();
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
            throw new APIClientError(
                response.status,
                `Unexpected response type: ${contentType}`
            );
        }

        const data = await response.json();

        if (!response.ok) {
            const errorData = data as ApiError;
            throw new APIClientError(
                errorData.error.status_code || response.status,
                errorData.error.message || 'An error occurred',
                errorData.meta.timestamp
            );
        }

        return data as ApiResponse<T>;
    }

    /**
     * Make HTTP request
     */
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const { params, ...fetchConfig } = config;
        const url = this.buildURL(endpoint, params);

        // Default headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchConfig.headers,
        };

        try {
            const response = await fetch(url, {
                ...fetchConfig,
                headers,
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof APIClientError) {
                throw error;
            }

            // Network or other errors
            throw new APIClientError(
                0,
                error instanceof Error ? error.message : 'Network error occurred'
            );
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
            params,
        });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}

// Export singleton instance
export const apiClient = new APIClient(API_BASE_URL);

// Export default for convenience
export default apiClient;
