const inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')

let [titleId, descId, installId, usageId, licenseId, 
    contribId, testsId, contactId] 
    = ['title', 'desc', 'install', 'usage', 'license',
    'contrib', 'tests', 'contact']

const shellify = string => `\`\`\`sh\n${string}\n\`\`\``

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
        message: 'Are you accepting new contributors?'
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
        message: `Do you want to provide your public github information for the questions section?`
    },
    {
        name: contactId,
        message: `Provide your github username.`,
        default: `EddiEsteban`,
        when: answers => answers.contactBool
    },
]

const makeReadMe = inquirer.prompt(questions)

function tocLinker(sectionId){
    tocIds.push(sectionId)
    return `<a id=toc-${sectionId}></a>`
}

const tocHeaders = []
const tocIds = []

function sectionGenerator(sectionHeader, section, sectionId){
    tocHeaders.push(sectionHeader)
    return `${tocLinker(sectionId)}\n## ${sectionHeader}\n${section}\n`
}

const tocGenerator = ()=> {let toc = ''; 
    tocHeaders.forEach((header, iter)=>toc += `${iter+1}. [${header}](#toc-${tocIds[iter]})\n`); 
    return toc
}

async function init() {
    const readMeJSON = await makeReadMe
    let {title, desc, install, usage, license, contrib, tests, contact} = readMeJSON
    title = `# ${title}\n`
    desc = sectionGenerator('Description', desc, descId)
    install = sectionGenerator('Installation', shellify(install), installId)
    usage = sectionGenerator('Usage', shellify(usage), usageId)
    license = sectionGenerator('License', license, licenseId)
    contrib = sectionGenerator('Contributing', contrib, contribId)
    tests = sectionGenerator('Tests', tests, testsId)
    contact = sectionGenerator('Questions', contact, contactId)
    const readMe = `${title}${tocGenerator()}${desc}${install}${usage}`+
        `${license}${contrib}${tests}${contact}`
        
        
    fs.writeFileSync('README.md', readMe)
}

init();
