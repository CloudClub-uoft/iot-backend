const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../app');
const db = require('../util/mysql');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST auth/login', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const first = faker.name.firstName();
  const last = faker.name.lastName();

  before((done) => {
    bcrypt.hash(password, 5, (_, hash) => {
      db.query(`INSERT INTO logins (\`first-name\`, \`last-name\`, email, password) VALUES ('${first}', '${last}', '${email}', '${hash}')`, done);
    });
  });

  it('it should return a valid auth cookie', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ email, password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('token');
        const token = res.headers['set-cookie'][0].match('token=(?<value>.*?);')[1];
        const payload = jwt.verify(token, process.env.JWT_KEY);
        expect(payload.email).to.equal(email);
        done();
      });
  });

  after((done) => {
    db.query(`DELETE FROM logins WHERE email='${email}'`, done);
  });
});
