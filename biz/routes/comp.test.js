const request = require("supertest")

const app = require("../app");
const {createData} = require("../_test-biz");
const db = require("../db");

beforeEach(createData);

afterAll(async ()=> {
    await db.end()
});

describe("GET / ", ()=> {

    test ("returns array of companies", async()=>{
        const resp = await request(app).get("/companies");
        expect(resp.body).toEqual({ 
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
              ]
        });
    });
});

describe("GET /apple", ()=> {
  
    test("returns apple info", async()=>{
       const resp= await request(app).get('/companies/apple');
       expect(resp.body).toEqual(
        {
            "company": {
                code: "apple",
                name: "Apple",
                description: "Maker of OSX.",
                invoices: [1, 2],
              }  
        }
       ) 
    });
   
    test("It should return 404 for no-such-company", async function () {
        const response = await request(app).get("/companies/blargh");
        expect(response.status).toEqual(404);
      })

});

describe("POST /", () => {

    test("Adds company", async()=> {
        const resp = await request(app)
        .post("/companies")
        .send({name: "StickyGreen", description: "buds"});

    expect(resp.body).toEqual(
        {
            "company": {
                code: "stickygreen",
                name: "StickyGreen",
                description: "buds",
              }
        }
    )
    })
    test("It should return 500 for conflict", async function () {
        const response = await request(app)
            .post("/companies")
            .send({name: "Apple", description: "Huh?"});
    
        expect(response.status).toEqual(500);
      })
})

describe("PUT /", ()=> {

    test("updates a company", async()=>{
        const resp = await request(app)
        .put("/companies/apple")
        .send({name: "Mac", description: "computers"});

        expect(resp.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Mac",
                    description: "computers",
                  }
            }
        )
    });

    test("returns 404 for no company ", async()=>{
        const resp = await request(app)
        .put("/companies/blargh")
        .send({name: "Blargh"});

        expect(resp.status).toEqual(404);
    });

    test("returns 500 for missing data ", async()=>{
        const resp = await request(app)
        .put("/companies/apple")
        .send({});

        expect(resp.status).toEqual(500);
    });
    });
describe("DELETE /", ()=>{

    test("deletes a company", async()=>{
        const resp = await request(app)
        .delete("/companies/apple");

        expect(resp.body).toEqual({
            "status": "deleted"
        })
    });
    test("It should return 404 for no-such-comp", async function () {
        const response = await request(app)
            .delete("/companies/blargh");
    
        expect(response.status).toEqual(404);
      });
})