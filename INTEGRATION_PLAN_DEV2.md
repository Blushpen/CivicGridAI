# CIVICGRID AI - DEVELOPER 2 INTEGRATION PLAN
Status: PHASE 2 STABILIZATION
Generated: 2026-08-12
Previous Commit: 0aeb381
Current Commit: 629cdf8

## EXECUTIVE SUMMARY

Current implementation has:
- ✓ 3 standalone services (AI Classifier, Duplicate Detector, Gamification Engine)
- ✓ 3 dashboard UIs (Admin, Worker, Leaderboard)
- ✓ Shared type definitions
- ❌ NO data persistence layer
- ❌ NO API integration points
- ❌ NO citizen reporting flow
- ❌ NO real issue-to-worker workflow
- ❌ NO real gamification rewards trigger

**Vertical Slice Completion**: ~15%

---

## PHASE 1: ENVIRONMENT & SETUP (BLOCKED)

**Status**: BLOCKED - Environment not available
**Duration**: N/A until resolved
**Blocking**: All build/test verification

### Requirements
1. Developer installs Node.js and npm
2. Developer provides actual GitHub identity (name + email)
3. Developer provides GitHub authentication (SSH key or PAT)

### Verification Commands (To Run After Environment Setup)
```bash
node --version
npm --version
npm install
npm run build
npm run lint
npm run typecheck
```

---

## PHASE 2: STABILIZATION (IN PROGRESS)

**Status**: IN PROGRESS
**Duration**: 2-4 hours
**Dependencies**: None
**Commit Range**: 0aeb381 → 629cdf8

### Completed ✓
- [x] Fix import path bugs (critical)
- [x] Stabilize gamification XP rules to match spec
- [x] Create inspection report

### Next Steps (Do After This Report)
- [ ] Fix type imports in admin dashboard (currently using wrong import)
- [ ] Add data layer abstraction (in-memory provider for MVP)
- [ ] Implement basic issue service skeleton
- [ ] Implement basic workflow service skeleton
- [ ] Create integration test outline

---

## PHASE 3: CORE DATA LAYER (REQUIRED FOR VERTICAL SLICE)

**Status**: NOT STARTED
**Duration**: 6-8 hours
**Dependencies**: Phase 2 complete
**Deliverable**: Working in-memory data provider for MVP demo

### 3.1 Create Data Provider Abstraction

**File**: `lib/services/dataProvider.ts`

```typescript
// Type-safe data provider interface
interface DataProvider {
  // Issues
  getIssue(id: string): Promise<Issue | null>;
  listIssues(filters?: IssueFilters): Promise<Issue[]>;
  createIssue(issue: Partial<Issue>): Promise<Issue>;
  updateIssue(id: string, updates: Partial<Issue>): Promise<Issue>;
  
  // Gamification
  getProfile(citizenId: string): Promise<GamificationProfile | null>;
  updateProfile(profile: GamificationProfile): Promise<void>;
  
  // Workers
  listWorkers(department?: Department): Promise<Worker[]>;
  updateWorker(id: string, updates: Partial<Worker>): Promise<Worker>;
}
```

**Implementation**: `lib/services/inMemoryProvider.ts`
- In-memory storage using Maps
- Seeded with demo data for MVP
- No actual Supabase integration yet (future work)

### 3.2 Create Issue Service

**File**: `lib/services/issueService.ts`

```typescript
interface IssueService {
  // Create new issue with AI classification and duplicate check
  createIssueWithClassification(
    input: IssueCreationInput
  ): Promise<{
    issue: Issue;
    classification: AIClassificationResult;
    duplicateDetection: DuplicateDetectionResult;
  }>;
  
  // Get issue queue for admin
  getAdminIssueQueue(filters?: IssueFilters): Promise<Issue[]>;
  
  // Assign issue to worker
  assignIssueToWorker(issueId: string, workerId: string): Promise<void>;
  
  // Get assigned issues for worker
  getWorkerAssignedIssues(workerId: string): Promise<Issue[]>;
  
  // Update issue status
  updateIssueStatus(issueId: string, status: IssueStatus): Promise<void>;
}
```

Implementation will:
1. Call AI Classifier for new issues
2. Call Duplicate Detector for new issues
3. Persist using DataProvider
4. Trigger events for workflow and gamification

### 3.3 Create Workflow Service

**File**: `lib/services/workflowService.ts`

```typescript
interface WorkflowService {
  // Handle issue classification event
  onIssueClassified(issue: Issue, classification: AIClassificationResult): Promise<void>;
  
  // Handle issue assignment event
  onIssueAssigned(issueId: string, workerId: string): Promise<void>;
  
  // Handle worker status update event
  onWorkerStatusUpdate(issueId: string, newStatus: IssueStatus): Promise<void>;
  
  // Handle issue resolution event
  onIssueResolved(issueId: string, evidence?: string): Promise<void>;
}
```

Implementation will:
1. Update issue metadata (timestamps, assignment, status)
2. Trigger gamification rewards
3. Update worker metrics
4. Create event log
5. Notify relevant parties (via placeholder)

### 3.4 Integrate Gamification Rewards

Update WorkflowService to trigger gamification:

```typescript
// When issue is resolved
onIssueResolved() {
  // Get citizen profile
  const profile = await dataProvider.getProfile(citizenId);
  
  // Award resolution reward
  let updated = gamificationEngine.recordIssueResolved(profile);
  
  // Check for quality evidence bonus
  if (issue.evidence.length > 0) {
    updated = gamificationEngine.awardQualityEvidenceBonus(updated);
  }
  
  // Persist updated profile
  await dataProvider.updateProfile(updated);
  
  // Trigger leaderboard recalculation
  // (future: update Supabase realtime)
}
```

---

## PHASE 4: DASHBOARD INTEGRATION (REQUIRED FOR VERTICAL SLICE)

**Status**: NOT STARTED
**Duration**: 4-6 hours
**Dependencies**: Phase 3 complete
**Deliverable**: Dashboards use real data from services

### 4.1 Admin Dashboard Integration

**File**: `app/admin/dashboard.tsx`

Current State:
```typescript
const [issues, setIssues] = useState<Issue[]>([]);

useEffect(() => {
  const timer = setTimeout(() => {
    setIssues(generateMockIssues(12));  // ← MOCK
    setLoading(false);
  }, 300);
}, []);
```

After Integration:
```typescript
useEffect(() => {
  const loadIssues = async () => {
    try {
      const issues = await issueService.getAdminIssueQueue(filters);
      setIssues(issues);
    } catch (error) {
      // Show error
    } finally {
      setLoading(false);
    }
  };
  
  loadIssues();
  
  // Future: Set up realtime subscription
  // const unsubscribe = issueService.subscribeToIssues(setIssues);
  // return unsubscribe;
}, []);
```

Assignment Handler:
```typescript
const handleAssign = async (issueId: string, workerId: string) => {
  try {
    await issueService.assignIssueToWorker(issueId, workerId);
    // UI will refresh via realtime or manual reload
  } catch (error) {
    // Show error
  }
};
```

### 4.2 Worker Dashboard Integration

Similar pattern - use `issueService.getWorkerAssignedIssues()`

Status updates: Use `issueService.updateIssueStatus()`

### 4.3 Leaderboard Integration

Use real profiles from DataProvider:
```typescript
const profiles = await dataProvider.listAllProfiles();
const leaderboard = gamificationEngine.getLeaderboard(profiles, 15);
```

---

## PHASE 5: CITIZEN REPORTING FLOW (REQUIRED FOR COMPLETE VERTICAL SLICE)

**Status**: NOT STARTED
**Duration**: 8-10 hours
**Dependencies**: Phase 3, 4 complete
**Deliverable**: Citizens can report issues and see result

### 5.1 Create Citizen Reporting Page

**File**: `app/citizen/report/page.tsx`

Features:
1. Issue title & description input
2. Location input (mock map or address)
3. Evidence upload (mock - store file references)
4. Submit button

Flow:
```
1. User fills form
2. Click submit
3. Call issueService.createIssueWithClassification()
4. Show classification result (category, severity, department, reason)
5. Show duplicate detection result (warning if duplicate detected)
6. Confirm submission
7. Show confirmation with issue ID
8. Redirect to citizen dashboard or issue detail
```

### 5.2 Create Citizen Dashboard

**File**: `app/citizen/dashboard/page.tsx`

Features:
1. List of citizen's reported issues
2. Issue status (Reported → Classified → Assigned → In Progress → Resolved → Verified)
3. Link to issue detail
4. XP earned from this issue (if resolved)

### 5.3 Create Issue Detail Page

**File**: `app/issue/[id]/page.tsx`

Features:
1. Issue details (title, description, category, severity)
2. Classification card (with confidence, reason)
3. Timeline:
   - Reported at
   - Classified at
   - Assigned to worker at
   - Started at
   - Resolved at
4. Assigned worker info (if assigned)
5. Status badge
6. Evidence (photos/attachments)

---

## PHASE 6: API ENDPOINTS (FUTURE - NOT IN MVP)

**Status**: FUTURE WORK
**Duration**: 4-6 hours
**Dependencies**: Phase 3 complete

Note: For hackathon MVP, direct service calls from components are acceptable.

If time permits, create Next.js API routes:
- `app/api/issues` (GET, POST)
- `app/api/issues/[id]` (GET, PUT)
- `app/api/workers` (GET)
- `app/api/profiles/[citizenId]` (GET)

---

## CRITICAL BLOCKERS

### 1. Environment Not Available
**Status**: BLOCKER
**Impact**: Cannot verify build works
**Resolution Required**: Developer installs Node.js/npm

### 2. Git Identity Wrong
**Status**: BLOCKER  
**Impact**: Cannot push to GitHub
**Resolution Required**: Developer provides actual GitHub identity

### 3. GitHub Auth Failed
**Status**: BLOCKER
**Impact**: Cannot push to GitHub
**Resolution Required**: Developer provides GitHub credentials (SSH or PAT)

---

## DATA MODEL CLARIFICATION

### Single Issue Model
```typescript
// lib/types.ts - CANONICAL
interface Issue {
  id: string;                    // ISS-1001, ISS-1002, etc.
  citizenId: string;             // CIT-100, CIT-101, etc.
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: IssueStatus;           // Reported, Classified, Assigned, In Progress, Resolved, Verified, Closed
  category?: IssueCategory;      // Set by AI classifier
  severity?: SeverityLevel;      // Set by AI classifier
  evidence: Evidence[];          // Photos, videos, text
  classification?: AIClassificationResult;  // AI result
  duplicateOf?: string;          // If this is a duplicate, link to original
  nearbyIssues?: string[];       // Issues within proximity radius
  assignedTo?: string;           // Worker ID
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  verifiedAt?: number;
}
```

**Usage**: 
- Citizen creation → Issue(status: "Reported")
- Admin detail → Issue with full data
- Worker assignment → Issue with assignedTo
- Worker status change → Issue with status update
- Gamification trigger → Issue with resolvedAt/verifiedAt

### Single Profile Model
```typescript
// lib/types.ts - CANONICAL
interface GamificationProfile {
  citizenId: string;
  reputation: number;           // 0-100
  xp: number;                   // Unbounded
  level: number;                // Calculated from XP thresholds
  badges: Badge[];
  issuesReported: number;
  issuesVerified: number;
  correctReports: number;       // DEPRECATED - use issuesVerified
  streakDays: number;
  leaderboardRank: number;
  createdAt: number;
  updatedAt: number;
}
```

**Usage**:
- After issue reported: increment issuesReported, award badges
- After issue resolved: increment issuesVerified, award XP (20), award reputation (+2)
- Leaderboard: sort by reputation DESC, then XP DESC

---

## TESTING STRATEGY

### Manual Testing (MVP)
1. Open homepage → see navigation
2. Click Admin Dashboard → see mock issues
3. Click issue → see detail
4. Click assign → update local state (currently)
5. After integration:
   - Click assign → call issueService.assignIssueToWorker()
   - Verify issue shows in worker dashboard

### Automated Testing (Future)
```typescript
// services/__tests__/issueService.test.ts
describe("IssueService", () => {
  test("createIssueWithClassification classifies and checks duplicates", async () => {
    const result = await issueService.createIssueWithClassification({
      title: "Pothole on Main",
      description: "Large hole in road",
      location: { latitude: 40.7128, longitude: -74.0060 },
    });
    
    expect(result.issue).toBeDefined();
    expect(result.classification.category).toBe("Pothole");
    expect(result.duplicateDetection).toBeDefined();
  });
});
```

---

## DEPLOYMENT CHECKLIST

Before marking MVP demo ready:

- [ ] Node.js and npm available in environment
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] `npm run lint` shows no critical errors
- [ ] `npm run typecheck` passes (if available)
- [ ] Can start dev server: `npm run dev`
- [ ] Homepage loads
- [ ] Admin dashboard loads with real issue data
- [ ] Worker dashboard loads with assigned issues
- [ ] Leaderboard shows real profile data
- [ ] Can create issue (citizen page)
- [ ] AI classification shows on issue detail
- [ ] Duplicate detection warning shows
- [ ] Can assign worker and see status update
- [ ] Gamification rewards calculated on resolution
- [ ] XP and reputation update on dashboard
- [ ] Git identity is correct
- [ ] GitHub authentication works
- [ ] Can push feature branch
- [ ] Can create Pull Request to main
- [ ] No secrets in commit history
- [ ] Build artifacts excluded from repo

---

## KNOWN LIMITATIONS

### MVP Scope
- No real Supabase integration (in-memory only)
- No real-time updates (manual refresh needed)
- No file upload (mock only)
- No email/SMS notifications
- No map visualization
- No voice input
- No multilingual support
- No payment/rewards marketplace

### Acceptable for Demo
- Hardcoded seed data in DataProvider
- Local state management (no Redux/Zustand)
- Synchronous operations (no complex async flows)
- Basic error messages (not user-friendly)
- No offline support
- No caching

---

## NEXT IMMEDIATE STEPS

1. **Environment Setup** (Developer)
   - Install Node.js
   - Install npm
   - Provide actual GitHub identity

2. **Fix Remaining Type Issues** (Dev2)
   - Check for any other import errors

3. **Create DataProvider** (Dev2)
   - In-memory implementation
   - Seed with demo data

4. **Create IssueService** (Dev2)
   - Integrate AI Classifier
   - Integrate Duplicate Detector
   - Integrate with DataProvider

5. **Create WorkflowService** (Dev2)
   - Hook up gamification rewards
   - Handle status transitions

6. **Update Admin Dashboard** (Dev2)
   - Load real issues from IssueService
   - Real assignment logic

7. **Update Worker Dashboard** (Dev2)
   - Load real assigned issues
   - Real status updates

8. **Add Citizen Reporting** (Dev2 or Dev3/4)
   - Basic form
   - Integration with complete flow

---

END INTEGRATION PLAN
