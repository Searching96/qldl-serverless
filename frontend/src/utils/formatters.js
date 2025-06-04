import React from "react";

// Vietnamese money formatter without currency symbol
export const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  minimumIntegerDigits: 1,
});

// Format money for display
export const formatMoney = (value) => {
  if (!value || value === '0' || value === 0) return '0';
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(/,/g, '')) : value;
  if (isNaN(numValue)) return '0';
  return moneyFormatter.format(numValue);
};

// Parse formatted money back to number
export const parseMoney = (formattedValue) => {
  if (!formattedValue || formattedValue === '0') return 0;
  const cleaned = String(formattedValue).replace(/\./g, '').replace(/,/g, '');
  return parseFloat(cleaned) || 0;
};

// Hook for money input with automatic formatting
export const useMoneyInput = (initialValue = '0') => {
  const [displayValue, setDisplayValue] = React.useState(formatMoney(initialValue));
  const [rawValue, setRawValue] = React.useState(parseMoney(initialValue));

  const handleChange = (inputValue) => {
    const numValue = parseMoney(inputValue);
    setRawValue(numValue);
    setDisplayValue(formatMoney(numValue));
  };

  const setValue = (value) => {
    setRawValue(value);
    setDisplayValue(formatMoney(value));
  };

  return {
    displayValue,
    rawValue,
    handleChange,
    setValue
  };
};
