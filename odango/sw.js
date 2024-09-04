self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncAllDataFromIndexedDB());
    }
});

async function syncAllDataFromIndexedDB() {
    const db = await openDatabase();
    const transaction = db.transaction('syncData', 'readonly');
    const store = transaction.objectStore('syncData');

    const allData = store.getAll();

    allData.onsuccess = async function() {
        const data = allData.result;
        for (let item of data) {
            try {
                await saveData(item.value, item.column, item.row, item.sheetName);
                const deleteTransaction = db.transaction('syncData', 'readwrite');
                const deleteStore = deleteTransaction.objectStore('syncData');
                deleteStore.delete(item.id);
            } catch (error) {
                console.error('Failed to sync data:', error);
            }
        }
    };
}

// Открытие базы данных IndexedDB (нужно также в Service Worker)
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SyncDB', 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('syncData')) {
                db.createObjectStore('syncData', { keyPath: 'id' });
            }
        };

        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.errorCode);
    });
}

// Функция для отправки данных на сервер (нужно также в Service Worker)
async function saveData(value, column, row, sheetName = 'odangoDay2') {
    const url = 'https://script.google.com/macros/s/AKfycbyAXgt-Q1wikBmbkxVUJ-oqKlG4sIXcVMUt40M2GYx4y_s2b5fFvT0V0LaCXn1sSfPwBA/exec';
    const params = new URLSearchParams({
        column: column,
        row: row,
        value: value,
        sheet: sheetName
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
        if (response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            console.log('Data saved:', data);
        } else {
            const text = await response.text();
            console.log('Response text:', text);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}
