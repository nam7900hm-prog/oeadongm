const SUBJECTS = ['국어','영어','수학','과학','사회','도덕','기술가정','역사','미술','체육'];
const SEMESTERS = ['2학년 1학기','2학년 2학기','3학년 1학기'];
const SEED = [
 ['경북모빌리티고등학교','특성화고','https://school.gyo6.net/anganghs/main.do?sysId=anganghs'],['경주디자인고등학교','특성화고','https://school.gyo6.net/godesign'],['경주마케팅고등학교','특성화고','http://school.gyo6.net/sannae/'],['경주정보고등학교','특성화고','https://school.gyo6.net/interneths'],['삼성생활예술고등학교','특성화고','http://school.gyo6.net/beauty-samseong'],['신라공업고등학교','특성화고','https://school.gyo6.net/sillahs'],['국제통상마이스터고등학교','마이스터고','http://school.gyo6.net/kgbmhs/main.do'],['한국반도체마이스터고등학교','마이스터고','https://school.gyo6.net/kjth'],['효청보건고등학교','특성화고','http://school.gyo6.net/hyochung'],['경북기계금속고등학교','특성화고','https://school.gyo6.net/gbgigo'],['한국조리명장고등학교','특성화고','http://school.gyo6.net/goryeong'],['경북생활과학고등학교','특성화고','https://school.gyo6.net/gbds'],['구미전자고등학교','특성화고','http://school.gyo6.net/gnet'],['구미여자상업고등학교','특성화고','http://school.gyo6.net/gys'],['구미정보고등학교','특성화고','https://school.gyo6.net/gumi-infohs'],['금오공업고등학교','특성화고','https://school.gyo6.net/koths'],['경북과학기술고등학교','특성화고','https://school.gyo6.net/gsths'],['김천생활과학고등학교','특성화고','https://school.gyo6.net/gcbshs'],['김천예술고등학교','특성화고','https://school.gyo6.net/gcarts'],['경북조리과학고등학교','특성화고','http://school.gyo6.net/mgtour'],['문경공업고등학교','특성화고','https://school.gyo6.net/mungyeong-th'],['한국산림과학고등학교','특성화고','http://school.gyo6.net/korea-forest/'],['한국펫고등학교','특성화고','https://school.gyo6.net/koreapet'],['경북에너지기술고등학교','특성화고','https://school.gyo6.net/sangsanhs'],['경북자연과학고등학교','특성화고','https://school.gyo6.net/gbns'],['상지미래경영고등학교','특성화고','http://school.gyo6.net/sangjihs'],['미래농업고등학교','특성화고','https://school.gyo6.net/kfa'],['명인고등학교','특성화고','http://myin.hs.kr/'],['경북하이텍고등학교','특성화고','http://school.gyo6.net/hi-tech'],['예일메디텍고등학교','특성화고','http://school.gyo6.net/yalemhs'],['한국생명과학고등학교','특성화고','http://school.gyo6.net/hansaenghs/'],['경북이커머스고등학교','특성화고','https://school.gyo6.net/ganggu-ch/'],['경북항공고등학교','특성화고',''],['한국국제조리고등학교','특성화고','http://school.gyo6.net/kic'],['한국미래산업고등학교','특성화고','https://school.gyo6.net/kfi'],['한국철도고등학교','특성화고','https://school.gyo6.net/railhs'],['경북바이오마이스터고등학교','마이스터고','http://school.gyo6.net/gbm'],['경북휴먼테크고등학교','특성화고','https://school.gyo6.net/khumantech'],['경북관광비즈니스고등학교','특성화고','https://school.gyo6.net/phhs'],['한국원자력마이스터고등학교','마이스터고','https://school.gyo6.net/pyth'],['경북소프트웨어마이스터고등학교','마이스터고','https://school.gyo6.net/gbsw'],['금성여자상업고등학교','특성화고','http://keumsunghs.school.gyo6.net/'],['의성유니텍고등학교','특성화고',''],['경북드론고등학교','특성화고','']
];

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const regionOf = name => /경주|신라|삼성생활|모빌리티|국제통상|반도체|효청|기계금속/.test(name) ? '경주·포항' : /구미|금오|김천|과학기술|경북생활/.test(name) ? '구미·김천' : '기타';
const STORAGE_KEY = 'odong-admission-project-v1';
let schools = loadSchools();
let predictions = JSON.parse(localStorage.getItem('odong-admission-predictions-v1') || '[]');
let seniorAdmissions = JSON.parse(localStorage.getItem('odong-admission-seniors-v1') || '[]');
let managementUnlocked = false;
let protectedTarget = 'manage';
let thresholds = JSON.parse(localStorage.getItem('odong-admission-thresholds-v1') || 'null') || {stable:10,suitable:2,challenge:-2};

function loadSchools() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  const source = saved || SEED.map(([name,type,url]) => ({ name, type, url, region: regionOf(name) }));
  return source.map(normalize);
}
function normalize(s) { return {name:s.name || '', type:s.type || '특성화고', url:s.url || '', region:s.region || '기타', cutoff:s.cutoff ?? '', departments:s.departments || '', academic:s.academic ?? '', attendance:s.attendance ?? '', volunteer:s.volunteer ?? '', aptitude:s.aptitude ?? '', aptitudeSkip:!!s.aptitudeSkip, interview:s.interview ?? '', interviewSkip:!!s.interviewSkip, memo:s.memo || s.teacher || ''}; }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(schools)); }
function saveStats() { localStorage.setItem('odong-admission-predictions-v1', JSON.stringify(predictions)); localStorage.setItem('odong-admission-seniors-v1', JSON.stringify(seniorAdmissions)); }
function saveThresholds() { localStorage.setItem('odong-admission-thresholds-v1', JSON.stringify(thresholds)); }

function init() {
  $('grade').innerHTML = [1,2,3].map(v => `<option${v===3?' selected':''}>${v}</option>`).join('');
  $('classNo').innerHTML = [1,2,3,4,5].map(v => `<option>${v}</option>`).join('');
  $('studentNo').innerHTML = Array.from({length:30}, (_, i) => `<option>${i+1}</option>`).join('');
  buildSemesterInputs(); bindTabs(); refreshSchoolSelectors(); bindEvents(); loadThresholdForm(); renderSearch(); renderManage(); renderStats(); loadForm(schools[0]); makeQr();
}
function buildSemesterInputs() {
  $('semesterInputs').innerHTML = SEMESTERS.map((semester, i) => `<section class="semester"><div class="semester-head"><h3>${semester}</h3><label class="check"><input class="semester-skip" data-semester="${i}" type="checkbox"> 비적용</label></div><div class="subject-grid">${SUBJECTS.map(subject => `<label>${subject}<select class="subject-score" data-semester="${i}"><option value="">선택</option><option value="5">5점</option><option value="4">4점</option><option value="3">3점</option><option value="2">2점</option><option value="1">1점</option><option value="x">미반영</option><option value="x">미이수</option></select></label>`).join('')}</div></section>`).join('');
  document.querySelectorAll('.semester-skip').forEach(box => box.addEventListener('change', () => document.querySelectorAll(`.subject-score[data-semester="${box.dataset.semester}"]`).forEach(input => input.disabled = box.checked)));
}
function activateTab(id) { document.querySelectorAll('.tab').forEach(x => x.classList.toggle('is-active', x.dataset.tab === id)); document.querySelectorAll('.tab-panel').forEach(x => x.classList.toggle('is-active', x.id === id)); }
function bindTabs() { document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => { if (['manage','stats'].includes(button.dataset.tab) && !managementUnlocked) { protectedTarget = button.dataset.tab; $('managePassword').value = ''; $('passwordError').hidden = true; $('passwordDialog').showModal(); return; } activateTab(button.dataset.tab); })); $('passwordSubmit').onclick = () => { if ($('managePassword').value === '6673') { managementUnlocked = true; $('passwordDialog').close(); activateTab(protectedTarget); } else $('passwordError').hidden = false; }; }
function bindEvents() {
  $('calculateButton').onclick = () => { if (studentScore() === null) return alert('적용 학기 성적과 출석·봉사 점수를 모두 입력하세요.'); recordPrediction(); renderResults(); renderSearch(); renderStats(); };
  $('resultRegion').onchange = renderResults; $('searchButton').onclick = renderSearch; $('searchRegion').onchange = renderSearch; $('searchName').oninput = renderSearch;
  $('schoolPicker').onchange = () => loadForm(schools.find(s => s.name === $('schoolPicker').value));
  $('schoolRegion').onchange = () => $('customRegionField').hidden = $('schoolRegion').value !== '직접입력';
  $('aptitudeSkip').onchange = () => $('aptitudeWeight').disabled = $('aptitudeSkip').checked;
  $('interviewSkip').onchange = () => $('interviewWeight').disabled = $('interviewSkip').checked;
  $('newSchool').onclick = () => loadForm(null); $('saveSchool').onclick = saveForm;
  $('makeQr').onclick = makeQr; $('qrSize').onchange = makeQr; $('qrAddress').onchange = makeQr;
  $('addSenior').onclick = addSeniorAdmission; $('importExcel').onclick = importAdmissionFile; $('seniorSchool').onchange = () => $('seniorCustomSchoolBox').hidden = $('seniorSchool').value !== '__direct__'; $('saveThresholds').onclick = updateThresholds;
}
function refreshSchoolSelectors() {
  const options = schools.map(s => `<option value="${esc(s.name)}">${esc(s.name)} · ${esc(s.region)}</option>`).join('');
  $('schoolPicker').innerHTML = '<option value="">직접 입력</option>' + options; $('preferredSchool').innerHTML = '<option value="">지망 학교 선택</option>' + options; $('seniorSchool').innerHTML = '<option value="">입력된 학교 선택</option>' + options + '<option value="__direct__">직접 입력</option>';
}
function studentScore() {
  const academic = [...document.querySelectorAll('.subject-score')].filter(x => !document.querySelector(`.semester-skip[data-semester="${x.dataset.semester}"]`).checked && x.value && x.value !== 'x').map(x => +x.value);
  const attendance = Number($('attendance').value), volunteer = Number($('volunteer').value);
  if (!academic.length || attendance < 1 || attendance > 100 || volunteer < 1 || volunteer > 100) return null;
  return (academic.reduce((a,b) => a+b, 0) / academic.length * 20 + attendance + volunteer) / 3;
}
function schoolCutoff(s) { const scores = seniorAdmissions.filter(x => x.school === s.name).map(x => Number(x.score)).filter(Number.isFinite); return scores.length ? Math.min(...scores) : Number(s.cutoff); }
function loadThresholdForm() { $('stableGap').value=thresholds.stable; $('suitableGap').value=thresholds.suitable; $('challengeGap').value=thresholds.challenge; }
function updateThresholds() { const stable=Number($('stableGap').value),suitable=Number($('suitableGap').value),challenge=Number($('challengeGap').value); if(!Number.isFinite(stable)||!Number.isFinite(suitable)||!Number.isFinite(challenge)||stable<suitable||suitable<challenge){alert('안정 기준 ≥ 적정 기준 ≥ 소신 하한 기준 순서로 점수를 입력하세요.');return;} thresholds={stable,suitable,challenge};saveThresholds();renderResults();renderSearch();renderStats();alert('합격선 조정 기준이 모든 결과에 적용되었습니다.'); }
function judgement(s) { const score = studentScore(), cutoff = schoolCutoff(s); if (score === null) return ['성적 입력 필요','challenge']; if (!Number.isFinite(cutoff) || cutoff <= 0) return ['자료 없음','challenge']; const gap = score - cutoff; return gap >= thresholds.stable ? ['안정','safe'] : gap >= thresholds.suitable ? ['적정','match'] : gap >= thresholds.challenge ? ['소신','challenge'] : ['어려움','challenge']; }
function editButton(name) { return `<button class="secondary edit" data-edit="${esc(name)}" aria-label="${esc(name)} 수정">✎</button>`; }
function bindEditButtons() { document.querySelectorAll('[data-edit]').forEach(button => button.onclick = () => { document.querySelector('[data-tab="manage"]').click(); loadForm(schools.find(s => s.name === button.dataset.edit)); }); }
function renderResults() {
  const filter = $('resultRegion').value, list = schools.filter(s => filter === '전체' || (filter === '경주·포항' ? s.region === filter : s.region !== '경주·포항'));
  const score = studentScore(); $('totalScore').textContent = score === null ? '총점 -' : `총점 ${score.toFixed(1)}점`;
  $('resultRows').innerHTML = list.map(s => { const [label, style] = judgement(s), cutoff = schoolCutoff(s); return `<tr><td>${esc(s.name)} ${editButton(s.name)}</td><td>${esc(s.region)}</td><td>${esc(s.type)}</td><td>${Number.isFinite(cutoff) && cutoff > 0 ? cutoff : '-'}</td><td><span class="badge ${style}">${label}</span></td></tr>`; }).join(''); bindEditButtons();
}
function renderSearch() {
  const region = $('searchRegion').value, keyword = $('searchName').value.trim().toLowerCase();
  const list = schools.filter(s => (region === '전체' || s.region === region) && s.name.toLowerCase().includes(keyword));
  $('searchRows').innerHTML = list.length ? list.map(s => { const [label, style] = judgement(s); return `<tr><td>${esc(s.name)} ${editButton(s.name)}</td><td>${esc(s.region)}</td><td>${esc(s.type)}</td><td>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">열기</a>` : '미등록'}</td><td><span class="badge ${style}">${label}</span></td></tr>`; }).join('') : '<tr><td colspan="5">조건에 맞는 학교가 없습니다.</td></tr>'; bindEditButtons();
}
function loadForm(s) {
  $('schoolPicker').value = s?.name || ''; $('schoolName').value = s?.name || ''; const defaultRegion = ['경주·포항','구미·김천','기타'].includes(s?.region) ? s.region : '직접입력'; $('schoolRegion').value = defaultRegion; $('customRegionField').hidden = defaultRegion !== '직접입력'; $('customRegion').value = defaultRegion === '직접입력' ? s?.region || '' : '';
  $('schoolType').value = s?.type || '특성화고'; $('schoolUrl').value = s?.url || ''; $('cutoff').value = s?.cutoff ?? ''; $('departments').value = s?.departments || ''; $('academicWeight').value = s?.academic ?? ''; $('attendanceWeight').value = s?.attendance ?? ''; $('volunteerWeight').value = s?.volunteer ?? ''; $('aptitudeWeight').value = s?.aptitude ?? ''; $('aptitudeSkip').checked = !!s?.aptitudeSkip; $('aptitudeWeight').disabled = !!s?.aptitudeSkip; $('interviewWeight').value = s?.interview ?? ''; $('interviewSkip').checked = !!s?.interviewSkip; $('interviewWeight').disabled = !!s?.interviewSkip; $('teacherMemo').value = s?.memo || ''; $('homepageLink').hidden = !s?.url; $('homepageLink').href = s?.url || '#';
}
function saveForm() {
  const name = $('schoolName').value.trim(), url = $('schoolUrl').value.trim(), region = $('schoolRegion').value === '직접입력' ? $('customRegion').value.trim() : $('schoolRegion').value;
  if (!name || !region) return alert('학교명과 지역을 입력하세요.'); if (url && !/^https?:\/\//i.test(url)) return alert('홈페이지 주소는 http:// 또는 https://로 시작해야 합니다.');
  let school = schools.find(s => s.name === $('schoolPicker').value) || schools.find(s => s.name === name); if (!school) { school = normalize({name}); schools.push(school); }
  Object.assign(school, {name, region, type:$('schoolType').value, url, cutoff:$('cutoff').value, departments:$('departments').value.trim(), academic:$('academicWeight').value, attendance:$('attendanceWeight').value, volunteer:$('volunteerWeight').value, aptitude:$('aptitudeSkip').checked ? '' : $('aptitudeWeight').value, aptitudeSkip:$('aptitudeSkip').checked, interview:$('interviewSkip').checked ? '' : $('interviewWeight').value, interviewSkip:$('interviewSkip').checked, memo:$('teacherMemo').value.trim()});
  save(); refreshSchoolSelectors(); renderManage(); renderResults(); renderSearch(); renderStats(); loadForm(school); alert('수정 내용이 모든 화면에 적용되었습니다.');
}
function renderManage() { $('manageRows').innerHTML = schools.map(s => `<tr><td><button class="secondary edit" data-edit="${esc(s.name)}">${esc(s.name)}</button></td><td>${esc(s.region)}</td><td>${s.cutoff || '-'}</td><td>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">열기</a>` : '미등록'}</td><td>${editButton(s.name)}</td></tr>`).join(''); bindEditButtons(); }
function recordPrediction() {
  const school = schools.find(s => s.name === $('preferredSchool').value); if (!school) return;
  const [label] = judgement(school); predictions.push({student:`${$('grade').value}학년 ${$('classNo').value}반 ${$('studentNo').value}번`,score:studentScore().toFixed(1),school:school.name,result:label,at:new Date().toLocaleString('ko-KR')}); saveStats();
}
function renderStats() {
  const count = label => predictions.filter(x => x.result === label).length;
  $('statSummary').innerHTML = `<span>기록 ${predictions.length}명</span><span>안정 ${count('안정')}</span><span>적정 ${count('적정')}</span><span>소신 ${count('소신')}</span><span>어려움 ${count('어려움')}</span><span>선배 합격자료 ${seniorAdmissions.length}건</span>`;
  $('predictionRows').innerHTML = predictions.length ? predictions.map((x,i) => `<tr><td>${esc(x.student)}</td><td>${x.score}</td><td>${esc(x.school)}</td><td>${esc(x.result)}</td><td><button class="secondary delete-prediction" data-index="${i}">삭제</button></td></tr>`).join('') : '<tr><td colspan="5">아직 기록이 없습니다.</td></tr>';
  $('seniorRows').innerHTML = seniorAdmissions.length ? seniorAdmissions.map((x,i) => `<tr><td>${x.studentId ? `학번 ${esc(x.studentId)} · ` : ''}${esc(x.grade || '-') }학년 ${esc(x.classNo || '-') }반 ${esc(x.no || '-') }번</td><td>${esc(x.school)}</td><td>${x.score}</td><td>${esc(x.result || '합격')}</td><td><button class="secondary delete-senior" data-index="${i}">삭제</button></td></tr>`).join('') : '<tr><td colspan="5">입력된 합격자 자료가 없습니다.</td></tr>';
  document.querySelectorAll('.delete-prediction').forEach(b => b.onclick = () => { predictions.splice(Number(b.dataset.index),1); saveStats(); renderStats(); });
  document.querySelectorAll('.delete-senior').forEach(b => b.onclick = () => { seniorAdmissions.splice(Number(b.dataset.index),1); saveStats(); renderStats(); renderResults(); renderSearch(); });
}
function addSeniorAdmission() { const selected=$('seniorSchool').value, school=selected==='__direct__' ? $('seniorCustomSchool').value.trim() : selected, score=Number($('seniorScore').value); if (!school || !Number.isFinite(score) || score < 0 || score > 100) return alert('학교와 0~100점의 합격 점수를 입력하세요.'); seniorAdmissions.push({studentId:$('seniorStudentId').value.trim(),grade:$('seniorGrade').value,classNo:$('seniorClass').value,no:$('seniorNo').value.trim(),school,score:score.toFixed(1),result:$('seniorResult').value}); $('seniorScore').value = '';$('seniorNo').value='';$('seniorStudentId').value='';$('seniorCustomSchool').value=''; saveStats(); renderStats(); renderResults(); renderSearch(); }
function downloadAdmissionTemplate() { const rows=[['학년','반','번호','학교명','합격점수','합격여부'],['3','1','1','경주디자인고등학교','85.5','합격']]; if(window.XLSX){const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet(rows),'합격자자료');XLSX.writeFile(book,'합격자_자료_양식.xlsx');}else{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));a.download='합격자_자료_양식.csv';a.click();} }
async function importAdmissionFile() { const file=$('excelFile').files[0]; if(!file)return alert('가져올 엑셀 파일을 먼저 선택하세요.'); try { let rows=[]; if(window.XLSX){const data=await file.arrayBuffer(),book=XLSX.read(data,{type:'array'}),sheet=book.Sheets[book.SheetNames[0]];rows=XLSX.utils.sheet_to_json(sheet,{defval:''});}else{const text=await file.text();const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);const header=lines.shift().split(',');rows=lines.map(line=>Object.fromEntries(header.map((h,i)=>[h,line.split(',')[i]||''])));} let added=0; rows.forEach(r=>{const school=String(r['학교명']||r.school||'').trim(),score=Number(r['합격점수']||r.score);if(school&&Number.isFinite(score)&&score>=0&&score<=100){seniorAdmissions.push({studentId:String(r['학번']||r.studentId||''),grade:String(r['학년']||r.grade||''),classNo:String(r['반']||r.classNo||''),no:String(r['번호']||r.no||''),school,score:score.toFixed(1),result:String(r['합격여부']||r.result||'합격')});added++;}});saveStats();renderStats();renderResults();renderSearch();alert(`${added}건의 합격자 자료를 가져왔습니다.`);}catch(error){alert('파일을 읽지 못했습니다. 양식 파일의 열 이름과 내용을 확인하세요.');}$('excelFile').value=''; }
function makeQr() { const deployed = location.protocol === 'https:' || location.protocol === 'http:', automaticAddress = deployed ? `${location.origin}${location.pathname}` : ''; const address = $('qrAddress').value.trim() || automaticAddress, size = Number($('qrSize').value), container = $('qrCode'); container.innerHTML = ''; if (!address) { $('qrNotice').textContent = '현재는 컴퓨터 파일로 열려 있습니다. Vercel 배포 후 이 탭을 열면 배포 주소가 자동으로 QR 코드에 연결됩니다.'; container.textContent = '배포 후 자동 생성됩니다.'; return; } $('qrAddress').value = address; $('qrNotice').textContent = '현재 배포 주소가 QR 코드에 자동 연결되었습니다. 학생은 QR을 스캔하면 이 사이트로 이동합니다.'; if (window.QRCode) new QRCode(container, {text:address,width:size,height:size,colorDark:'#003d9b',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H}); else container.textContent = 'QR 코드 도구를 불러오지 못했습니다.'; }
init();
