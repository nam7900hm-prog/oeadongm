# 외동중 고등학교 지원 도우미

학생의 과목별 성적, 출석·봉사 점수와 학교별 예상 합격점수를 비교하는 정적 웹 프로젝트입니다. 별도 서버나 데이터베이스 없이 브라우저에 입력 자료를 저장합니다.

학교자료 관리는 비밀번호 `6673` 입력 후 사용할 수 있습니다. 이 비밀번호는 정적 웹페이지에 포함된 기본 접근장치이므로, 실제 개인정보 보호가 필요한 운영 환경에서는 별도의 로그인 서버를 사용해야 합니다.

## 실행

`index.html` 파일을 브라우저에서 열면 바로 사용할 수 있습니다.

## GitHub 업로드

1. GitHub에서 새 저장소를 만듭니다.
2. 이 프로젝트 폴더 안의 모든 파일을 저장소 최상단에 업로드합니다.
3. 업로드 후 `index.html`, `assets/styles.css`, `assets/app.js`가 보이는지 확인합니다.

명령줄을 사용한다면 프로젝트 폴더에서 다음을 실행합니다.

```bash
git init
git add .
git commit -m "Initial school admission helper"
git branch -M main
git remote add origin https://github.com/사용자이름/저장소이름.git
git push -u origin main
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 로그인합니다.
2. **Add New → Project**에서 GitHub 저장소를 선택합니다.
3. Framework Preset은 **Other**로 두고 Build Command와 Output Directory는 비워 둡니다.
4. **Deploy**를 누릅니다.

정적 HTML·CSS·JavaScript 프로젝트라 Vercel의 별도 빌드 설정이 필요 없습니다.

## 주의

합격 가능성은 교사가 입력한 학교별 예상 합격점수와 과거 자료에 따른 참고 판정입니다. 최종 지원 전에는 해당 학교의 최신 모집요강을 확인해야 합니다.
