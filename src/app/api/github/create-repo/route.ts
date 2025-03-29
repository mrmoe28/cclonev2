import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
  try {
    const { files } = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not provided' },
        { status: 401 }
      );
    }

    const octokit = new Octokit({ auth: token });

    // Create a new repository
    const repoName = `ai-generated-code-${Date.now()}`;
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'Generated using AI Code Generator',
      private: false,
      auto_init: true,
    });

    // Create files in the repository
    for (const [filename, content] of Object.entries(files)) {
      await octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: repoName,
        path: filename,
        message: `Add ${filename}`,
        content: Buffer.from(content as string).toString('base64'),
      });
    }

    return NextResponse.json({
      url: repo.html_url,
      message: 'Repository created successfully',
    });
  } catch (error) {
    console.error('Error creating repository:', error);
    return NextResponse.json(
      { error: 'Failed to create repository' },
      { status: 500 }
    );
  }
} 