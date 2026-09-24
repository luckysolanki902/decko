/* Pyodide Web Worker - runs Python code in a separate thread */
/* Uses SharedArrayBuffer + Atomics for interactive stdin */
/* eslint-disable no-restricted-globals */

let pyodide = null;
let isLoading = false;
let stdinBuffer = null;
let statusView = null;
let lengthView = null;

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/';

function readStdin() {
  if (!stdinBuffer) return '\n';

  // Signal main thread that we need input
  Atomics.store(statusView, 0, 0); // 0 = waiting
  self.postMessage({ type: 'input-request' });

  // Block until main thread provides input
  Atomics.wait(statusView, 0, 0);

  // Read input from shared buffer
  const len = Atomics.load(lengthView, 0);
  const bytes = new Uint8Array(stdinBuffer, 8, len);
  const text = new TextDecoder().decode(bytes.slice());
  return text;
}

async function loadPyodideWorker() {
  if (pyodide) return pyodide;
  if (isLoading) return null;

  isLoading = true;
  self.postMessage({ type: 'status', status: 'loading' });

  try {
    importScripts(PYODIDE_CDN + 'pyodide.js');
    pyodide = await self.loadPyodide({
      indexURL: PYODIDE_CDN,
      stdout: (text) => self.postMessage({ type: 'stdout', text }),
      stderr: (text) => self.postMessage({ type: 'stderr', text }),
      stdin: readStdin,
    });

    isLoading = false;
    self.postMessage({ type: 'status', status: 'ready' });
    return pyodide;
  } catch (err) {
    isLoading = false;
    self.postMessage({ type: 'status', status: 'error', error: err.message });
    return null;
  }
}

function listFiles(dir) {
  try {
    const entries = pyodide.FS.readdir(dir).filter(e => e !== '.' && e !== '..');
    const files = [];
    for (const name of entries) {
      const fullPath = dir === '/' ? '/' + name : dir + '/' + name;
      try {
        const stat = pyodide.FS.stat(fullPath);
        const isDir = pyodide.FS.isDir(stat.mode);
        files.push({
          name,
          path: fullPath,
          isDir,
          size: isDir ? 0 : stat.size,
        });
      } catch (e) {
        // skip inaccessible entries
      }
    }
    return files;
  } catch (e) {
    return [];
  }
}

self.onmessage = async (event) => {
  const { type, code, packages } = event.data;

  if (type === 'init') {
    if (event.data.stdinBuffer) {
      stdinBuffer = event.data.stdinBuffer;
      statusView = new Int32Array(stdinBuffer, 0, 1);
      lengthView = new Int32Array(stdinBuffer, 4, 1);
    }
    loadPyodideWorker();
    return;
  }

  if (type === 'run') {
    const py = await loadPyodideWorker();
    if (!py) {
      self.postMessage({ type: 'error', error: 'Pyodide failed to load' });
      self.postMessage({ type: 'done', executionTime: 0 });
      return;
    }

    const startTime = performance.now();

    try {
      await py.loadPackagesFromImports(code).catch(() => {});
      const result = await py.runPythonAsync(code);
      const executionTime = performance.now() - startTime;

      if (result !== undefined && result !== null) {
        const resultStr = String(result);
        if (resultStr !== 'None') {
          self.postMessage({ type: 'result', value: resultStr });
        }
      }

      self.postMessage({ type: 'done', executionTime });
    } catch (err) {
      const executionTime = performance.now() - startTime;
      self.postMessage({ type: 'stderr', text: err.message });
      self.postMessage({ type: 'done', executionTime });
    }
  }

  if (type === 'install') {
    const py = await loadPyodideWorker();
    if (!py) {
      self.postMessage({ type: 'error', error: 'Pyodide failed to load' });
      return;
    }

    try {
      await py.loadPackage('micropip');
      const micropip = py.pyimport('micropip');
      for (const pkg of packages) {
        self.postMessage({ type: 'stdout', text: `Installing ${pkg}...\n` });
        await micropip.install(pkg);
        self.postMessage({ type: 'stdout', text: `\u2713 ${pkg} installed\n` });
      }
    } catch (err) {
      self.postMessage({ type: 'stderr', text: `Install error: ${err.message}\n` });
    }
  }

  if (type === 'reset') {
    if (pyodide) {
      pyodide.runPython('import sys\n_keep = set(sys.modules.keys())');
    }
    self.postMessage({ type: 'stdout', text: 'Environment reset.\n' });
  }

  // ── Filesystem operations ──

  if (type === 'fs-list') {
    const dir = event.data.dir || '/home/pyodide';
    const files = listFiles(dir);
    self.postMessage({ type: 'fs-list', dir, files });
  }

  if (type === 'fs-read') {
    try {
      const data = pyodide.FS.readFile(event.data.path);
      self.postMessage({ type: 'fs-read', path: event.data.path, data: data.buffer }, [data.buffer]);
    } catch (err) {
      self.postMessage({ type: 'fs-error', error: `Cannot read ${event.data.path}: ${err.message}` });
    }
  }

  if (type === 'fs-write') {
    try {
      const data = new Uint8Array(event.data.data);
      pyodide.FS.writeFile(event.data.path, data);
      self.postMessage({ type: 'fs-written', path: event.data.path, size: data.length });
    } catch (err) {
      self.postMessage({ type: 'fs-error', error: `Cannot write ${event.data.path}: ${err.message}` });
    }
  }

  if (type === 'fs-delete') {
    try {
      const stat = pyodide.FS.stat(event.data.path);
      if (pyodide.FS.isDir(stat.mode)) {
        pyodide.FS.rmdir(event.data.path);
      } else {
        pyodide.FS.unlink(event.data.path);
      }
      self.postMessage({ type: 'fs-deleted', path: event.data.path });
    } catch (err) {
      self.postMessage({ type: 'fs-error', error: `Cannot delete ${event.data.path}: ${err.message}` });
    }
  }
};
