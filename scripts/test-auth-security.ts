const BASE_URL = 'http://localhost:3000';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✘ FAIL\x1b[0m: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runAuthSecurityTests() {
  console.log('\n============================================================');
  console.log('   SMART CAMPUS NAVIGATION — PHASE 8 SECURITY & AUTH TESTS');
  console.log('============================================================\n');

  // 1. Password Security & Sanitization
  console.log('[1. Password Security & Payload Sanitization]');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@campus.edu', password: 'admin123' }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, 'Valid admin credentials return 200 OK');
  assert(loginData.data?.user?.passwordHash === undefined, 'passwordHash is NOT exposed in user payload');
  assert(loginData.data?.user?.role === 'ADMIN', 'User role correctly identified as ADMIN');

  const adminToken = loginData.data?.token;

  // 2. Reject Invalid Credentials
  console.log('\n[2. Authentication Failure & Protection]');
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@campus.edu', password: 'wrongpassword' }),
  });
  assert(badLoginRes.status === 401, 'Wrong password returns 401 Unauthorized');

  const unknownLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent@campus.edu', password: 'test' }),
  });
  assert(unknownLoginRes.status === 401, 'Non-existent user returns 401 Unauthorized');

  // 3. Reject Malformed Requests
  const emptyLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '', password: '' }),
  });
  assert(emptyLoginRes.status === 400, 'Empty email/password returns 400 Bad Request');

  // 4. Registration RBAC Boundary Check
  console.log('\n[3. Registration Security & Role Escalation Prevention]');
  const hackRegRes = await fetch(`${BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Hacker User',
      email: `hacker_${Date.now()}@campus.edu`,
      password: 'password123',
      role: 'ADMIN', // Attacker attempts to register directly as ADMIN
    }),
  });
  const hackRegData = await hackRegRes.json();
  assert(hackRegRes.status === 201, 'Registration succeeds');
  assert(hackRegData.data?.user?.role === 'STUDENT', 'Privilege escalation blocked: role forced to STUDENT');

  // 5. Protected Endpoint Access Control
  console.log('\n[4. Protected Profile API Access]');
  const unauthProfileRes = await fetch(`${BASE_URL}/api/users/profile`);
  assert(unauthProfileRes.status === 401, 'GET /api/users/profile without token returns 401 Unauthorized');

  const authProfileRes = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(authProfileRes.status === 200, 'GET /api/users/profile with valid Bearer token returns 200 OK');

  // 6. Admin Self-Demotion & Self-Deactivation Protection
  console.log('\n[5. Admin Account Protection]');
  const adminId = loginData.data?.user?.id;
  const demoteSelfRes = await fetch(`${BASE_URL}/api/users/${adminId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ role: 'STUDENT' }),
  });
  assert(demoteSelfRes.status === 400, 'Admin cannot demote own account (returns 400)');

  const deactivateSelfRes = await fetch(`${BASE_URL}/api/users/${adminId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ isActive: false }),
  });
  assert(deactivateSelfRes.status === 400, 'Admin cannot deactivate own account (returns 400)');

  // 7. Input Validation on Resource APIs
  console.log('\n[6. Input Validation & SQLi / Constraint Protection]');
  const badEdgeRes = await fetch(`${BASE_URL}/api/navigation/edges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromNodeId: 'same_node',
      toNodeId: 'same_node',
      distance: -50, // Negative distance
    }),
  });
  assert(badEdgeRes.status === 400, 'Negative distance and self-loop edge rejected with 400');

  const badLocationRes = await fetch(`${BASE_URL}/api/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '',
      categoryId: 'invalid_cat_9999',
    }),
  });
  assert(badLocationRes.status === 400, 'Empty location name rejected with 400');

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: \x1b[32m${passed} PASSED\x1b[0m, \x1b[31m${failed} FAILED\x1b[0m (Total: ${passed + failed})`);
  console.log('============================================================\n');

  if (failed > 0) process.exit(1);
}

runAuthSecurityTests().catch((err) => {
  console.error('Fatal Security test error:', err);
  process.exit(1);
});
