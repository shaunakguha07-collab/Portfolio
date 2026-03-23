const request = require('supertest');
const app = require('../server');
const db = require('../database');

// Mock the database query function
jest.mock('../database', () => ({
    query: jest.fn()
}));

describe('API Endpoints', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/messages', () => {
        it('should create a new message and return 201', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const res = await request(app)
                .post('/api/messages')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    message: 'Hello World'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('id', 1);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if fields are missing', async () => {
            const res = await request(app)
                .post('/api/messages')
                .send({
                    name: 'Test User'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'All fields are required.');
        });
    });

    describe('POST /api/login', () => {
        it('should login successfully with correct password', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    password: 'admin123' // Default password in server.js
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 with incorrect password', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid password');
        });
    });
});
