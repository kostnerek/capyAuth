import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import db from '../src/models/index.js';

chai.use(chaiHttp);
let should = chai.should();
let have = chai.have;
const server = chai.request(app).keepOpen();

describe("Test /auth/login", () => {
    
    before(async () => {
        await db.sequelize.truncate({ cascade: true });
        await server
            .post('/auth/register')
            .send({ username:"testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })
    });

    after(async () => {
        await db.sequelize.sync({force: true});
    });

    const missingValue = "Missing username or password"
    const missingUser = "User not found"
    const invalidValue = (user, message) => {
        it("Should return a 400 response", (done) => {
            server
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql(message);
                    done();
                });
        });
    }

    describe("Missing", () => {
        describe("Username/Email", () => {
            invalidValue({ password: "zaq1@WSX" }, missingValue);
        });
        describe("Password", () => {
            invalidValue({ username: "testpassword", email: "tester@gmail.com", password: "" }, missingValue);
        });
        describe("User", () => {
            invalidValue({ username: "qwerqwerq", email: "qwerqwe@gmail.com", password: "zaq1@WSX" }, missingUser);
        });
    });

    describe("Login to API", () => {
        describe("Using email", () => {
            it("Should return accessToken and refreshToken", (done) => {
                server
                    .post('/auth/login')
                    .send({ email: "auth@gmail.com", password: "zaq1@WSX" })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('accessToken');
                        res.body.should.have.property('refreshToken');
                        done();
                    })
            });
        });

        describe("Using username", () => {
            it("Should return accessToken and refreshToken", (done) => {
                server
                    .post('/auth/login')
                    .send({ username: "testAuth", password: "zaq1@WSX" })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('accessToken');
                        res.body.should.have.property('refreshToken');
                        done();
                    })
            });
        });

        describe("Using email&username", () => {
            it("Should return accessToken and refreshToken", (done) => {
                server
                    .post('/auth/login')
                    .send({ username: "testAuth", email: "auth@gmail.com", password: "zaq1@WSX" })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('accessToken');
                        res.body.should.have.property('refreshToken');
                        done();
                    })
            });
        });

        describe("Logging in using wrong password", () => {
            it("Should return 406", async () => {
                server
                    .post('/auth/login')
                    .send({ username: "testAuth", email: "auth@gmail.com", password: "zaq1@WWWW" })
                    .end((err, res) => {
                        res.should.have.status(406);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql("Invalid password");
                    })
            });
        });
    })
});