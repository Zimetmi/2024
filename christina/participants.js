document.addEventListener('DOMContentLoaded', function () {
    // Диапазоны для секций
    const section1Range = [2, 49];
    const section2Range = [50, 87];
    const section3Range = [88, 118];
	
    // Функция для фильтрации участников по диапазону
    function filterParticipantsByRange(participants, range) {
        return participants.filter(participant => {
            const rowId = participant.row;
            return rowId >= range[0] && rowId <= range[1];
        });
    }

    // Функция для извлечения участников
    function extractParticipants(data) {
        if (!data || !data.values || data.values.length <= 1) {
            throw new Error('Неверный формат данных: отсутствуют значения');
        }

        return data.values.slice(1).map((row, index) => {
            return {
                id: row[0],
                name: row[1],
                img: `${row[0]}.jpg`,
                row: index + 2
            };
        });
    }

    // Функция для создания исходного выпадающего списка (с вариантами от 1 до 5)
    function createSelect(id, dataColumn, dataRow, placeholder) {
        const select = document.createElement('select');
        select.className = 'data-input input-field';
        select.id = id;
        select.setAttribute('data-column', dataColumn);
        select.setAttribute('data-row', dataRow);

        for (let i = 1; i <= 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i == placeholder) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener('input', function () {
            saveData(select.value, dataColumn, dataRow, 'odangoDay1');
        });

        return select;
    }

    // Функция для создания нового выпадающего списка (с вариантами от 1 до 3)
 function createDropdown(id, dataColumn, dataRow, placeholder) {
    const select = document.createElement('select');
    select.className = 'data-input input-field';
    select.id = id;
    select.setAttribute('data-column', dataColumn);
    select.setAttribute('data-row', dataRow);

    for (let i = 1; i <= 3; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i == placeholder) {
            option.selected = true; // Используем переданный placeholder
        }
        select.appendChild(option);
    }

    select.addEventListener('input', function () {
        saveData(select.value, dataColumn, dataRow, 'christinaDay1');
    });

    return select;
}

    // Функция для создания чекбоксов
function createCheckbox(id, dataColumn, dataRow, initialValue) {

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'data-input';
    checkbox.id = id;
    checkbox.setAttribute('data-column', dataColumn);
    checkbox.setAttribute('data-row', dataRow);

    // Проверка наличия значения в initialValue
    checkbox.checked = initialValue !== undefined && initialValue !== null && initialValue.trim() !== '';

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            saveData('Номинант', dataColumn, dataRow, 'christinaDay1');
        } else {
            saveData('', dataColumn, dataRow, 'christinaDay1');
        }
    });

    return checkbox;
}


//Функция создания полей ввода
function createInputFields(container, rowId, placeholders, options = []) {
    const parameters = [
        { label: 'Соответствие', column: 'C', placeholder: placeholders['costum'] },
        { label: 'Качество костюма', column: 'D', placeholder: placeholders['shozhest'] },
        { label: 'Выход', column: 'E', placeholder: placeholders['vistup'] },
        { label: 'Аксессуары', column: 'F', placeholder: placeholders['dropdown'] }
    ];

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    parameters.forEach(param => {
        const inputRow = document.createElement('div');
        inputRow.className = 'input-row';

        const labelDiv = document.createElement('div');
        labelDiv.textContent = param.label;

        const selectContainer = document.createElement('div');
        const select = (param.column === 'F')
            ? createDropdown(`data${param.column}${rowId}`, param.column, rowId, param.placeholder)
            : createSelect(`data${param.column}${rowId}`, param.column, rowId, param.placeholder);

        selectContainer.appendChild(select);

        inputRow.appendChild(labelDiv);
        inputRow.appendChild(selectContainer);
        inputContainer.appendChild(inputRow);
    });

    const commentRow = document.createElement('div');
    commentRow.className = 'input-row';

    const commentLabelDiv = document.createElement('div');
    commentLabelDiv.textContent = 'Комментарий';

    const commentInputDiv = document.createElement('div');
    const textarea = document.createElement('textarea');
    textarea.className = 'data-input input-field';
    textarea.id = `dataG${rowId}`;
    textarea.setAttribute('data-column', 'G');
    textarea.setAttribute('data-row', rowId);
    textarea.value = placeholders['comment'] || ''; // Инициализируем значение из placeholders

    textarea.addEventListener('input', function () {
        saveData(textarea.value, 'G', rowId, 'christinaDay1');
    });

    commentInputDiv.appendChild(textarea);
    commentRow.appendChild(commentLabelDiv);
    commentRow.appendChild(commentInputDiv);
    inputContainer.appendChild(commentRow);

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';

    const checkboxLabels = ['Пошив', 'Крафт', 'Парик', 'Выступление'];
    const checkboxColumns = ['I', 'J', 'K', 'L'];

    checkboxLabels.forEach((label, index) => {
        const checkboxRow = document.createElement('div');
        checkboxRow.className = 'input-row';

        const labelDiv = document.createElement('div');
        labelDiv.textContent = label;

        const checkbox = createCheckbox(`data${checkboxColumns[index]}${rowId}`, checkboxColumns[index], rowId, placeholders.checkboxes[index]);

        checkboxRow.appendChild(labelDiv);
        checkboxRow.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxRow);
    });

    inputContainer.appendChild(checkboxContainer);

    container.appendChild(inputContainer);
}

    // Функция для создания панели участника
 function createParticipantPanel(participant, placeholders) {
    const panel = document.createElement('div');
    panel.className = 'panel';

    const button = document.createElement('button');
    button.className = 'accordion';
    button.textContent = `${participant.id} ${participant.name}`;

    const imgLink = document.createElement('a');
    imgLink.href = `card/${participant.img}`;
    imgLink.className = 'lightzoom';

    const img = document.createElement('img');
    img.src = `card/${participant.img}`;
    img.className = 'thumbnail';

    imgLink.appendChild(img);
    panel.appendChild(imgLink);

    const inputFieldsDiv = document.createElement('div');
    inputFieldsDiv.id = `inputFields${participant.id}`;
    inputFieldsDiv.className = 'input-fields';

    panel.appendChild(inputFieldsDiv);

    createInputFields(inputFieldsDiv, participant.row, placeholders, participant.options);

    return { button, panel };
}

    // Загрузка данных и создание панелей участников
    function renderData(data) {
        const participants = extractParticipants(data);
        
        // Пример использования, можно фильтровать по диапазонам, если нужно
        const section1Participants = filterParticipantsByRange(participants, section1Range);

        section1Participants.forEach(participant => {
            const placeholders = {
                costum: '', // Замените на реальные данные или добавьте в participant
                shozhest: '',
                vistup: '',
                comment: ''
            };
            const { button, panel } = createParticipantPanel(participant, placeholders);
            document.body.appendChild(button);
            document.body.appendChild(panel);
        });
    }

    // Функция для загрузки данных из Google Sheets с кешированием
    async function fetchDataWithCache(sheetName = 'christinaDay1', includeParticipants = false) {
        const SHEET_ID = '128bnCwot_ifFV_B5e1Zxi4VrMLIzGyV4X9iBe7JMJMk';
        const API_KEY = 'AIzaSyBj2W1tUafEz-lBa8CIwiILl28XlmAhyFM'; // Замените YOUR_API_KEY на ваш ключ API
        const RANGE = 'A1:L120';
        const CACHE_EXPIRY = 420000; // 7 минут в миллисекундах
        const cacheKey = `cachedData_${sheetName}`;
        const cacheTimeKey = `cachedTime_${sheetName}`;

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cachedTime) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(cachedTime);

            if (timeDiff < CACHE_EXPIRY) {
                const parsedData = JSON.parse(cachedData);
                if (includeParticipants) {
                    return { data: parsedData, participants: extractParticipants(parsedData) };
                } else {
                    return parsedData;
                }
            }
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, new Date().getTime().toString());

        if (includeParticipants) {
            return { data, participants: extractParticipants(data) };
        } else {
            return data;
        }
    }

    // Функция для получения значений placeholder
	function getPlaceholderValues(data, rowId) {

    const row = data.values[rowId - 1] || []; // Получаем строку, соответствующую rowId

		return {
			'costum': row[2] || '',      // Значение для соответствия (столбец C)
			'shozhest': row[3] || '',    // Значение для качества костюма (столбец D)
			'vistup': row[4] || '',      // Значение для аксессуаров (столбец E)
			'comment': row[6] || '',     // Значение для комментария (столбец G)
			'dropdown': row[5] || '',   // Значение для выпадающего списка (столбец F, новый)
			'checkboxes': [
				row[8] || '',   // Значение для чекбокса 1 (столбец I)
				row[9] || '',   // Значение для чекбокса 2 (столбец J)
				row[10] || '',  // Значение для чекбокса 3 (столбец K)
				row[11] || ''   // Значение для чекбокса 4 (столбец L)	
			]
		};
	}

    // Функция для отображения данных
    async function renderData(sheetName = 'christinaDay1') {
        const { data, participants } = await fetchDataWithCache(sheetName, true);
        
        const section1Container = document.getElementById('section1');
        const section2Container = document.getElementById('section2');
        const section3Container = document.getElementById('section3');

        section1Container.innerHTML = '';
        section2Container.innerHTML = '';
        section3Container.innerHTML = '';

        const section1Participants = filterParticipantsByRange(participants, section1Range);
        const section2Participants = filterParticipantsByRange(participants, section2Range);
        const section3Participants = filterParticipantsByRange(participants, section3Range);

        section1Participants.forEach(participant => {
            const placeholders = getPlaceholderValues(data, participant.row);
            const { button, panel } = createParticipantPanel(participant, placeholders);
            section1Container.appendChild(button);
            section1Container.appendChild(panel);
        });

        section2Participants.forEach(participant => {
            const placeholders = getPlaceholderValues(data, participant.row);
            const { button, panel } = createParticipantPanel(participant, placeholders);
            section2Container.appendChild(button);
            section2Container.appendChild(panel);
        });

        section3Participants.forEach(participant => {
            const placeholders = getPlaceholderValues(data, participant.row);
            const { button, panel } = createParticipantPanel(participant, placeholders);
            section3Container.appendChild(button);
            section3Container.appendChild(panel);
        });

        // Инициализация аккордеонов после загрузки данных и создания панелей участников
        initializeAccordions();

        // Инициализация lightzoom для всех элементов с классом lightzoom после обновления таблицы
        document.dispatchEvent(new Event('tableUpdated'));
    }

    // Функция для инициализации аккордеонов
    function initializeAccordions() {
        const accordions = document.getElementsByClassName("accordion");

        for (let i = 0; i < accordions.length; i++) {
            accordions[i].addEventListener("click", function () {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                    // Инициализируем lightzoom для изображений в этом открытом аккордеоне
                    $(panel).find('a.lightzoom').lightzoom({ speed: 400, overlayOpacity: 0.5 });
                }
            });
        }

        // Инициализация lightzoom для всех элементов с классом lightzoom
        $('a.lightzoom').lightzoom({ speed: 400, overlayOpacity: 0.5 });
    }


 

// Функция для сохранения данных
async function saveData(value, column, row, sheetName = 'christinaDay1') {
    const url = 'https://script.google.com/macros/s/AKfycbyAXgt-Q1wikBmbkxVUJ-oqKlG4sIXcVMUt40M2GYx4y_s2b5fFvT0V0LaCXn1sSfPwBA/exec';
    const params = new URLSearchParams({
        column: column,
        row: row,
        value: value,
        sheet: sheetName
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
        // Проверяем, что ответ в формате JSON, иначе обрабатываем как текст
        if (response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            console.log('Data saved:', data); // Пример вывода для проверки
        } else {
            const text = await response.text();
            console.log('Response text:', text); // Вывод текстового ответа
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}
// Привязка события change к функции сохранения данных
function attachInputListeners() {
    const textareas = document.querySelectorAll('textarea.data-input');
    textareas.forEach(textarea => {
        textarea.addEventListener('change', function () {
            saveData(this.value, this.getAttribute('data-column'), this.getAttribute('data-row'), 'christinaDay1');
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    // Остальной код для инициализации
    attachInputListeners();
});

    // Инициализация загрузки данных и отображение таблицы
    renderData('christinaDay1');


});
