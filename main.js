/**************************************************
 * Formula to compute the monthly payments
 *
 * 	R: monthlyPayments
 * 	C: loanAmount
 * 	i: interestRate (monthly, e.g. 5% --> 5/12/100)
 * 	n: loanTerm (e.g. 30*12)
 *
 * 					R = (C*i)/(1-(1/(1+i)^n))
 **************************************************/

// form input elements
var loanAmount = document.querySelector('#loan-amount');
var loanTerm = document.querySelector('#loan-term');
var interestRate = document.querySelector('#interest-rate');
var termType = document.querySelector('#term-type');
var calculateBtn = document.querySelector('#calculate-btn');
var resetBtn = document.querySelector('#reset-btn');

// output elements
var monthlyPayments = document.querySelector('#monthly-payments');
var principalPaid = document.querySelector('#principal-paid');
var interestedPaid = document.querySelector('#interested-paid');
var totalPaid = document.querySelector('#total-paid');

// error message elements
var interestError = document.querySelector('#interest-error-message');
var termError = document.querySelector('#term-error-message');
var loanError = document.querySelector('#loan-error-message');

// error messages
var errorEmptyField = 'This field is empty!';
var errorNotNumber = 'Please type a number!';
var errorLoanValue = 'Invalid loan value!'
var errorTermValue = 'Invalid loan term!';
var errorInterestValue = 'Invalid interest term!';

// variables
var zero = '$0.00';

calculateBtn.addEventListener('click', function() {

  if (loanAmount.value === '') {
    loanError.textContent = errorEmptyField;
    loanAmount.classList.add('invalid-input');
  } else if (isNaN(loanAmount.value.replace(',', ''))) {
    loanError.textContent = errorNotNumber;
    loanAmount.classList.add('invalid-input');
  } else if (loanAmount.value < 1000 || loanAmount.value > 1000000) {
    loanError.textContent = errorLoanValue;
    loanAmount.classList.add('invalid-input');
  } else {
    loanError.textContent = '';
    loanAmount.classList.remove('invalid-input');
  }

  if (loanTerm.value === '') {
    termError.textContent = errorEmptyField;
    loanTerm.classList.add('invalid-input');
  } else if (isNaN(loanTerm.value)) {
    termError.textContent = errorNotNumber;
    loanTerm.classList.add('invalid-input');
  } else if (termType.value === 'year' && loanTerm.value > 40 || termType.value === 'month' && loanTerm.value > 491) {
    termError.textContent = errorTermValue;
    loanTerm.classList.add('invalid-input');
  } else {
    termError.textContent = '';
    loanTerm.classList.remove('invalid-input');
  }

  if (interestRate.value === '') {
    interestError.textContent = errorEmptyField;
    interestRate.classList.add('invalid-input');
  } else if (isNaN(interestRate.value)) {
    interestError.textContent = errorNotNumber;
    interestRate.classList.add('invalid-input');
  } else if (interestRate.value > 99) {
    interestError.textContent = errorInterestValue;
    interestRate.classList.add('invalid-input');
  } else {
    interestError.textContent = '';
    interestRate.classList.remove('invalid-input');
  }

  // if all inputs are correct
  if (loanAmount.value != '' && loanTerm.value != '' && interestRate.value != '') {
    if (!isNaN(loanTerm.value) && !isNaN(interestRate.value)) {
      if ((termType.value === 'year' && loanTerm.value <= 40 || termType.value === 'month' && loanTerm.value <= 491) && interestRate.value <= 99) {
        var c = parseFloat(loanAmount.value.replace(',', ''));
        var i = interestRate.value / 12 / 100;
        var n = getLoanTerm(termType.value);
        var r = computeLoan(c, n, i);
        var ip = computeInterestedPaid(c, r, n);
        var tp = computeTotalPaid(r, n);

        monthlyPayments.textContent = r.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        principalPaid.textContent = c.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        interestedPaid.textContent = ip.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        totalPaid.textContent = tp.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
      }
    }
  }
});

// add comma for thousands
loanAmount.addEventListener('keyup', function(evt) {
  if (evt.which >= 37 && evt.which <= 40) {
    return;
  }

  this.value = this.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

loanAmount.onfocus = function() {
  this.select();
}

loanTerm.onfocus = function() {
  this.select();
}

// get number of month
function getLoanTerm(v) {
  if (v === 'year') {
    return loanTerm.value * 12;
  } else {
    return loanTerm.value;
  }
}

// compute results
function computeLoan(c, n, i) {
  return parseFloat(((c * i) / (1 - (1 / (Math.pow((1 + i), n))))).toFixed(2));
}

function computeInterestedPaid(c, r, n) {
  return parseFloat(((r * n) - c).toFixed(2));
}

function computeTotalPaid(r, n) {
  return parseFloat((r * n).toFixed(2));
}

// reset form inputs
resetBtn.addEventListener('click', function() {
  loanAmount.value = '';
  loanTerm.value = '';
  interestRate.value = '';
  termType.value = 'month';
  monthlyPayments.textContent = zero;
  principalPaid.textContent = zero;
  interestedPaid.textContent = zero;
  totalPaid.textContent = zero;
  loanError.textContent = '';
  termError.textContent = '';
  interestError.textContent = '';

  var el = document.querySelectorAll('.user-input');
  for (var i = 0; i < el.length; i++) {
    if (el[i].classList.contains('invalid-input')) {
      el[i].classList.remove('invalid-input');
    }
  }
});
