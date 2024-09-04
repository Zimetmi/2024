self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncAllData());
    }
});

async function syncAllData() {
    const sheetName = 'odangoDay2';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`localData_${sheetName}`)) {
            const [_, sheet, row, column] = key.split('_');
            const value = localStorage.getItem(key);
            try {
                await saveData(value, column, row, sheetName);
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Failed to sync data:', error);
            }
        }
    }
}
