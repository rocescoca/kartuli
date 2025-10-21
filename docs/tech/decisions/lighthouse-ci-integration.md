---
section: Tech/Decisions
title: Lighthouse CI Integration
date: 2025-01-21
status: Accepted
issue: "#21"
---

# Lighthouse CI Integration: Quality Gate Strategy

**Date**: 2025-01-21

**Issue**: [#21](https://github.com/kartuli-app/kartuli/issues/21)

## Context

We need a quality gate to ensure our Georgian language learning platform maintains high standards for Performance, Accessibility, Best Practices, and SEO. While E2E tests validate functionality, we need complementary quality measurements that focus on page quality signals and user experience metrics.

The current setup includes comprehensive E2E testing with Playwright, but lacks automated quality auditing of deployed applications. We need to ensure that performance regressions, accessibility issues, and SEO problems are caught before they reach production.

## Decision

We will implement **Lighthouse CI (LHCI)** as a quality gate after E2E tests in both PR preview and production deployments:

### Implementation Strategy
- **Tool**: Lighthouse CI CLI installed at repository root
- **Scope**: Single URL auditing (main game entry page `/`)
- **Preset**: Mobile emulation for consistent scoring
- **Runs**: 1 run per audit to minimize CI time
- **Integration**: Runs after successful E2E tests

### Quality Budgets
- **Performance**: ≥ 0.90 (90%)
- **Accessibility**: ≥ 0.90 (90%)
- **Best Practices**: ≥ 0.90 (90%)
- **SEO**: ≥ 0.90 (90%)

### CI Integration
- **PR Workflow**: Warn-level assertions for 7-day warm-up period (until Oct 28, 2025)
- **Production Workflow**: Error-level assertions for strict quality gate
- **Artifacts**: Reports stored in CI artifacts with 7-day retention
- **Reports**: Temporary public storage links for sharing

### Environment Controls
- **CI_AUDIT**: Environment variable to disable analytics during audits
- **LIGHTHOUSE_ASSERT_LEVEL**: Controls warn vs error assertion levels
- **BASE_URL**: Drives which URL is audited

## Consequences

### Positive
✅ **Quality assurance** - Automated detection of performance/accessibility regressions  
✅ **Consistent measurement** - Mobile preset ensures comparable scores across runs  
✅ **Fast feedback** - Single URL, single run minimizes CI overhead  
✅ **Comprehensive coverage** - Performance, Accessibility, Best Practices, and SEO  
✅ **CI integration** - Quality gate prevents regressions from reaching production  
✅ **Artifact preservation** - Reports available for debugging and analysis  

### Negative
⚠️ **Maintenance overhead** - Quality budgets require monitoring and adjustment  
⚠️ **CI time increase** - Adds ~2-3 minutes to deployment pipeline  
⚠️ **False positives** - Network conditions can cause score variations  
⚠️ **Budget management** - Thresholds need periodic review and adjustment  

## Implementation

### Current Status: Complete
- Lighthouse CI installed and configured with mobile preset
- Category budgets set to 0.90 (90%) for all metrics
- CI integration added to both PR and main workflows
- Environment variables configured for audit control
- Documentation and setup guides created

### Configuration Details
```json
{
  "ci": {
    "collect": {
      "preset": "mobile",
      "numberOfRuns": 1,
      "url": ["$BASE_URL"]
    },
    "assert": {
      "level": "$LIGHTHOUSE_ASSERT_LEVEL",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Workflow Integration
- **Pipeline order**: checks → build → deploy → **E2E** → **Lighthouse**
- **PR workflow**: Warn-level assertions during warm-up period
- **Main workflow**: Error-level assertions for production quality gate
- **Artifacts**: CI artifacts + temporary public storage links

### Environment Variables
- **CI_AUDIT=true**: Disables analytics during audits to prevent score skewing
- **LIGHTHOUSE_ASSERT_LEVEL**: Controls assertion strictness ("warn" vs "error")
- **BASE_URL**: Target URL for auditing (preview URL or production)

### Future Enhancements
- **Ratchet strategy**: Increase Performance/Accessibility thresholds to 0.95 once stable
- **Metric budgets**: Add specific metric thresholds (LCP ≤ 2500ms, CLS ≤ 0.10, TBT ≤ 200ms)
- **Multiple URLs**: Expand auditing to key user journeys
- **Multiple runs**: Use median scores for production stability

### Analytics Integration
- **CI_AUDIT flag**: Shared environment variable for E2E and future analytics
- **Clean audits**: Analytics disabled during Lighthouse runs for accurate scores
- **Future preparation**: Layout prepared for analytics script integration

### Indexing Behavior
- **Current setup**: Both preview and production allow indexing (`robots: {index: true}`)
- **Rationale**: Preview indexing is acceptable; production requires proper SEO scores
- **Impact**: Consistent SEO scoring across environments

### Ownership and Maintenance
- **Team responsibility**: Development team owns failing audit remediation
- **Timeline**: 7-day warm-up period to establish baseline scores
- **Budget review**: Monthly review of quality thresholds and adjustment needs
- **Documentation**: Clear triage process for quality issues
