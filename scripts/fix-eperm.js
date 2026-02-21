/**
 * Preload script: captura EPERM/EACCES errors em scandir/readdir do Windows
 * E bloqueia scan recursivo de C:\Users\NFC (exceto AppData).
 * Uso: NODE_OPTIONS="--require ./scripts/fix-eperm.js" npm run build
 */
const fs = require('fs');
const pathMod = require('path');

// Bloquear scan recursivo do home directory do Windows (exceto AppData que contém npm)
const USER_HOME = (process.env.USERPROFILE || '').replace(/\\/g, '/');
function shouldBlock(p) {
  if (!p || !USER_HOME) return false;
  if (typeof p !== 'string') return false;
  const normalized = p.replace(/\\/g, '/');
  // Bloquear qualquer path sob C:/Users/NFC que NÃO seja AppData
  if (normalized.startsWith(USER_HOME + '/') && !normalized.startsWith(USER_HOME + '/AppData')) {
    return true;
  }
  return false;
}

function handleErr(err) {
  return err && (err.code === 'EPERM' || err.code === 'EACCES');
}

// Patch readdir (callback API)
const origReaddir = fs.readdir;
fs.readdir = function(dirPath, options, cb) {
  const callback = typeof options === 'function' ? options : cb;
  const opts = typeof options === 'function' ? undefined : options;
  if (shouldBlock(dirPath)) return process.nextTick(() => callback(null, []));
  const wrappedCb = function(err, files) {
    if (handleErr(err)) return callback(null, []);
    return callback(err, files);
  };
  return opts
    ? origReaddir.call(this, dirPath, opts, wrappedCb)
    : origReaddir.call(this, dirPath, wrappedCb);
};

// Patch readdirSync
const origReaddirSync = fs.readdirSync;
fs.readdirSync = function(dirPath, ...args) {
  if (shouldBlock(dirPath)) return [];
  try { return origReaddirSync.call(this, dirPath, ...args); }
  catch (e) { if (e.code === 'EPERM' || e.code === 'EACCES') return []; throw e; }
};

// Patch opendir (callback API)
const origOpendir = fs.opendir;
if (origOpendir) {
  fs.opendir = function(dirPath, options, cb) {
    const callback = typeof options === 'function' ? options : cb;
    const opts = typeof options === 'function' ? undefined : options;
    if (shouldBlock(dirPath)) {
      const emptyD = {
        read: (c2) => c2 ? c2(null, null) : Promise.resolve(null),
        close: (c2) => c2 ? c2(null) : Promise.resolve(),
        [Symbol.asyncIterator]: () => ({ next: () => Promise.resolve({ done: true }) }),
      };
      return process.nextTick(() => callback(null, emptyD));
    }
    const emptyDir = {
      read: (cb2) => cb2 ? cb2(null, null) : Promise.resolve(null),
      close: (cb2) => cb2 ? cb2(null) : Promise.resolve(),
      [Symbol.asyncIterator]: () => ({ next: () => Promise.resolve({ done: true }) }),
    };
    const wrappedCb = function(err, dir) {
      if (err && (err.code === 'EPERM' || err.code === 'EACCES')) return callback(null, emptyDir);
      return callback(err, dir);
    };
    return opts
      ? origOpendir.call(this, dirPath, opts, wrappedCb)
      : origOpendir.call(this, dirPath, wrappedCb);
  };
}

// Patch promises API
const fsp = fs.promises;
if (fsp) {
  const origReaddirP = fsp.readdir;
  fsp.readdir = async function(dirPath, ...args) {
    if (shouldBlock(dirPath)) return [];
    try { return await origReaddirP.call(this, dirPath, ...args); }
    catch (e) { if (e.code === 'EPERM' || e.code === 'EACCES') return []; throw e; }
  };

  const origOpendirP = fsp.opendir;
  if (origOpendirP) {
    fsp.opendir = async function(dirPath, ...args) {
      if (shouldBlock(dirPath)) return {
        read: () => Promise.resolve(null),
        close: () => Promise.resolve(),
        [Symbol.asyncIterator]: () => ({ next: () => Promise.resolve({ done: true }) }),
      };
      try { return await origOpendirP.call(this, dirPath, ...args); }
      catch (e) {
        if (e.code === 'EPERM' || e.code === 'EACCES') return {
          read: () => Promise.resolve(null),
          close: () => Promise.resolve(),
          [Symbol.asyncIterator]: () => ({ next: () => Promise.resolve({ done: true }) }),
        };
        throw e;
      }
    };
  }
}
