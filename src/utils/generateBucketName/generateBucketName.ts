import log from 'loglevel';
import * as github from "@actions/github";

function getBranchFromRef(ref: string): string {
  let branchName = '';
  if (ref.indexOf('refs/heads/') > -1) {
    branchName = ref.slice('refs/heads/'.length);
  }
  return branchName.toLowerCase();
}

export function generateBucketName() {
  const githubNameOwner = github.context.repo.owner;
  const projectLower = github.context.repo.repo;
  log.info('Ref from GitHub: ', github.context.ref);
  const branchLower = getBranchFromRef(github.context.ref);
  const branchWithoutInvalidCharacter = branchLower.replace(/\//g, '-');
  return `${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}`;
}
