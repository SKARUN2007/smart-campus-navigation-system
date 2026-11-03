export {};

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

async function runApiTests() {
  console.log('\n============================================================');
  console.log('   SMART CAMPUS NAVIGATION — PHASE 6 BACKEND API TESTS');
  console.log('============================================================\n');

  // 1. LOCATIONS APIs
  console.log('[1. Locations APIs]');
  const locListRes = await fetch(`${BASE_URL}/api/locations`);
  const locListData = await locListRes.json();
  assert(locListRes.status === 200, 'GET /api/locations returns 200 OK');
  assert(locListData.success === true, 'Response payload has success: true');
  assert(Array.isArray(locListData.data) && locListData.data.length > 0, `Returned ${locListData.data?.length} locations`);

  const firstLoc = locListData.data[0];
  const locDetailRes = await fetch(`${BASE_URL}/api/locations/${firstLoc.id}`);
  const locDetailData = await locDetailRes.json();
  assert(locDetailRes.status === 200, `GET /api/locations/${firstLoc.id} returns 200`);
  assert(locDetailData.data?.name === firstLoc.name, 'Location details match');

  const locSearchRes = await fetch(`${BASE_URL}/api/locations/search?q=computer`);
  const locSearchData = await locSearchRes.json();
  assert(locSearchRes.status === 200, 'GET /api/locations/search?q=computer returns 200');
  assert(locSearchData.data?.length > 0, `Search returned ${locSearchData.data?.length} results`);

  // 2. BUILDINGS APIs
  console.log('\n[2. Buildings APIs]');
  const bldgRes = await fetch(`${BASE_URL}/api/buildings`);
  const bldgData = await bldgRes.json();
  assert(bldgRes.status === 200, 'GET /api/buildings returns 200');
  assert(Array.isArray(bldgData.data) && bldgData.data.length > 0, `Returned ${bldgData.data?.length} buildings`);

  const firstBldg = bldgData.data[0];
  const bldgDetailRes = await fetch(`${BASE_URL}/api/buildings/${firstBldg.id}`);
  const bldgDetailData = await bldgDetailRes.json();
  assert(bldgDetailRes.status === 200, `GET /api/buildings/${firstBldg.id} returns 200`);
  assert(Array.isArray(bldgDetailData.data?.locations), 'Building includes associated locations array');

  // 3. CATEGORIES APIs
  console.log('\n[3. Categories APIs]');
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const catData = await catRes.json();
  assert(catRes.status === 200, 'GET /api/categories returns 200');
  assert(Array.isArray(catData.data) && catData.data.length > 0, `Returned ${catData.data?.length} categories`);

  // 4. FACILITIES APIs
  console.log('\n[4. Facilities APIs]');
  const facRes = await fetch(`${BASE_URL}/api/facilities`);
  const facData = await facRes.json();
  assert(facRes.status === 200, 'GET /api/facilities returns 200');
  assert(Array.isArray(facData.data) && facData.data.length > 0, `Returned ${facData.data?.length} facilities`);

  const facSearchRes = await fetch(`${BASE_URL}/api/facilities/search?q=canteen`);
  const facSearchData = await facSearchRes.json();
  assert(facSearchRes.status === 200, 'GET /api/facilities/search?q=canteen returns 200');

  // 5. NAVIGATION APIs (Nodes & Edges & Route Engine)
  console.log('\n[5. Navigation APIs & Graph Engine]');
  const nodesRes = await fetch(`${BASE_URL}/api/navigation/nodes`);
  const nodesData = await nodesRes.json();
  assert(nodesRes.status === 200, 'GET /api/navigation/nodes returns 200');
  assert(nodesData.data?.length > 0, `Returned ${nodesData.data?.length} navigation nodes`);

  const edgesRes = await fetch(`${BASE_URL}/api/navigation/edges`);
  const edgesData = await edgesRes.json();
  assert(edgesRes.status === 200, 'GET /api/navigation/edges returns 200');
  assert(edgesData.data?.length > 0, `Returned ${edgesData.data?.length} navigation edges`);

  // Calculate route via backend API
  const routeApiRes = await fetch(`${BASE_URL}/api/navigation/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startQuery: 'Main Entrance',
      destinationQuery: 'Computer Science Department',
      preferAccessible: false,
    }),
  });
  const routeApiData = await routeApiRes.json();
  assert(routeApiRes.status === 200, 'POST /api/navigation/route returns 200 OK');
  assert(routeApiData.data?.success === true, 'Route calculation response success is true');
  assert(routeApiData.data?.routes?.length > 0, `API calculated ${routeApiData.data?.routes?.length} routes`);
  assert(routeApiData.data?.routes[0]?.totalDistanceMeters > 0, `Route distance: ${routeApiData.data?.routes[0]?.formattedDistance}`);

  // 6. USER REGISTRATION & AUTHENTICATION APIs
  console.log('\n[6. User Registration & Profile APIs]');
  const testEmail = `test_user_${Date.now()}@campus.edu`;
  const registerRes = await fetch(`${BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Navigator',
      email: testEmail,
      password: 'password123',
      role: 'STUDENT',
      department: 'Electrical Engineering',
      studentId: 'EE-2025-01',
    }),
  });
  const registerData = await registerRes.json();
  assert(registerRes.status === 201, 'POST /api/users/register returns 201 Created');
  assert(registerData.success === true, 'Registration succeeded');
  assert(Boolean(registerData.data?.token), 'JWT token returned on registration');

  const token = registerData.data?.token;
  const newUserId = registerData.data?.user?.id;

  // Profile GET with Bearer token
  const profileRes = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profileData = await profileRes.json();
  assert(profileRes.status === 200, 'GET /api/users/profile with Bearer token returns 200');
  assert(profileData.data?.email === testEmail, 'User profile email verified');

  // Profile PUT
  const profileUpdateRes = await fetch(`${BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Updated Navigator Name',
      department: 'Software Engineering',
    }),
  });
  const profileUpdateData = await profileUpdateRes.json();
  assert(profileUpdateRes.status === 200, 'PUT /api/users/profile returns 200');
  assert(profileUpdateData.data?.name === 'Updated Navigator Name', 'Profile name updated successfully');

  // 7. FAVOURITE APIs
  console.log('\n[7. Favourites APIs]');
  const addFavRes = await fetch(`${BASE_URL}/api/favourites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      locationId: firstLoc.id,
      userId: newUserId,
    }),
  });
  const addFavData = await addFavRes.json();
  assert(addFavRes.status === 201, 'POST /api/favourites returns 201 Created');

  const getFavRes = await fetch(`${BASE_URL}/api/favourites?userId=${newUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getFavData = await getFavRes.json();
  assert(getFavRes.status === 200, 'GET /api/favourites returns 200');
  assert(getFavData.data?.length === 1, 'Saved favourite is in user favourites list');

  const delFavRes = await fetch(`${BASE_URL}/api/favourites?locationId=${firstLoc.id}&userId=${newUserId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(delFavRes.status === 200, 'DELETE /api/favourites returns 200');

  // 8. NAVIGATION HISTORY APIs
  console.log('\n[8. Navigation History APIs]');
  const histLogRes = await fetch(`${BASE_URL}/api/navigation/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      startLocationId: firstLoc.id,
      destinationLocationId: firstLoc.id,
      totalDistance: 350,
      estimatedTime: 290,
      routeNodes: 'node_gate -> node_south_plaza -> node_adm',
    }),
  });
  assert(histLogRes.status === 201, 'POST /api/navigation/history returns 201');

  const getHistRes = await fetch(`${BASE_URL}/api/navigation/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getHistData = await getHistRes.json();
  assert(getHistRes.status === 200, 'GET /api/navigation/history returns 200');
  assert(getHistData.data?.length > 0, `Retrieved ${getHistData.data?.length} history entries`);

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: \x1b[32m${passed} PASSED\x1b[0m, \x1b[31m${failed} FAILED\x1b[0m (Total: ${passed + failed})`);
  console.log('============================================================\n');

  if (failed > 0) process.exit(1);
}

runApiTests().catch((err) => {
  console.error('Fatal API test error:', err);
  process.exit(1);
});
