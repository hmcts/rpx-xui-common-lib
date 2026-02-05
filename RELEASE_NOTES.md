# Package Review Notes - rpx-xui-common-lib

Date: 2026-02-05

Summary:
- Reviewed package usage across `projects/`, `src/`, and build tooling.
- Kept Angular/build tool dependencies that are required by `ng build`, lint, and test workflows even if not directly imported in source files.

Changes:
- Added peer dependency providers:
  - `@typescript-eslint/types`
  - `@typescript-eslint/utils`
- No dependency removals in this pass.

Notes:
- Packages like `@angular/compiler`, `@angular/animations`, `@angular/cdk`, `@angular/localize`, `@angular/compiler-cli`, `typescript`, and lint/test tooling are required by Angular build/lint/test and are intentionally retained.
