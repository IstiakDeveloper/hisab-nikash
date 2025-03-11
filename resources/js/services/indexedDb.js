// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FinanceDB', 1);

      request.onerror = event => reject('Failed to open database');

      request.onupgradeneeded = event => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = event => resolve(event.target.result);
    });
  }

  // Example function to save transaction offline
  async function saveTransaction(transaction) {
    try {
      const db = await initDB();
      const tx = db.transaction('transactions', 'readwrite');
      const store = tx.objectStore('transactions');

      // Mark as not synced
      transaction.synced = false;
      transaction.createdAt = new Date();

      const id = await store.add(transaction);

      // Try to sync if online
      if (navigator.onLine) {
        syncTransactions();
      }

      return id;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  // Sync function to run when online
  async function syncTransactions() {
    if (!navigator.onLine) return;

    try {
      const db = await initDB();
      const tx = db.transaction('transactions', 'readwrite');
      const store = tx.objectStore('transactions');
      const index = store.index('synced');

      const unsyncedTransactions = await index.getAll(false);

      // Loop through unsynced and post to server
      for (const transaction of unsyncedTransactions) {
        try {
          // Use fetch or axios to send to server
          const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
          });

          if (response.ok) {
            // Mark as synced
            transaction.synced = true;
            await store.put(transaction);
          }
        } catch (error) {
          console.error('Failed to sync transaction:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing transactions:', error);
    }
  }

  // Listen for online status to sync
  window.addEventListener('online', syncTransactions);
