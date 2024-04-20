console.log("");
console.log("Connected");
console.log("");

document.addEventListener("DOMContentLoaded", () => {
    const staticImages = [
        "./assets/images/cloth1.jpg",
        "./assets/images/cloth2.jpg",
        "./assets/images/cloth3.jpg",
        "./assets/images/cloth4.jpg",
    ];

    let currentColor;
    let currentSize;

    fetch("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448")
        .then(response => response.json())
        .then(data => {
            populateImages(staticImages);
            populateProductInfo(data.product);
            addEventListeners(data.product);
        })
        .catch(error => console.error("Error fetching data:", error));

    const populateImages = (images) => {
        const mainImageContainer = document.querySelector(".main-image");
        const smallImagesContainer = document.querySelector(".small-images");

        mainImageContainer.innerHTML = `<img src="${images[0]}" alt="Main Image">`;

        images.forEach((image, index) => {
            const smallImage = document.createElement("img");
            smallImage.src = image;
            smallImage.alt = `Small Image ${index + 1}`;
            smallImagesContainer.appendChild(smallImage);

            smallImage.addEventListener("click", () => {
                const mainImage = document.querySelector(".main-image img");
                mainImage.src = image;

                document.querySelectorAll(".small-images img").forEach((smallImg) => {
                    smallImg.classList.remove("selected");
                });

                smallImage.classList.add("selected");
            });
        });

        document.querySelector(".small-images img").classList.add("selected");
    };

    const populateProductInfo = (product) => {
        document.querySelector(".brand-name").textContent = product.vendor;
        document.querySelector(".product-title").textContent = product.title;
        document.querySelector(".product-price span").textContent = `${product?.price}.00`;
        document.querySelector(".compare-price span").textContent = `${product?.compare_at_price}.00`;
        document.querySelector(".product-description").innerHTML = product?.description;
    };

    const addEventListeners = (product) => {
        const colorsContainer = document.querySelector(".colors");
        const sizesContainer = document.querySelector(".sizes");
        const quantityInput = document.querySelector(".quantity-buttons .qty");
        const addToCartButton = document.querySelector(".add-to-cart");
        const cartMessage = document.querySelector(".cart-message");

        product.options[0].values.forEach((color, index) => {
            const colorBox = document.createElement("div");
            colorBox.style.backgroundColor = Object.values(color)[0];
            colorsContainer.appendChild(colorBox);

            if (index === 0) {
                colorBox.classList.add("selected");
                colorBox.innerHTML = `<img id="checkIcon" src="./assets/icon/select-icon.svg" alt="Check">`;
                currentColor = Object.keys(color)[0];
            }

            colorBox.addEventListener("click", () => {
                colorsContainer.querySelectorAll("div").forEach((box) => {
                    box.classList.remove("selected");
                    box.innerHTML = "";
                });

                colorBox.classList.add("selected");
                colorBox.innerHTML = `<img id="checkIcon" src="./assets/icon/select-icon.svg" alt="Check">`;
                currentColor = Object.keys(color)[0];
            });
        });

        product.options[1].values.forEach((size, index) => {
            const sizeDiv = document.createElement("div");
            const radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "size";

            sizeDiv.appendChild(radioInput);
            sizeDiv.insertAdjacentHTML("beforeend", size);

            if (index === 0) {
                sizeDiv.classList.add("selected");
                radioInput.checked = true;
                currentSize = size;
            }

            sizesContainer.appendChild(sizeDiv);

            sizeDiv.addEventListener("click", () => {
                sizesContainer.querySelectorAll("div").forEach((sizeDiv) => {
                    sizeDiv.classList.remove("selected");
                });

                sizeDiv.classList.add("selected");
                currentSize = size;
                radioInput.checked = true;
            });

            if (index === 0) {
                sizeDiv.click();
            }
        });

        const quantityMinusButton = document.querySelector(".quantity-buttons .minus");
        const quantityPlusButton = document.querySelector(".quantity-buttons .plus");

        quantityMinusButton.addEventListener("click", () => {
            let quantityValue = parseInt(quantityInput.textContent);

            if (quantityValue > 1) {
                quantityValue--;
                quantityInput.textContent = quantityValue;
            }
        });

        quantityPlusButton.addEventListener("click", () => {
            let quantityValue = parseInt(quantityInput.textContent);
            quantityValue++;
            quantityInput.textContent = quantityValue;
        });

        addToCartButton.addEventListener("click", () => {
            cartMessage.innerHTML = `
                <h3 id="message">${product.title} with Color ${currentColor} and Size ${currentSize} added to cart</h3>
            `;
        });
    };
});
