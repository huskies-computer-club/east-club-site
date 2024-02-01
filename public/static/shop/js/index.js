function showToast(message) {
  $("#toast-body").html(message);
  $("#toast").addClass("show");
  setTimeout(function () {
    $("#toast").removeClass("show");
  }, 3000);
}
const onAddItemSuccessMsg =
  '<div>Item added to your cart! <a href="cart.html" id="viewCart">view cart</a></div>';
$(document).ready(function () {
  updateCartCountUI();
  const $container = $("#items");
  $container.empty();
  const $rightPanel = $("#rightPanel");
  const $overlay = $("#overlay");

  // Function to render items
  jsonData.items.forEach((item, i) => {
    const itemContent = `
    <img id=${item.id} src="public/static/shop/images/${item.image}" alt="${item.name}" style="max-width: 300px; height: 200px;">
    <h2>${item.name}</h2>
    <p>${item.description}</p>
    <p>Price: $${item.price}</p>
`;
    let btn = `<button class="add-to-cart" data-id="${item.id}">Add To Cart</button>`;
    if (item?.options) {
      btn = `<button class="toggleButton" data-id="${item.id}">Add To Cart</button>`;
    }
    $("<div/>", {
      class: "item",
      html: itemContent + btn,
    }).appendTo($container);

    $(document).on("click", `.add-to-cart[data-id='${item.id}']`, function () {
      addToCart(item);
      showToast(onAddItemSuccessMsg);
    });
    $(document).on("click", `.toggleButton[data-id='${item.id}']`, function () {
      $rightPanel.slideToggle();
      $overlay.fadeIn();
      let $optionsForm = $('<form id="optionsForm"></form>');
      let formContent = "";
      const itemOptions = item.options;
      for (let key in itemOptions) {
        if (itemOptions.hasOwnProperty(key)) {
          const optionName = key;
          const optionValues = itemOptions[key];
          const optionContent = `
                        <div> 
                            <h3>${key}</h3>
                            <div class="option">
                            ${optionValues
                              .map((optionValue) => {
                                return `
                                    <input type="radio" id="${
                                      key + optionValue
                                    }" name="${key}" value="${optionValue}">
                                    <label for="${
                                      key + optionValue
                                    }">${optionValue}</label><br>
                                    `;
                              })
                              .join("")}
                    </div>
                        </div>
                    `;
          formContent += optionContent;
        }
      }
      formContent += `<div><button type="submit">Add To Cart</button></div>`;
      $optionsForm.append(formContent);
      $rightPanel.html($optionsForm);
      $("#optionsForm").on("submit", function (e) {
        e.preventDefault();
        // serialize gets the data ready to be send over network
        let formData = $(this).serialize();
        // taking the serialize form data without sending over network might eventually break;
        const params = new URLSearchParams(formData);
        const options = Object.fromEntries(params);

        addToCart({ ...item, options });
        showToast(onAddItemSuccessMsg);
        $rightPanel.slideUp();
        $overlay.fadeOut();
      });
    });
  });
  // on hover change pizza img
  $("#5").hover(
    function () {
      $("#5").attr("src", "/public/static/shop/images/pizza-2.jpg");
    },
    function () {
      $("#5").attr("src", "/public/static/shop/images/pizza.jpg");
    }
  );
  // show panel
  $overlay.click(function () {
    $overlay.fadeOut();
  });

  $(document).click(function (event) {
    // Check if the click is outside the panel and if the panel is visible
    if (
      !$(event.target).closest("#rightPanel, .toggleButton").length &&
      $rightPanel.is(":visible")
    ) {
      $rightPanel.slideUp();
      $overlay.fadeOut();
    }
  });
});
