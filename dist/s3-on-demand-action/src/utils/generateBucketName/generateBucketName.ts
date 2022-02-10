
export function generateBucketName(project: string, branch: string) {
  const githubNameOwner = 'mathias-gheno'; // TODO get by .env or by githubaction toolkit
  const projectLower = project.toLowerCase();
  const branchLower = branch.toLowerCase();
  const branchWithoutInvalidCharacter = branchLower.replace(/\//g, '-');
  return `${githubNameOwner}-${projectLower}-${branchWithoutInvalidCharacter}`;
}
