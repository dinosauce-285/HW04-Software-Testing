---
name: playwright-feature-suite
description: Build a data-driven Playwright suite for ONE web feature, run it across browsers, and produce an HTML report stamped with the author's ID. Use when automating a feature (registration, checkout, admin CRUD...) end to end, through to the report and the bug report. Triggered by requests like "automate feature X", "write Playwright tests for screen Y", "build a data-driven suite", "run the tests on 3 browsers".
---

# Build a Playwright suite for one feature

This skill packages the process used to automate three EShop features in HW04, which produced
50 test cases, 9 HTML reports and 18 confirmed bugs.

Overriding rule: **never generate a script from a description of the feature.** Every selector
and every expectation must come from real source code or from behaviour observed at runtime.

## Step 0 - Survey first, never guess

Before writing the first line of test code, run a throwaway survey script to verify real behaviour.

1. Read the screen's source (component, route, API handler, database schema).
2. Write a probe Playwright script that prints: real button labels, the `type` of each input,
   how many elements each intended selector matches, HTTP status codes of the related endpoints.
3. Write the findings to a survey file - it is the evidence assertions are later written against.

**Four things to always check here**, because these are where guessing goes wrong most often:

| Check | Why |
|---|---|
| Real button labels and headings | A Vietnamese UI often still ships English buttons (`Sign In`, `Login`) |
| The `type` of the password field | Many apps declare `type="text"` -> `input[type=password]` never matches |
| How many elements each CSS selector matches | Matching 2 elements is a strict mode violation |
| Whether state survives a reload | Data held in React context is lost on `page.goto` |

## Step 1 - List test cases before writing code

Apply equivalence partitioning and boundary value analysis. For every constraint, produce at
least three cases: **below the boundary / on the boundary / above the boundary**. An off-by-one
`>` instead of `>=` only shows up in the on-the-boundary case.

Target at least 12 test cases per feature, split across positive / negative / edge.

## Step 2 - Move the data into a CSV file

One row is one test case. Suggested columns:

```csv
tc_id,type,description,<input columns>,expect_*,ref_bug
```

- `expect_*` encodes the expectation so the spec holds no literal values.
- `ref_bug` links a case to a bug ID, used in failure messages and in the bug report.
- For values CSV cannot express (a 500-character string, an email that must be unique per run)
  use placeholders such as `__LONG_500__`, `__UNIQUE__` and expand them in the CSV helper.

Parse with `csv-parse/sync` and `trim: false` - with `true`, the cases that specifically test
whitespace handling silently lose their input.

## Step 3 - Page Object built from real source

Collect every selector into one class. Document, in the file itself, each trap found in step 0
along with the source line number - that is what tells the next reader why a selector looks odd.

A Page Object exposes two kinds of method:
- **Actions** - never assert; let the test decide what to expect.
- **State readers** - return raw values (number, string, boolean), never an interpretation.

## Step 4 - A spec that loops over the data

```ts
const cases = readCsv<Case>('feature.csv');
for (const c of cases) {
  test(`${c.tc_id} [${c.type}] ${c.description}`, async ({ page }) => { /* ... */ });
}
```

Test names come from the CSV, so they appear verbatim in the HTML report - a reader sees at a
glance what each case checks.

## Step 5 - Assert against the correct specification, not current behaviour

This is the step that decides whether the suite is worth anything.

If the system returns 5,000,000 where the specification says 450,000, the assertion says
**450,000**. The test fails, and that failure is the bug evidence. Written against current
behaviour instead, the report is all green and finds nothing.

Use at least 3 assertion patterns that differ **in kind**:

| Pattern | Example |
|---|---|
| Element count | `expect(rows).toHaveCount(n)` |
| Text content | `expect(el).toContainText('...')` |
| Navigation | `expect(page).toHaveURL(/...$/)` |
| Control state | `toBeDisabled` / `toHaveValue` / `toBeVisible` |
| API layer | `expect(res.status()).toBe(400)` |
| Business invariant | `expect(final).toBeGreaterThanOrEqual(0)` |

Attach a failure message describing the **business consequence**, not just the numeric delta:

```ts
expect(discount, `${c.tc_id}: wrong discount amount - bug ${c.ref_bug}`).toBe(Number(c.expect_discount));
```

### Three traps that make an assertion pass while checking nothing

This is the most valuable part of the skill. All three actually happened.

**1. `getByRole` normalises whitespace.** The accessible-name standard collapses whitespace, so
`getByRole('cell', { name: 'Name' })` still matches `'  Name  '`. To test trimming you must
compare against raw `allTextContents()`.

**2. A polling matcher passes on its first attempt.** `expect(page).toHaveURL(/\/register$/)`
used to assert "must stay on this page" is always true, because the first poll happens before
the app has navigated. Wait for a settled state first:

```ts
const navigated = await page.waitForURL('**/login', { timeout: 3000 }).then(() => true, () => false);
expect(navigated).toBe(false);
```

**3. Waiting on an element that exists in both states.** Waiting for a link that renders whether
or not the user is signed in confirms nothing. Pick an element that appears **only** in the
intended state (a "Sign out" button, the user's name), and check the `{user ? ... : ...}`
branch in the source to confirm it.

## Step 6 - Isolate data between tests

Tests sharing an account or accumulating data become order-dependent and **fail for the wrong
reason**, masking the real bug.

- `globalSetup` resets the database to its seed state before every run.
- Each test creates its own account when the feature has per-user quotas.
- Data created by a test carries a timestamp in its name so runs never collide.
- Set `retries: 0` - a test failing on a real bug is a result to keep, not to retry away.

## Step 7 - Run across browsers and keep every report

```ts
// playwright.config.ts
const RUN_AT = new Date().toISOString();
const REPORT_ROOT = process.env.REPORT_ROOT ?? 'reports';
const REPORT_DIR = `${REPORT_ROOT}/${FEATURE}-${BROWSER}-${RUN_AT.replace(/[:.]/g, '-')}`;

metadata: { 'Run by': STUDENT_ID, 'Run at (ISO)': RUN_AT },
reporter: [['list'], ['html', { open: 'never', outputFolder: REPORT_DIR,
             title: `Run by: ${STUDENT_ID} - ${FEATURE} - ${BROWSER} - ${RUN_AT}` }]],
```

Run **one feature on one browser per run**:

```bash
for b in chromium firefox webkit; do FEATURE=$f BROWSER=$b npx playwright test --project=$b; done
```

**Never add a `--reporter` flag on the command line.** It replaces the entire reporter list from
the config, so the run produces no report at all while the terminal still reports success.
Listing `html` on the flag is not a fix either: the reporter then falls back to its default
output folder and loses the custom title.

After each run: `ls` the report root to confirm a new folder actually appeared. `--list` also
creates an empty report folder - delete those, or the count will be wrong.

Keep trial runs out of the submitted evidence with `REPORT_ROOT=demo-runs`.

## Step 8 - Classify every failure before filing a bug

For each failing test, answer one question first: **real bug, or broken script?**

| Signal | Conclusion |
|---|---|
| The failure message matches the business consequence you predicted | Real bug |
| Fails with "limit reached" or "element not found" during setup | Broken script - fix and rerun |
| Fails on one browser only | Suspect compatibility or timing - investigate separately |
| Identical result on all 3 browsers | Server-side logic defect |

Only once it is confirmed a real bug does it go into the bug report and become an issue.

### Capturing evidence

- Bug visible in the UI -> screenshot the browser at the exact moment the defect appears.
- API-only bug -> open the HTML report of the real run, click the failing test, screenshot the
  Errors panel (it carries `Expected` / `Received` and the source line).
- Commit the images, then embed them in the issue via GitHub raw URLs - `gh` cannot upload
  images directly.

## Step 9 - Log every fix made to AI-generated script

On each fix, immediately record one row: what the AI produced / what was wrong / what it became /
**why the AI missed it**. That last column cannot be reconstructed later, and it is the most
valuable analysis in the whole exercise.

Classify the cause into three groups: `prompt` (missing context) / `model` (model limitation) /
`feature` (system-specific, knowable only by reading the source).

## Checklist before calling it done

- [ ] >= 12 test cases, covering positive / negative / edge
- [ ] No literal data values left in any spec file
- [ ] >= 3 assertion patterns that differ in kind
- [ ] All 3 browsers run, each into its own report folder
- [ ] Report shows the author stamp and ISO timestamp - open it and look, do not trust the config
- [ ] Every failing test classified as real bug or broken script
- [ ] Every passing test interrogated: would it still pass if the system were broken?
- [ ] The fix log has the "why the AI missed it" column filled in
