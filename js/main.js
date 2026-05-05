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

if (localStorage.getItem("productList") !== null) {
  productList = JSON.parse(localStorage.getItem("productList"));
}
displayProducts(productList);

var productRegex = {
  productNameRegex: /^[A-Z][\sa-z0-9_]{2,}$/,
  productPriceRegex: /^[1-9][0-9]{1,5}$/,
  productCategoryRegex: /^(Mobile|Headphones|Laptop|Camera|Printer|TV)$/,
  productDescriptionRegex: /^[a-zA-z].{3,}$/,
};

function addProducts() {
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

    Swal.fire({
      title: "Added!",
      text: "Product has been added successfully",
      icon: "success",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the product!",
    });
  }
}

function resetAllInputs() {
  productNameInput.value = "";
  productPriceInput.value = "";
  productCategoryInput.value = "";
  productDescriptionInput.value = "";
  productImageInput.value = "";

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
    return; // return ---> we don't return a value ---> Stop Func
    // Pattern --> Early Return
  }

  for (let i = 0; i < products.length; i++) {
    cartona += `
           <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card">
              <img style="height: 250px;" src="${products[i].image}" class="card-img-top" alt="..." />
              <div class="card-body">
                <span class="badge bg-primary mb-2">${products[i].category}</span>

                <h3 class="card-title h5 mb-2">${products[i].name}</h3>
                <p class="card-text mb-2">
                  ${products[i].description}
                </p>

                <div class="d-flex align-items-center gap-1 mb-2">
                  <div class="d-flex text-warning">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                  </div>
                  <span class="text-xs text-gray-400 font-medium">
                    4.2 (12)</span
                  >
                </div>

                <div>
                  <span class="d-block mb-2 fs-5 fw-medium">${products[i].price} EGP</span>
                </div>

                <div>
                  <button onclick="setDataToInputs(${
                    products.length < productList.length
                      ? products[i].oldIndex
                      : i
                  })" class="btn btn-outline-warning d-block w-100 mb-3">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onclick="deleteProducts(${
                    products.length < productList.length
                      ? products[i].oldIndex
                      : i
                  })" class="btn btn-outline-danger d-block w-100">
                    <i class="fa-solid fa-trash-can"></i> 
                  </button>
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

      Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted.",
        icon: "success",
      });
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

      Swal.fire({
        title: "Deleted!",
        text: "All products have been deleted.",
        icon: "success",
      });
    }
  });
}

function setDataToInputs(index) {
  updateIndex = index;
  let data = productList[index];

  productNameInput.value = data.name;
  productPriceInput.value = data.price;
  productCategoryInput.value = data.category;
  productDescriptionInput.value = data.description;

  // Note: We cannot programmatically set the value of an <input type="file"> to a file path.
  // It throws an InvalidStateError. We just leave it as is or empty.

  // show update button and hide add button
  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

function updateProduct() {
  let data = productList[updateIndex];

  data.name = productNameInput.value;
  data.price = productPriceInput.value;
  data.category = productCategoryInput.value;
  data.description = productDescriptionInput.value;

  if (productImageInput.files.length > 0) {
    data.image = `./images/${productImageInput.files[0]?.name}`;
  }

  localStorage.setItem("productList", JSON.stringify(productList));
  displayProducts(productList);

  resetAllInputs();

  // show add button and hide update button
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
}

//! Validation For All Inputs

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
