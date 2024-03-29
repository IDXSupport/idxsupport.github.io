import { faker } from '@faker-js/faker'
const site = 'http://localhost:3069/'
const website = faker.internet.url()
const wordsInput = faker.lorem.words()
const wordsOutput = wordsInput.trim().replace(/\s/g, ',')
const word = faker.lorem.word()
const title = faker.lorem.word()

describe('The correct URL is here', () => {
	it('has the right correct url', () => {
		cy.visit(site)
	})
})

describe('Form buttons', () => {
	it('all fields accept text', () => {
		cy.visit(site)
		cy.get('#url').type(website)
		cy.get('#elementName').type(word)
	})
	it('adds the query to the page dom', () => {
		cy.get('#list').should('not.be.empty')
	})
	it('fills with class when the class button is pressed', () => {
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=class&class=${word}&title=Search&h1Ignore=Y`
		)
	})
	it('fills with id when the id button is pressed', () => {
		cy.get('#idButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=id&id=${word}&title=Search&h1Ignore=Y`
		)
	})
	it('fills with element when the element button is pressed', () => {
		cy.get('#elementButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=element&el=${word}&title=Search&h1Ignore=Y`
		)
	})
	it('fills with duda when the duda button is pressed', () => {
		cy.get('#dudaButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/duda?site=${website}&target=id&id=${word}&title=Search&h1Ignore=Y`
		)
	})
	it('clears the title query when title field is empty', () => {
		cy.get('#title').clear()
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=class&class=${word}&h1Ignore=Y`
		)
	})
	it('updates the title when title field is changed', () => {
		cy.get('#title').clear().type(title)
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=class&class=${word}&title=${title}&h1Ignore=Y`
		)
	})
})

describe('When using the class button with certain characters', () => {
	it('removes extra whitespace', () => {
		cy.visit(site)
		cy.get('#url').type(website)
		cy.get('#elementName')
			.clear()
			.type('  ' + word + '  ')
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=class&class=${word}&title=Search&h1Ignore=Y`
		)
	})
	it('replaces spaces with commas', () => {
		cy.get('#elementName').type(wordsInput)
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			`https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=${website}&target=class&class=${
				word + wordsOutput
			}&title=Search&h1Ignore=Y`
		)
	})
})

describe('clear field buttons', () => {
	it('clears the input fields', () => {
		cy.visit(site)
		cy.get('#url').type(website)
		cy.get('#elementName').type(word)
		cy.get('#clearButton').click()
		cy.get('#url').should('be.empty')
	})
	it('does not clear the saved outputs', () => {
		cy.get('#url').type(website)
		cy.get('#elementName').type(wordsInput)
		cy.get('#classButton').click()
		cy.get('#clearButton').click()
		cy.get('#1').should('exist')
	})
})

describe('Clear history', () => {
	it.skip('clears the list', () => {
		cy.get('#list').should('be.empty')
	})
})
