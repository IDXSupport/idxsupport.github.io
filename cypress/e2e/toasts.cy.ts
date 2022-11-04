describe('The correct URL is here', () => {
	it('has the right correct url', () => {
		cy.visit('/')
	})
})

describe('With invalid input the page shows a fail toast message', () => {
	it('when not including any url or element', () => {
		cy.visit('/')
		cy.get('#classButton').click()
		cy.get('#toast').should('have.class', 'fail show')
		cy.log('when using an invalid url')
		cy.get('#url').type('hello there')
		cy.get('#classButton').click()
		cy.get('#toast').should('have.class', 'fail show')
	})
	it('when not including an element', () => {
		cy.visit('/')
		cy.get('#url').type('http://google.com')
		cy.get('#elementName').type(' ')
		cy.get('#classButton').click()
		cy.get('#toast').should('have.class', 'fail show')
	})
	it('when not including a url', () => {
		cy.visit('/')
		cy.get('#elementName').type('something')
		cy.get('#classButton').click()
		cy.get('#toast').should('have.class', 'fail show')
	})
})
describe('A good growler shows while using valid inputs', () => {
	afterEach(function () {
		cy.get('#toast').should('have.class', 'success show')
	})
	it('when all fields are inputted with good info', () => {
		cy.visit('/')
		cy.get('#url').type('http://google.com')
		cy.get('#elementName').type('whatsup')
		cy.get('#classButton').click()
		cy.get('#output').should(
			'have.value',
			'https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=http://google.com&target=class&class=whatsup&title=Search&h1Ignore=Y'
		)
	})
	it('when using the class field', () => {
		cy.get('#classButton').click()
	})
	it('when using the ID field', () => {
		cy.get('#idButton').click()
	})
	it('when using the element field', () => {
		cy.get('#elementButton').click()
	})
	it('when using the Duda field', () => {
		cy.get('#dudaButton').click()
	})
})

describe('A good growler shows while using valid inputs', () => {
	it('shows the expected output in the output field', () => {
		cy.get('#elementName').clear()
		cy.get('#elementName').type('this')
		cy.get('#classButton').click()
		cy.get('#toast').should('have.class', 'success show')
		cy.get('#output').should(
			'have.value',
			'https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper-v2?site=http://google.com&target=class&class=this&title=Search&h1Ignore=Y'
		)
	})
})
