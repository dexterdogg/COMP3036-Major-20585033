import request from 'supertest';
import { TEST_USERS } from './testDb.js';

export async function loginAsStudent(app) {
  const agent = request.agent(app);

  const res = await agent
    .post('/login')
    .type('form')
    .send({
      email: TEST_USERS.student.email,
      password: TEST_USERS.student.password
    });

  if (res.status !== 302) {
    throw new Error(`Student login failed with status ${res.status}`);
  }

  return agent;
}

export async function loginAsAdmin(app) {
  const agent = request.agent(app);

  const res = await agent
    .post('/login')
    .type('form')
    .send({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password
    });

  if (res.status !== 302) {
    throw new Error(`Admin login failed with status ${res.status}`);
  }

  return agent;
}