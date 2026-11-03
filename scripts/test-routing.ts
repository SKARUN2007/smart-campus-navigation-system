import { defaultCampusGraph, CampusGraph } from '../src/services/routing/graph';
import { dijkstraShortestPath } from '../src/services/routing/dijkstra';
import { astarShortestPath } from '../src/services/routing/astar';
import { RouteService } from '../src/services/routing/routeService';
import { calculateWalkingTimeSeconds } from '../src/services/routing/routeMetrics';
import { CAMPUS_LOCATIONS } from '../src/data/campusLocations';
import { CAMPUS_NODES, CAMPUS_EDGES } from '../src/data/campusPaths';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passedCount++;
  } else {
    console.error(`  \x1b[31m✘ FAIL\x1b[0m: ${testName} ${detail ? `(${detail})` : ''}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('   SMART CAMPUS NAVIGATION ENGINE — PHASE 5 TEST SUITE');
  console.log('============================================================\n');

  const routeService = new RouteService(defaultCampusGraph);

  // SCENARIO 1: Main Entrance -> Computer Science Department
  console.log('[Scenario 1] Main Entrance to Computer Science Department:');
  const res1 = routeService.findRoutes({
    startQuery: 'Main Entrance',
    destinationQuery: 'Computer Science Department',
  });
  assert(res1.success === true, 'Route calculation succeeds');
  assert(res1.routes.length > 0, `At least 1 route returned (${res1.routes.length} found)`);
  assert(res1.routes[0]?.totalDistanceMeters > 0, `Valid distance: ${res1.routes[0]?.formattedDistance}`);
  assert(res1.routes[0]?.instructions.length >= 3, `Generated ${res1.routes[0]?.instructions.length} turn instructions`);

  // SCENARIO 2: Central Library -> Main Canteen
  console.log('\n[Scenario 2] Central Library to Main Canteen:');
  const res2 = routeService.findRoutes({
    startQuery: 'Central Library',
    destinationQuery: 'Main Canteen',
  });
  assert(res2.success === true, 'Route calculation succeeds');
  assert(res2.routes[0]?.nodes[0].name.toLowerCase().includes('library'), 'Starts at Library waypoint');
  assert(
    res2.routes[0]?.nodes[res2.routes[0].nodes.length - 1].name.toLowerCase().includes('canteen'),
    'Terminates at Canteen waypoint'
  );

  // SCENARIO 3: Administrative Block -> Auditorium
  console.log('\n[Scenario 3] Administrative Block to Auditorium:');
  const res3 = routeService.findRoutes({
    startQuery: 'Administrative Block',
    destinationQuery: 'Auditorium',
  });
  assert(res3.success === true, 'Route calculation succeeds');
  assert(res3.routes[0]?.totalDistanceMeters > 0, `Route distance: ${res3.routes[0]?.formattedDistance}`);

  // SCENARIO 4: Shortest Route Calculation (Dijkstra optimality)
  console.log('\n[Scenario 4] Shortest Route Calculation (Dijkstra optimality):');
  const dRes = dijkstraShortestPath(defaultCampusGraph, 'node_gate', 'node_cs');
  assert(dRes.found === true, 'Dijkstra finds connected path');
  assert(dRes.pathNodes[0].id === 'node_gate', 'First node is entrance gate');
  assert(dRes.pathNodes[dRes.pathNodes.length - 1].id === 'node_cs', 'Target node is CS Dept');

  // SCENARIO 5: Alternative Route Calculation
  console.log('\n[Scenario 5] Alternative Route Calculation:');
  const resAlt = routeService.findRoutes({
    startQuery: 'Main Entrance',
    destinationQuery: 'Sports Ground',
  });
  assert(resAlt.success === true, 'Routes calculated');
  const hasAlternative = resAlt.routes.some((r) => r.type === 'ALTERNATIVE');
  assert(hasAlternative, 'Alternative route identified alongside shortest route');
  if (hasAlternative) {
    const altRoute = resAlt.routes.find((r) => r.type === 'ALTERNATIVE')!;
    const shortestRoute = resAlt.routes.find((r) => r.type === 'SHORTEST')!;
    assert(
      altRoute.totalDistanceMeters >= shortestRoute.totalDistanceMeters,
      `Alternative (${altRoute.totalDistanceMeters}m) is >= Shortest (${shortestRoute.totalDistanceMeters}m)`
    );
  }

  // SCENARIO 6: Accessible Route Calculation (excluding stairs)
  console.log('\n[Scenario 6] Accessible Route Calculation (Stairs Avoidance):');
  // Between node_central_circle and node_north_plaza, e_stairs is 160m but accessible: false
  const stairRoute = dijkstraShortestPath(defaultCampusGraph, 'node_central_circle', 'node_north_plaza', {
    requireAccessible: false,
  });
  const stepFreeRoute = dijkstraShortestPath(defaultCampusGraph, 'node_central_circle', 'node_north_plaza', {
    requireAccessible: true,
  });
  assert(stepFreeRoute.found === true, 'Accessible route found');
  const hasStairsInAccessible = stepFreeRoute.pathEdges.some((e) => e.pathwayType === 'STAIRS' || !e.accessible);
  assert(!hasStairsInAccessible, 'Step-free route excludes all stairways and non-accessible pathways');

  // SCENARIO 7: Unreachable Destination Handling
  console.log('\n[Scenario 7] Unreachable Destination Handling:');
  const testGraph = new CampusGraph(
    [
      { id: 'n_a', name: 'Node A', x: 0, y: 0 },
      { id: 'n_b', name: 'Node B', x: 10, y: 10 },
      { id: 'n_isolated', name: 'Node Isolated', x: 100, y: 100 },
    ],
    [{ id: 'e1', from: 'n_a', to: 'n_b', distance: 20, accessible: true, available: true, pathwayType: 'WALKWAY' }]
  );
  const unreachableRes = dijkstraShortestPath(testGraph, 'n_a', 'n_isolated');
  assert(unreachableRes.found === false, 'Correctly flags path as not found');
  assert(unreachableRes.totalDistance === 0, 'Distance is 0 for disjoint components');

  // SCENARIO 8: Same Start & Destination Handling
  console.log('\n[Scenario 8] Same Start & Destination Handling:');
  const resSame = routeService.findRoutes({
    startQuery: 'Computer Science Department',
    destinationQuery: 'Computer Science Department',
  });
  assert(resSame.success === false, 'Same start and destination returns false');
  assert(
    resSame.error?.toLowerCase().includes('same') === true,
    'Returns helpful error indicating locations are identical'
  );

  // SCENARIO 9: Invalid Location ID
  console.log('\n[Scenario 9] Invalid Location ID Handling:');
  const resInvalid = routeService.findRoutes({
    startQuery: 'fake_location_9999',
    destinationQuery: 'Central Library',
  });
  assert(resInvalid.success === false, 'Fails gracefully on unknown location');
  assert(resInvalid.error?.includes('Could not identify') === true, 'Returns informative error message');

  // SCENARIO 10: Unavailable Walking Path
  console.log('\n[Scenario 10] Unavailable Walking Path Handling (Under Construction):');
  const customGraph = new CampusGraph(
    [
      { id: 'n1', name: 'N1', x: 0, y: 0 },
      { id: 'n2', name: 'N2', x: 10, y: 0 },
      { id: 'n3', name: 'N3', x: 5, y: 10 },
    ],
    [
      // Direct edge n1 -> n2 is disabled
      { id: 'e_direct', from: 'n1', to: 'n2', distance: 10, accessible: true, available: false, pathwayType: 'WALKWAY' },
      // Detour edges n1 -> n3 -> n2 are available
      { id: 'e_detour1', from: 'n1', to: 'n3', distance: 8, accessible: true, available: true, pathwayType: 'WALKWAY' },
      { id: 'e_detour2', from: 'n3', to: 'n2', distance: 8, accessible: true, available: true, pathwayType: 'WALKWAY' },
    ]
  );
  const routeDetour = dijkstraShortestPath(customGraph, 'n1', 'n2');
  assert(routeDetour.found === true, 'Found detour path');
  assert(routeDetour.totalDistance === 16, `Total distance is 16m via detour (direct 10m path avoided)`);
  assert(!routeDetour.pathEdges.some((e) => e.id === 'e_direct'), 'Direct unavailable edge is not traversed');

  // SCENARIO 11: Distance Calculation Accuracy (Sum of edges)
  console.log('\n[Scenario 11] Distance Calculation Accuracy:');
  const resCalc = routeService.findRoutes({
    startQuery: 'Main Entrance',
    destinationQuery: 'Boys Hostel',
  });
  assert(resCalc.success === true, 'Route calculated');
  const route = resCalc.routes[0];
  const edgeSum = route.edges.reduce((acc, e) => acc + e.distance, 0);
  assert(
    route.totalDistanceMeters === edgeSum,
    `Calculated route distance (${route.totalDistanceMeters}m) equals sum of edge weights (${edgeSum}m)`
  );

  // SCENARIO 12: Walking Time Calculation
  console.log('\n[Scenario 12] Walking Time Calculation (1.2 m/s):');
  const testDist = 120; // 120m at 1.2 m/s = 100 seconds
  const testTime = calculateWalkingTimeSeconds(testDist);
  assert(testTime === 100, `120m walking time is exactly 100s (${testTime}s calculated)`);
  const zeroTime = calculateWalkingTimeSeconds(0);
  assert(zeroTime === 0, '0m walking time is 0s');

  // SCENARIO 13: Path Reconstruction Integrity
  console.log('\n[Scenario 13] Path Reconstruction Integrity:');
  const resReconstruct = routeService.findRoutes({
    startQuery: 'Administrative Block',
    destinationQuery: 'Medical Centre',
  });
  assert(resReconstruct.success === true, 'Path calculated');
  const testRoute = resReconstruct.routes[0];
  let continuous = true;
  for (let i = 0; i < testRoute.edges.length; i++) {
    const e = testRoute.edges[i];
    const u = testRoute.nodes[i].id;
    const v = testRoute.nodes[i + 1].id;
    const isEdgeConnecting = (e.from === u && e.to === v) || (e.from === v && e.to === u);
    if (!isEdgeConnecting) {
      continuous = false;
      break;
    }
  }
  assert(continuous, 'All consecutive nodes in path are directly connected by the traversed edge');

  // SCENARIO 14: A* vs Dijkstra Result Comparison
  console.log('\n[Scenario 14] A* vs Dijkstra Result Comparison:');
  const pairs = [
    { from: 'node_gate', to: 'node_lib' },
    { from: 'node_gate', to: 'node_sports' },
    { from: 'node_adm', to: 'node_aud' },
    { from: 'node_sw_junction', to: 'node_mech' },
  ];
  let distancesIdentical = true;
  let astarVisitedLessOrEqual = true;

  for (const pair of pairs) {
    const dij = dijkstraShortestPath(defaultCampusGraph, pair.from, pair.to);
    const ast = astarShortestPath(defaultCampusGraph, pair.from, pair.to);
    if (dij.totalDistance !== ast.totalDistance) {
      distancesIdentical = false;
    }
    if (ast.visitedNodesCount > dij.visitedNodesCount) {
      astarVisitedLessOrEqual = false;
    }
  }
  assert(distancesIdentical, 'A* and Dijkstra produce identical shortest path distance across all test pairs');
  assert(astarVisitedLessOrEqual, 'A* heuristic prunes search space, visiting <= nodes than Dijkstra');

  // SCENARIO 15: Step-by-Step Instructions Generation
  console.log('\n[Scenario 15] Step-by-Step Instructions Generation:');
  const resInstr = routeService.findRoutes({
    startQuery: 'Main Entrance',
    destinationQuery: 'Auditorium',
  });
  assert(resInstr.success === true, 'Route calculated');
  const instructions = resInstr.routes[0].instructions;
  assert(instructions.length > 2, `Total instructions generated: ${instructions.length}`);
  assert(instructions[0].action === 'START', `First step is START ("${instructions[0].instruction}")`);
  assert(
    instructions[instructions.length - 1].action === 'ARRIVE',
    `Last step is ARRIVE ("${instructions[instructions.length - 1].instruction}")`
  );
  const intermediateActions = instructions.slice(1, -1).map((s) => s.action);
  const hasTurn = intermediateActions.some((a) =>
    ['STRAIGHT', 'TURN_LEFT', 'TURN_RIGHT', 'SLIGHT_LEFT', 'SLIGHT_RIGHT', 'RAMP', 'STAIRS'].includes(a)
  );
  assert(hasTurn, 'Intermediate steps contain directional turning actions');

  // SUMMARY
  console.log('\n============================================================');
  console.log(`TEST SUMMARY: \x1b[32m${passedCount} PASSED\x1b[0m, \x1b[31m${failedCount} FAILED\x1b[0m (Total: ${passedCount + failedCount})`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
