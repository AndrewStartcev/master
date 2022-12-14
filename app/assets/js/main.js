$(document).ready(() => {

  let menuBurger = $('.header__burger');
  let menuClose = $('.menu__close');
  let menu = $('.menu');

  menuBurger.click(function () {
    menu.addClass('open');
    $('html').addClass('lock');
  });

  menuClose.click(function () {
    menu.removeClass('open');
    $('.menu-item-has-children').removeClass('active');
    $('html').removeClass('lock');
  });

  // $(document).on("mouseup", function (e) {
  //   var div = $(".menu__container");
  //   if (!div.is(e.target) && div.has(e.target).length === 0) {
  //     menu.removeClass('open');
  //     $('.menu-item-has-children').removeClass('active')
  //     $('html').removeClass('lock');
  //   }
  // });


  /* Всплывающие окна по классу и ID */
  $('[data-popup]').on('click', function (e) {
    $('.popup').removeClass('show');
    let popupId = $(this).attr('data-popup');
    if ($(this).is('[data-theme]')) {
      let popupTheme = $(this).attr('data-theme');
      $(popupId + ' input[name="theme"]').val(popupTheme)
    }
    $(popupId).addClass('show');
    $('html').addClass('lock');

  });

  $('.popup__close, .popup-close, .popup__ok').on('click', function () {
    $('.popup').removeClass('show');
    $('html').removeClass('lock');
  });

  $('.menu-item-has-children > a').click(function () {
    let currentEl = $(this).parent('.menu-item-has-children')
    $('.menu-item-has-children').not(currentEl).removeClass('active');
    currentEl.toggleClass('active');
  });


  // ===== Табы для блока "Процесс работы"
  let workTabLink = $('.work-process__btn');
  let workTabBlock = $('.work-process__block');

  workTabLink.click(function () {
    let id = "#" + $(this).attr("data-tab")
    workTabLink.removeClass('active')
    workTabBlock.removeClass('active')
    $(this).addClass('active')
    $(id).addClass('active')
  });

});

if (document.querySelector(".warning")) {
  const container = document.querySelector(".warning");
  const apply = container.querySelector(".warning__apply");
  apply.addEventListener("click", () => {
    container.classList.remove("warning--active");
    document.cookie = "warning=true; max-age=2592000; path=/";
  });
};

// ======== Маска для телефона ===============
document.addEventListener("DOMContentLoaded", function () {
  var phoneInputs = document.querySelectorAll('input[type="tel"]');

  var getInputNumbersValue = function (input) {
    return input.value.replace(/\D/g, '');
  }

  var onPhonePaste = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input);
    var pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      var pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
        return;
      }
    }
  }

  var onPhoneInput = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input),
      selectionStart = input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return input.value = "";
    }

    if (input.value.length != selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
      var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
  }
  var onPhoneKeyDown = function (e) {
    var inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
    }
  }
  for (var phoneInput of phoneInputs) {
    phoneInput.addEventListener('keydown', onPhoneKeyDown);
    phoneInput.addEventListener('input', onPhoneInput, false);
    phoneInput.addEventListener('paste', onPhonePaste, false);
  }
});
