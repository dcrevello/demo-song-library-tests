// function to remove non-breaking spaces and trim whitespace
export function normalizeLabel(text) {
  return text.replace(/\u00a0/g, ' ').trim();
}

// function to get a mapping of column labels to their indices in the table header
export function getColumnIndexMap(aliasName = 'columnIndices') {
  cy.get('#song-table .theader .table_header').then($headers => {
    const indexMap = {}

    $headers.each((index, el) => {
      const label = el.innerText.replace(/\u00a0/g, ' ').trim().toLowerCase()
      indexMap[label] = index
    })

    cy.wrap(indexMap).as(aliasName)
  })
}

// function to type text into a specific cell identified by row and column indices
export function typeInCell(rowIndex, colIndex, text) {
  cy.get('#song-table .table_row.ng-star-inserted').eq(rowIndex)
    .find('.table_small').eq(colIndex)
    .find('input').clear().type(text)
}

// function to clear cell text in a specific cell identified by row and column indices
export function clearCellText(rowIndex, colIndex) {
  cy.get('#song-table .table_row.ng-star-inserted').eq(rowIndex)
    .find('.table_small').eq(colIndex)
    .find('input').clear()
}

// function to find a row index by searching for a specific text in a given column
export function findRowByCellValue(colIndex, targetText) {
  return cy.get('#song-table .table_row.ng-star-inserted').then($rows => {
    for (let i = 0; i < $rows.length; i++) {
      const input = $rows[i].querySelectorAll('.table_small')[colIndex]?.querySelector('input')
      if (input) {
        const value = input.value.replace(/\u00a0/g, ' ').trim()
        if (value === targetText) {
          return i
        }
      }
    }
    throw new Error(`Row not found with value "${targetText}" in column ${colIndex}`)
  })
}

// function to get the text value from a specific cell identified by row and column indices
export function getCellText(rowIndex, colIndex) {
  return cy
    .get('#song-table .table_row.ng-star-inserted').eq(rowIndex)
    .find('.table_small').eq(colIndex).find('input')
    .invoke('val').then(value => value.trim())
}

// function to verify the text value in a specific cell matches the expected text
export function verifyCellText(rowIndex, colIndex, expectedText) {
  cy.get('#song-table .table_row.ng-star-inserted').eq(rowIndex)
    .find('.table_small').eq(colIndex).find('input')
    .invoke('val').then(actualValue => {
      const normalized = actualValue.trim()
      expect(normalized).to.equal(expectedText)
    })
}

// function to click a button with a specific label in a given row
export function clickRowButton(rowIndex, label) {
  cy.get('#song-table .table_row.ng-star-inserted')
    .eq(rowIndex)
    .within(() => {
      cy.contains('button', label).should('be.enabled').click({ force: true })
      //cy.contains('button', label).then($btn => {
      //  $btn.click()
      //})
    })
}

// function to verify alert text in a specific cell
export function verifyAlertText(rowIndex, colIndex, expectedText) {
  cy.get('#song-table .table_row.ng-star-inserted').eq(rowIndex)
    .find('.table_small').eq(colIndex)
    .find('div[class*="alert-danger"]') // partial match for dynamic classes
    .should('exist').invoke('text').then(text => {
      const normalized = text.replace(/\u00a0/g, ' ').trim()
      expect(normalized).to.equal(expectedText)
    })
}

// function to verify the state of a button in a specific row
export function verifyButtonState(rowIndex, label, shouldBeEnabled = true) {
  const assertion = shouldBeEnabled ? 'not.be.disabled' : 'be.disabled'
    cy.get('#song-table .table_row.ng-star-inserted')
        .eq(rowIndex)
        .find('button')
        .contains(label)
        .should(assertion)
}

// function to verify that no record with a matching value in specified column exists
export function verifyRecordNotExists(colIndex, targetText) {
  cy.get('#song-table .table_row.ng-star-inserted').each($row => {
    cy.wrap($row).find('.table_small').eq(colIndex).find('input')
      .invoke('val').then(value => {
        const normalized = value.replace(/\u00a0/g, ' ').trim()
        expect(normalized).to.not.equal(targetText)
      })
    })
}