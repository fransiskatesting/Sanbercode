import CategoriesApi from '../../pages/CategoriesApi'
import categoriesData from '../../fixtures/categoriesData.json'

const {
  newCategory,
  updatedCategory,
  invalidCategory,
  paginationParams,
  expectedValues,
} = categoriesData

let createdCategoryId

describe('API Testing — Platzi Fake Store: Categories Endpoint', () => {

  it('TC-API-CAT-001 - GET /categories — Harus mengembalikan daftar semua kategori', () => {
    CategoriesApi.getAllCategories().then((response) => {
      CategoriesApi.assertStatus(response, 200)
      CategoriesApi.assertNonEmptyArray(response.body)
      response.body.forEach((category) => {
        CategoriesApi.assertCategoryFields(category)
      })
      expect(response.body.length).to.be.gte(expectedValues.minCategoryCount)
    })
  })

  it('TC-API-CAT-002 - GET /categories?limit=5&offset=0 — Harus mengembalikan data sesuai pagination', () => {
    CategoriesApi.getAllCategories({
      limit: paginationParams.limit,
      offset: paginationParams.offset,
    }).then((response) => {
      CategoriesApi.assertStatus(response, 200)
      CategoriesApi.assertNonEmptyArray(response.body)
      CategoriesApi.assertPaginationLimit(response.body, paginationParams.limit)
      response.body.forEach((category) => {
        CategoriesApi.assertCategoryFields(category)
      })
    })
  })

  it('TC-API-CAT-003 - GET /categories/:id — Harus mengembalikan detail kategori yang valid', () => {
    CategoriesApi.getCategoryById(expectedValues.existingCategoryId).then((response) => {
      CategoriesApi.assertStatus(response, 200)
      CategoriesApi.assertCategoryFields(response.body)
      expect(response.body.id).to.eq(expectedValues.existingCategoryId)
    })
  })

  it('TC-API-CAT-004 - GET /categories/:id — Harus mengembalikan error jika ID tidak ditemukan', () => {
    const nonExistentId = 999999
    CategoriesApi.getCategoryById(nonExistentId).then((response) => {
      expect(response.status, 'Status harus 400 atau 404').to.be.oneOf([400, 404])
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.not.be.empty
    })
  })

  it('TC-API-CAT-005 - GET /categories/:id/products — Harus mengembalikan produk dari kategori yang valid', () => {
    CategoriesApi.getProductsByCategory(expectedValues.existingCategoryId).then((response) => {
      CategoriesApi.assertStatus(response, 200)
      expect(response.body).to.be.an('array')
      if (response.body.length > 0) {
        const product = response.body[0]
        expect(product).to.have.property('id')
        expect(product).to.have.property('title')
        expect(product).to.have.property('price')
        expect(product).to.have.property('category')
        expect(product.category.id).to.eq(expectedValues.existingCategoryId)
      }
    })
  })

  it('TC-API-CAT-006 - POST /categories — Harus berhasil membuat kategori baru', () => {
    CategoriesApi.createCategory(newCategory).then((response) => {
      CategoriesApi.assertStatus(response, 201)
      CategoriesApi.assertCategoryFields(response.body)
      expect(response.body.name).to.eq(newCategory.name)
      expect(response.body.image).to.eq(newCategory.image)
      expect(response.body.id).to.be.a('number')
      createdCategoryId = response.body.id
      cy.log(`Created Category ID: ${createdCategoryId}`)
    })
  })

  it('TC-API-CAT-007 - POST /categories — Harus mengembalikan error jika payload tidak lengkap', () => {
    CategoriesApi.createCategory(invalidCategory).then((response) => {
      expect(response.status, 'Status harus 400').to.eq(400)
      expect(response.body).to.have.property('message')
    })
  })

  it('TC-API-CAT-008 - PUT /categories/:id — Harus berhasil mengupdate kategori yang ada', () => {
    const targetId = createdCategoryId ?? expectedValues.existingCategoryId
    CategoriesApi.updateCategory(targetId, updatedCategory).then((response) => {
      CategoriesApi.assertStatus(response, 200)
      CategoriesApi.assertCategoryFields(response.body)
      expect(response.body.name).to.eq(updatedCategory.name)
      expect(response.body.id).to.eq(targetId)
    })
  })

  it('TC-API-CAT-009 - PUT /categories/:id — Harus mengembalikan error jika ID tidak ditemukan', () => {
    const nonExistentId = 999999
    CategoriesApi.updateCategory(nonExistentId, updatedCategory).then((response) => {
      expect(response.status, 'Status harus 400 atau 404').to.be.oneOf([400, 404])
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.not.be.empty
    })
  })

  it('TC-API-CAT-010 - DELETE /categories/:id — Harus berhasil menghapus kategori yang ada', () => {
    CategoriesApi.createCategory({
      name: 'Category To Be Deleted',
      image: 'https://placehold.co/600x400',
    }).then((createResponse) => {
      CategoriesApi.assertStatus(createResponse, 201)
      const idToDelete = createResponse.body.id
      cy.log(`Deleting Category ID: ${idToDelete}`)
      CategoriesApi.deleteCategory(idToDelete).then((deleteResponse) => {
        CategoriesApi.assertStatus(deleteResponse, 200)
        expect(deleteResponse.body).to.eq(true)
      })
    })
  })

  it('TC-API-CAT-011 - DELETE /categories/:id — Harus mengembalikan error jika ID tidak ditemukan', () => {
    const nonExistentId = 999999
    CategoriesApi.deleteCategory(nonExistentId).then((response) => {
      expect(response.status, 'Status harus 400 atau 404').to.be.oneOf([400, 404])
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.not.be.empty
    })
  })

  it('TC-API-CAT-012 - GET /categories — Verifikasi response time harus di bawah 3000ms', () => {
    const startTime = Date.now()
    CategoriesApi.getAllCategories().then((response) => {
      const duration = Date.now() - startTime
      CategoriesApi.assertStatus(response, 200)
      CategoriesApi.assertNonEmptyArray(response.body)
      expect(duration, `Response time harus < 3000ms, aktual: ${duration}ms`).to.be.lessThan(3000)
      cy.log(`Response Time: ${duration}ms`)
      expect(response.headers['content-type']).to.include('application/json')
    })
  })
})
