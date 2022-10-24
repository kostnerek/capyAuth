import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import db from '../src/models/index.js';

chai.use(chaiHttp);
let should = chai.should();
let have = chai.have;
const server = chai.request(app).keepOpen();

describe("Test /auth/register", () => {
    before(async () => {
        await db.sequelize.truncate({ cascade: true });
    });
    after(async () => {
        await db.sequelize.sync({force: true});
    });

    describe("Non existing user", () => {
        it("Should return a 201 response", (done) => {
            server
                .post('/auth/register')
                .send({ username:"test", email: "tester@gmail.com", password: "zaq1@WSX" })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User created');
                    done();
                });
        });
    });

    describe("Existing user", () => {
        it("Should return a 400 response", (done) => {
            server
                .post('/auth/register')
                .send({ username:"test", email: "tester@gmail.com", password: "zaq1@WSX" })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User already exists');
                    done();
                });
        });
    });

    const invalidPassword = "Password needs to be between 8-32 characters, have one lower and uppercase and one special character"
    const invalidUsername = "Username needs to be between 4-32 characters, have no special characters"
    const invalidEmail = "Email is not valid"
    const missing = "Missing username, password or email"
    const invalidValue = (user, message) => {
        it("Should return a 400 response", (done) => {
            server
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql(message);
                    done();
                });
        });
    }

    describe("Invalid properties", () => {
        describe("Missing values", () => {
            describe("Username", () => {
                invalidValue({ username: "", email: "tester@gmail.com", password: "zaq1@WSX" }, missing);
            });
            describe("Email", () => {
                invalidValue({ username: "testemail", email: "", password: "zaq1@WSX" }, missing);
            });
            describe("Password", () => {
                invalidValue({ username: "testpassword", email: "tester@gmail.com", password: "" }, missing);
            });
        });
        describe("Invalid values", () => {
            describe("Username", () => {
                invalidValue({ username: "test_", email: "tester@gmail.com", password: "zaq1@WSX" }, invalidUsername);
            });
            describe("Email", () => {
                invalidValue({ username: "test", email: "testtest.com", password: "zaq1@WSX" }, invalidEmail);
            });
            describe("Password", () => {
                invalidValue({ username: "test", email: "tester@gmail.com", password: "zaq1WSX" }, invalidPassword);
            });
        })
    });
});