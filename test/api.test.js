const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, validateEnvironment } = require("../src/index");

test("GET / returns API status with apiUrl first", async () => {
    const response = await request(app).get("/");
    assert.equal(response.status, 200);
    assert.deepEqual(Object.keys(response.body).slice(0, 1), ["apiUrl"]);
    assert.equal(response.body.apiUrl, "/");
});

test("GET /health returns ok", async () => {
    const response = await request(app).get("/health");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
});

test("protected subscribers route rejects missing cookie", async () => {
    const response = await request(app).get("/api/newsletter/subscribers");
    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Authentication required");
});

test("registration validates weak credentials before database access", async () => {
    const response = await request(app).post("/api/auth/register").send({ name: "A", email: "bad", password: "short" });
    assert.equal(response.status, 422);
    assert.match(response.body.message, /2 characters/);
});

test("subscription validates malformed email before database access", async () => {
    const response = await request(app).post("/api/newsletter/subscribe").send({ email: "not-an-email" });
    assert.equal(response.status, 422);
    assert.match(response.body.message, /valid email/);
});

test("environment validation rejects missing variables", () => {
    const originalMongo = process.env.MONGO_URI;
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.MONGO_URI;
    delete process.env.JWT_SECRET;
    assert.throws(() => validateEnvironment(), /MONGO_URI, JWT_SECRET/);
    process.env.MONGO_URI = originalMongo;
    process.env.JWT_SECRET = originalSecret;
});
