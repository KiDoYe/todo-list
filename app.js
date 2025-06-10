// TailwindCSS 기반 TODO LIST 구현
const app = document.getElementById('app');

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

// 오늘 날짜 구하기
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const minDate = `${yyyy}-${mm}-${dd}`;

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const dateInput = document.getElementById('todo-date');

// 날짜 입력란 기본값 및 min 설정 (지난 날짜 선택 불가)
if (dateInput) {
  dateInput.value = minDate;
  dateInput.min = minDate;
}

// localStorage에서 todos 불러오기
const savedTodos = localStorage.getItem('todos');
let todos = savedTodos ? JSON.parse(savedTodos) : [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-black bg-opacity-60 px-4 py-2 rounded shadow-sm border-l-4 border-yellow-400';
    li.innerHTML = `
      <button class="mr-3 w-6 h-6 flex items-center justify-center rounded-full border-2 border-yellow-400 bg-black focus:outline-none focus:ring-2 focus:ring-yellow-400 check-btn" data-check="${idx}">
        ${todo.done ? '<svg class=\'w-4 h-4 text-yellow-400\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M5 13l4 4L19 7\'/></svg>' : ''}
      </button>
      <span class="${todo.done ? 'line-through text-gray-500' : 'text-yellow-200'} cursor-pointer flex-1 font-mono text-lg starwars-shadow" data-idx="${idx}">${todo.text}</span>
      <span class="ml-3 text-xs text-yellow-300 font-mono">${todo.date ? todo.date : ''}</span>
      <button class="ml-2 text-yellow-400 hover:text-yellow-200 font-bold" data-del="${idx}">삭제</button>
    `;
    list.appendChild(li);
  });
  saveTodos();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  const date = dateInput.value;
  if (value && date) {
    todos.push({ text: value, done: false, date });
    input.value = '';
    dateInput.value = minDate;
    renderTodos();
  }
});

const clearAllBtn = document.getElementById('clear-all');
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    todos = [];
    renderTodos();
    saveTodos();
  });
}

list.addEventListener('click', (e) => {
  if (e.target.matches('button[data-del]')) {
    const idx = e.target.getAttribute('data-del');
    todos.splice(idx, 1);
    renderTodos();
  } else if (e.target.closest('button[data-check]')) {
    const btn = e.target.closest('button[data-check]');
    const idx = btn.getAttribute('data-check');
    todos[idx].done = !todos[idx].done;
    renderTodos();
  } else if (e.target.matches('span[data-idx]')) {
    const idx = e.target.getAttribute('data-idx');
    todos[idx].done = !todos[idx].done;
    renderTodos();
  }
});

renderTodos();