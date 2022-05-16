import log from 'loglevel';
import * as github from "@actions/github";

function getBranchFromRef(ref: string) {
  let branchName = '';
  if (ref.indexOf('refs/heads/') > -1) {
    branchName = ref.slice('refs/heads/'.length);
  }
  return branchName.toLowerCase();
}

function getAbbreviationsOfProject(project: string) {
  return project.includes('-')
    ? project
      .split('-')
      .map(e => e[0])
      .join('')
    : project.slice(0, 5);
}

function isBiggerThanCertificationLimitation(bucket: string) {
  const AWS_CERTIFICATION_LIMIT_CARACTERS = 64;
  return bucket.length > AWS_CERTIFICATION_LIMIT_CARACTERS
}

// see: https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(string: string) {
  let hash = 5381;
  let i    = string.length;

  while(i) {
    hash = (hash * 33) ^ string.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

/**
 * @description
 *
 * This function will generate a bucket name based on: Owner, Repo Name, Branch name.
 * If you configured `ENVIRONMENT` then this will be used as sufix.
 *
 * Example: mathiasgheno-s3-on-demand-action-feature-a-tst
 *
 */
export function generateBucketName() {
  const githubNameOwner = github.context.repo.owner;
  const projectLower = github.context.repo.repo;
  const projectAbbreviated = getAbbreviationsOfProject(projectLower);

  log.info('Ref from GitHub: ', github.context.ref);
  const branchLower = getBranchFromRef(github.context.ref);
  const branchWithoutInvalidCharacter = branchLower.replace(/\//g, '-');

  if(process.env.ENVIRONMENT) {
    let url_base = hash(`${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}`);
    log.debug(url_base);
    return `${url_base}-${process.env.ENVIRONMENT}`
  } else {
    const url_base = hash(`${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}`)
    log.debug(url_base);
    return `${url_base}`;
  }
}
