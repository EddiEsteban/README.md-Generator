const inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')
const axios = require('axios')

let [titleId, descId, installId, usageId, licenseId, 
    contribId, testsId, contactId] 
    = ['title', 'desc', 'install', 'usage', 'license',
    'contrib', 'tests', 'contact']

const shellify = string => `\`\`\`sh\n${string}\n\`\`\``
function githubName(string){
    let output = ''
    const githubRegex = /[A-Za-z0-9_.-]/
    function readd(char){
        if (githubRegex.test(char)) {output += char}
        else {output += '-'}
    }
    [...string].forEach(char => readd(char))
    output = output.replace(/(-)\1+/g, '$1')
    return output
}

const questions = [
    {
        type: 'input', //input is default type
        name: titleId,
        message: `Provide the ${chalk.red(`title`)} of your project.`,
        default: `Untitled Project`
    },
    {
        name: descId,
        message: `Provide a succinct ${chalk.red(`description`)} of your project.`,
        default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac posuere lorem. Praesent porta, purus et commodo tempus, mi leo blandit orci, eget efficitur quam odio a lectus. Nulla vehicula scelerisque est eget efficitur.`
    },
    {
        name: installId,
        message: `Provide ${chalk.red(`installation`)} instructions.`,
        default: `npm install <your package name>`
    },
    {
        name: usageId,
        message: `Provide ${chalk.red(`usage`)} instructions.`,
        default: `node index.js`
    },
    {
        name: licenseId,
        message: `Provide a ${chalk.red(`license`)} for your project.`,
        default: 'MIT'
    },
    {
        type: 'confirm',
        name: 'contribBool',
        message: `Are you accepting new ${chalk.magenta(`contributors`)}?`
    },
    {
        name: contribId,
        message: `Provide instructions for ${chalk.red(`contributing`)}.`,
        default: `Contact the repository owner if you would like to contribute.`,
        when: answers => answers.contribBool
    },
    {
        name: testsId,
        message: `Provide ${chalk.red(`tests`)}: examples of how to use your project, and the expectant output.`,
        default: `Test cases go here`
    },
    {
        type: 'confirm',
        name: 'contactBool',
        message: `Do you want to provide your public github information for the ${chalk.magenta(`questions`)} section?`
    },
    {
        name: contactId,
        message: `Provide your github username.`,
        default: `YourUsername`,
        when: answers => answers.contactBool
    },
]

const makeReadMe = inquirer.prompt(questions)

function tocLinker(sectionId){
    tocIds.push(sectionId)
    return `<a id='toc-${sectionId}'></a>`
}

const tocHeaders = []
const tocIds = []

function sectionGenerator(sectionHeader, section, sectionId){
    tocHeaders.push(sectionHeader)
    return `\n${tocLinker(sectionId)}\n## ${sectionHeader}\n${section}\n`
}

const tocGenerator = ()=> {let toc = ''; 
    tocHeaders.forEach((header, iter)=>toc += `\n${iter+1}. [${header}](#toc-${tocIds[iter]})\n`); 
    return toc
}

async function init() {
    const readMeJSON = await makeReadMe

    

    let {title, desc, install, usage, license, contribBool, contrib, tests, contactBool, contact} = readMeJSON
    
    if (!contribBool) {contrib = `This repository is not accepting contributors.`}
    if (!contactBool) {contact = `Please direct any questions, concerns, and compliments to the contributors of this repo.`}

    let badges = 
        `![Forks](https://img.shields.io/github/forks/${contact}/${githubName(title)}) `+
        `![Stars](https://img.shields.io/github/stars/${contact}/${githubName(title)}) `+
        `![License](https://img.shields.io/github/license/${contact}/${githubName(title)}) `+
        `\n`

    title = `\n# ${title}\n`
    desc = sectionGenerator('Description', desc, descId)
    install = sectionGenerator('Installation', shellify(install), installId)
    usage = sectionGenerator('Usage', shellify(usage), usageId)
    license = sectionGenerator('License', license, licenseId)
    contrib = sectionGenerator('Contributing', contrib, contribId)
    tests = sectionGenerator('Tests', tests, testsId)

    githubUrl = `https://api.github.com/users/${contact}`

    const githubData = await axios.get(githubUrl)
        .then(response => response.data)

    let questions = `![Profile picture of ${contact}](${githubData.avatar_url})\n\n`+
        `Please direct any questions, concerns, and compliments to [${contact}](${githubData.html_url})\n ` 
        //accessing email requires authentication, and the password method is deprecated. See: https://developer.github.com/changes/2020-02-14-deprecating-password-auth/
    questions = sectionGenerator('Questions', questions, contactId)



    const readMe = `${badges}${title}${tocGenerator()}${desc}${install}${usage}`+
        `${license}${contrib}${tests}${questions}`
        
        
    fs.writeFileSync('README.md', readMe)
}

init();
