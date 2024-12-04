const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Job = require('../models/jobModel');

const jobs = [
    {
        title: "Job title 1",
        type: "Job type 1",
        description: "Job description 1",
        company: {
            name: "Company 1",
            contactEmail: "email1@gmail.com",
            contactPhone: "012345611",
            website: "jabbadabbaduu"
        },
        location: "Vantaa",
        salary: 3800,
        postedDate: "2024-08-30T00:00:00.000Z",
        status: "open",
        applicationDeadline: "2024-08-31T00:00:00.000Z",
        requirements: []
    },
    {
        title: "Job title 2",
        type: "Job type 2",
        description: "Job description 2",
        company: {
            name: "Company 2",
            contactEmail: "email2@gmail.com",
            contactPhone: "012345622",
            website: "jabbadabbaduu"
        },
        location: "Vantaa",
        salary: 3800,
        postedDate: "2024-08-30T00:00:00.000Z",
        status: "open",
        applicationDeadline: "2024-08-31T00:00:00.000Z",
        requirements: []
    },
];

describe('Jobs controller', () => {
    beforeEach(async () => {
        await Job.deleteMany({});
        await Job.insertMany(jobs);
    });

    afterAll(() => {
        mongoose.connection.close();
    });

    // Test GET /api/jobs
    it('GET /api/jobs returns all jobs as JSON when called', async () => {
        const response = await api
            .get('/api/jobs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveLength(jobs.length);
    });

    // Test POST /api/jobs
    it('POST /api/jobs creates a new job when called', async () => {
        const newJob = {
            title: "Job title 3",
            type: "Job type 3",
            description: "Job description 3",
            company: {
                name: "Company 3",
                contactEmail: "email3@gmail.com",
                contactPhone: "012345333",
                website: "jabbadabbaduu"
            },
            location: "Vantaa",
            salary: 3800,
            postedDate: "2024-08-30T00:00:00.000Z",
            status: "open",
            applicationDeadline: "2024-08-31T00:00:00.000Z",
            requirements: []
        };

        await api
            .post('/api/jobs')
            .send(newJob)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const jobsAfter = await Job.find({});
        expect(jobsAfter).toHaveLength(jobs.length + 1);
        const titles = jobsAfter.map(job => job.title);
        expect(titles).toContain(newJob.title);
    });

    // Test GET /api/jobs/:id
    it('GET /api/jobs/:id returns one job by ID when called', async () => {
        const job = await Job.findOne();
        const response = await api
            .get('/api/jobs/' + job._id)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.title).toEqual(job.title);
    });

    it('Should return 404 if job not found', async () => {
        const invalidId = new mongoose.Types.ObjectId();
        response = await api
            .get(`/api/jobs/${invalidId}`)
            .expect(404)
    });

    // Test PUT /api/jobs/:id
    it('PUT /api/jobs/:id updates one job by ID when called', async () => {
        const job = await Job.findOne();
        const updatedJob = {
            title: 'Updated Job',
            type: 'Part-time',
            description: 'Updated job description',
        };

        await api
            .put('/api/jobs/' + job._id)
            .send(updatedJob)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const updatedJobCheck = await Job.findById(job._id);
        expect(updatedJobCheck.title).toEqual(updatedJob.title);
        expect(updatedJobCheck.type).toEqual(updatedJob.type);
        expect(updatedJobCheck.description).toEqual(updatedJob.description);
    });

    it('Should return 404 if job not found', async () => {
        const invalidId = new mongoose.Types.ObjectId();
        response = await api
            .put(`/api/jobs/${invalidId}`)
            .expect(404)
    });

    // Test DELETE /api/jobs/:id
    it('DELETE /api/jobs/:id deletes one job by ID when called', async () => {
        const job = await Job.findOne();
        await api
            .delete('/api/jobs/' + job._id)
            .expect(204);

        const jobsAfter = await Job.find({});
        expect(jobsAfter).toHaveLength(jobs.length - 1);
        const titles = jobsAfter.map(job => job.title);
        expect(titles).not.toContain(job.title);

        const deletedJob = await Job.findById(job._id);
        expect(deletedJob).toBeNull();
    });

    it('Should return 404 if job not found', async () => {
        const invalidId = new mongoose.Types.ObjectId();
        await api
            .delete(`/api/jobs/${invalidId}`)
            .expect(404)
    });


});