# 🔧 Jira Comments Directory Reorganization Plan

## Current Issues

1. **Nested Directory Confusion**: `jira_comments/jira_comments/` structure
2. **File Duplication**: Same files exist at root and in nested archive
3. **Inconsistent Organization**: Mixed production and archive files at root level
4. **Multiple README files**: Conflicting documentation

## Proposed Clean Structure

```
sandbox/jira_comments/
├── README.md                           # Main entry point
├── ADF_RESEARCH_SUMMARY.md            # Complete knowledge base
├── scripts/                           # Production scripts
│   ├── core/                          # Core functionality
│   │   ├── jira-mentions-test.js
│   │   ├── jira-mentions-json.js
│   │   ├── jira-mentions-with-tables.js
│   │   ├── jira-mentions-with-images.js
│   │   └── adf-content-detector.js
│   ├── media/                         # Media handling
│   │   ├── download-media-files.js
│   │   ├── download-real-media.js
│   │   ├── download-specific-ticket-media.js
│   │   ├── investigate-media-structure.js
│   │   └── serve-test-page.js
│   └── analysis/                      # Advanced analysis
│       └── find-data-type-examples.js
├── output/                           # Generated reports and data
│   ├── reports/
│   │   ├── jira-mentions-2025-06-17.md
│   │   ├── jira-images-mentions-2025-06-17.md
│   │   └── jira-mentions-with-tables-2025-06-17.md
│   ├── data/
│   │   ├── jira-mentions-2025-06-17.json
│   │   ├── downloaded-media-data.json
│   │   ├── media-structure-investigation.json
│   │   └── test-data-examples-2025-06-17.json
│   └── media/                        # Downloaded media files
│       ├── downloaded-media/
│       └── test-media/
├── web/                              # Web interface components
│   ├── test-adf-rendering.html
│   └── serve-test-page.js (moved here)
└── docs/                            # Additional documentation
    ├── JIRA_COMMENT_PARSING_REFERENCE.md
    └── setup-instructions.md
```

## Actions Required

1. **Clean Up Duplicates**: Remove nested `jira_comments/jira_comments/` directory
2. **Organize by Function**: Group scripts by purpose (core, media, analysis)
3. **Separate Outputs**: Move generated files to dedicated output directory
4. **Consolidate Documentation**: Single README with clear navigation
5. **Archive Legacy**: Move old structure to timestamped archive if needed

## Benefits

- **Clear Navigation**: Logical directory structure
- **No Duplication**: Single source of truth for each file
- **Purpose-Based Organization**: Easy to find relevant scripts
- **Clean Separation**: Scripts vs outputs vs documentation
- **Scalable Structure**: Room for future enhancements

## Migration Strategy

1. Create new directory structure
2. Move files to appropriate locations
3. Update internal references and imports
4. Test all scripts in new locations
5. Update documentation to match new structure
6. Remove old nested structure