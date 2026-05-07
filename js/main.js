const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productCategoryInput = document.getElementById("productCategory");
const productDescriptionInput = document.getElementById("productDescription");
const productImageInput = document.getElementById("productImage");
const searchInput = document.getElementById("search");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const clearBtn = document.getElementById("clearBtn");
let productList = [];
let updateIndex = 0;
// get products from local storage
if (localStorage.getItem("productList") !== null) {
  productList = JSON.parse(localStorage.getItem("productList"));
}
displayProducts(productList);
// set regex for inputs
var productRegex = {
  productNameRegex: /^(?=.*[A-Za-z])[A-Za-z0-9\s&()'.,\-]{3,100}$/,
  productPriceRegex: /^[1-9][0-9]{1,5}$/,
  productCategoryRegex: /^(Mobile|Headphones|Laptop|Camera|Printer|TV)$/,
  productDescriptionRegex:
    /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,!@#$%^&*()_\-+=:;"'/?<>[\]{}|`~]{10,500}$/,
};
function addProducts() {
  // check all inputs are valid before adding
  if (
    isProductInputsValid(productRegex.productNameRegex, productNameInput) &&
    isProductInputsValid(productRegex.productPriceRegex, productPriceInput) &&
    isProductInputsValid(
      productRegex.productCategoryRegex,
      productCategoryInput,
    ) &&
    isProductInputsValid(
      productRegex.productDescriptionRegex,
      productDescriptionInput,
    ) &&
    isProductImageInputValid()
  ) {
    var product = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image: `./images/${productImageInput.files[0]?.name ? productImageInput.files[0]?.name : "placeholder.png"}`,
    };
    productList.push(product);
    localStorage.setItem("productList", JSON.stringify(productList));
    displayProducts(productList);
    resetAllInputs();
    // after adding
    fireSwalSuccess("Added!", "Product has been added successfully");
  } else {
    if (
      !isProductInputsValid(productRegex.productNameRegex, productNameInput)
    ) {
      fireSwalError("Missing Name", "Please enter a name for the product!");
    } else if (
      !isProductInputsValid(productRegex.productPriceRegex, productPriceInput)
    ) {
      fireSwalError("Missing Price", "Please enter a price for the product!");
    } else if (
      !isProductInputsValid(
        productRegex.productCategoryRegex,
        productCategoryInput,
      )
    ) {
      fireSwalError(
        "Missing Category",
        "Please enter a category for the product!",
      );
    } else if (
      !isProductInputsValid(
        productRegex.productDescriptionRegex,
        productDescriptionInput,
      )
    ) {
      fireSwalError(
        "Missing Description",
        "Please enter a description for the product!",
      );
    } else if (!isProductImageInputValid()) {
      fireSwalError("Missing Image", "Please enter an image for the product!");
    } else {
      fireSwalError("Missing Data", "Please fill all inputs correctly!");
    }
  }
}
function resetAllInputs() {
  // clear inputs
  productNameInput.value = "";
  productPriceInput.value = "";
  productCategoryInput.value = "";
  productDescriptionInput.value = "";
  productImageInput.value = "";
  // remove valid classes
  productNameInput.classList.remove("is-valid");
  productPriceInput.classList.remove("is-valid");
  productCategoryInput.classList.remove("is-valid");
  productDescriptionInput.classList.remove("is-valid");
  productImageInput.classList.remove("is-valid");
}
function displayProducts(products) {
  let cartona = ``;
  if (products.length === 0) {
    document.getElementById("rowData").innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="mb-4">
          <i class="fa-solid fa-box-open text-muted" style="font-size: 5rem;"></i>
        </div>
        <h2 class="h4 text-muted mb-3">No Products Found</h2>
        <p class="text-secondary">It looks like your inventory is empty. Start adding some products using the form above!</p>
      </div>
    `;
    return;
  }
  for (let i = 0; i < products.length; i++) {
    cartona += `
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="product-card card h-100">
              <div class="product-image-wrapper">
                <img src="${products[i].image}" class="card-img-top product-image" alt="${products[i].name}" />
                <div class="product-badges">
                  <span class="badge product-badge-category">${products[i].category}</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h3 class="product-title h5 mb-2" title="${products[i].name}">${products[i].name}</h3>
                <p class="product-description card-text mb-3 flex-grow-1">
                  ${products[i].description}
                </p>
                <div class="d-flex align-items-center mb-3">
                  <div class="product-rating d-flex gap-1 me-2">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                  </div>
                  <span class="product-rating-count fw-medium">4.2 (12)</span>
                </div>
                <div class="product-footer pt-3 border-top mt-auto d-flex align-items-center justify-content-between">
                  <span class="product-price d-block fs-5 fw-bold mb-0">
                    ${products[i].price} <span class="price-currency">EGP</span>
                  </span>
                  <div class="product-crud-actions d-flex gap-2">
                    <button onclick="setDataToInputs(${
                      products.length < productList.length
                        ? products[i].oldIndex
                        : i
                    })" class="btn btn-action-edit" title="Edit">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteProducts(${
                      products.length < productList.length
                        ? products[i].oldIndex
                        : i
                    })" class="btn btn-action-delete" title="Delete">
                      <i class="fa-solid fa-trash-can"></i> 
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
  }
  document.getElementById("rowData").innerHTML = cartona;
}
function deleteProducts(index) {
  Swal.fire({
    title: "Delete Product?",
    text: "Are you sure you want to delete this product? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C62222",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      productList.splice(index, 1);
      localStorage.setItem("productList", JSON.stringify(productList));
      displayProducts(productList);
      searchInput.value = "";
      // after delete
      fireSwalSuccess("Deleted!", "Product has been deleted.");
    }
  });
}
function searchProducts(searchInput) {
  let searchTerm = searchInput.value;
  let filteredProducts = [];
  for (let i = 0; i < productList.length; i++) {
    if (
      productList[i].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productList[i].category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      productList[i].oldIndex = i;
      filteredProducts.push(productList[i]);
    }
  }
  displayProducts(filteredProducts);
}
function clearProducts() {
  if (productList.length > 0) {
    Swal.fire({
      title: "Delete Products?",
      text: "Are you sure you want to delete All products? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C62222",
      cancelButtonColor: "#606773",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("productList");
        productList = [];
        displayProducts(productList);

        // after delete
        fireSwalSuccess("Deleted!", "All products have been deleted.");
      }
    });
  } else {
    // No products to clear
    fireSwalError("No Products to Clear", "Your product list is empty!");
  }
}
function setDataToInputs(index) {
  updateIndex = index;
  let data = productList[index];
  // set data to inputs
  productNameInput.value = data.name;
  productPriceInput.value = data.price;
  productCategoryInput.value = data.category;
  productDescriptionInput.value = data.description;
  // show update button and hide add button
  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}
function updateProduct() {
  // if all inputs valid then update product
  if (
    isProductInputsValid(productRegex.productNameRegex, productNameInput) &&
    isProductInputsValid(productRegex.productPriceRegex, productPriceInput) &&
    isProductInputsValid(
      productRegex.productCategoryRegex,
      productCategoryInput,
    ) &&
    isProductInputsValid(
      productRegex.productDescriptionRegex,
      productDescriptionInput,
    ) &&
    isProductImageInputValid()
  ) {
    let data = productList[updateIndex];
    data.name = productNameInput.value;
    data.price = productPriceInput.value;
    data.category = productCategoryInput.value;
    data.description = productDescriptionInput.value;
    if (productImageInput.files.length > 0) {
      data.image = `./images/${productImageInput.files[0]?.name}`;
    }
    // update local storage
    localStorage.setItem("productList", JSON.stringify(productList));
    // display products
    displayProducts(productList);
    // reset inputs
    resetAllInputs();
    // Show add button and hide update button
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
    // After product update
    fireSwalSuccess("Updated!", "Product has been updated successfully.");
  } else {
    // Keep individual error messages, just add the new consistent styling
    if (
      !isProductInputsValid(productRegex.productNameRegex, productNameInput)
    ) {
      fireSwalError("Missing Name", "Please enter a name for the product!");
    } else if (
      !isProductInputsValid(productRegex.productPriceRegex, productPriceInput)
    ) {
      fireSwalError(
        "Missing Price",
        "Please enter a valid price for the product!",
      );
    } else if (
      !isProductInputsValid(
        productRegex.productCategoryRegex,
        productCategoryInput,
      )
    ) {
      fireSwalError(
        "Missing Category",
        "Please enter a category for the product!",
      );
    } else if (
      !isProductInputsValid(
        productRegex.productDescriptionRegex,
        productDescriptionInput,
      )
    ) {
      fireSwalError(
        "Missing Description",
        "Please enter a description for the product!",
      );
    } else if (!isProductImageInputValid()) {
      fireSwalError(
        "Missing Image",
        "Please choose an image for your product!",
      );
    }
  }
}
// Validation For All Inputs
function isProductInputsValid(regex, productInput) {
  if (regex.test(productInput.value)) {
    productInput.classList.add("is-valid");
    productInput.classList.remove("is-invalid");
    productInput.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    productInput.classList.add("is-invalid");
    productInput.classList.remove("is-valid");
    productInput.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
// Validation For Image Input
function isProductImageInputValid() {
  if (productImageInput.files.length > 0) {
    productImageInput.classList.add("is-valid");
    productImageInput.classList.remove("is-invalid");
    productImageInput.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    productImageInput.classList.add("is-invalid");
    productImageInput.classList.remove("is-valid");
    productImageInput.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
// reusable swal functions
function fireSwalError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: "#C62222",
    confirmButtonText: "Close",
    timerProgressBar: true,
    timer: 2000,
  });
}
function fireSwalSuccess(title, text) {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: "#10B981",
    confirmButtonText: "OK",
    timerProgressBar: true,
    timer: 2000,
  });
}
