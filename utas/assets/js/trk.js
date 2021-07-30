function bbButtonClickTrack() {
    if (typeof fbq != 'undefined') {
        fbq("track", "BelanjaBioButtonClick");
    }
}

function addToCartTrack(cart) {
    if (typeof fbq != 'undefined') {
        var ids = [];

        $.each(cart.item, function (index, item) {
            ids.push(item.product_guid);
        });

        fbq('track', 'AddToCart', {
            value: cart.total,
            currency: 'IDR',
            content_ids: ids,
            content_type: 'product',
            num_items: cart.item.length,
        });
    }

    if (typeof gtag != 'undefined') {
        var items = [];

        $.each(cart.item, function (index, item) {
            items.push({
                id: item.product_guid,
                name: item.product_name,
                brand: cart.store,
                category: item.product_name,
                quantity: item.qty,
                price: item.price
            });
        });

        gtag('event', 'add_to_cart', {
            "items": items
        });
    }
}

function initiateCheckoutTrack(product_items) {
    if (typeof fbq != 'undefined') {
        var total = 0;
        var ids = [];

        $.each(product_items, function (index, item) {
            total += item.price;
            ids.push(item.id);
        });

        fbq('track', 'InitiateCheckout', {
            value: total,
            currency: 'IDR',
            content_ids: ids,
            content_type: 'product',
            num_items: product_items.length,
        });
    }

    if (typeof gtag != 'undefined') {
        var items = [];
        $.each(product_items, function (index, item) {
            items.push({
                id: item.id,
                name: item.name,
                brand: item.store,
                category: item.name,
                quantity: item.qty,
                price: item.price
            });
        });

        gtag('event', 'checkout_progress', {
            "items": items,
            "coupon": " "
        });
    }
}

function purchaseTrack(order_data) {
    if (typeof fbq != 'undefined') {
        var ids = [];

        $.each(order_data.product_items, function (index, item) {
            ids.push(item.id);
        });

        fbq('track', 'Purchase', {
            value: order_data.total,
            currency: 'IDR',
            content_ids: ids,
            content_type: 'product',
            num_items: order_data.product_items.length,
        });
    }

    if (typeof gtag != 'undefined') {
        var items = [];

        $.each(order_data.product_items, function (index, item) {
            items.push({
                id: item.id,
                name: item.name,
                brand: order_data.store,
                category: item.name,
                quantity: item.qty,
                price: item.price
            });
        });

        gtag('event', 'purchase', {
            "transaction_id": order_data.code,
            "value": order_data.total,
            "currency": "IDR",
            "shipping": order_data.shipping,
            "items": items
        });
    }
}

function viewContentTrack(attr) {
    if (typeof fbq != 'undefined') {
        fbq('track', 'ViewContent', {
            value: attr.price,
            currency: 'IDR',
            content_ids: [attr.id],
            content_type: 'product',
            content_name: attr.name,
            content_category: attr.name,
        });
    }

    if (typeof gtag != 'undefined') {
        gtag('event', 'view_item', {
            "items": [
                {
                    "id": attr.id,
                    "name": attr.name,
                    "brand": attr.store,
                    "category": attr.name,
                    "quantity": 1,
                    "price": attr.price
                }
            ]
        });
    }

    $.get(window.FRONTEND_HOST + 'track/?t=product&p=' + attr.id);
}
