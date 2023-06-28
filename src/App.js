import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currency, setCurrency] = useState('PHP');
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [modalAmount, setModalAmount] = useState('');
  const [modalItemName, setModalItemName] = useState('');  

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    const savedIncome = localStorage.getItem('income');
    const savedExpenses = localStorage.getItem('expenses');

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    if (savedIncome && savedIncome !== '') {
      setIncome(JSON.parse(savedIncome));
    }
    if (savedExpenses && savedExpenses !== '') {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    const calculateSavings = () => {
      let incomeValue = 0;
      let expensesValue = 0;

      income.forEach((item) => {
        incomeValue += parseFloat(item.amount);
      });

      expenses.forEach((item) => {
        expensesValue += parseFloat(item.amount);
      });

      if (!isNaN(incomeValue) && !isNaN(expensesValue)) {
        const savings = incomeValue - expensesValue;
        setMonthlySavings(savings.toFixed(2));
      } else {
        setMonthlySavings(0);
      }
    };

    localStorage.setItem('expenses', JSON.stringify(expenses));
    calculateSavings();
  }, [expenses, income]);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalType('income');
    setModalAmount('');
    setModalItemName('');
  };

  const handleModalTypeChange = (event) => {
    setModalType(event.target.value);
  };

  const handleModalAmountChange = (event) => {
    setModalAmount(event.target.value);
  };

  const handleModalItemNameChange = (event) => {
    setModalItemName(event.target.value);
  };

  const handleAddItem = () => {
    if (modalAmount !== '' && modalItemName !== '') {
      const newItem = {
        amount: parseFloat(modalAmount),
        itemName: modalItemName,
      };

      if (modalType === 'income') {
        setIncome([...income, newItem]);
      } else {
        setExpenses([...expenses, newItem]);
      }
    }

    handleModalClose();
  };

  const handleDeleteItem = (itemType, index) => {
    if (itemType === 'income') {
      const updatedIncome = [...income];
      updatedIncome.splice(index, 1);
      setIncome(updatedIncome);
    } else {
      const updatedExpenses = [...expenses];
      updatedExpenses.splice(index, 1);
      setExpenses(updatedExpenses);
    }
  };

  return (
    <div className="bg-slate-900 text-white flex items-center justify-center h-screen">
      <div className="bg-white/20 rounded-md shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">SaverTrack</h1>
        <div className="mb-6">
          <label htmlFor="currency" className="text-lg font-medium mr-2">
            Select Currency:
          </label>
          <select
            id="currency"
            className="text-gray-700 border rounded-lg py-2 px-4"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Monthly Income: {currency}{' '}
            {Array.isArray(income)
              ? income.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2)
              : 0}
          </p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Monthly Expenses: {currency}{' '}
            {Array.isArray(expenses)
              ? expenses.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2)
              : 0}
          </p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Potential Monthly Savings: {currency} {monthlySavings}
          </p>
        </div>
        <div className="mb-6">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={handleModalOpen}>
            Add Income/Expense
          </button>
        </div>
        <div className="flex flex-col">
  <h2 className="text-lg font-bold">Items:</h2>
  <ul className="rounded-lg p-2 mt-2">
    {Array.isArray(income)
      ? income.map((item, index) => (
          <li
            key={`income-${index}`}
            className="bg-green-500 bg-opacity-50 hover:bg-opacity-75 rounded-lg p-2 mb-2 flex justify-between items-center"
          >
            <span className='text-lg font-semibold'>{item.itemName}:</span> {currency} {item.amount.toFixed(2)}{' '}
            <button
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md font-semibold text-gray-200 ml-2"
              onClick={() => handleDeleteItem('income', index)}
            >
              Delete
            </button>
          </li>
        ))
      : null}
    {Array.isArray(expenses)
      ? expenses.map((item, index) => (
          <li
            key={`expenses-${index}`}
            className="bg-red-500 bg-opacity-50 hover:bg-opacity-75 rounded-lg p-2 mb-2 flex justify-between items-center"
          >
            <span className='text-lg font-semibold'>{item.itemName}:</span> {currency} {item.amount.toFixed(2)}{' '}
            <button
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md font-semibold text-gray-200 ml-2"
              onClick={() => handleDeleteItem('expense', index)}
            >
              Delete
            </button>
          </li>
        ))
      : null}
  </ul>
</div>

      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50 -z-10"></div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Add Income/Expense</h2>
            <div className="flex items-center mb-4">
              <input
                id="income-type"
                type="radio"
                value="income"
                checked={modalType === 'income'}
                onChange={handleModalTypeChange}
              />
              <label htmlFor="income-type" className="ml-2 mr-4">
                Income
              </label>
              <input
                id="expense-type"
                type="radio"
                value="expense"
                checked={modalType === 'expense'}
                onChange={handleModalTypeChange}
              />
              <label htmlFor="expense-type" className="ml-2">
                Expense
              </label>
            </div>
            <div className="mb-4">
              <input
                id="modal-item-name"
                className="border rounded-lg py-2 px-4 bg-slate-800/40"
                type="text"
                placeholder="Item Name"
                value={modalItemName}
                onChange={handleModalItemNameChange}
              />
            </div>
            <div className="mb-4">
              <input
                id="modal-amount"
                className="border rounded-lg py-2 px-4 bg-slate-800/40"
                type="number"
                placeholder="Amount"
                value={modalAmount}
                onChange={handleModalAmountChange}
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4" onClick={handleAddItem}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
