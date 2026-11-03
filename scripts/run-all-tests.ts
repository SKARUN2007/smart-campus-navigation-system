import { spawnSync } from 'child_process';

console.log('\n============================================================');
console.log('       SMART CAMPUS NAVIGATION SYSTEM — FULL TEST SUITE');
console.log('       PHASE 8 COMPLETE VERIFICATION & QUALITY ASSURANCE');
console.log('============================================================\n');

const suites = [
  { name: 'Routing Algorithm Engine (Dijkstra, A*, Constraints)', script: 'scripts/test-routing.ts' },
  { name: 'Backend REST APIs & PostgreSQL Integration', script: 'scripts/test-api.ts' },
  { name: 'Authentication, RBAC & Security Boundary Tests', script: 'scripts/test-auth-security.ts' },
];

let totalPassedSuites = 0;

for (const suite of suites) {
  console.log(`\n>>> EXECUTING SUITE: ${suite.name} ...`);
  const result = spawnSync('npx', ['tsx', suite.script], { stdio: 'inherit' });
  if (result.status === 0) {
    totalPassedSuites++;
  } else {
    console.error(`\n❌ Suite FAILED: ${suite.name}`);
    process.exit(1);
  }
}

console.log('\n============================================================');
console.log(`   ALL ${totalPassedSuites} / ${suites.length} TEST SUITES PASSED CLEANLY!`);
console.log('   SYSTEM MEETS ALL PHASE 8 QUALITY ASSURANCE CRITERIA.');
console.log('============================================================\n');

