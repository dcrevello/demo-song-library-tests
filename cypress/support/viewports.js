//  default viewport sizes for reactive behavior testing
export const viewports = {
  desktop: { width: 1000, height: 660 },       // Cypress default
  tablet: { width: 768, height: 1024 },
  mobile: { width: 640, height: 660 },         // Below the 650px threshold
  justBelowThreshold: { width: 649, height: 660 },
  justAboveThreshold: { width: 651, height: 660 },
}