var $cartBtn = $('#product-cart .btn-expand'),
    $productCart = $('#product-cart'),
    $selectedProduct = $('#selected-product'),
    $removeProduct = '.btn-remove',
    $confirmationDialog = $('#product-cart .confirmation-dialog'),
    $btnConfirmDelete = '.btn-confirm-delete',
    $btnCancelDelete = '.btn-cancel',
    $website = $('#website_url'),
    // login form
    $loginForm = $("#login-form"),
    $btnCancel = $('.btn-cancel'),
    $btnVerify = $('.btn-verify'),
    $loginEmail = $('#login-email'),
    $btnLogin = $('#btn-login'),
    $btnSearch = $('#btn-search'),
    $goLogin = $('#go-login'),
    $goRegister = $('.go-register'),
    $areaLogin = $('#login-area'),
    $areaRegister = $('#register-area'),
    $btnCheckout = $('#btn-checkout');

Number.prototype.currency = function () {
    var value = this.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    return value.replace(',00', '');
}

function pushHistory(location) {
    if (!!location && location != 'javascript:;') {
        try {
            window.history.pushState(null, '', location);
        } catch (e) {

        }
    }
}

// remove http(s) on website text and add/keep http(s) on href
if($website.length > 0) {
    var website_url = $website.attr('href'),
    website_text = $website.text(),
    website_replace_http = website_text.replace('http://',''),
    website_replace_https = website_text.replace('https://','');

    if (website_text.indexOf("http") === -1) {
        $website.attr('href','http://'+website_url);
    }
    if (website_text.includes('http')) {
        $website.html(website_replace_http);
    }
    if (website_text.includes('https')) {
        $website.html(website_replace_https);
    }
}

// login form
// open login modal
$btnLogin.on('click', function(){
    // make modal slide from top
    $('#login-form').addClass('from-top, modal-slide');
});

//Search Modal
$btnSearch.on('click', function(){
    $('#search-form').addClass('from-top, modal-slide');
});

// show register form
$goRegister.on('click', function(){
    $emailValue = $('#user_email').val();
    if ($emailValue != "") {
        $('#register_email').val($emailValue);
    }
    $areaLogin.hide();
    $areaRegister.show();
    $loginForm.removeClass('registration-dialog-open');
});

// cancel form dialog
$btnCancel.on('click', function(){
    $loginForm.removeClass('registration-dialog-open');
    $loginForm.removeClass('activation-dialog-open');
});

// show login form
$goLogin.on('click', function(){
    $areaRegister.hide();
    $areaLogin.show();
});

// login before checkout (open login modal)
$('#btn-checkout').on('click', function(){
    // make modal popup
    getVals()
    $('#login-form').removeClass('from-top, modal-slide');
});

// hide & show product on cart dialog
$cartBtn.on('click', function () {
    if ($productCart.hasClass('show')) {
        $productCart.removeClass('show');
    } else {
        $productCart.addClass('show');
    }
});

// hide when click outside product-cart element
$(document).on('click', function (event) {
    if ($productCart.hasClass('show') && !$productCart.hasClass('confirmation')) {
        if (!$(event.target).closest('#product-cart').length) {
            $cartBtn.trigger('click');
        }
    }
    if ($productCart.hasClass('confirmation')) {
        if (!$(event.target).closest('#product-cart').length) {
            $confirmationDialog.addClass('shake animated');
            setTimeout(function () {
                $confirmationDialog.removeClass('shake animated');
            }, 1000);
        }
    }
});

// delete product on cart dialog
$productCart.on('click', $removeProduct, function () {
    $(this).parent().addClass('delete');
    $productCart.addClass('confirmation');
    $($btnConfirmDelete).attr('data-cart-key', $(this).attr('data-cart-key'));
    $productCart.find($removeProduct).attr('disabled', true);
});

// confirm to delete product on cart dialog
$productCart.on('click', $btnConfirmDelete, function () {
    $productCart.find('.product-item.delete').remove();
    $productCart.removeClass('confirmation');
    $($removeProduct).attr('disabled', false);
});

// confirm to cancel delete product on cart dialog
$productCart.on('click', $btnCancelDelete, function () {
    $($removeProduct).parent().removeClass('delete');
    $productCart.removeClass('confirmation');
    $($removeProduct).attr('disabled', false);
});

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
if ($('#store-closed').length > 0) {
    var storeClosed = $('#store-closed').offset().top;
}
var delta = 5;
var navbarHeight = $('#header-page').outerHeight();

$(window).on('scroll', () => didScroll = true);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st < navbarHeight) {
        // Scroll Top
        $('#header-page').removeClass('nav-up').addClass('nav-top');
        $('body').removeClass('is-scrolling');
    } else if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('#header-page').removeClass('nav-down nav-top').addClass('nav-up');
        $('body').addClass('is-scrolling');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('#header-page').removeClass('nav-up').addClass('nav-down');
        }
    }

    if ($('#store-closed').length > 0) {
        if (st > storeClosed) {
            $('#store-closed').addClass('on-top');
        } else {
            $('#store-closed').removeClass('on-top');
        }
    }

    lastScrollTop = st;
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image-preview').attr('src', e.target.result).removeClass('hide');
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#image-upload").change(function (e) {
    var image_upload_field = this;
    e.preventDefault();

    form = new FormData();
    form.append('image', e.target.files[0]);
    elem = $(this);
    uploadBox = $('#image-upload-box');

    uploadBox.addClass('is-loading');

    $.ajax({
        url: window.BASE_URL + 'upload-receipt',
        type: 'POST',
        data: form,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 5000,
        success: function (response) {
            if (response.status == 'success') {
                $('.receipt').val(response.image);
                $('#image-preview').attr('src', response.image);
            }
            uploadBox.removeClass('is-loading');
        },
        error: function (response, textstatus, message) {
            readURL(image_upload_field);
            uploadBox.removeClass('is-loading');
        }
    });

    $(this).parent().find('#upload-text').html('Change image')
});

$('.post-body [data-product-type="link"]').on('click', function () {
    bbButtonClickTrack();
});

// Text copy
$(document).on('click', '.btn-copy', function () {
    var copyText = $(this).prev(".text-to-copy").text().replace(/\D+/g, '');
    var btnStatus = $('<span class="btn-status">Copied</span>')
    var temp = $('<input class="sr-only">');
    $(this).parent().append(temp);
    temp.val(copyText).select();
    document.execCommand("copy");
    temp.remove();

    $(this).append(btnStatus);
    $(this).addClass('is-copied');

    setTimeout(function () {
        btnStatus.parent().removeClass('is-copied');
        btnStatus.remove();
    }, 3000);
});

function getVals(vals) {
    var formBody = $(".checkout-form .card-body")
    var inputs = formBody.find("[name]")
    var obj = {}
    if (!vals) {
        inputs.map(function(item) {
            var inputItem = inputs[item]
            if (inputItem.value) {
                if (inputItem.name === "subdistrict") {
                    obj[inputItem.name] = {
                        text: inputItem.innerText,
                        value: inputItem.value
                    }
                } else {
                    obj[inputItem.name] = inputItem.value
                }
            }
        })
        setTimeout(function() {
            window.localStorage.setItem("checkoutCache", JSON.stringify(obj))
        })
        window.history.pushState("", "", JSON.stringify(obj))
    } else {
        Object.keys(vals).map(function(key) {
            inputs.map(function(item) {
                var inputItem = inputs[item]
                if (inputItem.name === key) {
                    if (inputItem.type == "checkbox") {
                        if (vals["is-dropshiper"] === "true") {
                            setTimeout(function(){
                                $("#"+inputItem.id).attr("checked", true).trigger("change")
                            })
                        }
                    }
                    if (key === "subdistrict") {
                        setTimeout(function() {
                            $("#input_subdistrict").append($("<option selected='selected'></option>").val(vals[key].value).text(vals[key].text)).trigger("change")
                        })
                    } else {
                        console.log(vals["is-dropshiper"])
                        if (key === "name-dropshiper" || key === "phone-dropshiper") {
                            if (vals["is-dropshiper"] === "true") {
                                inputItem.value = vals[key]
                            }
                        } else {
                            inputItem.value = vals[key]
                        }
                    }
                }
            })
        })
    }
}

$(document).on("click", "[data-clipboard]", function() {
    const dataTarget = $(this).attr("data-clipboard")
    const dataTargetAttr = $("[" + dataTarget + "]").attr(dataTarget)
    var copyText = dataTargetAttr
    var btnStatus = $('<span class="btn-status">Copied</span>')
    var temp = $('<input class="sr-only" style="position: absolute; top: 0; opacity: 0;">');
    $(this).parent().append(temp);
    temp.focus();
    temp.val(copyText).select();
    document.execCommand("copy");
    temp.remove();

    $(this).append(btnStatus);
    $(this).addClass('is-copied');

    setTimeout(function () {
        btnStatus.parent().removeClass('is-copied');
        btnStatus.remove();
    }, 3000);
});

// Display option
$('.option-item').on('click', function () {
    $('.option-item').removeClass('is-active');
    var option = $(this).attr("id");
    $(this).addClass('is-active');
    $('#content').removeClass();
    $('#content').addClass(option);
});

var container = $('html, body');
var scrollPosition;
var postStatus;

// Zoom post when display grid is active
$(document).on('click', '#content.display-grid .post-image', function (e) {
    e.preventDefault();
    //window.history.pushState(null, '', $(this).attr('href'));
    pushHistory($(this).attr('href'));
    document.title = $(this).attr('data-title');
    
    postStatus = true;
    var scrollTo = $(this);
    var postDescription = $(this).next();
    var layout = $(this).parents('#content');
    if (typeof container.scrollTop === "function") {
        scrollPosition = container.scrollTop();
    }
    layout.removeClass('display-grid').addClass('display-list');
    postDescription.addClass('is-expanded');
    $('body').addClass('post-is-active');
    setTimeout(function () {
        container.animate({ scrollTop: scrollTo.offset().top }, 0);
        scrollTo.parents('.post').find('.post-content').addClass('is-expanded');
        enableCarousel()
        scrollTrigger()
    }, 50);

    var el = $(this).closest('.post-body');
    var attr = {
        id: el.attr('data-product-guid'),
        price: el.find('.price-regular').html().replace('Rp ', '').replace(/\./g, ''),
        name: el.find('.post-title').html(),
        store: window.STORE
    };

    try {
        viewContentTrack(attr);
    } catch (error) {
    }

    return false;
});

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
  
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
  
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function scrollTrigger() {
    if ($('#content').find('.post').length > 0) {
        // var currentHash = "#initial_hash"
        if($('#content').hasClass('display-list')) {
            $(document).scroll(function() {
                $('.post').each(function(index, el) {
                    clearTimeout($.data(this, 'scrollTimer'));
                    $.data(this, 'scrollTimer', setTimeout(function(){
                        if (isScrolledIntoView(el)){
                            var href = $(el).find('a').attr('href');
                            var value_title = $(el).find('a').attr('data-title');
                            pushHistory(href);
                            document.title = value_title;
                        }
                    }, 250));
                });
            });
        }
    }
}

scrollTrigger()

// back to grid layout with back navigation
//window.history.pushState(null, "", window.location.href);
pushHistory(window.location.href);

window.onpopstate = function () {
    if (postStatus == true) {
        backToGrid();
    }
};

// close post active when display grid is active
$(document).on('click', '.btn-back-to-grid', backToGrid);

// swipe to grid layout
$(document).on('swipe', 'body', backToGrid);

var _imgCrsl = $(".post").find(".img-crsl");

$(".send-as-dropsip-checkbox").on("change", function(e) {
    var toggle = e.currentTarget.checked
    if (toggle) {
        $('#send-as-dropship').val('true')
       } else {
        $('#send-as-dropship').val('false')
    }
});

function enableCarousel() {

    try {
        $('.image-carousel.slick-initialized').slick("destroy");
    } catch(err) {
    }

    if ($("body").hasClass("post-is-active")) {
        $('.image-carousel:not(.slick-initialized)').slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
        });
    }
}

setTimeout(function() {
    if (window.PRODUCTS > 11 && $('.post').length < window.TOTALPRODUCTS) {
        $('#loadmore-wrapper').show();
    }

    $('.ph-shadow').remove();
    $('.post').show();
}, 800);

function backToGrid(e) {
    if (!$(e.target).attr("class").includes("image-carousel")) {

        document.title = window.DISPLAYNAME + ' on Utas' ;
        if (window.FRONTEND_HOST == window.BASE_URL) {
            pushHistory(window.BASE_URL + window.STORE);
        } else {
            pushHistory(window.FRONTEND_HOST);
        }
        postStatus = false;
        container.animate({ scrollTop: scrollPosition }, 0);
        var layout = $('#content');
        clear_search_product(' ');
        $('#btn-loadmore').show();
        layout.removeClass('display-list').addClass('display-grid');
        $('body').find('.post.is-active').removeClass('is-active');
        $('body').removeClass('post-is-active');
        enableCarousel()
    }
}

// expand or shrink post description
$(document).on('click', '#content.display-list .btn-expand-description', function (e) {
    if ($(e.target).closest(".share-link-product").length) {
        return false
    }
    $(this).parents('.post-content').toggleClass('is-expanded');
}); 

// hide sidebar menu
$(document).click(function (event) {
    if (!$(event.target).closest('#navbar-sidebar, #navbar-sidebar .sidebar-body, .navbar-toggler').length) {
        $('body').find('#header.sidebar-active').removeClass('sidebar-active');
    }
});

$btn_submit = $('.btn-submit');

// hide/show info/message box in 1s
// $(function () {
//     setTimeout(function () {
//         $("#info-box").addClass('is-hide')
//         $(".message-info").addClass('is-active')
//     }, 1000);
// });

// trigger to hide info box
$('#info-box .btn-close').on('click', function () {
    $(this).parent().addClass('is-hide')
});

// Show order detail
$('.btn-more').on('click', function () {
    $(this).parent().toggleClass('is-active');
});

// close message
$('.message-info').on('click', '.btn-close', function () {
    $(this).parents('.message-info').removeClass('is-active')
});

// toggle dropdown usermenu on mobile
$('.dropdown-menu-toggle').on('click', function () {
    $(this).parents('.dropdown-user-menu').toggleClass('is-expanded')
});
//# sourceMappingURL=app.js.map

if ($('.page-checkout').length > 0 && $('.service-fee').length > 0 && window.PAYMENT_FEE != undefined) {
    init_payment();
}

function init_payment() {
    // show payment fee amount on each payment
    var fee_va = parseInt(window.PAYMENT_FEE.va),
        fee_ro = parseInt(window.PAYMENT_FEE.ro),
        fee_ewallet = parseInt(window.PAYMENT_FEE.ewallet),
        fee_qr = parseInt(window.PAYMENT_FEE.qr),
        fee_cc = parseInt(window.PAYMENT_FEE.cc),
        
        pay_option = $('[name="payment"]');
        
        // fee + services
        fee_va += parseInt(window.SERVICE_FEE);
        fee_ro += parseInt(window.SERVICE_FEE);
        fee_ewallet += parseInt(window.SERVICE_FEE);
        fee_qr += parseInt(window.SERVICE_FEE);
        fee_cc += parseInt(window.SERVICE_FEE);

    if ($('.payment-options').length > 1) {
        if (typeof window.PAYMENT_FEE.va_stripe != 'undefined') {
            var fee_va_stripe = parseInt(window.PAYMENT_FEE.va_stripe) + parseInt(window.SERVICE_FEE);
            $('#fee_va').html(fee_va_stripe.currency() + ' - ' + fee_va.currency());
        } else {
            $('#fee_va').html(fee_va.currency());
        }
        
        $('#fee_ro').html(fee_ro.currency());
        $('#fee_ewallet').html(fee_ewallet.currency());
        $('#fee_qr').html(fee_qr.currency());
    
        pay_option.change(function(){
            $('.payment-options').prev().find('.badge').removeClass('badge-warning').addClass('text-muted badge-light');
            $('.payment-options').prev().find('.btn-help').addClass('d-none');
            $(this).parents('.payment-options').prev().find('.badge').removeClass('text-muted badge-light').addClass('badge-warning');
            $(this).parents('.payment-options').prev().find('.btn-help').removeClass('d-none');
        });
    }
}

// checkout
if ($('.dropdown-subdistrict').length > 0) {
    window.VOUCHER_DISCOUNT = 0;

    if ($('.dropdown-subdistrict').val() != '') {
        $('.dropdown-ongkir').html('');
        $btn_submit.attr('disabled', '');
        
        get_ongkir();
    }

    $('.dropdown-subdistrict').select2({
        placeholder: window.WRITE_DISTRICT,
        minimumInputLength: 3,
        ajax: {
            url: window.BASE_URL + 'ajax-destination',
            dataType: 'json',
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.label,
                            id: item.subdistrict_id
                        }
                    })
                };
            }
        }
    });

    $('.dropdown-subdistrict').on('change', function () {
        $('.dropdown-ongkir').html('');
        $btn_submit.attr('disabled', '');

        get_ongkir(); 
    });

    $('.dropdown-ongkir').on('change', function () {
        shipping_insurance_value = parseInt($(this).find(':selected').attr('data-insurance-value'));

        if (shipping_insurance_value > 0) {
            $(this).closest('.group-footer').find('.insurance-value').html(shipping_insurance_value.currency());
            $(this).closest('.group-footer').find('[class*="insurance-"]').show();

            if (parseInt($(this).find(':selected').attr('data-insurance-recommended')) == 1) {
                $(this).closest('.group-footer').find('.insurance-checkbox').attr('checked', 'checked');
            }
        } else {
            $(this).closest('.group-footer').find('.insurance-value').html('');
            $(this).closest('.group-footer').find('[class*="insurance-"]').hide();
        }
        calculate();
    });
}

$(document).on('click', '.insurance-checkbox', function() {
    calculate();
});

// get service fee
$('[name="payment"]').on('click', function() {
    if ($(this).val() == 'cc') {
        $('.card-details').show();
    } else {
        $('.card-details').hide();
    }
    calculate();
});

window.VOUCHER_DISCOUNT = 0;
calculate();

// voucher
$(document).on('click', '#voucher_label .btn-link', function() {
    $(this).parents('#voucher_label').hide(100);
    $('#voucher_code .voucher-code').focus();
    $('#voucher_code').removeClass('mt-2');
});

$(document).on('click', '.btn-apply-voucher', function() {

    var $button_apply_voucher = $(this);
    var $input_voucher_code = $('.voucher-code');
    var $hidden_voucher_code = $('[name="voucher"]');

    if ($button_apply_voucher.hasClass('btn-primary')) {
        $.post(window.FRONTEND_HOST + 'ajax-voucher', {
            store: window.STORE,
            code: $input_voucher_code.val()
        }, function (response) {
            if (response.status == 'success') {
                window.VOUCHER_DISCOUNT = response.value;

                if (window.VOUCHER_DISCOUNT > parseInt(window.CART_TOTAL)) {
                    window.VOUCHER_DISCOUNT = window.CART_TOTAL;
                }

                $('.voucher-discount').show();
                $('.voucher-discount').next().show();
                $('.voucher-discount').find('span').html(parseInt(window.VOUCHER_DISCOUNT).currency());
                $input_voucher_code.attr('disabled', '');
                $hidden_voucher_code.val($input_voucher_code.val());
                
                $button_apply_voucher.removeClass('btn-primary').addClass('btn-danger').html('Batalkan');
    
                calculate();
            } else {
                alert(response.message);
            }
        });
    } else {
        $('.voucher-discount').hide();
        $('.voucher-discount').next().hide();
        $('.voucher-discount').find('span').html('');
        $input_voucher_code.removeAttr('disabled');
        $hidden_voucher_code.val('');
        
        window.VOUCHER_DISCOUNT = 0;
        $button_apply_voucher.removeClass('btn-danger').addClass('btn-primary').html('Pakai');

        calculate();
    }

});

function calculate() {
    if ($('.product-box').length > 0) {
        var shipping_price = 0;
        var shipping_discount = 0;
        var shipping_insurance_value = 0;
        
        if (window.SHIP_DISCOUNT_TYPE == 'nominal') {
            shipping_discount = parseInt(window.SHIP_DISCOUNT);
        }

        $.each($('.dropdown-ongkir'), function (index, item) {
            current_shipping_price = parseInt($(item).find(':selected').attr('data-cost'));
            if (!isNaN(current_shipping_price)) {
                shipping_price += current_shipping_price;
            }

            current_shipping_discount = parseInt($(item).find(':selected').attr('data-ship-discount'));
            if (!isNaN(current_shipping_discount)) {
                shipping_discount += current_shipping_discount;
            }

            is_insurance = $(item).closest('.group-footer').find('input[type="checkbox"]:checked').val();
            if (typeof is_insurance != 'undefined') {
                shipping_insurance_value += parseInt($(item).find(':selected').attr('data-insurance-value'));
            }
        });

        if (window.SHIP_DISCOUNT_TYPE == 'percent') {
            shipping_discount_minimum_percent_value = Math.round(parseInt(window.SHIP_DISCOUNT) / 100 * shipping_price);
            shipping_discount += shipping_discount_minimum_percent_value;

            $('[name="shipping_discount_minimum_percent_value"]').val(shipping_discount_minimum_percent_value);
        }

        if (shipping_discount > shipping_price) {
            shipping_discount = shipping_price;
        }

        if (shipping_discount > 0) {
            $('.shipping-discount-info').show();
            $('.shipping-discount-price').html(shipping_discount.currency());
        }

        shipping_price += shipping_insurance_value;
        $('.shipping-price').html(shipping_price.currency());
        voucher_discount = parseInt(window.VOUCHER_DISCOUNT);
        if (voucher_discount > parseInt(window.CART_TOTAL)) {
            total = shipping_price + parseInt(window.SHIP_COST);
        } else {
            total = shipping_price + parseInt(window.SHIP_COST) + parseInt(window.CART_TOTAL) - voucher_discount;
        }

        total -= shipping_discount;

        // calculate fees
        if ($('.service-fee').length > 0) {
            var payment_name = $('[name="payment"]:checked').val();
            if (typeof payment_name != 'undefined') {
                if (payment_name == 'alfamart' || payment_name == 'indomaret') {
                    var fee = parseInt(window.PAYMENT_FEE.ro);
                } else if (payment_name == 'dana' || payment_name == 'linkaja' || payment_name == 'ovo') {
                    var fee = parseInt(window.PAYMENT_FEE.ewallet);
                } else if (payment_name == 'qris') {
                    var fee = parseInt(window.PAYMENT_FEE.qr);
                } else if (payment_name == 'cc') {
                    var fee = parseInt(window.PAYMENT_FEE.cc);
                } else if ((payment_name == 'bca' || payment_name == 'bni') && typeof window.PAYMENT_FEE.va_stripe != 'undefined'){
                    var fee = parseInt(window.PAYMENT_FEE.va_stripe);
                } else {
                    var fee = parseInt(window.PAYMENT_FEE.va);
                }

                fee += parseInt(window.SERVICE_FEE) 
                $('.service-fee').html(fee.currency());

                total += fee;
            }
        }

        window.TOTAL = total;
        $('.total').html(total.currency());
    }
}

$btn_submit.on('click', function(e) {
    window.localStorage.removeItem("formCache")
    if ($('[name="payment"]:checked').val() == 'cc') {
        e.preventDefault();
        var $form = $('.checkout-form'); 
        var card_number = $form.find('#card_number').val();
        var card_exp_month = $form.find('#card_exp_month').val();
        var card_exp_year = $form.find('#card_exp_year').val();
        var card_cvn = $form.find('#card_cvn').val();

        if (!Xendit.card.validateCardNumber(card_number)) {
            alert('Invalid card number');
        } else if (!Xendit.card.validateExpiry(card_exp_month, card_exp_year)) {
            alert('Invalid expiry');
        } else if (!Xendit.card.validateCvn(card_cvn)) {
            alert('Invalid cvn');
        } else {
            // Disable the submit button to prevent repeated clicks:        
            $btn_submit.prop('disabled', true);
            
            // Request a token from Xendit:        
            Xendit.card.createToken({        
                amount: window.TOTAL,
                card_number: card_number,
                card_exp_month: card_exp_month,
                card_exp_year: card_exp_year,
                card_cvn: card_cvn,
                is_multiple_use: false        
            }, xenditResponseHandler); 
        }
    }
});

function xenditResponseHandler(err, creditCardCharge) {
    if (creditCardCharge.status === 'VERIFIED') {
        $('#cc-form').modal('hide');
        var $form = $('.checkout-form'); 
        
        // Get the token ID:        
        var token = creditCardCharge.id;        
        
        // Insert the token into the form so it gets submitted to the server:        
        $form.append($('<input type="hidden" name="token_id" />').val(token));        
        
        // Submit the form to your server:
        $form.get(0).submit();
    } else if (creditCardCharge.status === 'IN_REVIEW') {        
        $('#cc-iframe').attr('src', creditCardCharge.payer_authentication_url);
        $('#cc-form').modal('show');
        $btn_submit.prop('disabled', false);
    } else if (creditCardCharge.status === 'FAILED') {        
        // $('#error pre').text(creditCardCharge.failure_reason);        
        $('#cc-form').modal('hide');
        $btn_submit.prop('disabled', false);
    }     
}

function get_ongkir() {
    $.post(window.FRONTEND_HOST + 'ajax-ongkir', {
        store: window.STORE,
        to: $('.dropdown-subdistrict').val()
    }, function (response) {
        // console.log(response);
        var i = 0;
        response.forEach(function (group) {
            var options = '';

            group.forEach(function (item) {
                options += '<option value="' + item.value + '" data-cost="' + item.cost + '" data-ship-discount="' + item.shipping_discount + '" data-insurance-value="' + item.insurance_value + '" data-insurance-recommended="' + item.insurance_recommended + '">' + item.label + '</option>';
            });

            $('.dropdown-ongkir').eq(i).html(options).select2().show();
            i++;
        });

        calculate();
        $btn_submit.removeAttr('disabled');
    });
}

// optin form
$(document).on('click', '[data-product-type="optin"]', function () {
    var el = $(this);

    $.post(window.BASE_URL + 'ajax-form', {
        store: window.STORE,
        form_id: el.find('.btn-checkout').attr('data-form-id')
    }, function (response) {
        if (window.UTAS) {
            var $form = $($.parseHTML(response));
            var output = '';
    
            $.each($form.find('input, textarea, select'), function(key, value) {
                console.log(key);
                var field = $(value);
                field.addClass('form-control');
    
                if (field.attr('placeholder') == '' || typeof field.attr('placeholder')) {
                    field.attr('placeholder', field.attr('name'));
                }
    
                var field_output = $('#template-field').html()
                    .replace(/%field%/g, field[0].outerHTML);
    
                output += field_output;
            });
        } else {
            var $form = $($.parseHTML(response)).find('#keform');
            var output = '';
            var length = $form.find('.full').length;
    
            for (j = 0; j < length; j++) {
                var field = $form.find('.full').eq(j).find('input, textarea, select');
                field.addClass('form-control');
    
                var field_output = $('#template-field').html()
                    .replace(/%field%/g, field[0].outerHTML);
    
                output += field_output;
            }

            $('.btn-optin-submit').html($form.find('.kirimemail-btn-submit').html());
        }

        $('#optin-form form').attr('action', $form.attr('action'));

        $('.scroll-area').html(output);
        $('.modal-title').html(el.closest('.post-body').find('.post-title').html());

        // display form

        $('#optin-form').modal('show');
    });

});

// show product details
$(document).on('click', '.display-list .btn-checkout', function (e) {
    //window.history.pushState(null, '', $(this).attr('href'));
    pushHistory($(this).attr('href'));

    if ($(this).hasClass('redirect') === false) {
        e.preventDefault();
    }

    var $product_modal = $('#product-detail');
    var $parent = $(this).closest('.post-body');
    window.PARENT_EL = $parent;
    var $variant_qty = $('.variant-qty');
    var wholesale_price = $parent.attr('data-wholesale-price');

    $variant_qty.val(1);
    if (wholesale_price != '[]' && wholesale_price != '' && wholesale_price != '[{"qty":"","price":""}]') {
        window.WHOLESALE_PRICE = JSON.parse(wholesale_price);
    } else {
        window.WHOLESALE_PRICE = '';
    }

    if (($parent.attr('data-product-type') == 'physical' && parseInt($parent.attr('data-stock')) > 0)) {
        if ($parent.find('.price-sale').length > 0) {
            var price = $parent.find('.price-sale').html();
        } else {
            var price = $parent.find('.price-regular').html();
        }

        price = parseInt(price.replace('Rp ', '').replace('.', '')).currency();
        $product_modal.find('.product-title').html($parent.find('.post-title').html());
        $product_modal.find('.price-regular').html(price);
        $product_modal.find('.product-image').attr('src', $parent.find('[data-slick-index=0]').find("img").attr('src'));
        $product_modal.find('.btn-add').attr('data-product-guid', $parent.attr('data-product-guid')).attr('data-image', $parent.attr('data-image'));

        // set product variant
        if ($parent.attr('data-is-variant') == 1) {
            var variant_item = ($parent.attr('data-variant-item').split(','));

            $product_modal.find('.product-variant').show();
            $product_modal.find('.variant-label').html($parent.attr('data-variant'));

            dropdown = '';
            for (i = 0; i < variant_item.length; i++) {
                item = variant_item[i].split(':');

                // 0 variant name
                // 1 stock

                // set default max
                if (i == 0) {
                    $variant_qty.attr('max', item[1]);
                    $product_modal.find('.product-stock').html(item[1]);
                }

                if (item[0] != 'default' && item[1] > 0) {
                    dropdown += '<option value="' + item[0] + '" max="' + item[1] + '">' + item[0] + '</option>';
                }
            }

            $product_modal.find('.variant-dropdown').html(dropdown);
        } else {
            $product_modal.find('.product-variant').hide();
            $product_modal.find('.variant-dropdown').html('');
            $product_modal.find('.product-stock').html($parent.attr('data-stock'));

            if ($parent.attr('data-product-type') == 'digital') {
                $variant_qty.attr('max', 1);
            } else {
                $variant_qty.attr('max', $parent.attr('data-stock'));
            }
        }

        $('#product-detail').modal('show');
    } else if ($parent.attr('data-product-type') == 'digital') {
        add_to_cart($parent.attr('data-product-guid'), $parent.attr('data-image'));
    }
});

// on variant change
$(document).on('change', '.product-variant', function () {
    $('.variant-qty').val(1);
    var max = $(this).find(':selected').attr('max');
    $('.variant-qty').attr('max', max);
});

$(document).on('change keyup', '.variant-qty', function () {
    var el = $(this);
    var max = parseInt(el.attr('max'));
    var current_value = parseInt(el.val());

    if (current_value > max) {
        el.val(max);
    } else if (current_value < 1) {
        el.val(1);
    }
});

function change_qty(el, mode) {
    var max = parseInt(el.attr('max'));

    if (mode == 'add') {
        var current_qty = parseInt(el.val()) + 1;
    } else {
        var current_qty = parseInt(el.val()) - 1;
    }

    if (current_qty > max) {
        el.val(max);
    } else if (current_qty < 1) {
        el.val(1);
    } else {
        el.val(current_qty);
    }

    if (typeof window.PARENT_EL == 'undefined') {
        window.PARENT_EL = $('.post-body[data-product-guid="' + el.attr('data-product-guid') + '"]');
    }

    if (window.PARENT_EL.find('.price-sale').length > 0) {
        applied_value = parseInt(window.PARENT_EL.find('.price-sale').html().replace('Rp ', '').replace('.', '')).currency();
    } else {
        applied_value = parseInt(window.PARENT_EL.find('.price-regular').html().replace('Rp ', '').replace('.', '')).currency();
    }
    
    if (window.WHOLESALE_PRICE != '' && current_qty > 1) {
        $(window.WHOLESALE_PRICE).each(function(index, value) {
            if (current_qty >= value.qty) {
                applied_value = parseInt(value.price).currency();
            }
        });
    }
    
    $('.modal-dialog .price-regular').html(applied_value);

    if (el.hasClass('product-quantity')) {
        update_qty(el);
    }
}

var qty_timer;

function update_qty(el) {
    var max = parseInt(el.attr('max'));
    var current_value = parseInt(el.val());

    if (current_value > max) {
        el.val(max);
    } else if (current_value < 1) {
        el.val(1);
    }

    var current_qty = el.val();
    var cart_key = el.attr('data-cart-key');
    clearTimeout(qty_timer);

    qty_timer = setTimeout(function () {
        el.attr('disabled', 'disabled');
        $('.user-cart').find('.btn-plus, .btn-minus').attr('disabled', '');
        $.post(window.FRONTEND_HOST + 'ajax-update-qty', {
            store: window.STORE,
            product: cart_key,
            qty: current_qty
        }, function (response) {
            render_cart(response);
        });
    }, 500);
}

// on change qty

$(document).on('change, keyup', '.product-quantity', function () {
    update_qty($(this));
});


$(document).on('click', '.btn-plus', function () {
    change_qty($(this).closest('.input-group').find('input'), 'add');
});

$(document).on('click', '.btn-minus', function () {
    change_qty($(this).closest('.input-group').find('input'), 'reduce');
});


// add to cart
function add_to_cart(product_guid, image, variant = '', qty = 1) {
    $.post(window.FRONTEND_HOST + 'ajax-add-item', {
        store: window.STORE,
        product: product_guid,
        image: image,
        variant: variant,
        qty: qty
    }, function (response) {
        render_cart(response);
        $('.cart-info .text').html('Product added successfully');
        $('.cart-info').removeClass('is-deleted').slideDown(100);
        $('.cart-info').delay(2000).fadeOut(100);
        $('#product-detail').modal('hide');
    });
}

$(document).on('change', '.variant-dropdown', function () {
    var $product_modal = $('#product-detail');
    $product_modal.find('.product-stock').html($(this).children('option:selected').attr('max'));
});

$(document).on('click', '.btn-add', function () {
    var product_guid = $(this).attr('data-product-guid');

    add_to_cart(product_guid, $(this).attr('data-image'), $('.variant-dropdown').val(), $('.variant-qty').val());
});

$(document).on("click", ".btn-remove-checkout", function() {
    $('#product-cart').removeClass("d-block")
    $('#product-cart').addClass("d-none")
})

$(".product-cart-checkout-overlay, .btn.cancel").on("click", function() {
    $(".btn-remove-checkout").trigger("click")
})

$(".btn.cancel").on("click", function() {
    $cartBtn.trigger('click');
})

$('.btn-add-checkout').on('click', function () {
    var $parent = $(this).closest(".product-item");
    window.PARENT_EL = $parent;
    get_cart();
    $('#product-cart').addClass("d-block");
    setTimeout(function() {
        $('#product-cart').addClass("show");
    })
});

// remove from cart
$(document).on('click', '.btn-confirm-delete', function () {
    var el = $(this);
    var parent = el.closest('.product-item-group');
    var key = $(this).attr('data-cart-key');

    $.post(window.FRONTEND_HOST + 'ajax-remove-item', {
        store: window.STORE,
        product: key,
    }, function (response) {
        window.CART_TOTAL = response['total'];
        window.SERVICE_FEE = response['service_fee'];

        if (window.PAYMENT_FEE != undefined) {
            init_payment();
        }

        $('.cart-info .text').html('Product deleted successfully');
        $('.cart-info').addClass('is-deleted').slideDown(100).delay(2000).fadeOut(100);

        // count product-item
        var product_count = $('.product-item').length;
        console.log(product_count);
        product_count--;

        // hide #product-cart when product item is 0
        if (product_count == 0) {
            $productCart.delay(2500).removeClass('show').slideUp(100);
            $('body').removeClass('cart-is-active');   
        }

        // if checkout page
        if ($('.dropdown-ongkir').length > 0) {
            if (window.CART_TOTAL == 0) {
                window.location.href = window.BASE_URL + '/' + window.STORE;
            }

            el.closest('.product-item').remove();
            if (parent.find('.product-item').length == 0) {
                parent.remove();
            }

            // check product group
            $.each($('.product-box'), function (index, item) {
                if ($(item).find('[data-product-type="physical"]').length == 0) {
                    $(item).find('.shipping-info').remove();
                }
            });

            // if only digital product remains
            if (response['type'] == 'digital') {
                $('.shipping-info').remove();
                $btn_submit.removeAttr('disabled');
            }

            calculate();
        } else {
            product = key.split('-');
            $('.btn-checkout[data-product-guid="' + product[0] + '"]').html('Beli');

            render_cart(response);
        }
    });
});

function get_cart() {
    $.post(window.FRONTEND_HOST + 'ajax-get-item', {
        store: window.STORE
    }, function (response) {
        render_cart(response);
    })
}

function render_cart(cart) {
    if (cart != '') {
        var output = '';
        var item_count = 0;

        for (var key in cart.item) {
            var value = cart.item[key];

            if (value.product_type == 'digital') {
                var hide_btn = 'style="display:none;"';
            } else {
                var hide_btn = '';
            }
            output += $('#template-cart-item').html()
                .replace(/%hide_btn%/g, hide_btn)
                .replace(/%name%/g, value.product_name)
                .replace(/%qty%/g, value.qty)
                .replace(/%price%/g, parseInt(value.product_price * value.qty).currency())
                .replace(/%image%/g, value.product_image)
                .replace(/%qty_max%/g, value.qty_max)
                .replace(/%product_guid%/g, value.product_guid)
                .replace(/%cart_key%/g, key);

            $('.btn-checkout[data-product-guid="' + value.product_guid + '"]').html( window.BUY_AGAIN );
            item_count++;
        }

        $('.user-cart').html(output);
        $('#total-product-selected').html(Object.keys(cart.item).length);
        $('.total-cart-price').html(parseInt(cart.total).currency());

        if (item_count > 0 && !$('body').hasClass('page-checkout')) {
            $('#product-cart').show().parents('body').addClass('cart-is-active');
        }

        addToCartTrack(cart);
    }
}

if ($('.display-list').length > 0) {
    var element_id = $('#content').attr('data-slug');
    var checkExist = setInterval(function () {
        var element_id = $('#content').attr('data-slug');
        if ($('#' + element_id).length) {
            element = document.getElementById(element_id);
            element.scrollIntoView(true);
            clearInterval(checkExist);
        }
    }, 100);
}

if ($('#product-cart').length > 0) {
    get_cart();
}

// if is single product page
if ($('.post-is-active').length > 0) {
    var slug = $('#content').attr('data-slug');
    var el = $('#' + slug).find('.post-body');

    var price = el.find('.price-regular').html();

    setTimeout(function() {
        $('html, body').animate({
            scrollTop: $('.post#' + window.SLUG).offset().top
        }, 10);
    }, 1500);

    if (typeof price != 'undefined') {
        viewContentTrack({
            id: el.attr('data-product-guid'),
            price: price.replace('Rp ', '').replace(/\./g, ''),
            name: el.find('.post-title').html(),
            store: window.STORE
        });
    }
}

// if checkout page
if ($('.page-checkout').length > 0) {
    var product_items = [];

    $.each($('.product-item'), function (index, item) {
        product_key = $(item).find('button').attr('data-cart-key').split('-');
        if ($(item).find('.qty').length > 0) {
            var qty = parseInt($(item).find('.qty').html());
        } else {
            var qty = 1;
        }
        product_items.push({
            id: product_key[0],
            name: $(item).find('.product-title').html(),
            store: window.STORE,
            qty: qty,
            price: parseInt($(item).find('.product-price').html().replace('Rp ', '').replace(/\./g, '')) / qty,
        });
    });

    initiateCheckoutTrack(product_items);
}

// if thank you page
if ($('.page-thankyou').length > 0) {
    purchaseTrack(JSON.parse(window.ORDER));
}

$('#register-email').submit(function(e){
    e.preventDefault();
    $emailValue = $('#register_email').val();
    $('.btn-register').addClass('is-loading').attr('disabled','disabled').text('Send verification code ...');
    $.post(window.FRONTEND_HOST + 'register', {
        store: window.STORE,
        email: $('#register_email').val(),
    }, function (response) {
        $('.btn-register').removeClass('is-loading').removeAttr('disabled').text('Sign up now');
        $('#register-form').slideUp();
        $('#activation-verify').slideDown();
        $("#mailto").html($emailValue);   
        
    });
});

$('#login-email').on('submit', (e) => {
    e.preventDefault();
    $emailValue = $('#user_email').val();
    $('.btn-process-login').addClass('is-loading').attr('disabled','disabled').text('Sending login code ...');
    $.post(window.FRONTEND_HOST + 'login', {
        store: window.STORE,
        email: $('#user_email').val(),
    }, function (response) {
        if (response.length == 0) {
            $('.btn-process-login').removeClass('is-loading').removeAttr('disabled').text('Login Now');
            $('#login-form').addClass("registration-dialog-open");
        } else {
            $("#mailto").html($emailValue);
            $('.login-hash').val(response);
            $('#login-email').slideUp();
            $('#login-verify').slideDown();
        }
    });
});

$('.btn-save-address').on('click', function() {
    $.post(window.FRONTEND_HOST + 'save-address', {
        store: window.STORE,
        name: $('#member-area [name="name"]').val(),
        phone: $('#member-area [name="phone"]').val(),
        address: $('#member-area [name="address"]').val(),
        postal_code: $('#member-area [name="postal_code"]').val(),
        subdistrict_id: $('#member-area [name="subdistrict_id"]').val(),
    }, function (response) {
       $('#member-area').modal('hide');
    });
});

function load_product() {
    var offset = parseInt($('#btn-loadmore').attr('data-offset'));
    $.post(window.FRONTEND_HOST + 'ajax-load-product', {
        store: window.STORE,
        offset: offset,
    }, function (response) {
        if (response == '') {
            $('#loadmore-wrapper').fadeOut(100);
        } else {
            $('#content').append(response);
            setInterval(()=> { 
                $('.ph-shadow').remove();
                $('.avatar img').show();
                $('.post').show();
            }, 800);
            $('#btn-loadmore').removeClass('is-loading');
            $('#btn-loadmore').data('is-loading');
            $('#btn-loadmore').attr('data-offset', $('#content .post').length);
            enableCarousel();
        }
        if (window.PRODUCTS == 0) {
            $('#loadmore-wrapper').fadeOut(100);
        }

        if(window.TOTALPRODUCTS < 3){
            var layout = $('#content');
            layout.removeClass('display-grid').addClass('display-list');
        }

        if ($('.post').length == window.TOTALPRODUCTS) {
            $('#loadmore-wrapper').hide();
        }
    });
}

$('#btn-loadmore').on('click', function() {
    $(this).addClass('is-loading');
    load_product();
});

$('#search').keyup(function(e){
    var keyword = $('#search').val();
    if(e.keyCode == 13) {
        $('#search-form').modal('hide');
        $('#loadmore-wrapper').hide();
        $('.content1').hide();
        search_product(keyword);
     }
});

function search_product(keyword)
{
    $.post(window.FRONTEND_HOST + 'ajax-search-product', {
        store: window.STORE,
        keyword: keyword,
    }, function (response) {

        $('.content2').show();

        if (response == '') {
            $('#search').val('');
            //ajax_alert(response);
            $('.content2').hide();
            $('.content1').show();
            alert("product does not exist!");
        } else {
            $('#search').val('');
            $('.content2').html(response);
            $('body').addClass('post-is-active');
        }
        
    });
}

function clear_search_product(keyword)
{
    $('.content2').hide();
    $('.content1').show();
    $('#search').val('');
}

function ajax_alert(message) {
    swal.fire({
        text: message,
        showConfirmButton: true,
        title: 'product does not exist',
        type: 'warning'
    })
}

function mark_alert(result, message) {
    let type = result ? 'success' : 'error';
    sweetAlert({
        text: message,
        showConfirmButton: true,
        title: '',
        type: type
    })
}

function convert_time(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// countdown timer
if ($('.page-thankyou').length != 0) {
    function makeTimer() {

    var endTime = new Date(window.ENDTIME);			
        endTime = (Date.parse(endTime) / 1000);

        var now = new Date();
        now = (Date.parse(now) / 1000);

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400); 
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if (hours < "10") { hours = "0" + hours; }
        if (minutes < "10") { minutes = "0" + minutes; }
        if (seconds < "10") { seconds = "0" + seconds; }

        $("#days").html(days);
        $("#hours").html(hours);
        $("#minutes").html(minutes);
        $("#seconds").html(seconds);
        
        $('#timer').slideDown(100);
    }

    setInterval(function() { 
        makeTimer();
    }, 1000);
}

$('.switch_theme').on('click', function() {
    var data = $(this).attr('data-theme');
    change_theme(data);
    $('body').addClass(data);

    if(data == 'dark')
    {
        $('body').removeClass('light').addClass('dark');
        
    } else{
        $('body').removeClass('dark').addClass('light');
    }

});

//ini buat simpan session theme
function change_theme(data) {    
    $.post(window.FRONTEND_HOST + 'ajax-change-theme', {
        store: window.STORE,
        data_theme: data,
    }, function (response) {
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    // testimoi buyer
    const buyerName = $(".testimoni-buyer").find(".buyer-name")
    const buyerNameVal = buyerName.val();

    $("#checkbox-testimoni").on("change", function(e) {
        if (e.target.checked) {
            const anonym = buyerNameVal.replace(buyerNameVal.substr(2,buyerNameVal.length-4), buyerNameVal.substr(1,buyerNameVal.length-3).replace(/./g,"*"))
            buyerName.val(anonym)
        } else {
            buyerName.val(buyerNameVal)
        }
    })

    $(".rating-stars").ratingStars({
        selectors: {
        starsSelector: '.rating-stars',
        starSelector: '.rating-star',
        starActiveClass: 'is--active',
        starHoverClass: 'is--hover',
        starNoHoverClass: 'is--no-hover',
        targetFormElementSelector: '.rating-value'
        }
    });

    var loc = window.location
    var formCache = window.localStorage.getItem("checkoutCache")
    if (loc.pathname.split("/")[2] === "checkout") {
        getVals(JSON.parse(formCache))
    } else {
        if (formCache) {
            window.localStorage.removeItem("checkoutCache")
        }
    }

    // modal direct checkout
    var shareLinkModal = $("#share-link-modal");
    shareLinkModal.on("show.bs.modal", function(e) {
        var data = $(e.relatedTarget).attr("data-share-link");
        var linkProduct = data;
        var linkCheckout = data + "?checkout=1"
        var linkCheckoutTitle = $(this).find(".link-checkout-title");
        var linkProductTitle = $(this).find(".link-product-title");
        linkProductTitle.attr("data-clipboard-link-product", linkProduct)
        linkCheckoutTitle.attr("data-clipboard-link-checkout", linkCheckout)
    })

    // load product
    if ($('#btn-loadmore').length > 0) {
        if ($('#content .post').length == 0) {
            load_product();
        } else {
            $('#btn-loadmore').attr('data-offset', $('#content .post').length)
        }
    }

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);
});

window.onload = (event) => {
    $('.ph-shadow').remove();
    $('.avatar img').show();
    $('.post').show();
    enableCarousel();
}

$(function () {
    function get_search_data() {
        var data = {
        };
    
        return data;
    }
    
    var datatable_params = {
        lengthChange: false,
        searching: true,
        processing: true,
        serverSide: true,
        responsive : true,
        initComplete: function(settings, json) {
            $('body').removeClass('is-loading');
        },
        ajax: {
            url: window.FRONTEND_HOST + window.STORE + '/member-area/listener',
            data: function (d) {
                jQuery.extend(d, get_search_data());
            }
        },
        columns: [
            {data: null, bSearchable: true, bSortable: false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: 'code', name: 'code', bSearchable: true, bSortable: true,
                render: function (data, type, full, meta) {
                    return '<a href="#">' + full.code + '</a>';
                }
            },
            {data: 'name', name: 'name', bSearchable: true, bSortable: false},
            {data: 'status', name: 'status', bSearchable: false, bSortable: true,
                render: function (data, type, full, meta) {
                    if (full.status == 0) {
                        return '<span class="badge badge-light">Pending</span>';
                    } else if (full.status == 1) {
                        return '<span class="badge badge-warning">Processing</span>';
                    } else if (full.status == 2) {
                        return '<span class="badge badge-primary">Shipping</span>';
                    } else if (full.status == 3) {
                        return '<span class="badge badge-success">Completed</span>';
                    } else {
                        return '<span class="badge">Cancelled</span>';
                    }
                }
            },
            {data: 'payment_status', name: 'payment_status', bSearchable: false, bSortable: true,
                render: function (data, type, full, meta) {
                    if (full.payment_status == 1) {
                        return '<span class="badge badge-success">Paid</span>';
                    } else {
                        return '<span class="badge badge-light">Unpaid</span>';
                    }
                }
            },
            {data: 'created_at', name: 'created_at', bSearchable: false, bSortable: true,
                render: function (data, type, full, meta) {
                    return convert_time(full.created_at);
                }
            },
            {data: 'total', name: 'total', bSearchable: false, bSortable: true,
                render: function (data, type, full, meta) {
                    return parseInt(full.total).currency();
                }
            },
            {data: 'action', name: 'action', bSearchable: false, bSortable: false,
                render: function (data, type, full, meta) {

                    var dropdown =  $('#template-dropdown-purchase').html();
    
                    if (full.payment_status == 1) {
                        style_paid = 'style="display:none"';
                        style_unpaid = '';
                    } else {
                        style_paid = '';
                        style_unpaid = 'style="display:none"';
                    }
    
                    if (full.cart_type == 'physical') {
                        style_complete = 'style="display:none"';
                        style_tracking = '';
                    } else {
                        style_complete = '';
                        style_tracking = 'style="display:none"';
                    }
    
                    if (full.waybill) {
                        tracking = ''
                    } else {
                        tracking = 'display:none';
                    }
                    
                    if (full.status == 2 && full.payment_status == 1){
                        var output = $('#template-action').html()
                        .replace(/%dropdown%/g, dropdown);
                    }else if( full.payment_status == 1 && full.cart_type == 'digital' ){
                        var output = $('#template-action').html()
                        .replace(/%dropdown%/g, dropdown);
                    } else{
                        var output = $('#template-action').html()
                        .replace(/%dropdown%/g, '');
                    }
                    
    
                    output = output.replace(/%code%/g, full.code)
                    .replace(/%id%/g, full.id)
                    .replace(/%cart_type%/g, full.cart_type)
                    .replace(/%style_paid%/g, style_paid)
                    .replace(/%style_unpaid%/g, style_unpaid)
                    .replace(/%style_complete%/g, style_complete);
    
                    return output;
                }
            }
        ]
    };
    
    if ($('#datatable').find('th').length == 7) {
        datatable_params.columns.splice(7,1);
        datatable_params.columns.splice(0,1);
    }
    
    var table = $('#datatable').DataTable(datatable_params);

    $('.search').keyup(function(){
        table.search($(this).val()).draw();
    });

    $(document).on('click', '.btn-action-complete', function() {
        var el = $(this);
        $('body').addClass('is-loading');
        mark_order(el);
    
    });
    
    function mark_order(el) {
    
        var status = el.attr('data-status');
        var id = el.attr('data-code');
    
        $('#order-completed').modal('hide');
    
        $.post(window.FRONTEND_HOST + window.STORE + '/member-area/mark-order', {
            'id' : id,
            'status' : status
        }, function(response) {
            table.draw();
            mark_alert(response.status, response.message);
            $('body').removeClass('is-loading');
        });
    
    }
    
});

$(document).on('click', '.view-order-history', function() {
    let code = $(this).attr('data-code');
    window.code = code;
    show_detail_order(code);
});

function show_detail_order(code) {
    $('#orderDetail').addClass('is-loading');
    
    $.post(window.FRONTEND_HOST + window.STORE + '/member-area/get-order', {
        'code' : code
    }, function(response) {
        $('#orderDetail').removeClass('is-loading');
        result = JSON.parse(response);

        var firstNumber = result.phone.charAt(0);
        var validNumber;
        if (firstNumber == '0') {
            validNumber = result.phone.replace('0','62');
        } else if (firstNumber == '+') {
            validNumber = result.phone.replace('+','');
        } else {
            validNumber = result.phone;
        }

        if (result.cart_type == 'physical') {
            $('.order-address-detail').show();
            $('.confirm-order').show();
        } else {
            $('.order-address-detail').attr('style', 'display:none!important');
            $('.confirm-order').attr('style', 'display:none!important');
        }

        $('.order-name').html(result.name);
        $('.order-address').html(result.address.address + '<br/>' + result.address.subdistrict_name + ', ' + result.address.city_name + ', ' + result.address.province_name + ' (' + result.address.postal_code + ')');
        $('.order-note').html(result.note);
        $('.order-phone').html(result.phone);
        $('.order-email').html(result.email);
        $('.order-code').html('#' + result.code);
        $('.order-date').html(result.created_at);

        if (result.payment_method != '') {
            $('.info-payment-method').show();
            $('.payment-method').html(result.payment_method);
        } else {
            $('.info-payment-method').hide();
        }

        $('#payment_status').removeAttr('class').addClass('alert');
        if (result.payment_status == 1) {
            $('#payment_status').addClass('alert-success');
            $('.payment-status-name').html('Paid');
        } else {
            $('#payment_status').addClass('alert-warning');
            $('.payment-status-name').html('Unpaid');
        }

        var order_group_item_html = '';
        var product_digital_group_html = '';
        var awb_found = false;
        $.each(result['order_group'], function(index, order_group_item) {
            var product_digital_html = '';
            var order_item_html = '';
            var ship_from_name = order_group_item.ship_from_name;

            if (order_group_item['waybill'] != '' && order_group_item['waybill'] != null) {
                awb_found = true;
                $('.info-awb').show();
                $('.data-awb').html(order_group_item['waybill']);
            } else{
                $('.info-awb').hide();
            }

            ongkir = parseInt(order_group_item['ship_cost']);
            var tooltipTemplate = '';
            if (ongkir > 0) {
                
                if(order_group_item['cashless'] == 1){
                    tooltipTemplate = $('#template-tooltip').html();
                }

                order_item_html += $('#template-order-item').html()
                .replace(/%name%/g, order_group_item['courier_name'].toUpperCase() + ' - ' + order_group_item['courier_service'] + tooltipTemplate)
                .replace(/%qty%/g, '')
                .replace(/%price%/g, '')
                .replace(/%subtotal%/g, ongkir.currency());
                setTimeout(function() {
                    $('#courier-tooltip').tooltip();
                }, 500)
            }

            insurance_value = parseInt(order_group_item['insurance_value']);
            if (insurance_value > 0) {
                order_item_html += $('#template-order-item').html()
                .replace(/%name%/g, 'Shipping insurance')
                .replace(/%qty%/g, '')
                .replace(/%price%/g, '')
                .replace(/%subtotal%/g, insurance_value.currency());
            }

            let digitalProductCount = 0;
            $.each(order_group_item['order_item'], function(index_2, order_item) {
                if( order_item['product_type'] == 'digital' && result.payment_status == 1) {
                    product_digital_html += $('#template-product-digital').html()
                    .replace(/%additional_information%/g, order_item['additional_info'])
                    .replace(/%url%/g, '<a class="badge badge-info py-2 w-100" href="'+ order_item.url +'" target="_blank">ACCESS</a>')
                    .replace(/%license%/g, order_item['license']);
                    digitalProductCount++
                }

                var name = order_item['name']
                if (order_item['variant'] != 'default') {
                    name += ' - ' + order_item['variant'];
                }

                order_item_html += $('#template-order-item').html()
                .replace(/%name%/g, name)
                .replace(/%qty%/g, order_item['qty'])
                .replace(/%price%/g, parseInt(order_item['price']).currency())
                .replace(/%subtotal%/g, parseInt(order_item['subtotal']).currency());
            });

            order_group_item_html += $('#template-order-group-item').html()
                .replace(/%city_name%/g, ship_from_name)
                .replace(/%order_item%/g, order_item_html);
            
            if (digitalProductCount == 0) {
                product_digital_group_html = "";
            } else {
                product_digital_group_html += $('#template-product-digital-group').html()
                .replace(/%product_digital_item%/g, product_digital_html);
            }
        });

        $('.order-group-item').html(order_group_item_html);
        $('.product-digital-group-item').html(product_digital_group_html);

        if (result.cart_type == 'digital') {
            $(".city-group-header").attr('style', 'display:none!important');
        } else {
            $(".city-group-header").show();
        }
        
        if (parseInt(result.additional_cost) > 0) {
            $('.is-additional-cost').show();
            $('.additional-price').html(parseInt(result.additional_cost).currency());
        } else {
            $('.is-additional-cost').hide();
        }

        if (parseInt(result.voucher_value) > 0) {
            $('.is-voucher').show();
            $('.voucher-discount').html(parseInt(result.voucher_value).currency());
        } else {
            $('.is-voucher').hide();
        }

        if (parseInt(result.shipping_discount_value) > 0) {
            $('.is-shipping-discount').show();
            $('.shipping-discount').html(parseInt(result.shipping_discount_value).currency());
        } else {
            $('.is-shipping-discount').hide();
        }

        var transaction_fee = parseInt(result.service_fee) + parseInt(result.payment_fee);
        var total = parseInt(result.total);

        if (Number.isNaN(transaction_fee)) {
            transaction_fee = 0;
        }

        if (result.bearer_fee == 'SELLER') {
            total -= transaction_fee;
        }

        $('.unique-price').html(parseInt(result.random_cost).currency());
        $('.transaction-fee').html(transaction_fee.currency());
        $('.total').html(total.currency());

        ppn = parseInt(result.ppn);
        if (ppn) {
            $('.ppn').html(ppn.currency());
            $('.is-ppn').show();
        } else {
            $('.is-ppn').hide();
        }

        $('#orderDetail').modal('show');
    });
}

//show or hide direct checkout link
$(document).on('click', '.share-link-modal', function() {
    var product_type = $(this).attr('data-type');
    $('#share-link-modal').find(".direct-link-checkout").show();
    if(product_type == 'link' || product_type == 'optin'){         
        $('#share-link-modal').find(".direct-link-checkout").hide();
    }
});