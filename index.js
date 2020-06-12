// The README will be populated with the following:

// * At least one badge
// * Project title
// * Description
// * Table of Contents
// * Installation
// * Usage
// * License
// * Contributing
// * Tests
// * Questions
//   * User GitHub profile picture
//   * User GitHub email

const inquirer = require('inquirer')
const fs = require('fs')

const questions = [
    {
        type: 'input', //input is default type
        name: 'title',
        message: 'Provide the title of your project.'
    },
    {
        name: 'desc',
        message: 'Provide a succinct description of your project.'
    },
    {
        name: 'install',
        message: 'Provide installation instructions.'
    },
    {
        name: 'usage',
        message: 'Provide usage instructions.'
    },
    {
        name: 'license',
        message: 'Provide a license for your project.',
        default: 'MIT'
    },
    {
        type: 'confirm',
        name: 'contribBool',
        message: 'Are you accepting new contributors?'
    },
    {
        name: 'contrib',
        message: 'Provide instructions for contributing.',
        when: (answers) => answers.contribBool
    },
    {
        name: 'tests',
        message: 'Provide examples of how to use your project, and the expectant output.'
    },
    {
        name: 'contact',
        message: 'Provide your github username.'
    },
]

const makeReadMe = inquirer.prompt(questions)

const varToString = varObj => Object.keys(varObj)[0]

function tocLinker(section){
    sectionId = varToString({section})
    tocIds.push(sectionId)
    return `<a id=toc-${sectionId}></a>`
}

const tocHeaders = []
const tocIds = []

function sectionGenerator(sectionHeader, section){
    tocHeaders.push(sectionHeader)
    return `${tocLinker(section)}\n## ${sectionHeader}\n${section}\n`
}

const tocGenerator = ()=> {let toc = ''; 
    tocHeaders.forEach((header, iter)=>toc += `${iter+1}. [${header}](#toc-${tocIds[iter]})\n`); 
    return toc
}

async function init() {
    const readMeJSON = await makeReadMe
    let {title, desc, install, usage, license, contrib, tests, contact} = readMeJSON
    title = `# ${title}\n`
    desc = sectionGenerator('Description', desc)
    install = sectionGenerator('Installation', install)
    usage = sectionGenerator('Usage', usage)
    license = sectionGenerator('License', license)
    contrib = sectionGenerator('Contributing', contrib)
    tests = sectionGenerator('Tests', tests)
    contact = sectionGenerator('Questions', contact)
    const readMe = `${title}${tocGenerator()}${desc}${install}${usage}`+
        `${license}${contrib}${tests}${contact}`
        
        
    fs.writeFileSync('README.md', readMe)
}

init();
