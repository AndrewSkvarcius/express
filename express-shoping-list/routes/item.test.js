process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../fakeData");
let item = { name: "stupid", price:100 }

beforeEach(async () => {
 items.push(item)
});

afterEach(async () => {
    items = []
});

describe("GET / items", ()=> {
    test("Gets list of items", async () => {
        const resp = await request(app).get("/items");
        const {items} = resp.body;
        expect(resp.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    })
});

describe("GET / items/:name", ()=> {
    test("Gets one item", async () => {
        const resp = await request(app).get(`/items/${item.name}`);
        const {items} = resp.body;
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toEqual((item))
    });

    test("Response with 404 if not found", async ()=>{
        const resp = await request(app).get(`/items/0`);
        expect (resp.statusCode).toBe(404);
    });
});

describe("POST /items", ()=> {
    test("Makes new item", async () => {
        const resp = await request(app)
        .post(`/items`)
        .send({ name: "sandwich", price: 10});
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item.price).toEqual(10)
        expect(resp.body.item.name).toEqual("sandwich")
    });
});

describe("PATCH /items/:name",() => {
test("Updates item ", async () => {
    const resp = await request(app)
    .patch(`items/${item.name}`)
    .send({ name: "mike"
});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.item).toEqual({name: "mike"
}); 
   });
   test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});

describe("Delete /itmes/:name", () => {
    test("Deletes one item", async ()=>{
        const resp= await request(app).delete(`/items/${item.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "item Deleted"});
    })
})