import categoriesData from '../fixtures/categoriesData.json'
const { baseUrl, endpoints, expectedValues } = categoriesData

class CategoriesApi {

  getAllCategories(params = {}) {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}${endpoints.categories}`,
      qs: params,
      failOnStatusCode: false,
    })
  }

  getCategoryById(id) {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}${endpoints.categories}/${id}`,
      failOnStatusCode: false,
    })
  }

  getProductsByCategory(id) {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}${endpoints.categories}/${id}/products`,
      failOnStatusCode: false,
    })
  }

  createCategory(body) {
    return cy.request({
      method: 'POST',
      url: `${baseUrl}${endpoints.categories}`,
      body,
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    })
  }

  updateCategory(id, body) {
    return cy.request({
      method: 'PUT',
      url: `${baseUrl}${endpoints.categories}/${id}`,
      body,
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    })
  }

  deleteCategory(id) {
    return cy.request({
      method: 'DELETE',
      url: `${baseUrl}${endpoints.categories}/${id}`,
      failOnStatusCode: false,
    })
  }

  assertStatus(response, expectedStatus) {
    expect(response.status, `Status code harus ${expectedStatus}`).to.eq(expectedStatus)
  }

  assertNonEmptyArray(body) {
    expect(body).to.be.an('array')
    expect(body.length).to.be.greaterThan(0)
  }

  assertCategoryFields(category) {
    expectedValues.requiredFields.forEach((field) => {
      expect(category, `Field '${field}' harus ada`).to.have.property(field)
    })
    expect(category.id).to.be.a('number')
    expect(category.name).to.be.a('string').and.not.empty
    expect(category.image).to.be.a('string').and.not.empty
  }

  assertPaginationLimit(body, limit) {
    expect(body.length).to.be.lte(limit)
  }
}

export default new CategoriesApi()
