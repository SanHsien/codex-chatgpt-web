const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const manifest = require('../package.json');

test('modern packaging consumers resolve the reviewed override and retain matching APIs', () => {
  const range = manifest.overrides['minimatch@>=7.0.0 <11.0.1'];
  assert.equal(typeof range, 'string', 'modern minimatch consumers need a reviewed security override');
  assert.equal(range, '11.0.5', 'the modern line must resolve to the patched 11.0.5 release');
  const semver = require('semver');
  // filelist is a legacy consumer (minimatch 5, not overridden); the legacy test covers it.
  for (const consumer of ['app-builder-lib', '@electron/universal']) {
    const consumerRequire = createRequire(require.resolve(consumer));
    const mm = consumerRequire('minimatch');
    assert.ok(semver.satisfies(consumerRequire('minimatch/package.json').version, range), consumer);
    assert.equal(new mm.Minimatch('**/*.js', { dot: true }).match('dist/.hidden.js'), true);
    assert.deepEqual(mm.match(['app.js', 'app.txt'], '*.js'), ['app.js']);
  }
});

test('legacy packaging consumers retain callable minimatch and real archive/filter behavior', async () => {
  for (const consumer of ['@electron/asar', 'glob', 'dir-compare']) {
    const mm = createRequire(require.resolve(consumer))('minimatch');
    assert.equal(typeof mm, 'function', consumer);
    assert.equal(mm('app.js', '*.js'), true);
  }
  const scratch = mkdtempSync(join(tmpdir(), 'launcher-minimatch-'));
  const source = join(scratch, 'source');
  mkdirSync(source);
  writeFileSync(join(source, 'app.js'), 'module.exports = 1;');
  writeFileSync(join(source, 'ignored.txt'), 'ignored');
  try {
    const { FileMatcher } = require('app-builder-lib/out/fileMatcher');
    const matcher = new FileMatcher(source, join(scratch, 'out'), (p) => p, ['**/*.js']);
    const patterns = [];
    matcher.computeParsedPatterns(patterns);
    assert.ok(patterns.some((pattern) => pattern.match('app.js')));
    const { FileList } = require('filelist');
    const files = new FileList();
    const previousCwd = process.cwd();
    try {
      process.chdir(source);
      files.include('*.js');
      assert.deepEqual(files.toArray(), ['app.js']);
    } finally {
      process.chdir(previousCwd);
    }
    const glob = require('glob');
    assert.deepEqual(glob.sync('*.js', { cwd: source }), ['app.js']);
    const compared = require('dir-compare').compareSync(source, source, { includeFilter: '*.js' });
    assert.equal(compared.same, true);
    assert.equal(compared.equal, 1);
    const asar = require('@electron/asar');
    const archive = join(scratch, 'app.asar');
    await asar.createPackageWithOptions(source, archive, { unpack: '*.txt' });
    assert.equal(asar.extractFile(archive, 'app.js').toString(), 'module.exports = 1;');
    assert.equal(asar.statFile(archive, 'ignored.txt').unpacked, true);
    asar.uncacheAll();
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
