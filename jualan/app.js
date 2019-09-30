Number.prototype.currency = function() {
 return this.toLocaleString('id-ID', {
  style: 'currency',
  currency: 'IDR',
 });
}
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('#header-page').outerHeight();
$(window).scroll(function(event) {
 didScroll = true;
});
setInterval(function() {
 if (didScroll) {
  hasScrolled();
  didScroll = false;
 }
}, 250);

function hasScrolled() {
 var st = $(this).scrollTop();
 if (Math.abs(lastScrollTop - st) <= delta)
  return;
 if (st > lastScrollTop && st > navbarHeight) {
  $('#header-page').removeClass('nav-down').addClass('nav-up');
 } else {
  if (st + $(window).height() < $(document).height()) {
   $('#header-page').removeClass('nav-up').addClass('nav-down');
  }
 }
 lastScrollTop = st;
}

function readURL(input) {
 if (input.files && input.files[0]) {
  var reader = new FileReader();
  reader.onload = function(e) {
   $('#image-preview').attr('src', e.target.result).removeClass('hide');
  }
  reader.readAsDataURL(input.files[0]);
 }
}
$("#image-upload").change(function(e) {
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
  success: function(response) {
   if (response.status == 'success') {
    $('.receipt').val(response.image);
    $('#image-preview').attr('src', response.image);
   }
   uploadBox.removeClass('is-loading');
  },
  error: function(response, textstatus, message) {
   readURL(image_upload_field);
   uploadBox.removeClass('is-loading');
  }
 });
 $(this).parent().find('#upload-text').html('Change image')
});
$('[data-type="link"]').on('click', function() {
 if (typeof fbq != 'undefined') {
  //fbq("track", "JualanButtonClick"); tambahkan track untuk fb ads kamu
 }
});
var $btn_proceed_checkout = $('.btn-proceed-checkout');
$btn_proceed_checkout.on('click', function(e) {
 e.preventDefault();
 $btn_proceed_checkout.html('Sedang memproses ...');
 $.post(window.BASE_URL + 'ajax-check-stock', {
  product_guid: window.PRODUCT_GUID,
 }, function(response) {
  if ($('.qty').val() <= parseInt(response)) {
   $('form').submit();
  } else {
   alert('Stok tidak mencukupi');
   $btn_proceed_checkout.html('Bayar Sekarang');
  }
 });
});
$(document).on('click', '.btn-copy', function() {
 var copyText = $(this).prev(".text-to-copy").text().replace(/\D+/g, '');
 var btnStatus = $('<span class="btn-status">Copied</span>')
 var temp = $('<input class="sr-only">');
 $('body').append(temp);
 temp.val(copyText).select();
 document.execCommand("copy");
 console.log(temp.val() + " is copied");
 temp.remove();
 $(this).append(btnStatus);
 $(this).addClass('is-copied');
 setTimeout(function() {
  btnStatus.parent().removeClass('is-copied');
  btnStatus.remove();
 }, 3000);
});
$('.option-item').on('click', function() {
 $('.option-item').removeClass('is-active');
 var option = $(this).attr("id");
 $(this).addClass('is-active');
 $('#content').removeClass();
 $('#content').addClass(option);
});
var container = $('html, body');
var scrollPosition;
var postStatus;
$(document).on('click', '#content.display-grid .post-image', function() {
 postStatus = true;
 var scrollTo = $(this);
 var postDescription = $(this).next();
 var layout = $(this).parents('#content');
 scrollPosition = container.scrollTop();
 layout.removeClass('display-grid').addClass('display-list');
 postDescription.addClass('is-expanded');
 setTimeout(function() {
  container.animate({
   scrollTop: scrollTo.offset().top
  }, 0);
  $(this).parents('.post').addClass('is-active');
  $('body').addClass('post-is-active');
 }, 50);
 return false;
});
window.history.pushState(null, "", window.location.href);
window.onpopstate = function() {
 if (postStatus == true) {
  backToGrid();
  window.history.pushState(null, "", window.location.href);
 }
};
$(document).on('click', '.header-layout-grid .btn-back', backToGrid);
$(document).on('swipe', 'body', backToGrid);

function backToGrid() {
 postStatus = false;
 container.animate({
  scrollTop: scrollPosition
 }, 0);
 var layout = $('#content');
 layout.removeClass('display-list').addClass('display-grid');
 $('body').find('.post.is-active').removeClass('is-active');
 $('body').removeClass('post-is-active');
}
$(document).on('click', '#content.display-list .btn-expand-description', function() {
 $(this).parents('.post-content').toggleClass('is-expanded');
});
$(document).click(function(event) {
 if (!$(event.target).closest('#navbar-sidebar, #navbar-sidebar .sidebar-body, .navbar-toggler').length) {
  $('body').find('#header.sidebar-active').removeClass('sidebar-active');
 }
});
$btn_submit = $('.btn-submit');
$confirm_destination = $('#confirm-destination');
$(function() {
 setTimeout(function() {
  $("#info-box").addClass('is-hide')
  $(".message-info").addClass('is-active')
 }, 4000);
});
if ($('.ongkir-field').length == 0) {
 $btn_submit.removeAttr('disabled');
}
$('#info-box .btn-close').on('click', function() {
 $(this).parent().addClass('is-hide')
});
$('#select-destination').on('click', function() {
 $(this).parent().addClass('is-active');
 $('#edit-destination').hide();
});
$('#confirm-destination').on('click', function() {
 if ($(this).attr('disabled') == 'disabled') {
  return;
 }
 $(this).parents('.price-group').removeClass('is-active');
 $(this).parents('.price-group').addClass('has-value');
 $btn_submit.removeAttr('disabled');
 $('#edit-destination').show();
});
$('#edit-destination').on('click', function() {
 $(this).parents('.price-group').removeClass('has-value');
 $(this).parents('.price-group').addClass('is-active');
 $(this).hide();
});
$('#invoice-detail').on('click', '.btn-more', function() {
 $(this).parent().toggleClass('is-active')
});
$('.message-info').on('click', '.btn-close', function() {
 $(this).parents('.message-info').removeClass('is-active')
});
$('.dropdown-menu-toggle').on('click', function() {
 $(this).parents('.dropdown-user-menu').toggleClass('is-expanded')
});



if ($('.dropdown-subdistrict').length > 0) {
  var actual_JSON = $.getJSON( "https://raw.githubusercontent.com/irfnrdh/insta/master/data.json")
 $('.dropdown-subdistrict').select2({
  minimumInputLength: 3,
  ajax: {
   //url: actual_JSON,
   url: window.BASE_URL + 'ajax-destination',
   dataType: 'json',
   processResults: function(data) {
    return {
     results: $.map(data, function(item) {
      return {
       text: item.label,
       id: item.subdistrict_id
      }
     })
    };
   }
  }
 });
 $('.dropdown-subdistrict').on('change', function() {
  $('.dropdown-ongkir').html('');
  $btn_submit.attr('disabled', '');
  $confirm_destination.attr('disabled', '');
  get_ongkir();
 });
 $('.dropdown-ongkir').on('change', function() {
  confirm_destination();
 });
 $('.qty').on('change keyup click', function() {
  calculate();
  window.cost = 0;
  $('.dropdown-ongkir, .dropdown-subdistrict, .shipping-price').html('');
  $('.ongkir-field').removeClass('has-value');
 });
 $('.confirm-destination').on('click', function() {
  confirm_destination();
 });
}
window.cost = 0;
calculate();

function confirm_destination() {
 if (typeof window.ongkir != 'undefined') {
  window.ongkir.forEach(function(item) {
   if ($('.dropdown-ongkir').find(':selected').val() == item.value) {
    window.cost = item.cost;
    calculate();
    $('.shipping-price').html(item.cost.currency());
   }
  });
 }
}

function calculate() {
 if ($('.ongkir-field').length > 0) {
  total = window.PRODUCT_PRICE * $('.qty').val() + window.cost + parseInt(window.SHIP_COST);
  $('.total').html(total.currency());
 }
}

function get_ongkir() {
 var weight = $('.qty').val() * window.PRODUCT_WEIGHT;
 $.post(window.BASE_URL + 'ajax-ongkir', {
  store: window.STORE,
  product: window.PRODUCT_GUID,
  weight: weight,
  to: $('.dropdown-subdistrict').val()
 }, function(response) {
  $confirm_destination.removeAttr('disabled');
  window.ongkir = response;
  var options = '';
  response.forEach(function(item) {
   options += '<option value="' + item.value + '" data-cost="' + item.cost + '">' + item.label + '</option>';
  });
  $('.dropdown-ongkir').html(options).select2();
 });
}
$(document).on('click', '[data-type="optin"]', function() {
 var el = $(this);
 $.post(window.BASE_URL + 'ajax-form', {
  store: window.STORE,
  form_id: el.attr('data-form-id')
 }, function(response) {
  var $form = $($.parseHTML(response)).find('#keform');
  var output = '';
  var length = $form.find('.full').length;
  for (j = 0; j < length; j++) {
   var field = $form.find('.full').eq(j).find('input, textarea, select');
   field.addClass('form-control');
   var field_output = $('#template-field').html().replace(/%field%/g, field[0].outerHTML);
   output += field_output;
  }
  $('#optin-form form').attr('action', $form.attr('action'));
  $('.btn-optin-submit').html($form.find('.kirimemail-btn-submit').html());
  $('.scroll-area').html(output);
  $('.modal-title').html(el.closest('.post-body').find('.post-title').html());
  $('#optin-form').modal('show');
 });
});