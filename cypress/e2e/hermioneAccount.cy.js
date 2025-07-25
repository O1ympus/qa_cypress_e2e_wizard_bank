/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const username = 'Hermoine Granger';
  const accountNumber = 1001;
  const balance = 5096;
  const currency = 'Dollar';

  const deposit = faker.number.int({ min: 1000, max: 9999 });
  const withdraw = faker.number.int({ max: balance + deposit });

  const now = new Date();
  const today = now.toISOString().slice(0, 16);

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

    cy.reload();

    cy.get('[ng-click="transactions()"]').click();

    cy.get('#start')
      .invoke('val', today)
      .trigger('input');

    cy.get('#anchor0').contains('.ng-binding', deposit)
      .should('be.visible');
    cy.get('#anchor1').contains('.ng-binding', withdraw)
      .should('be.visible');

    cy.get('[ng-click="back()"]').click();

    cy.get('[ng-model="accountNo"]').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody').should('not.have.descendants', 'tr');
    cy.get('[ng-click="byebye()"]').click();
    cy.get('#userSelect').should('be.visible');
  });
});
