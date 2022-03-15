import * as core from '@actions/core'
import * as github from "@actions/github";
import { RequestError } from "@octokit/request-error";

async function run(): Promise<void> {
    const pullNumber = parseInt(core.getInput('pull-number'), 10)
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    if (!Number.isNaN(pullNumber)) {
      try {
        await octokit.pulls.createReview({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: pullNumber,
          event: 'APPROVE'
        })
      } catch (error) {
        if (error instanceof RequestError) {
          core.setFailed(`Error (code ${error.status}): ${error.message}`);
        } else {
          core.setFailed('Unknown Error')
        }
      }
    } else {
      core.setFailed('PR number could not be parsed, please check the input again')
    }
}

run()
