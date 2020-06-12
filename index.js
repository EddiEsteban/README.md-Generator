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

async function init() {
    const readMe = await makeReadMe
    fs.writeFileSync('README.md', JSON.stringify(readMe))
}

init();
