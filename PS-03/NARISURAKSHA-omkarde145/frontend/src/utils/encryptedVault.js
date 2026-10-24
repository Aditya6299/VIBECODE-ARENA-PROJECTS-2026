/**
 * Client-Side Encrypted Case Vault
 * Uses IndexedDB for persistence + AES-256-GCM for encryption
 * Passphrase is never stored — only the derived key in volatile memory
 */

const DB_NAME = 'NariSurakshaVault';
const DB_VERSION = 1;
const STORE_NAME = 'caseData';
const CASE_KEY = 'activeCase';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

// Derive AES-256-GCM key from passphrase + salt using PBKDF2
async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function saveEncryptedCase(passphrase, caseData) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const plaintext = new TextEncoder().encode(JSON.stringify(caseData));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );

  const payload = {
    id: CASE_KEY,
    salt: Array.from(salt),
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ciphertext)),
    savedAt: new Date().toISOString()
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(payload);
    req.onsuccess = () => resolve({ success: true, savedAt: payload.savedAt });
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function loadEncryptedCase(passphrase) {
  const db = await openDB();
  const payload = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(CASE_KEY);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });

  if (!payload) return null;

  const salt = new Uint8Array(payload.salt);
  const iv = new Uint8Array(payload.iv);
  const ciphertext = new Uint8Array(payload.ciphertext);

  try {
    const key = await deriveKey(passphrase, salt);
    const plaintext = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    const decoded = new TextDecoder().decode(plaintext);
    return { data: JSON.parse(decoded), savedAt: payload.savedAt };
  } catch {
    // Wrong passphrase or corrupted data
    return { error: 'WRONG_PASSPHRASE' };
  }
}

export async function hasSavedCase() {
  try {
    const db = await openDB();
    const payload = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(CASE_KEY);
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    });
    return !!payload;
  } catch {
    return false;
  }
}

export async function deleteEncryptedCase() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(CASE_KEY);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}
