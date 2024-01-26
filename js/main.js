// Находим элементы на странице
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []


if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTask(task))
}


checkEmptyList()


// Добавляем задачи
form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
//Отмечаем задачу завершенной

tasksList.addEventListener('click', doneTask)


function addTask(e) {

	// Отменяем отправку формы
	e.preventDefault()

	// Достаем текст задачи из поля ввода
	const taskText = taskInput.value

	// Описываем задачу в виду обьекта 
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Добавляем задачу в массив с задачами
	tasks.push(newTask)

	// Сохраняем спсиок задача в хранилище браузера LocalStorage
	saveToLocalStorage()

	renderTask(newTask)

	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = ''
	taskInput.focus()

	// Проверка есть ли в списке задач больше одного элемента
	checkEmptyList()

}

function deleteTask(e) {
	// Проверяем что клик был НЕ пo кнопке "удалишь задачу"
	if (e.target.dataset.action !== 'delete') return


	// Проверяем что клик был пo кнопке "удалишь задачу"
	const parentNode = e.target.closest('.list-group-item')

	// Определяем ID задачи
	const id = Number(parentNode.id)


	// Находим элемент по нидексу
	const index = tasks.findIndex((task) => task.id === id)

	// Сохраняем спсиок задача в хранилище браузера LocalStorage
	saveToLocalStorage()


	// Удаляем задачу из массива с задачами 
	tasks.splice(index, 1)


	parentNode.remove()

	checkEmptyList()
}

function doneTask(e) {
	// Проверем что клик был НЕ по кнопке "задача выполнена"
	if (e.target.dataset.action !== 'done') return

	// Проверем что клик был по кнопке "задача выполнена"
	const parentNode = e.target.closest('.list-group-item')

	// Определяем ID задачи
	const id = Number(parentNode.id)

	// Находим элемент 
	const task = tasks.find((task) => task.id === id)
	task.done = !task.done

	// Сохраняем спсиок задача в хранилище браузера LocalStorage
	saveToLocalStorage()


	const taskTitle = parentNode.querySelector('.task-title')

	taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListElement = `
		<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Lista zadań jest pusta</div>
				</li>`
		tasksList.insertAdjacentHTML('afterbegin', emptyListElement)
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}

	saveToLocalStorage()
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формируем CSS класс
	const cssClass = task.done ? "task-title task-title--done" : "task-title"

	// Формируем разметку для новой задачи
	const taskHTML = `
			<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>
	`
	// Добавляем задачу на страницу 
	tasksList.insertAdjacentHTML('beforeend', taskHTML)

}

