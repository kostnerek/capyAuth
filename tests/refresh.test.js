import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import db from '../src/models/index.js';

chai.use(chaiHttp);
let should = chai.should();
let have = chai.have;
const server = chai.request(app).keepOpen();

describe("Test /auth/refresh", () => {
    
    before(async () => {
        await db.sequelize.truncate({ cascade: true });
    });

    after(async () => {
        await db.sequelize.sync({force: true});
    });

    describe("Refresh using accessToken", () => {
        it("Should return accessToken and refreshToken", async () => {
            await server
                .post('/auth/register')
                .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })

            // var accessToken, refreshToken;

            let [accessToken, refreshToken] = await server
                .post('/auth/login')
                .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
                .then((res) => {
                    return [res.body.accessToken, res.body.refreshToken];
                });
            
            server
                .post('/auth/refresh')
                .set("X-Access-Token", accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('accessToken');
                    res.body.should.have.property('refreshToken');
                });
        });
    });

    describe("Refresh using refreshToken", () => {
        it("Should return refreshToken", async () => {
            await server
                .post('/auth/register')
                .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })

            // var accessToken, refreshToken;

            let [accessToken, refreshToken] = await server
                .post('/auth/login')
                .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
                .then((res) => {
                    return [res.body.accessToken, res.body.refreshToken];
                });
            
            server
                .post('/auth/refresh')
                .set("X-Refresh-Token", refreshToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('refreshToken');
                });
        });
    });
    describe("Both tokens are present", () => {
        it("Should return 400", async () => {
            await server
                .post('/auth/register')
                .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })

            // var accessToken, refreshToken;

            let [accessToken, refreshToken] = await server
                .post('/auth/login')
                .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
                .then((res) => {
                    return [res.body.accessToken, res.body.refreshToken];
                });
            
            server
                .post('/auth/refresh')
                .set("X-Access-Token", accessToken)
                .set("X-Refresh-Token", refreshToken)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Both tokens are present");
                });
        });
    });
    describe("No token is present", () => {
        it("Should return 400", async () => {
            server
                .post('/auth/refresh')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Missing token");
                });
        });
    });
    describe("Invalid", () => {
        it("Should return 400", async () => {
            await server
                .post('/auth/register')
                .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })

            // var accessToken, refreshToken;

            let [accessToken, refreshToken] = await server
                .post('/auth/login')
                .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
                .then((res) => {
                    return [res.body.accessToken, res.body.refreshToken];
                });
            
            server
                .post('/auth/refresh')
                .set("X-Access-Token", refreshToken)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Invalid token");
                });
        });
    });
});