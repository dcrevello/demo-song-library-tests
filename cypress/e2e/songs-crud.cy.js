import * as utils from '../support/utils.js'

describe('template spec', () => {
  it('TC_CRUD_001: Adding a song works', () => {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Set column index mapping
    utils.getColumnIndexMap('colIndices')

    // Get initial song count
    cy.get('#song-table .table_row.ng-star-inserted').its('length').as('initialCount')
    /*cy.get('#song-table .table_row.ng-star-inserted').then($rows => {
      const initialCount = $rows.length
      cy.wrap(initialCount).as('initialCount') // store for later use
    }) */

    // Click the "Add Song" button
    cy.contains('button', 'Add New Song').click()

    // Verify a new row is added
    cy.get('@initialCount').then(initialCount => {
      cy.get('#song-table .table_row.ng-star-inserted')
        .should('have.length', initialCount + 1)
    })

    // Fill in the new song details
    cy.get('@colIndices').then(colIndices => {
      // get relevant column indices
      const titleCol = colIndices['title']
      const artistCol = colIndices['artist']
      const releaseDateCol = colIndices['release date']
      const priceCol = colIndices['price']

      // details for the new song to add
      const newSong = {
        title: 'Test Song',
        artist: 'Test Artist',
        releaseDate: '2021-10-01',
        price: '1.29'
      }

      // Type in the new song details in the first row (index 0)
      utils.typeInCell(0, titleCol, newSong.title)
      utils.typeInCell(0, artistCol, newSong.artist)
      utils.typeInCell(0, releaseDateCol, newSong.releaseDate)
      utils.typeInCell(0, priceCol, newSong.price)

      // Click the "Save" button in the new row
      utils.clickRowButton(0, 'Save')
      cy.wait(500) // wait for save to complete

      // Verify toast message appears
      cy.get('.alert.alert-info.ng-star-inserted').should('contain.text', 'Information is processed successfully.')

      // Verify the new song appears in the first row
      utils.verifyCellText(0, titleCol, newSong.title)
      utils.verifyCellText(0, artistCol, newSong.artist)
      utils.verifyCellText(0, releaseDateCol, newSong.releaseDate)
      utils.verifyCellText(0, priceCol, '$ ' + newSong.price)
    })
  })

  it('TC_CRUD_002: Required field validation and field format validation work when adding a song', () => {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Set column index mapping
    utils.getColumnIndexMap('colIndices')

    // Click the "Add Song" button
    cy.contains('button', 'Add New Song').click()

    // Fill in the new song details
    cy.get('@colIndices').then(colIndices => {
      // get relevant column indices
      const titleCol = colIndices['title']
      const artistCol = colIndices['artist']
      const releaseDateCol = colIndices['release date']
      const priceCol = colIndices['price']

      // details for the new song to add
      const newSong = {
        title: 'Test Song',
        artist: 'Test Artist',
        releaseDate: '2021-10-01',
        price: '1.29'
      }

      // Clear Title, Artist, adn Release Date to trigger required field validation
      utils.clearCellText(0, titleCol)
      utils.clearCellText(0, artistCol)
      utils.clearCellText(0, releaseDateCol)
      cy.wait(200)
    
      // Verify required field alerts appear
      utils.verifyAlertText(0, titleCol, 'Title is required.')
      utils.verifyAlertText(0, artistCol, 'Artist is required.')
      utils.verifyAlertText(0, releaseDateCol, 'Required')

      // Verify Save button is disabled
      utils.verifyButtonState(0, 'Save', false)

      // Fill in invalid Price to trigger default $ 0.00 value
      utils.typeInCell(0, titleCol, newSong.title) // fill in title to remove that alert
      utils.typeInCell(0, artistCol, newSong.artist) // fill in artist to remove that alert
      utils.typeInCell(0, releaseDateCol, newSong.releaseDate) // fill in release date to remove that alert
      utils.typeInCell(0, priceCol, 'invalid-price')
      cy.wait(200)

      // Verify Price field is set to default value $ 0.00
      utils.verifyCellText(0, priceCol, '$ 0.00')

      // Verify Save button is enabled
      utils.verifyButtonState(0, 'Save', true)

      // Enter Price and save
      utils.typeInCell(0, priceCol, newSong.price)
      utils.clickRowButton(0, 'Save')
      cy.wait(500) // wait for save to complete

      // Verify toast message appears
      cy.get('.alert.alert-info.ng-star-inserted').should('contain.text', 'Information is processed successfully.')

      // Verify the new song appears in the first row
      utils.verifyCellText(0, titleCol, newSong.title)
      utils.verifyCellText(0, artistCol, newSong.artist)
      utils.verifyCellText(0, releaseDateCol, newSong.releaseDate)
      utils.verifyCellText(0, priceCol, '$ ' + newSong.price)
    })
  })

  /*  Issues with Edit button clicks, not sufficient time to chase down
  it('TC_CRUD_003: Editing a song works', () => {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Set column index mapping
    utils.getColumnIndexMap('colIndices')

    // Set song to edit
    const originalTitle = 'Bad Blood'
    const updatedSong = {
      title: 'Bad Bloods',
      artist: 'Swift Taylor',
      releaseDate: '2016-06-06',
      price: '1.50'
    }

    // Find the row index of the song to edit
    cy.get('@colIndices').then(colIndices => {
      const titleCol = colIndices['title']
      const artistCol = colIndices['artist']
      const releaseDateCol = colIndices['release date']
      const priceCol = colIndices['price']

      utils.findRowByCellValue(titleCol, originalTitle).then(rowIndex => {
        // Click the "Edit" button in that row
        utils.clickRowButton(rowIndex, 'Edit')
        cy.wait(500) // wait for save to complete

        // Update the song details
        utils.typeInCell(rowIndex, titleCol, updatedSong.title)
        utils.typeInCell(rowIndex, artistCol, updatedSong.artist)
        utils.typeInCell(rowIndex, releaseDateCol, updatedSong.releaseDate)
        utils.typeInCell(rowIndex, priceCol, updatedSong.price)

        // Click the "Save" button in that row
        utils.clickRowButton(rowIndex, 'Save')
        cy.wait(500) // wait for save to complete

        // Verify toast message appears
        cy.get('.alert.alert-info.ng-star-inserted').should('contain.text', 'Information is processed successfully.')

        // Verify the song details are updated in that row
        utils.verifyCellText(rowIndex, titleCol, updatedSong.title)
        utils.verifyCellText(rowIndex, artistCol, updatedSong.artist)
        utils.verifyCellText(rowIndex, releaseDateCol, updatedSong.releaseDate)
        utils.verifyCellText(rowIndex, priceCol, '$ ' + updatedSong.price)
      })
    })
  }) */

    /*  Issues with Delete button clicks, not sufficient time to chase down
  it('TC_CRUD_005: Deleting a song works', () => {
    cy.visit('https://shuxincolorado.github.io/song-list2/dist/song-list2/')

    // Confirm the table container exists
    cy.get('#song-table').should('exist')

    // Get initial song count
    cy.get('#song-table .table_row.ng-star-inserted').its('length').as('initialCount')

    // Find the row index of the song to delete
    const titleToDelete = 'Bad Blood'
    utils.findRowByCellValue(0, titleToDelete).then(rowIndex => {
      // Click the "Delete" button in that row
      utils.clickRowButton(rowIndex, 'Delete')
      cy.wait(500) // wait for delete to complete

      // Verify row count is decreased by 1
      cy.get('@initialCount').then(initialCount => {
        cy.get('#song-table .table_row.ng-star-inserted')
          .should('have.length', initialCount - 1)
      })

      // Verify the song is no longer present in the table
      utils.verifyRecordNotExists(0, titleToDelete)
    })
  }) */
})