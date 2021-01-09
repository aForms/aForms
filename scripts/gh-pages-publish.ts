const { cd, exec, echo, touch } = require('shelljs');
import { readFileSync } from 'fs';
const url = require('url');

let repoUrl;
const pkg = JSON.parse(readFileSync('package.json') as any);
if (typeof pkg.repository === 'object') {
    if (!pkg.repository.hasOwnProperty('url')) {
        throw new Error('URL does not exist in repository section');
    }
    repoUrl = pkg.repository.url;
} else {
    repoUrl = pkg.repository;
}

const parsedUrl = url.parse(repoUrl);
const repository = (parsedUrl.host || '') + (parsedUrl.path || '');

if (repository) {
  echo('Deploying docs!!!');
  cd('docs');
  touch('.nojekyll');
  exec('git init');
  exec('git add .');
  exec('git commit -m "docs(docs): update gh-pages"');
  exec(
    `git push --force --quiet "https://${repository}" main:gh-pages`
  );
  echo('Docs deployed!!');
} else {
    echo('Missing repository url.');
}
