/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const username = 'Hermoine Granger';
  const accountNumber = 1001;
  const balance = 5096;
  const currency = 'Dollar';

  const deposit = faker.number.int({ min: 1000, max: 9999 });

  const withdraw = faker.number.int({ max: balance + deposit });

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('[ng-click="customer()"]').click();
    cy.get('#userSelect').select(username);
    cy.get('button[type="submit"]')
      .should('contain.text', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('.ng-binding', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('.ng-binding', balance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('.ng-binding', currency)
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[ng-model="amount"]').type(deposit);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.operationCheck('Deposit Successful', balance + deposit);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[ng-model="amount"]').type(withdraw);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.operationCheck('Transaction successful', balance + deposit - withdraw);

    cy.get('[ng-click="transactions()"]').click();

    cy.get('table').should('be.visible'); // wait for table itself
    cy.get('tr[ng-repeat^="tx in transactions"]', { timeout: 5000 })
      .should('have.length.at.least', 2); // deposit + withdraw
  });
});
