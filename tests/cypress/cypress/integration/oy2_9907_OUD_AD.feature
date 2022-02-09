Feature: Verify and fill out OUD-AD measurement

      Scenario: User logins to QMR and verifies fill out the OUD-AD measurement page for No option
        Given user visits QMR home page
        When  login as state user two
        And   user click on link Adult Core Set Measures
        And   user click on link OUD-AD
        And   user can click on No option for reporting on this measure
       

    Scenario: User logins to QMR and verifies fill out the OUD-AD measurement page for Yes option
            Given user visits QMR home page
            When  login as state user two
            And   user click on link Adult Core Set Measures
            And   user click on link OUD-AD
            And   user can click on Yes option for Are you reporting on this measure
            And   upload attachment pdf
            And   upload attachment text file
            And   upload attachment picture
            And   user enters inputs to the Rate field and verify the correct Rate output
            And   button on the page is clickable 

    Scenario: Verify Numerical Value/Calculations with Administrative Data option
        Given user visits QMR home page
        When login as state user
        Then verify Core Set Measures is displayed
        Then Click on Adult Core Set Measures
        Then verify url contains ACS
        And  user click on link OUD-AD
        And Click on National Committee for Quality Assurance Radio Button
        Then Click on Administrative Data
        Then Click on Medicaid Management Information System
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 111111
        And verify error message is displayed
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 411111
        And verify that only one number after decimal can populate for auto calculated rate exists
        And clear numerator input box
        And clear Denominator input box
        And type 8 digits numerator
        And type 8 digits Denominator
        # And verify error message is not displayed
        And clear numerator input box
        And clear Denominator input box
        And type letters numerator
        And type letters Denominator
        # And verify there is no value in rate box
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 411111
        And input text in rate box
    # And verify user cannot manually override enter rate exists
    Scenario: Verify Numerical Value/Calculations with Administrative Data and Other Data Source options
        Given user visits QMR home page
        When login as state user
        Then verify Core Set Measures is displayed
        Then Click on Adult Core Set Measures
        Then verify url contains ACS
        And   user click on link OUD-AD
        And Click on National Committee for Quality Assurance Radio Button
        Then Click on Administrative Data
        Then Click on Medicaid Management Information System
        Then Click on Other Data Source Radio Button
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 111111
        And verify error message is displayed
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 411111
        And verify that only one number after decimal can populate for auto calculated rate exists
        And clear numerator input box
        And clear Denominator input box
        And type 8 digits numerator
        And type 8 digits Denominator
        # And verify error message is not displayed
        And clear numerator input box
        And clear Denominator input box
        And type letters numerator
        And type letters Denominator
        # And verify there is no value in rate box
        And clear numerator input box
        And clear Denominator input box
        And type numerator 321111
        And type Denominator 411111
        # And verify user can manually override enter rate exists