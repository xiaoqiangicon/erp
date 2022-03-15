import $ from 'jquery';
import { banks } from '../../../../../pro-com/src/data';

const $inputBank = $('#input-bank');

const bankStrings = [];
banks.forEach(bank => {
  bankStrings.push(`<option value="${bank}">${bank}</option>`);
});

$inputBank.append(bankStrings.join(''));
