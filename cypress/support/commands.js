// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('returnIDfromDetails', (details) => {
    //Easy to follow parsing of details into ID
    let first = details.Name.slice(0,2);
    let second = details.Name.substring(details.Name.indexOf(" ") + 1,details.Name.indexOf(" ") + 3);
    let year = details.DOB.slice(0,4);
    let gender = details.Gender.slice(0,1);
    
    let id = first + second + year + gender;

    //Log for feedback so tester can easily find where things may be hosed
    cy.log("ID generated from command: " + id);
})

Cypress.Commands.add('searchID', (patientID) => {
    //Select the box and enter incorrect ID
    cy.get('input').type(patientID)
    //Press Find Patient button
    cy.get('button.FindPatient').click()
    //Ensure patient info has loaded and become visible
    cy.get('.PatientInfoContianer', {timeout: 10000}).should('be.visible')
})