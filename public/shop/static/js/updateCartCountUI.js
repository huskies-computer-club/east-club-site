function updateCartCountUI() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  $("#cart_count").empty();
  const totalCartItems = cart.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);
  if (!totalCartItems) {
    $("#cart_count").toggle();
  } else {
    $("#cart_count").toggle(true).text(totalCartItems);
  }
}
