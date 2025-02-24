const guidedTourLocators = require("../../../../locators/GuidedTour.json");
const onboardingLocators = require("../../../../locators/FirstTimeUserOnboarding.json");
const commonlocators = require("../../../../locators/commonlocators.json");
const explorerLocators = require("../../../../locators/explorerlocators.json");

describe("Guided Tour", function() {
  it("Guided tour should work when started from the editor", function() {
    cy.generateUUID().then((uid) => {
      cy.Signup(`${uid}@appsmith.com`, uid);
    });
    cy.get(onboardingLocators.introModalWelcomeTourBtn).should("be.visible");
    cy.get(onboardingLocators.introModalWelcomeTourBtn).click();
    cy.get(onboardingLocators.welcomeTourBtn).should("be.visible");
  });

  it("1. Guided Tour", function() {
    // Start guided tour
    cy.get(commonlocators.homeIcon).click({ force: true });
    cy.get(guidedTourLocators.welcomeTour).click();
    cy.get(guidedTourLocators.startBuilding).click();
    cy.get(explorerLocators.entityExplorer).should("not.be.visible");
    // Refresh the page to validate if the tour resumes
    cy.reload();
    cy.get(guidedTourLocators.banner).should("be.visible");
    // Step 1: Run query
    cy.runQuery();
    cy.get(guidedTourLocators.successButton).click();
    // Step 2: Select table widget
    cy.SearchEntityandOpen("CustomersTable");
    // Step 3: Add binding to the tableData property
    cy.testJsontext("tabledata", "{{getCustomers.data}}");
    cy.get(guidedTourLocators.successButton).click();
    cy.get(guidedTourLocators.infoButton).click();
    // Renaming widgets // Commending below wait due to flakiness
    //cy.wait("@updateWidgetName");
    // Step 4: Add binding to the defaultText property of NameInput
    cy.wait(1000);
    cy.get(guidedTourLocators.hintButton).click();
    cy.testJsontext("defaultvalue", "{{CustomersTable.selectedRow.name}}");
    cy.get(guidedTourLocators.successButton).click();
    // Step 5: Add binding to the rest of the widgets in the container
    cy.get(commonlocators.editWidgetName).contains("EmailInput");
    cy.testJsontext("defaultvalue", "{{CustomersTable.selectedRow.email}}");
    cy.get(".t--entity-name")
      .contains("CountryInput")
      .click({ force: true });
    cy.wait(1000);
    cy.get(commonlocators.editWidgetName).contains("CountryInput");
    cy.testJsontext("defaultvalue", "{{CustomersTable.selectedRow.country}}");
    cy.get(".t--entity-name")
      .contains("DisplayImage")
      .click({ force: true });
    cy.get(guidedTourLocators.successButton).click();
    // Step 6: Drag and drop a widget
    cy.dragAndDropToCanvas("buttonwidget", {
      x: 800,
      y: 750,
    });
    cy.get(guidedTourLocators.successButton).click();
    cy.get(guidedTourLocators.infoButton).click();
    // Step 7: Execute a query onClick
    cy.executeDbQuery("updateCustomerInfo");
    // Step 8: Execute getCustomers onSuccess
    cy.get(
      `.t--property-control-onclick [data-guided-tour-iid='onSuccess'] ${commonlocators.dropdownSelectButton}`,
    )
      .click({ force: true })
      .get("ul.bp3-menu")
      .children()
      .contains("Execute a query")
      .click({ force: true })
      .get("ul.bp3-menu")
      .children()
      .contains("getCustomers")
      .click({ force: true });
    cy.get(guidedTourLocators.successButton).click();
    // Step 9: Deploy
    cy.PublishtheApp();
    cy.get(guidedTourLocators.rating).should("be.visible");
    cy.get(guidedTourLocators.rating)
      .eq(4)
      .click();
    cy.get(guidedTourLocators.startBuilding).should("be.visible");
    cy.get(guidedTourLocators.startBuilding).click();
  });
});
