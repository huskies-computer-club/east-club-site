// Add to Cart
function addToCart(addItem) {
    console.log('adding to cart', addItem)
    const { id, name, price, image } = addItem
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let found = cart.find(item => item.id === id);

    if (found) {
        found.quantity += 1;
    } else {
        cart.push({ id, name, quantity: 1, price, image });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountUI();
}

