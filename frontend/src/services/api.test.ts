import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient, APIClientError } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('APIClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET requests', () => {
        it('should make successful GET request', async () => {
            const mockData = { id: '1', title: 'Test Recipe' };
            const mockResponse = {
                data: mockData,
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => mockResponse,
            });

            const result = await apiClient.get('/api/recipes/1');

            expect(result.data).toEqual(mockData);
            expect(result.meta.timestamp).toBe('2026-02-21T10:30:00Z');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/recipes/1'),
                expect.objectContaining({ method: 'GET' })
            );
        });

        it('should handle query parameters', async () => {
            const mockResponse = {
                data: [],
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => mockResponse,
            });

            await apiClient.get('/api/recipes', { limit: 10, page: 1 });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('limit=10'),
                expect.any(Object)
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('page=1'),
                expect.any(Object)
            );
        });
    });

    describe('POST requests', () => {
        it('should make successful POST request with body', async () => {
            const requestBody = { ingredients: ['tomato', 'cheese'] };
            const mockResponse = {
                data: { id: '1', title: 'Generated Recipe' },
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => mockResponse,
            });

            const result = await apiClient.post('/api/recipes/generate', requestBody);

            expect(result.data).toEqual(mockResponse.data);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/recipes/generate'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                })
            );
        });
    });

    describe('DELETE requests', () => {
        it('should make successful DELETE request', async () => {
            const mockResponse = {
                data: { deleted: true },
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => mockResponse,
            });

            const result = await apiClient.delete('/api/inventory/items/tomato');

            expect(result.data.deleted).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/inventory/items/tomato'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('Error handling', () => {
        it('should handle API errors with standardized format', async () => {
            const errorResponse = {
                error: {
                    message: 'Recipe not found',
                    status_code: 404,
                },
                meta: {
                    timestamp: '2026-02-21T10:30:00Z',
                },
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 404,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => errorResponse,
            });

            try {
                await apiClient.get('/api/recipes/999');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(APIClientError);
                expect((error as APIClientError).statusCode).toBe(404);
                expect((error as APIClientError).message).toBe('Recipe not found');
            }
        });

        it('should handle network errors', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            try {
                await apiClient.get('/api/recipes');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(APIClientError);
                expect((error as APIClientError).statusCode).toBe(0);
                expect((error as APIClientError).message).toBe('Network error');
            }
        });

        it('should handle non-JSON responses', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Headers({ 'content-type': 'text/html' }),
                json: async () => {
                    throw new Error('Not JSON');
                },
            });

            try {
                await apiClient.get('/api/recipes');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(APIClientError);
                expect((error as APIClientError).message).toContain('text/html');
            }
        });
    });
});
