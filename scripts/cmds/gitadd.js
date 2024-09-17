const axios = require('axios');
const path = require('path');

module.exports = {
    config: {
        name: "gitadd",
        version: "1.0",
        author: "Raphael ilom",
        countDown: 5,
        role: 0,
        shortDescription: "Add a new file to a GitHub repo",
        longDescription: "Add a new file to a private GitHub repository using a file name and code content or a URL to the code.",
        category: "utility",
        guide: {
            vi: "Sử dụng lệnh như sau:\ngitadd <file name>.js <code url | code>",
            en: "Use the command as follows:\ngitadd <file name>.js <code url | code>"
        }
    },
    onStart: async function ({ api, message, args, event }) {
        if (args.length < 2) {
            return message.reply("Please provide the file name and code content or code URL.");
        }

        const fileName = args[0];
        if (!fileName.endsWith('.js')) {
            return message.reply("The file name must end with '.js'.");
        }
        const codeSource = args.slice(1).join(" ");
        const githubToken = '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'; //add your GitHub token 
        const owner = 'Isaiah-ilom'; //add your GitHub username 
        const repo = 'https://github.com/Isaiah-ilom/Ilom';  //add your repo name
        const branch = 'main';
        const filePath = path.join('scripts', 'cmds', fileName);

        try {
            let code;

            if (codeSource.startsWith('http://') || codeSource.startsWith('https://')) {
                const response = await axios.get(codeSource);
                code = response.data;
            } else {
                code = codeSource;
            }

            const { data: refData } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });
            const latestCommitSha = refData.object.sha;

            const { data: commitData } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });
            const baseTreeSha = commitData.tree.sha;

            const { data: blobData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
                content: code,
                encoding: 'utf-8'
            }, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });

            const { data: treeData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
                base_tree: baseTreeSha,
                tree: [
                    {
                        path: filePath,
                        mode: '100644',
                        type: 'blob',
                        sha: blobData.sha
                    }
                ]
            }, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });

            const { data: newCommitData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
                message: `Added ${fileName} `,
                tree: treeData.sha,
                parents: [latestCommitSha]
            }, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });

            await axios.patch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
                sha: newCommitData.sha
            }, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });

            message.reply(` ${fileName} added`);
        } catch (error) {
            console.error(error);
            message.reply("An error occurred while adding the file. Please try again.");
        }
    }
};
