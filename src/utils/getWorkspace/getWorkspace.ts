
export const getWorkspace = () => {
  return process.env.GITHUB_WORKSPACE || process.cwd();
}
