/* ============================================================
   Pruebas de la API (casos de la sección 9 de api-rest-express.md)
   Ejecutar con: npm test
   Usa el test runner y fetch que ya trae Node 18+, sin librerías extra.
   ============================================================ */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

let server;
let base;

before(async () => {
  // Puerto 0: el sistema elige uno libre, así no choca con el servidor de desarrollo
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
});

async function pedir(ruta) {
  const respuesta = await fetch(base + ruta);
  const tipo = respuesta.headers.get('content-type') || '';
  const cuerpo = tipo.includes('application/json') ? await respuesta.json() : await respuesta.text();
  return { estado: respuesta.status, cuerpo };
}

test('GET /api/heroes → 200 y 8 héroes', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes');
  assert.equal(estado, 200);
  assert.equal(cuerpo.length, 8);
});

test('GET /api/heroes?editorial=marvel → 200 y 4 héroes de Marvel', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes?editorial=marvel');
  assert.equal(estado, 200);
  assert.equal(cuerpo.length, 4);
  assert.ok(cuerpo.every((h) => h.editorial === 'marvel'));
});

test('GET /api/heroes?editorial=DC → 200 y 4 héroes (no distingue mayúsculas)', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes?editorial=DC');
  assert.equal(estado, 200);
  assert.equal(cuerpo.length, 4);
  assert.ok(cuerpo.every((h) => h.editorial === 'dc'));
});

test('GET /api/heroes?editorial=image → 400, editorial inválida', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes?editorial=image');
  assert.equal(estado, 400);
  assert.deepEqual(cuerpo, { error: 'Editorial inválida' });
});

test('GET /api/heroes/superman → 200 y el objeto de Superman', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes/superman');
  assert.equal(estado, 200);
  assert.equal(cuerpo.id, 'superman');
  assert.equal(cuerpo.nombre, 'Superman');
});

test('GET /api/heroes/thor → 404, héroe no encontrado', async () => {
  const { estado, cuerpo } = await pedir('/api/heroes/thor');
  assert.equal(estado, 404);
  assert.deepEqual(cuerpo, { error: 'Héroe no encontrado' });
});

test('GET /api/villanos → 404, ruta no encontrada', async () => {
  const { estado, cuerpo } = await pedir('/api/villanos');
  assert.equal(estado, 404);
  assert.deepEqual(cuerpo, { error: 'Ruta no encontrada' });
});

test('GET / → sirve index.html', async () => {
  const { estado, cuerpo } = await pedir('/');
  assert.equal(estado, 200);
  assert.match(cuerpo, /Icons Archive/);
});

test('Los archivos del backend no se publican', async () => {
  const { estado } = await pedir('/server/package.json');
  assert.equal(estado, 404);
});

test('Tampoco con la ruta codificada o con mayúsculas', async () => {
  for (const ruta of ['/%73erver/package.json', '/SERVER/package.json', '/%64ocumentacion/contexto.md', '/server%5Cpackage.json', '/README.md']) {
    const { estado } = await pedir(ruta);
    assert.equal(estado, 404, ruta);
  }
});

test('Se publican las páginas, estilos, scripts e imágenes', async () => {
  for (const ruta of ['/spider-man.html', '/styles.css', '/bootstrap-layer.css', '/script.js', '/img/background.jpg', '/img/green%20lantern/hal%20jordan.webp']) {
    const { estado } = await pedir(ruta);
    assert.equal(estado, 200, ruta);
  }
});

test('POST con JSON mal formado → 400, no 500', async () => {
  const respuesta = await fetch(base + '/api/heroes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{mal json'
  });
  assert.equal(respuesta.status, 400);
});
