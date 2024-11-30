
document.addEventListener('DOMContentLoaded', () => {
    let iconCart = document.querySelector('.icon-cart');
    let closeCart = document.querySelector('.close');
    let body = document.querySelector('body');
    let ListProductHTML = document.querySelector('.ListProduct');
    let ListCartHTML = document.querySelector('.ListCart');
    let iconCartSpan = document.querySelector('.icon-cart span');
    let checkOut = document.querySelector('.checkOut');
    let commande = document.querySelector('.commande');
    let confirmOrderButton = document.querySelector('.commande-btn');
    let filterSelect = document.querySelector('select[name="filter"]');

    
    let searchForm = document.querySelector('.search-form');
    let searchInput = document.querySelector('#search-box');

    let ListProduct = [];
    let carts = [];

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    checkOut.addEventListener('click', showCommandTable);

    function showCommandTable() {
        commande.style.display = 'block';
        commande.scrollIntoView({ behavior: 'smooth' });
    }

  
    const addDataToHTML = () => {
        ListProductHTML.innerHTML = '';
        if (ListProduct.length > 0) {
            ListProduct.forEach(product => {
                let newProduct = createProductElement(product);
                ListProductHTML.appendChild(newProduct);
            });
        }
    };


    const createProductElement = (product) => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2 class="name">${product.name}</h2>
            <div class="category">Category: ${product.categories}</div>
            <div class="price">${product.price}</div>
            <div class="promotion">${product.promotion}</div>
            <button class="addCart">Add to Cart</button>
        `;
        return newProduct;
    };


    ListProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let product_id = positionClick.parentElement.dataset.id;
            addToCart(product_id);
        }
    });

    const addToCart = (product_id) => {
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
        if (carts.length <= 0) {
            carts = [{
                product_id: product_id,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            carts.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }
        addCartToHTML();
        addCartToMemory();
    };

    const addCartToMemory = () => {
        localStorage.setItem('carts', JSON.stringify(carts));
    };

    const addCartToHTML = () => {
        ListCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if (carts.length > 0) {
            carts.forEach(cart => {
                totalQuantity = totalQuantity + cart.quantity;
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.dataset.id = cart.product_id;
                let positionProduct = ListProduct.findIndex((value) => value.id == cart.product_id);
                let info = ListProduct[positionProduct];
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        ${info.price * cart.quantity}
                    </div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                `;
                ListCartHTML.appendChild(newCart);
            });
        }
        iconCartSpan.innerText = totalQuantity;
    };

    ListCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if (positionClick.classList.contains('plus')) {
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }
    });

    const changeQuantity = (product_id, type) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
        if (positionItemInCart >= 0) {
            switch (type) {
                case 'plus':
                    carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                    break;
                default:
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    if (valueChange > 0) {
                        carts[positionItemInCart].quantity = valueChange;
                    } else {
                        carts.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        addCartToMemory();
        addCartToHTML();
    };

    const initApp = () => {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                ListProduct = data;
                addDataToHTML();

                if (localStorage.getItem('carts')) {
                    carts = JSON.parse(localStorage.getItem('carts'));
                    addCartToHTML();
                }
            });
    };

    initApp();

    filterSelect.addEventListener('change', () => {
        let selectedCategory = filterSelect.value;
        filterProducts(selectedCategory);
    });

    const filterProducts = (category) => {
        ListProductHTML.innerHTML = '';
        if (category === 'filter') {
            addDataToHTML(); 
        } else {
            let filteredProducts = ListProduct.filter(product => product.categories === category);
            filteredProducts.forEach(product => {
                let newProduct = createProductElement(product);
                ListProductHTML.appendChild(newProduct);
            });
        }
    };


    confirmOrderButton.addEventListener('click', (event) => {
        event.preventDefault(); 
        localStorage.removeItem('carts');
        carts = [];
        ListCartHTML.innerHTML = '';
        commande.style.display = 'none';
        alert('La commande a été confirmée avec succès!');
    });
    
    const rechercheButton = document.querySelector('.navbar-recherche');

    rechercheButton.addEventListener('click', () => {
        searchForm.classList.toggle('active');
    });

    searchInput.addEventListener('input', () => {
        let query = searchInput.value.toLowerCase();
        searchProducts(query);
    });

    const searchProducts = (query) => {
        ListProductHTML.innerHTML = '';
        let filteredProducts = ListProduct.filter(product => product.name.toLowerCase().includes(query));
        filteredProducts.forEach(product => {
            let newProduct = createProductElement(product);
            ListProductHTML.appendChild(newProduct);
        });
    };



});
