import * as github from "@actions/github";

function getBranchFromRef(ref: string): string {
  let branchName = '';
  if (ref.indexOf('refs/heads/') > -1) {
    branchName = ref.slice('refs/heads/'.length);
  }
  return branchName.toLowerCase();
}

// console.log(getBranchFromRef('/refs/heads/master'));

export function generateBucketName() {
  const githubNameOwner = github.context.repo.owner;
  const projectLower = github.context.repo.repo;
  console.info('Ref from GitHub: ', github.context.ref);
  const branchLower = getBranchFromRef(github.context.ref);
  const branchWithoutInvalidCharacter = branchLower.replace(/\//g, '-');
  return `${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}`;
}
