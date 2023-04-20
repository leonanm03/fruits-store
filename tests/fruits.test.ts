import supertest from "supertest";
import app from "../src/app";

const api = supertest(app);

describe("POST /fruits", () => {
  it("Should respond with status 201 when correct body is sent", async () => {
    const body = {
      name: "Abacate",
      price: 10,
    };

    const result = await api.post("/fruits").send(body);

    expect(result.status).toBe(201);
  });

  it("Should respond with status 422 body is not sent", async () => {
    const result = await api.post("/fruits");

    expect(result.status).toBe(422);
  });

  it("Should respond with status 422 when wrong body is sent", async () => {
    const body = {
      name: { name: "oi" },
      price: 10,
    };

    const result = await api.post("/fruits").send(body);

    expect(result.status).toBe(422);
  });

  it("Should respond with status 409 when duplicated fruit name is sent", async () => {
    const body = {
      name: "Abacate",
      price: 10,
    };

    const result = await api.post("/fruits").send(body);

    expect(result.status).toBe(409);
  });
});

describe("GET /fruits", () => {
  it("Should respond with status 200 and fruits array", async () => {
    const result = await api.get("/fruits");

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
  });
});

describe("GET /fruits/:id", () => {
  it("Should respond with status 200 and fruit correct id is sent", async () => {
    const { body: fruits } = await api.get("/fruits");
    const [{ id }] = fruits;

    const result = await api.get(`/fruits/${id}}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  it("Should respond with status 404 when wrong fruit id is sent", async () => {
    const { body: fruits } = await api.get("/fruits");
    const id = fruits.length + 1;

    const result = await api.get(`/fruits/${id}}`);

    expect(result.status).toBe(404);
  });
});
