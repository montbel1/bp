#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Account Management System...');

// Test data for accounts
const testAccounts = [
  {
    name: "Cash",
    type: "ASSET",
    number: "1000",
    description: "Main checking account",
    isActive: true,
    openingBalance: "5000.00"
  },
  {
    name: "Accounts Receivable",
    type: "ASSET", 
    number: "1100",
    description: "Money owed by customers",
    isActive: true,
    openingBalance: "0.00"
  },
  {
    name: "Office Supplies",
    type: "ASSET",
    number: "1200", 
    description: "Office equipment and supplies",
    isActive: true,
    openingBalance: "500.00"
  },
  {
    name: "Accounts Payable",
    type: "LIABILITY",
    number: "2000",
    description: "Money owed to vendors",
    isActive: true,
    openingBalance: "0.00"
  },
  {
    name: "Sales Revenue",
    type: "REVENUE",
    number: "4000",
    description: "Income from sales",
    isActive: true,
    openingBalance: "0.00"
  },
  {
    name: "Office Expenses",
    type: "EXPENSE",
    number: "5000",
    description: "General office expenses",
    isActive: true,
    openingBalance: "0.00"
  }
];

console.log('✅ Test data prepared');
console.log('📝 Next: Test account creation through the UI');
console.log('🌐 Visit: http://localhost:3000/accounts/new');
console.log('📊 Then check: http://localhost:3000/accounts'); 