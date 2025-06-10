// 프로젝트: 우주 스타일 TailwindCSS TODO LIST
// 주요 기능: 할 일 추가/삭제/완료, 날짜 지정, 전체 삭제, localStorage 저장
// 리뷰 및 주요 주석 추가

// TailwindCSS 기반 TODO LIST 구현
// 1. DOM에서 app 컨테이너를 가져옴
const app = document.getElementById('app');

// 2. 메인 UI(입력폼, 리스트, 전체삭제 버튼 등)를 동적으로 렌더링
app.innerHTML = `
  <div class="max-w-md mx-auto mt-10 bg-gradient-to-b from-black via-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 border-4 border-yellow-400">
    <h1 class="text-4xl font-extrabold mb-6 text-center text-yellow-400 starwars-title drop-shadow-lg tracking-widest">TODO LIST</h1>
    <form id="todo-form" class="flex flex-col gap-2 mb-4">
      <div class="flex">
        <input id="todo-input" type="text" class="flex-1 border-2 border-yellow-400 bg-black text-yellow-200 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-300 font-mono" placeholder="할 일을 입력하세요..." />
        <button type="submit" class="bg-yellow-400 text-black px-4 py-2 rounded-r font-bold hover:bg-yellow-300 transition">추가</button>
      </div>
      <div class="flex gap-2">
        <input id="todo-date" type="date" class="border-2 border-yellow-400 bg-black text-yellow-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono flex-1" />
      </div>
    </form>
    <div class="flex justify-end mb-2">
      <button id="clear-all" class="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-400 transition text-sm">전체 삭제</button>
    </div>
    <ul id="todo-list" class="space-y-2"></ul>
  </div>
`;

// 3. 오늘 날짜(YYYY-MM-DD) 구하기 (date input의 min, value에 사용)
const today = new Date();
const yyyy = today.getFullYear(); // 현재 연도
const mm = String(today.getMonth() + 1).padStart(2, '0'); // 현재 월(2자리)
const dd = String(today.getDate()).padStart(2, '0'); // 현재 일(2자리)
const minDate = `${yyyy}-${mm}-${dd}`; // 오늘 날짜 문자열

// 4. 주요 DOM 요소 변수 할당
const form = document.getElementById('todo-form'); // 입력 폼
const input = document.getElementById('todo-input'); // 할 일 입력란
const list = document.getElementById('todo-list'); // 할 일 목록 ul
const dateInput = document.getElementById('todo-date'); // 날짜 입력란

// 5. 날짜 입력란: 오늘 이전 날짜 선택 불가, 기본값 오늘로 설정
if (dateInput) {
  dateInput.value = minDate; // 기본값 오늘
  dateInput.min = minDate;   // 최소값 오늘
}

// 6. localStorage에서 todos 불러오기 (없으면 빈 배열)
const savedTodos = localStorage.getItem('todos');
let todos = savedTodos ? JSON.parse(savedTodos) : [];

// 7. todos 배열을 localStorage에 저장하는 함수
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 8. 할 일 목록을 렌더링하는 함수 (todos 배열 → DOM)
function renderTodos() {
  list.innerHTML = ''; // 기존 목록 비우기
  todos.forEach((todo, idx) => {
    // 각 할 일 항목(li) 생성 및 TailwindCSS 스타일 적용
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-black bg-opacity-60 px-4 py-2 rounded shadow-sm border-l-4 border-yellow-400';
    // 체크 버튼, 텍스트, 날짜, 삭제 버튼 포함
    li.innerHTML = `
      <button class="mr-3 w-6 h-6 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-black focus:outline-none focus:ring-2 focus:ring-yellow-400 check-btn" data-check="${idx}">
        ${todo.done ? '<svg class=\'w-4 h-4 text-yellow-400\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M5 13l4 4L19 7\'/></svg>' : ''}
      </button>
      <span class="${todo.done ? 'line-through text-gray-500' : 'text-yellow-200'} cursor-pointer flex-1 font-mono text-lg starwars-shadow" data-idx="${idx}">${todo.text}</span>
      <span class="ml-3 text-xs text-yellow-300 font-mono">${todo.date ? todo.date : ''}</span>
      <button class="ml-2 text-yellow-400 hover:text-yellow-200 font-bold" data-del="${idx}">삭제</button>
    `;
    list.appendChild(li); // ul에 li 추가
  });
  saveTodos(); // 렌더링 시마다 localStorage에 저장
}

// 9. 할 일 추가 이벤트 (폼 제출)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // 폼 기본 동작(새로고침) 방지
  const value = input.value.trim(); // 입력값 앞뒤 공백 제거
  const date = dateInput.value; // 선택한 날짜
  if (value && date) { // 값이 모두 있으면
    todos.push({ text: value, done: false, date }); // 새 할 일 추가
    input.value = ''; // 입력란 초기화
    dateInput.value = minDate; // 날짜 입력란 오늘로 초기화
    renderTodos(); // 목록 다시 렌더링
  }
});

// 10. 전체 삭제 버튼 이벤트 (모든 할 일 삭제)
const clearAllBtn = document.getElementById('clear-all');
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    todos = []; // 배열 비우기
    renderTodos(); // 목록 비우기
    saveTodos(); // localStorage도 비우기
  });
}

// 11. 할 일 항목 클릭 이벤트 (삭제/완료 토글)
list.addEventListener('click', (e) => {
  if (e.target.matches('button[data-del]')) {
    // 삭제 버튼 클릭 시 해당 인덱스 삭제
    const idx = e.target.getAttribute('data-del');
    todos.splice(idx, 1);
    renderTodos();
  } else if (e.target.closest('button[data-check]')) {
    // 체크 버튼 클릭 시 완료/미완료 토글
    const btn = e.target.closest('button[data-check]');
    const idx = btn.getAttribute('data-check');
    todos[idx].done = !todos[idx].done;
    renderTodos();
  } else if (e.target.matches('span[data-idx]')) {
    // 텍스트 클릭 시에도 완료/미완료 토글
    const idx = e.target.getAttribute('data-idx');
    todos[idx].done = !todos[idx].done;
    renderTodos();
  }
});

// 12. 최초 렌더링 (페이지 로드 시)
renderTodos();

/*
[코드 리뷰]
- UI/UX: TailwindCSS와 커스텀 폰트, 컬러로 우주 분위기 구현. 반응형, 시각적 강조 우수.
- 기능: 할 일 추가/삭제/완료, 전체 삭제, 날짜 지정, localStorage 저장 등 실사용에 필요한 기능 충실.
- 코드 구조: 함수 분리, 이벤트 위임, localStorage 활용 등 기본기 준수. 불필요한 반복 최소화.
- 개선점: 
  1. 코드 분할(모듈화) 및 컴포넌트화(React 등) 시 확장성↑
  2. 날짜 유효성(미래만 허용 등) 추가 검증 가능
  3. localStorage key 네이밍, 데이터 마이그레이션 고려 가능
- 주석: 주요 로직별 상세 주석 추가로 유지보수 용이
*/