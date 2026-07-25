# nam7900hm-prog/oeadongm 업그레이드 보고서

## 기준 소스

- 배포 주소: `https://oeadongm.vercel.app/`
- 저장소: `nam7900hm-prog/oeadongm`
- 기존 파일: `index.html`, `assets/app.js`, `assets/styles.css`

## 기존에 정상 작동하던 기능

- 학교자료 신규 등록·수정·저장
- 학생 1명 개별 점수 입력과 즉시 비교
- 합격자 자료 입력·삭제·엑셀 업로드·양식 다운로드
- 학교 검색, 통계, QR 코드
- 학교·합격자·판정기준의 localStorage 저장

## 기존에 있었지만 불완전한 기능

- 학교 수정 후 현재 화면 일부는 다시 그렸지만 학생×학교 공통 계산 결과는 별도로 저장하지 않음
- 학생 150명 저장·수정 구조 없음
- 학생별 결과/학교별 지원학생 결과 없음
- 학교 또는 학생 변경 후 관련 결과의 재계산 필요 상태와 자동 재계산 없음
- 다운로드·통계가 하나의 공통 결과 저장소를 사용하지 않음
- 기존 localStorage 키가 기능별 v2 구조로 분리되지 않음

## 새로 추가한 파일

- `admin.html`: 교사용 로그인 및 7개 관리 메뉴
- `admin.js`: 학교·학생·계산결과·엑셀·마이그레이션·자동 재계산 엔진
- `UPGRADE_REPORT.md`: 완료 보고서

## 수정한 파일

- `index.html`: 기존 메뉴에 `교사용 자동계산` 링크 추가

## 추가한 핵심 함수

- `saveSchoolSetting()` / `updateSchoolSetting()`
- `saveStudent()` / `updateStudent()`
- `markSchoolResultsStale()` / `markStudentResultsStale()`
- `recalculateResultsForSchool()` / `recalculateResultsForStudent()`
- `recalculateAllResults()`
- `calculateStudentForSchool()`
- `saveCalculationResult()`
- `refreshAllResultViews()` / `refreshExportData()`
- `migrateLegacyStorage()`
- `safelyEvaluateFormula()`

## 저장과 자동 재계산

- 학교 신규 저장 시 `SC-2027-0001` 형식으로 기준ID 자동 생성
- 기존 학교 수정 시 기준ID를 유지하고 설정 버전 증가
- 학교 저장 후 해당 학교와 모든 학생 조합을 묶음 재계산
- 학생 신규/수정 시 원점수를 1~5 평점으로 다시 변환하고 적용 가능한 모든 학교 결과 재계산
- 비교과는 평점 변환 없이 원점수·입력만점을 유지
- 결과는 학생ID와 학교 기준ID 조합별로 하나만 저장하고 모든 결과 화면과 다운로드에서 재사용

## 결과 저장값

- 학생ID, 학교 기준ID, 학교 설정 버전
- 교과·출석·봉사·인적성·면접·최종 점수
- 예상·안정 점수, 점수 차이, 지원 수준
- 계산일시, 학생 수정일, 계산 상태, 오류 내용

## localStorage v2 구조

- `odong-school-settings-v2`
- `odong-students-v2`
- `odong-results-v2`
- `odong-calculation-runs-v2`
- `odong-upload-history-v2`
- `odong-config-v2`

기존 `odong-admission-project-v1` 학교자료는 삭제하지 않고 v2 학교 기준으로 복사합니다. 마이그레이션이나 저장에 실패하면 기존 키를 삭제하지 않으며, v2 저장 실패 시 직전 v2 값을 복원합니다.

## 검사 결과

- 기존 `assets/app.js` 문법 검사: 통과
- 신규 `admin.js` 문법 검사: 통과
- `eval`, `Function`, `new Function` 미사용 확인
- 기존 학생 화면 로드: 통과
- 기존 화면에서 교사용 자동계산 링크 표시: 통과
- 교사용 화면 로드 및 PIN 로그인: 통과
- 교사용 7개 메뉴 표시: 통과
- 브라우저 콘솔 오류: 없음

## 기존 기능 유지

기존 배포본의 프로그램 제목, 디자인, 학교 목록, 학생 개별 입력, 학교 비교, 합격자·상담 성격의 기록, 통계, QR 코드, 기존 엑셀 기능 및 교사 비밀번호 화면을 삭제하지 않았습니다.

## 확인이 필요한 사항

- 실제 학교 산출식·반영 학기·과목·가중치·예상점수는 교사가 검증해야 합니다.
- 정적 Vercel 앱이므로 데이터는 교사가 사용하는 각 브라우저에 저장되며 여러 PC에 자동 공유되지 않습니다.
- PIN은 브라우저 수준의 접근 구분입니다. 중앙 계정 권한과 여러 교사 공동 사용이 필요하면 서버 인증·데이터베이스가 필요합니다.
