import $ from 'jquery';
import { banks } from '@zzh/data';

const $inputBank = $('#input-bank');

const bankStrings = [];
banks.forEach(bank => {
  bankStrings.push(`<option value="${bank}">${bank}</option>`);
});

$inputBank.append(bankStrings.join(''));
