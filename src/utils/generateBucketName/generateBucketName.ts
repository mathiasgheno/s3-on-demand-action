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
    let name = `${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}-${process.env.ENVIRONMENT}`;
    if(isBiggerThanCertificationLimitation(name)) {
      name = `${githubNameOwner}-${projectAbbreviated}-${branchWithoutInvalidCharacter}-${process.env.ENVIRONMENT}`
    }
    return name;
  } else {
    let name = `${githubNameOwner}-${projectAbbreviated}-${branchWithoutInvalidCharacter}`;
    if(isBiggerThanCertificationLimitation(name)) {
      name = `${githubNameOwner}-${projectAbbreviated}-${branchWithoutInvalidCharacter}`;
    }
    return name;
  }
}
