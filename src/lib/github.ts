import { Octokit } from "@octokit/rest";

// Ensure environment variable is set
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONOREPO_NAME = process.env.GITHUB_MONOREPO_NAME; // Removed hardcoded fallback

/**
 * Pushes files to a specific folder within a central repository.
 * If the repository doesn't exist, it creates it.
 * @param folderName The name of the subfolder for this POC (e.g. "sap-sync").
 * @param files An array of file objects { path: string, content: string | Buffer }.
 * @param description Description of the POC (used for commit message).
 * @returns The full URL to the folder in the repository.
 */
export async function createRepoAndPush(
  folderName: string,
  files: Array<{ path: string; content: string | Buffer }>,
  description: string = "New MuleSoft POC",
) {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not defined in environment variables.");
  }
  if (!MONOREPO_NAME) {
    throw new Error("GITHUB_MONOREPO_NAME is not defined in environment variables.");
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    request: { timeout: 60000 }, // Increased timeout to 60s
  });
  const repoName = MONOREPO_NAME;

  try {
    // Helper for retrying API calls (Handles transient TLS Socket Drops)
    const retry = async <T>(
      fn: () => Promise<T>,
      retries = 3,
      delay = 1000,
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error: any) {
        // Do not retry predictable 404 Not Found errors (like checking if repo exists)
        if (error.status === 404) throw error;

        if (retries <= 0) throw error;
        console.log(
          `[Retry] Network/API Error: ${error.message}. Retrying in ${delay}ms...`,
        );
        await new Promise((res) => setTimeout(res, delay));
        return retry(fn, retries - 1, delay * 2);
      }
    };

    let repo: any;
    let owner: string;
    let defaultBranch = "main";

    // 1. Check if the Monorepo exists
    try {
      const { data: user } = await retry(() =>
        octokit.users.getAuthenticated(),
      );
      owner = user.login;

      console.log(`Checking for existing repository: ${owner}/${repoName}`);
      const { data: existingRepo } = await retry(() =>
        octokit.repos.get({ owner, repo: repoName }),
      );
      repo = existingRepo;
      defaultBranch = repo.default_branch;
    } catch (e: any) {
      if (e.status === 404) {
        // Create the repo if it doesn't exist
        console.log(`Repository ${repoName} not found. Creating it...`);
        const { data: newRepo } = await retry(() =>
          octokit.repos.createForAuthenticatedUser({
            name: repoName,
            description: "Centralized Library of MuleSoft Proofs of Concept",
            private: process.env.GITHUB_PRIVATE === "true",
            auto_init: true, // Initialize with README
          }),
        );
        repo = newRepo;
        owner = newRepo.owner.login;
        defaultBranch = newRepo.default_branch;

        // Wait briefly for GitHub to finish asynchronous auto-init before getting Ref
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        throw e;
      }
    }

    // 2. Get the latest commit SHA
    const { data: ref } = await retry(() =>
      octokit.git.getRef({
        owner,
        repo: repoName,
        ref: `heads/${defaultBranch}`,
      }),
    );
    const latestCommitSha = ref.object.sha;

    // 3. Create Blobs & Build Tree Items
    console.log(`Uploading ${files.length} files to folder '${folderName}'...`);
    const treeItems: any[] = [];

    // Create blobs sequentially for maximum stability
    let uploadedCount = 0;
    for (const file of files) {
      const isBuffer = Buffer.isBuffer(file.content);
      const content = isBuffer
        ? (file.content as Buffer).toString("base64")
        : Buffer.from(file.content).toString("base64");

      try {
        const { data: blob } = await retry(() =>
          octokit.git.createBlob({
            owner,
            repo: repoName,
            content: content,
            encoding: "base64",
          }),
        );

        treeItems.push({
          path: `${folderName}/${file.path}`,
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        });
        uploadedCount++;
        if (uploadedCount % 5 === 0)
          console.log(`Uploaded ${uploadedCount}/${files.length} files...`);
      } catch (e) {
        console.error(`Failed to upload ${file.path}, skipping...`);
        // Allow partial failure? Or throw? Throwing is safer for consistency.
        throw e;
      }
    }

    // 4. Create a Tree (linking new files to the existing structure)
    const { data: tree } = await retry(() =>
      octokit.git.createTree({
        owner,
        repo: repoName,
        base_tree: latestCommitSha,
        tree: treeItems,
      }),
    );

    // 5. Create a Commit
    const { data: newCommit } = await retry(() =>
      octokit.git.createCommit({
        owner,
        repo: repoName,
        message: `Add POC: ${folderName} - ${description}`,
        tree: tree.sha,
        parents: [latestCommitSha],
      }),
    );

    // 6. Push (Update Ref)
    await retry(() =>
      octokit.git.updateRef({
        owner,
        repo: repoName,
        ref: `heads/${defaultBranch}`,
        sha: newCommit.sha,
      }),
    );

    const repoUrl = `${repo.html_url}/tree/${defaultBranch}/${folderName}`;
    console.log(`Successfully pushed to ${repoUrl}`);

    return {
      url: repoUrl,
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: owner,
    };
  } catch (error: any) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    throw new Error(`Failed to push to repository: ${error.message}`);
  }
}

/**
 * Fetches the file structure of a specific folder in the monorepo.
 * @param folderName The path to the folder (e.g. "sap-sync").
 * @returns An array of file items.
 */
export async function getRepoTree(folderName: string) {
  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN is missing");
    throw new Error("GITHUB_TOKEN is not defined.");
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    request: { timeout: 60000 },
  });
  const repoName = MONOREPO_NAME;

  try {
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // 1. Get the default branch (usually 'main')
    const { data: repo } = await octokit.repos.get({ owner, repo: repoName });
    const defaultBranch = repo.default_branch;

    // 2. Get the specific tree for that branch
    // Note: Using the Git Tree API allows recursive fetching
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
    });

    const treeSha = ref.object.sha;

    console.log(
      `[getRepoTree] Fetching recursive tree for ${owner}/${repoName} at ${treeSha}`,
    );

    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo: repoName,
      tree_sha: treeSha,
      recursive: "true",
    });

    // 3. Filter for files inside our specific folder
    // The path in the tree will be like "my-poc/src/main/mule/api.xml"
    const relevantItems = treeData.tree.filter(
      (item: any) =>
        item.path.startsWith(folderName + "/") || item.path === folderName,
    );

    console.log(
      `[getRepoTree] Found ${relevantItems.length} items in folder '${folderName}'`,
    );

    return relevantItems.map((item: any) => ({
      name: item.path.split("/").pop(), // Extract just the filename
      path: item.path, // Full path relative to repo root
      type: item.type === "blob" ? "file" : "dir",
      size: item.size,
      url: item.url,
    }));
  } catch (error: any) {
    console.error(
      "[getRepoTree] Error fetching recursive tree:",
      error.response?.data || error.message,
    );
    return [];
  }
}

/**
 * Deletes a POC folder from the monorepo.
 * @param folderName The name of the subfolder for this POC (e.g. "sap-sync").
 * @returns boolean indicating success.
 */
export async function deletePOCFolder(folderName: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not defined in environment variables.");
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    request: { timeout: 60000 },
  });
  const repoName = MONOREPO_NAME;

  try {
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // 1. Get the default branch
    const { data: repo } = await octokit.repos.get({ owner, repo: repoName });
    const defaultBranch = repo.default_branch;

    // 2. Get the specific tree for that branch
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
    });

    const treeSha = ref.object.sha;

    // 3. Get recursive tree
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo: repoName,
      tree_sha: treeSha,
      recursive: "true",
    });

    // 4. Find all files in this folder
    const prefix = folderName + "/";
    const filesToDelete = treeData.tree.filter(
      (item: any) => item.path.startsWith(prefix) || item.path === folderName,
    );

    if (filesToDelete.length === 0) {
      console.log(`[deletePOCFolder] No files found for folder: ${folderName}`);
      return true; // Already deleted or doesn't exist
    }

    // 5. Create tree with null shas for the files (this marks them for deletion)
    // Note: we only need to null out the files, deleting the directory is implicit in git
    const treeItems = filesToDelete
      .filter((item) => item.type === "blob")
      .map((item: any) => ({
        path: item.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: null,
      }));

    // 6. Create the new Tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo: repoName,
      base_tree: treeSha,
      tree: treeItems,
    });

    // 7. Create a Commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo: repoName,
      message: `Delete POC: ${folderName}`,
      tree: newTree.sha,
      parents: [treeSha],
    });

    // 8. Update Ref
    await octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
      sha: newCommit.sha,
    });

    console.log(`[deletePOCFolder] Successfully deleted folder ${folderName}`);
    return true;
  } catch (error: any) {
    console.error(
      "[deletePOCFolder] Error:",
      error.response?.data || error.message,
    );
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
}
