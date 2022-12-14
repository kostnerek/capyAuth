import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import db from '../src/models/index.js';
import mocha from 'mocha';

chai.use(chaiHttp);
let should = chai.should();
let have = chai.have;
const server = chai.request(app).keepOpen();

describe("Test /auth/", () => {

    before(async () => {
        await db.sequelize.truncate({ cascade: true });
        await server
                .post('/auth/register')
                .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })
        let [accessToken, refreshToken] = await server
            .post('/auth/login')
            .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
            .then((res) => {
                return [res.body.accessToken, res.body.refreshToken];
            });
        mocha.globalSetup = { accessToken, refreshToken };
    });

    after(async () => {
        await db.sequelize.sync({force: true});
    });

    describe("Using accessToken", () => {
        it("Should return accessToken and refreshToken", async () => {
            server
                .post('/auth/')
                .set("X-Access-Token", mocha.globalSetup.accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql("testAuth");
                    res.body.should.have.property('email').eql("auth@gmail.com");
                    res.body.should.have.property('grant').eql(0);
                });
        });
    });

    describe("Using refreshToken", () => {
        it("Should return accessToken and refreshToken", async () => {
            server
                .post('/auth/')
                .set("X-Refresh-Token", mocha.globalSetup.refreshToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql("testAuth");
                    res.body.should.have.property('email').eql("auth@gmail.com");
                    res.body.should.have.property('grant').eql(1);
                });
        });
    });

    describe("Both token provided", () => {
        it("Should return 403", async () => {
            server
                .post('/auth/')
                .set("X-Access-Token", mocha.globalSetup.accessToken)
                .set("X-Refresh-Token", mocha.globalSetup.refreshToken)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Both tokens provided!");
                });
        });
    });

    describe("No token provided", () => {
        it("Should return 403", async () => {
            server
                .post('/auth/')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("No token provided!");
                });
        });
    });

    describe("Invalid token provided", () => {
        it("Should return 401", async () => {
            server
                .post('/auth/')
                .set("X-Access-Token", mocha.globalSetup.refreshToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Unauthorized!");
                });
        });
    });
});