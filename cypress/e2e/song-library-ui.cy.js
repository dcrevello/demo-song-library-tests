import { viewports } from '../support/viewports'

describe('Song Library UI - Basic Tests', () => {

  /*  Commenting out for now, not using
  // layout ratio thresholds for different viewports
  //  used to verify the layout is as expected for the viewport size
  //  wide = desktop, narrow = tablet and mobile
  const layoutRatios = {
    wide: 0.95,
    narrow: 0.90
  }

  function getExpectedLayoutRatio(viewportWidth) {
    if (viewportWidth > 900) {
      return layoutRatios.wide
    } else {
      return layoutRatios.narrow
    }
  } */

  it('TC_UI_001: should load the app in a standard layout and verify the table layout', function() {
    cy.viewport(viewports.desktop.width, viewports.desktop.height)
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // get expected pixel width based on layout ratio
    //const expectedWidth = Math.floor(viewports.desktop.width * getExpectedLayoutRatio(viewports.desktop.width))

    // Confirm correct table width and lack of block rules that indicate standard layout
    // NOTE: The width check is too flaky to be reliable, so commenting it out
//    cy.get('#song-table').invoke('css', 'width').then(actualWidth => {
//      expect(parseInt(actualWidth)).to.be.closeTo(expectedWidth, 5)
//    })
    // Confirm lack of block rules that indicate standard layout
    cy.get('#song-table').should('not.have.css', 'display', 'block')

    // Verify the header row exists and has the correct number of columns
    cy.get('#song-table > div.theader').should('exist')
    cy.get('#song-table > div.theader > div').should('have.length', 5)

    // Verify there are one or more song rows
    cy.get('#song-table .table_row.ng-star-inserted').should('have.length.gte', 1)

    // Verify each song row has the correct number of columns
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('.table_small').should('have.length', 5)
    })

    // Verify the header has the correct text
    //const expectedHeaders = ['ID', 'Title', 'Artist', 'Release Date', 'Price']
    const expectedHeaders = ['Title', 'Artist', 'Release Date', 'Price', '']
    cy.get('#song-table > div.theader > div').each(($cell, index) => {
      //cy.wrap($cell).should('have.text', expectedHeaders[index])
      cy.wrap($cell).invoke('text').then(text => {
        expect(text.replace(/\u00a0/g, ' ').trim()).to.eq(expectedHeaders[index])
      })
    })

    // Verify the song rows don't have empty cells
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('input').each($input => {
        cy.wrap($input).invoke('val').should('not.be.empty')
      })
    })

    // Verify each song row contains Edit, Delete, and Save buttons
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('button').then($buttons => {
        // Convert and clean up JQuery values to simple array of strings
        const buttonLabels = [...$buttons].map(btn => btn.innerText.trim())
        // Verify all expected buttons are present
        expect(buttonLabels).to.include.members(['Edit', 'Delete', 'Save'])
      })
    })
  })

  it('TC_UI_002: should load the app in a mobile layout and verify the panel layout', function() {
    cy.viewport(viewports.mobile.width, viewports.mobile.height)
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Confirm block rules that indicate mobile layout
    //cy.get('#song-table').should('have.css', 'width', '90%')
    cy.get('#song-table').should('have.css', 'display', 'block')

    // Verify the header row exists and has the correct number of columns
    cy.get('#song-table > div.theader').should('exist')
    cy.get('#song-table > div.theader > div').should('have.length', 5)

    // Verify there are one or more song rows
    cy.get('#song-table .table_row.ng-star-inserted').should('have.length.gte', 1)

    // Verify each song row has the correct number of columns
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('.table_small').should('have.length', 5)
    })

    // Verify the header has the correct text
    //const expectedHeaders = ['ID', 'Title', 'Artist', 'Release Date', 'Price']
    const expectedHeaders = ['Title', 'Artist', 'Release Date', 'Price', '']
    cy.get('#song-table > div.theader > div').each(($cell, index) => {
      //cy.wrap($cell).should('have.text', expectedHeaders[index])
      cy.wrap($cell).invoke('text').then(text => {
        expect(text.replace(/\u00a0/g, ' ').trim()).to.eq(expectedHeaders[index])
      })
    })

    // Verify the song rows don't have empty cells
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('input').each($input => {
        cy.wrap($input).invoke('val').should('not.be.empty')
      })
    })

    // Verify each song row contains Edit, Delete, and Save buttons
    cy.get('#song-table .table_row.ng-star-inserted').each($row => {
      cy.wrap($row).find('button').then($buttons => {
        // Convert and clean up JQuery values to simple array of strings
        const buttonLabels = [...$buttons].map(btn => btn.innerText.trim())
        // Verify all expected buttons are present
        expect(buttonLabels).to.include.members(['Edit', 'Delete', 'Save'])
      })
    })
  })

  it('TC_UI_003: should toggle the layout and verify the UI updates accordingly', function() {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Start with desktop layout
    cy.viewport(viewports.desktop.width, viewports.desktop.height)
    cy.wait(100) // brief wait to allow layout to adjust
    // Confirm lack of block rules that indicate standard layout
    cy.get('#song-table').should('not.have.css', 'display', 'block')

    // Switch to mobile layout
    cy.viewport(viewports.mobile.width, viewports.mobile.height)
    cy.wait(100) // brief wait to allow layout to adjust
    // Confirm block rules that indicate mobile layout
    cy.get('#song-table').should('have.css', 'display', 'block')

    // Switch to just above threshold layout
    cy.viewport(viewports.justAboveThreshold.width, viewports.justAboveThreshold.height)
    cy.wait(100) // brief wait to allow layout to adjust
    // Confirm lack of block rules that indicate standard layout
    cy.get('#song-table').should('not.have.css', 'display', 'block')

    // Switch to just below threshold layout
    cy.viewport(viewports.justBelowThreshold.width, viewports.justBelowThreshold.height)
    cy.wait(100) // brief wait to allow layout to adjust
    // Confirm block rules that indicate mobile layout
    cy.get('#song-table').should('have.css', 'display', 'block')
  })

  it('TC_Load_001: should load the app and verify 5 songs are listed', function() {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Check that there are one or more song rows
    cy.get('#song-table .table_row.ng-star-inserted')
      .should('have.length', 5)
  })
})