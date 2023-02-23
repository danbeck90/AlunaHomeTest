describe("Home Test", () => {
    before(function () {
        //Getting Input data
        cy.fixture('example').then(function(data){
            this.pData = data.PatientDetails;
            cy.log(this.pData.Name);
        })
        //Get desired identifier using custom command
        this.patientID = cy.returnIDfromDetails(this.pData)
        //Set a bad ID in one location
        this.badID = 'tHi$ Is @ BaD 1D';
    })
    
    it('First exercise', function () {
        //GET request to API and handle response
        cy.request('/patients/identifier?name='+this.pData.Name+'&dob='+this.pData.DOB+'&gender='+this.pData.Gender).then(
            (response) => {
                //Validate Response
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('identifier',this.patientID)
            }
        )      
    })

    it('Second exercise', function () {
        //Check for 200 when a proper ID is saved
        cy.request('POST', '/identity', this.patientID).then(
            (response) => {
                //Validate Response
                expect(response.status).to.eq(200)
            }
        )
        //Check for 500 when an Improper ID is sent
        cy.request('POST', '/identity', this.badID).then(
            (response) => {
                //Validate Response
                expect(response.status).to.eq(500)
            }
        )
        //Check for 409 when the ID already exists
        cy.request('POST', '/identity', this.patientID).then(
            (response) => {
                //Validate Response
                expect(response.status).to.eq(409)
            }
        )

        //Check we can properly recieve the full Patient Identity from the identifier
        cy.request('/identity?identifier='+this.patientID).then(
            (response) => {
                //Validate Response
                expect(response.body).to.have.property('identifier',this.patientID)
            }
        )  
    })

    it('Third Exercise', function () {
        //Formatted data for below
        let PatientInfoString = this.pData.Name + '\n' + this.pData.DOB + '\n' + this.pData.Gender
        
        //Navigate to URL
        cy.visit('https://DashBoardScreen.com')
        //Use custom command to enter BAD ID and ensure we are ready to check info
        cy.searchID(this.badID)
        //Expect no patient matches the identifier
        cy.get('.PatientInfoHeader').should('have.text','No patient matches the identifier')
        //Expect ID returned
        cy.get('.PatientInfoData').should('have.text',this.badID)

        //Click Back button
        cy.get('button.Back').click()

        //Use custom command to enter GOOD ID and ensure we are ready to check info
        cy.searchID(this.patientID)
        //Expect patient found
        cy.get('.PatientInfoHeader').should('have.text','Patient found')
        //Expect ID returned
        cy.get('.PatientInfoData').should('have.text',PatientInfoString)

    })
})