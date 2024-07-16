document.addEventListener('DOMContentLoaded', async function() {
    const inputFields = document.querySelectorAll('.data-input'); // Получение всех полей ввода

    // Константы для работы с Google Sheets API и кешем
    const SHEET_ID = '128bnCwot_ifFV_B5e1Zxi4VrMLIzGyV4X9iBe7JMJMk';
    const API_KEY = 'AIzaSyCYgExuxs0Kme9-tWRCsz4gVD9yRjHY74g';
    const RANGE = 'A1:F120';
    const CACHE_EXPIRY = 420000; // 7 минут в миллисекундах

    // Функция для загрузки данных из Google Sheets с кешированием
    const fetchDataWithCache = async (sheetName = 'Mako') => {
        const cacheKey = `cachedData_${sheetName}`;
        const cacheTimeKey = `cachedTime_${sheetName}`;

        // Проверка наличия данных в кеше и их актуальности
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cachedTime) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(cachedTime);

            // Использование данных из кеша, если они актуальны
            if (timeDiff < CACHE_EXPIRY) {
                return JSON.parse(cachedData);
            }
        }

        // Загрузка данных из Google Sheets API и обновление кеша
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, new Date().getTime().toString());

        return data;
    };

    // Функция для создания ячейки таблицы
    const createTableCell = (cellContent, isLink = false) => {
        const cell = document.createElement('td');
        if (isLink) {
            const link = document.createElement('a');
            link.href = `card/${cellContent}.jpg`;
            link.textContent = cellContent;
            link.classList.add('lightzoom'); // Настройка lightzoom
            cell.appendChild(link);
        } else {
            cell.textContent = cellContent;
        }
        return cell;
    };

    // Функция для рендеринга таблицы с данными
    const renderTable = (data) => {
        const tableBody = document.querySelector('#dataTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = ''; // Очистка таблицы перед вставкой новых данных

        data.values.forEach((row, rowIndex) => {
            const newRow = document.createElement('tr');
            row.forEach((cell, colIndex) => {
                const isLink = colIndex === 0 && rowIndex > 0;
                const newCell = createTableCell(cell, isLink);
                newRow.appendChild(newCell);
            });
            tableBody.appendChild(newRow);
        });

        // Триггерим событие для переподключения lightzoom
        document.dispatchEvent(new Event('tableUpdated'));
    };

    // Функция для заполнения полей ввода значениями из таблицы
    const populateInputFields = (data) => {
        inputFields.forEach(input => {
            const column = input.getAttribute('data-column');
            const row = input.getAttribute('data-row');
            const cellValue = data.values[row - 1] ? data.values[row - 1][column.charCodeAt(0) - 65] : '';
            input.placeholder = cellValue;

            if (input.tagName === 'SELECT') {
                input.value = cellValue;
            }
        });
    };

    // Функция для отображения данных на странице
    const renderData = async (sheetName = 'Mako') => {
        const data = await fetchDataWithCache(sheetName);
        renderTable(data);
        populateInputFields(data);
    };

    // Функция для сохранения данных
    const saveData = async (value, column, row, sheetName = 'Mako') => {
        const url = 'https://script.google.com/macros/s/AKfycbyAXgt-Q1wikBmbkxVUJ-oqKlG4sIXcVMUt40M2GYx4y_s2b5fFvT0V0LaCXn1sSfPwBA/exec';
        const params = new URLSearchParams({
            column: column,
            row: row,
            value: value,
            sheet: sheetName
        });

        try {
            const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Установка обработчиков событий для полей ввода
    inputFields.forEach(input => {
        input.addEventListener('input', async function() {
            const column = input.getAttribute('data-column');
            const row = input.getAttribute('data-row');
            await saveData(input.value, column, row, 'Mako');
        });
    });

    // Инициализация загрузки данных и отображение таблицы
    await renderData('Mako');

    // Подключение lightzoom после обновления таблицы
    document.addEventListener('tableUpdated', function() {
        $('.lightzoom').lightzoom(); // Настройка lightzoom, если используется jQuery
    });
});

// Функции для работы аккордеона
function openCity(evt, cityName) {
    // Объявляем все переменные
    var i, tabcontent, tablinks;

    // Получаем все элементы с классом "tabcontent" и скрываем их
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Получаем все элементы с классом "tablinks" и удаляем класс "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Отображаем текущую вкладку и добавляем класс "active" к кнопке, открывшей вкладку
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
	}

	// Проверка на существование элемента с классом .time перед попыткой доступа к его textContent
	let timeElement = document.querySelector('.time');
	if (timeElement) {
		let text = timeElement.textContent;
		console.log(text);
	}

// Для заполнения расписания
document.addEventListener('DOMContentLoaded', async function() {
    const SHEET_ID = '1_p2Wb9MU6VCHkdM0ZZcj7Kjfg-LHK6h_qwdEKztXdds'; // ID гугл таблицы
    const API_KEY = 'AIzaSyBj2W1tUafEz-lBa8CIwiILl28XlmAhyFM'; // API ключ для работы с таблицами
    const RANGE = 'Sheet1!A1:B169'; // Имя страницы и диапазон ячеек
    const CACHE_EXPIRY = 420000; // 7 минут в миллисекундах

    const fetchDataWithCache = async () => {
        const cacheKey = `cachedData`;
        const cacheTimeKey = `cachedTime`;

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cachedTime) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(cachedTime);

            if (timeDiff < CACHE_EXPIRY) {
                return JSON.parse(cachedData);
            }
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const message = `An error has occurred: ${response.status} ${response.statusText}`;
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error(message);
        }

        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, new Date().getTime().toString());

        return data;
    };

    const createTableCell = (cellContent, isLink = false) => {
        const cell = document.createElement('td');
        if (isLink) {
            const link = document.createElement('a');
            link.href = `card/${cellContent}.jpg`;
            link.textContent = cellContent;
            link.classList.add('lightzoom'); // Настройка lightzoom
            cell.appendChild(link);
        } else {
            cell.textContent = cellContent;
        }
        return cell;
    };

    const renderTable = (data) => {
        const tableBody = document.querySelector('#schedule tbody');
        if (!tableBody) return;

        tableBody.innerHTML = ''; // Очистка таблицы перед вставкой новых данных
        if (!data.values) {
            throw new Error('Data values are undefined.');
        }

        data.values.forEach((row) => {
            const newRow = document.createElement('tr');
            let rowClass = '';

            row.forEach((cell, colIndex) => {
                if (cell.toLowerCase().includes('смотр')) {
                    rowClass = 'smort';
                } else if (cell.toLowerCase().includes('блок')) {
                    rowClass = 'block';
                } else if (cell.toLowerCase().includes(':')) {   // Здесь задаётся класс для ячеек, включающих двоеточие. Строки, где в ячейках есть двоеточие, будут центрироваться в таблице, и выводиться жирным шрифтом. Вообще это рассчитано для обозначения начала номинаций, но некоторые участники используют двоеточие для названия фандома
                    rowClass = 'B';
                }
                const isLink = colIndex === 0;
                const newCell = createTableCell(cell, isLink);
                newRow.appendChild(newCell);
            });

            if (rowClass) {
                newRow.classList.add(rowClass);
            }

            tableBody.appendChild(newRow);
        });

        // Триггерим событие для переподключения lightzoom
        document.dispatchEvent(new Event('tableUpdated'));
    };

    const renderData = async () => {
        try {
            const data = await fetchDataWithCache();
            renderTable(data);
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        }
    };

    await renderData();
    
    // Подключение lightzoom после обновления таблицы
    document.addEventListener('tableUpdated', function() {
        $('.lightzoom').lightzoom(); // Настройка lightzoom, если используется jQuery
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // Аккордеон
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
                // Инициализируем lightzoom для изображений в этом открытом аккордеоне
                $(panel).find('a.lightzoom').lightzoom({speed: 400, overlayOpacity: 0.5});
            }
        });
    }

    // Инициализация lightzoom для всех элементов с классом lightzoom
    $('a.lightzoom').lightzoom({speed: 400, overlayOpacity: 0.5});
});

// Функция для переключения вкладок в шапке
 function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
       tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }
