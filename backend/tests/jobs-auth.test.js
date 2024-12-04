const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");

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

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "john@example.com",
    password: "R3g5T7#gh",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
    address:"kettu",
    profile_picture:"jihuu"
  });
  token = result.body.token;
});

describe("Given there are initially some jobs saved", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Promise.all([
      api
        .post("/api/jobs")
        .set("Authorization", "bearer " + token)
        .send(jobs[0]),
      api
        .post("/api/tours")
        .set("Authorization", "bearer " + token)
        .send(jobs[1]),
    ]);
  });

  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create a new job when POST /api/jobs is called", async () => {
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
      .post("/api/jobs")
      .set("Authorization", "bearer " + token)
      .send(newJob)
      .expect(201);
  });

  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get("/api/jobs/" + job._id)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one job by ID when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      title: "Updated job information.",
      type: "Part-Time",
    };
    const response = await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "bearer " + token)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    console.log("Response body:", response.body);
  
    const updatedJobCheck = await Job.findById(job._id);
    console.log("Updated job:", updatedJobCheck);
  
    expect(updatedJobCheck.title).toBe(updatedJob.title);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });
  

  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .delete("/api/jobs/" + job._id)
      .set("Authorization", "bearer " + token)
      .expect(204);
    const jobCheck = await Job.findById(job._id);
    expect(jobCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
