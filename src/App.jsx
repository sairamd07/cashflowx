import { useState, useEffect } from "react";

import {
  Plus,
  X,
  Wallet,
  WalletCards,
  Receipt,
  TrendingUp,
  TrendingDown,
  Bot,
  Clock,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Bell,
  CalendarDays,
  Search,
  Settings as SettingsIcon,
  Utensils,
  ShoppingBag,
  Car,
  Target,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ✅ FEATURE 1: localStorage functions
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// ✅ FEATURE 7: Better demo data
const initialTransactions = [];

// ✅ FEATURE 8: Currency formatter
const formatCurrency = (amount) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

// ✅ FEATURE 9: Export to CSV
const exportTransactionsAsCSV = (transactions) => {
  const headers = ["Date", "Name", "Category", "Amount", "Type"];
  const rows = transactions.map(t => 
    [t.date, t.name, t.category, t.amount, t.type]
  );
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cashflowx-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const cashFlowData = [
  { day: "Today", balance: 42500 },
  { day: "7 Days", balance: 38200 },
  { day: "15 Days", balance: 31700 },
  { day: "22 Days", balance: 26800 },
  { day: "30 Days", balance: 22400 },
];

// ✅ FEATURE 2: Toast notification component
function NotificationToast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}

// ✅ FEATURE 4: Settings page
function Settings({ onLogout,userName }) {
  const clearData = () => {
  localStorage.removeItem(`cashflowx_transactions_${userName}`);
  localStorage.removeItem(`cashflowx_goals_${userName}`);
  localStorage.removeItem(`cashflowx_payments_${userName}`);

  window.location.reload();
};

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Customize your CashFlowX experience</p>
        </div>

        <button className="notification">
          <Bell size={20} />
          <span></span>
        </button>
      </header>

      <div className="settings-grid">
        <div className="panel">
          <h3>Preferences</h3>
          <div className="setting-item">
            <span>Currency</span>
            <strong>₹ Indian Rupee</strong>
          </div>
          <div className="setting-item">
            <span>Theme</span>
            <strong>Dark Mode</strong>
          </div>
        </div>

        <div className="panel">
          <h3>Safety Settings</h3>
          <div className="setting-item">
            <span>Safety Threshold</span>
            <strong>₹10,000</strong>
          </div>
          <div className="setting-item">
            <span>Notifications</span>
            <strong>Enabled</strong>
          </div>
        </div>

        <div className="panel">
          <h3>About CashFlowX</h3>
          <div className="setting-item">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>
          <div className="setting-item">
            <span>Build Date</span>
            <strong>September 2026</strong>
          </div>
          <p style={{ marginTop: "15px", fontSize: "11px", color: "#687386" }}>
            Smart personal cash-flow management platform that predicts your future 
            financial position and warns you before cash shortage.
          </p>
        </div>

        <div className="panel danger-panel">
          <h3>Danger Zone</h3>
          <p style={{ fontSize: "11px", color: "#687386", marginBottom: "15px" }}>
            Clear all your data and start fresh. This action cannot be undone.
          </p>
          <button
  className="settings-btn"
  onClick={onLogout}
>
  Logout
</button>
          <button  
  onClick={clearData} 
  className="danger-button" 
>
            🗑️ Clear All Data
          </button>
        </div>
      </div>
    </>
  );
}

// Rest of the components remain the same...
function Analytics({ transactions }) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const savings = income - expenses;

  const savingsRate = income > 0
    ? Math.round((savings / income) * 100)
    : 0;

  const categories = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categories[item.category] =
        (categories[item.category] || 0) + item.amount;
    });

  const categoryData = Object.entries(categories).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((highest, current) =>
          current.amount > highest.amount ? current : highest
        )
      : null;

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Analytics</h1>
          <p>Understand where your money is going.</p>
        </div>

        <button className="notification">
          <Bell size={20} />
          <span></span>
        </button>
      </header>

      <section className="analytics-stats">
        <div className="analytics-card">
          <span>Total Income</span>
          <h2>{formatCurrency(income)}</h2>
          <p className="income-text">Money coming in</p>
        </div>

        <div className="analytics-card">
          <span>Total Expenses</span>
          <h2>{formatCurrency(expenses)}</h2>
          <p className="expense-text">Money going out</p>
        </div>

        <div className="analytics-card">
          <span>Total Savings</span>
          <h2>{formatCurrency(savings)}</h2>
          <p className="positive">Available after expenses</p>
        </div>

        <div className="analytics-card">
          <span>Savings Rate</span>
          <h2>{savingsRate}%</h2>
          <p className="positive">Of your income saved</p>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Spending by Category</h3>
              <p>Your expenses grouped by category</p>
            </div>
          </div>

          <div className="analytics-chart">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242b38"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="category"
                    stroke="#687386"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#687386"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#151a23",
                      border: "1px solid #293140",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      formatCurrency(value),
                      "Spent",
                    ]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <BarChart3 size={30} />
                <p>Add some expenses to see your spending analysis.</p>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Spending Insight</h3>
              <p>What your transactions tell us</p>
            </div>

            <Bot size={20} className="panel-icon" />
          </div>

          <div className="analytics-insight">
            {topCategory ? (
              <>
                <div className="big-insight-icon">
                  <TrendingDown size={25} />
                </div>

                <h2>{topCategory.category}</h2>

                <p>
                  Your highest spending category is{" "}
                  <strong>{topCategory.category}</strong>, with total
                  spending of{" "}
                  <strong>
                    {formatCurrency(topCategory.amount)}
                  </strong>
                  .
                </p>

                <div className="insight-progress">
                  <div
                    style={{
                      width: `${Math.min(
                        (topCategory.amount / expenses) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <span>
                  {expenses > 0
                    ? Math.round(
                        (topCategory.amount / expenses) * 100
                      )
                    : 0}
                  % of total expenses
                </span>
              </>
            ) : (
              <>
                <div className="big-insight-icon">
                  <Bot size={25} />
                </div>

                <h2>No data yet</h2>

                <p>
                  Add some transactions and CashFlowX will analyze your
                  spending patterns.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="financial-health">
        <div>
          <div className="health-icon">
            <Wallet size={20} />
          </div>

          <div>
            <h3>Financial Health</h3>

            <p>
              {savingsRate >= 20
                ? "You're maintaining a healthy savings rate."
                : savingsRate > 0
                ? "You're saving, but there may be room to improve."
                : "Your expenses are currently equal to or higher than your income."}
            </p>
          </div>
        </div>

        <strong>{savingsRate >= 20 ? "Healthy" : "Needs Attention"}</strong>
      </section>
    </>
  );
}

function Budgets({ transactions }) {
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Food", limit: 2500 },
    { id: 2, category: "Shopping", limit: 3000 },
    { id: 3, category: "Transport", limit: 2000 },
    { id: 4, category: "Entertainment", limit: 1500 },
  ]);

  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [newBudget, setNewBudget] = useState({
    category: "Food",
    limit: "",
  });

  const getSpent = (category) => {
    return transactions
      .filter(
        (item) =>
          item.type === "expense" &&
          item.category === category
      )
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const addBudget = (e) => {
    e.preventDefault();

    if (!newBudget.limit) return;

    setBudgets([
      ...budgets,
      {
        id: Date.now(),
        category: newBudget.category,
        limit: Number(newBudget.limit),
      },
    ]);

    setNewBudget({
      category: "Food",
      limit: "",
    });

    setShowBudgetForm(false);
  };

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Budgets</h1>
          <p>Set limits and stay in control of your spending.</p>
        </div>

        <button
          className="add-transaction-button"
          onClick={() => setShowBudgetForm(true)}
        >
          <Plus size={18} />
          Add Budget
        </button>
      </header>

      <section className="budget-overview">
        <div className="budget-overview-card">
          <span>Total Budget</span>
          <strong>
            {formatCurrency(
              budgets.reduce((sum, item) => sum + item.limit, 0)
            )}
          </strong>
        </div>

        <div className="budget-overview-card">
          <span>Total Spent</span>
          <strong className="expense-text">
            {formatCurrency(
              budgets.reduce((sum, item) => sum + getSpent(item.category), 0)
            )}
          </strong>
        </div>

        <div className="budget-overview-card">
          <span>Remaining</span>
          <strong className="positive">
            {formatCurrency(
              budgets.reduce((sum, item) => sum + item.limit, 0) -
              budgets.reduce(
                (sum, item) => sum + getSpent(item.category),
                0
              )
            )}
          </strong>
        </div>
      </section>

      <section className="budget-list">
        {budgets.map((budget) => {
          const spent = getSpent(budget.category);

          const percentage =
            budget.limit > 0
              ? Math.round((spent / budget.limit) * 100)
              : 0;

          const isOver = percentage >= 100;
          const isWarning = percentage >= 80 && !isOver;

          return (
            <div className="budget-card" key={budget.id}>
              <div className="budget-card-top">
                <div>
                  <h3>{budget.category}</h3>

                  <p>
                    {formatCurrency(spent)} spent of {formatCurrency(budget.limit)}
                  </p>
                </div>

                <div
                  className={`budget-percentage ${
                    isOver
                      ? "over"
                      : isWarning
                      ? "warning"
                      : ""
                  }`}
                >
                  {percentage}%
                </div>
              </div>

              <div className="budget-progress">
                <div
                  className={
                    isOver
                      ? "progress-over"
                      : isWarning
                      ? "progress-warning"
                      : ""
                  }
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="budget-bottom">
                <span>
                  {isOver
                    ? `${formatCurrency(
                        spent - budget.limit
                      )} over budget`
                    : `${formatCurrency(
                        budget.limit - spent
                      )} remaining`}
                </span>

                {isOver && (
                  <strong className="expense-text">
                    ⚠ Over Budget
                  </strong>
                )}

                {isWarning && (
                  <strong className="warning-text">
                    ⚠ Almost Full
                  </strong>
                )}

                {!isOver && !isWarning && (
                  <strong className="positive">
                    On Track
                  </strong>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {showBudgetForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add Budget</h2>
                <p>Create a monthly spending limit.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowBudgetForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addBudget}>
              <label>Category</label>

              <select
                value={newBudget.category}
                onChange={(e) =>
                  setNewBudget({
                    ...newBudget,
                    category: e.target.value,
                  })
                }
              >
                <option>Food</option>
                <option>Shopping</option>
                <option>Transport</option>
                <option>Bills</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Other</option>
              </select>

              <label>Monthly Limit</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  placeholder="0"
                  value={newBudget.limit}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      limit: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowBudgetForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-button">
                  <Plus size={17} />
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AffordabilityChecker({
  currentBalance,
  projectedBalance,
  safetyThreshold,
}) {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const checkAffordability = () => {
    const expense = Number(amount);

    if (!expense || expense <= 0) {
      setResult(null);
      return;
    }

    const balanceAfterExpense =
      projectedBalance - expense;

    if (balanceAfterExpense >= safetyThreshold) {
      setResult({
        type: "safe",
        message:
          "Yes, you can afford this expense.",
        detail: `You should still have approximately ${formatCurrency(
          balanceAfterExpense
        )} after the expense.`,
      });
    } else if (balanceAfterExpense >= 0) {
      setResult({
        type: "warning",
        message:
          "You can afford it, but it may reduce your financial safety.",
        detail: `Your projected balance would fall to approximately ${formatCurrency(
          balanceAfterExpense
        )}.`,
      });
    } else {
      setResult({
        type: "danger",
        message:
          "This expense may not be affordable.",
        detail:
          "It could push your projected balance below ₹0.",
      });
    }
  };

  return (
    <div className="panel affordability-card">

      <div className="panel-header">
        <div>
          <h3>Can I afford this?</h3>

          <p>
            Check an expense against your
            predicted cash flow.
          </p>
        </div>
      </div>

      <div className="affordability-input">

        <span>₹</span>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <button onClick={checkAffordability}>
          Check
        </button>

      </div>

      {result && (
        <div
          className={`affordability-result ${result.type}`}
        >
          <strong>
            {result.type === "safe" && "✓ "}
            {result.type === "warning" && "⚠ "}
            {result.type === "danger" && "🚨 "}

            {result.message}
          </strong>

          <p>{result.detail}</p>
        </div>
      )}

    </div>
  );
}

function SmartRecommendations({ transactions = [] }) {
  const expenses = transactions.filter(
    (item) => item.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    const category = item.category || "Other";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.amount || 0);
  });

  const recommendations = Object.entries(categoryTotals)
    .map(([category, amount]) => {
      let savingRate = 0.1;

      if (amount >= 5000) {
        savingRate = 0.2;
      } else if (amount >= 2500) {
        savingRate = 0.15;
      }

      const possibleSaving = Math.round(
        amount * savingRate
      );

      return {
        category,
        amount,
        possibleSaving,
      };
    })
    .filter((item) => item.possibleSaving > 0)
    .sort(
      (a, b) =>
        b.possibleSaving - a.possibleSaving
    )
    .slice(0, 3);

  const totalSavings = recommendations.reduce(
    (sum, item) => sum + item.possibleSaving,
    0
  );

  return (
    <section className="panel smart-recommendations">

      <div className="panel-header">

        <div>
          <h3>Smart Recommendations</h3>

          <p>
            Simple ways CashFlowX thinks you
            could save money.
          </p>
        </div>

        <div className="recommendation-icon">
          <Bot size={20} />
        </div>

      </div>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <TrendingUp size={22} />

          <p>
            Add more expense transactions to
            receive personalized recommendations.
          </p>
        </div>
      ) : (
        <>
          <div className="recommendation-list">

            {recommendations.map((item) => (
              <div
                className="recommendation-item"
                key={item.category}
              >

                <div className="recommendation-item-icon">
                  <TrendingDown size={18} />
                </div>

                <div className="recommendation-content">

                  <strong>
                    {item.category} spending is
                    relatively high
                  </strong>

                  <p>
                    You spent {formatCurrency(item.amount)}{" "}
                    in this category. Reducing
                    this by a small amount could
                    save you around {formatCurrency(item.possibleSaving)}.
                  </p>

                </div>

                <div className="recommendation-saving">
                  +{formatCurrency(item.possibleSaving)}
                </div>

              </div>
            ))}

          </div>

          <div className="total-saving">

            <div>
              <span>Potential monthly savings</span>

              <strong>
                {formatCurrency(totalSavings)}
              </strong>
            </div>

            <span>
              Based on your current spending
              patterns
            </span>

          </div>
        </>
      )}

    </section>
  );
}

function PurchaseTiming({
  transactions = [],
  recurringPayments = [],
}) {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const calculateTiming = () => {
    const purchase = Number(amount);

    if (!purchase || purchase <= 0) {
      setResult(null);
      return;
    }

    const income = transactions
      .filter((item) => item.type === "income")
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

    const balance = income - expenses;

    const expenseItems = transactions.filter(
      (item) => item.type === "expense"
    );

    const dailySpending =
      expenseItems.length > 0
        ? expenses / expenseItems.length
        : 0;

    const monthlyRecurring = recurringPayments
      .filter(
        (item) => item.frequency === "Monthly"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );

    const projected30DayBalance =
      balance -
      dailySpending * 30 -
      monthlyRecurring;

    const safetyThreshold = 10000;

    const balanceAfterPurchase =
      projected30DayBalance - purchase;

    if (balanceAfterPurchase >= safetyThreshold) {
      setResult({
        type: "safe",
        days: 0,
        message:
          "You can afford this purchase now.",
        detail: `Your projected balance would remain around ${formatCurrency(
          balanceAfterPurchase
        )}.`,
      });

      return;
    }

    if (dailySpending <= 0) {
      setResult({
        type: "warning",
        days: 0,
        message:
          "This purchase would reduce your financial buffer.",
        detail:
          "Add more expense transactions so CashFlowX can estimate the best purchase date.",
      });

      return;
    }

    const requiredBuffer =
      safetyThreshold - balanceAfterPurchase;

    const daysToWait = Math.ceil(
      requiredBuffer / dailySpending
    );

    setResult({
      type: "warning",
      days: daysToWait,
      message: `CashFlowX recommends waiting approximately ${daysToWait} days.`,
      detail:
        "Waiting gives your cash flow more time to recover while keeping your safety buffer healthier.",
    });
  };

  return (
    <section className="panel purchase-timing">

      <div className="panel-header">
        <div>
          <h3>Best Time to Buy</h3>

          <p>
            Find a safer time to make a large purchase.
          </p>
        </div>

        <div className="recommendation-icon">
          <CalendarDays size={20} />
        </div>
      </div>

      <div className="purchase-input">

        <div className="input-wrapper">
          <span>₹</span>

          <input
            type="number"
            placeholder="Enter purchase amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />
        </div>

        <button onClick={calculateTiming}>
          Check Timing
        </button>

      </div>

      {result && (
        <div
          className={`purchase-result ${result.type}`}
        >
          <div className="answer-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <strong>{result.message}</strong>

            <p>{result.detail}</p>

            {result.days > 0 && (
              <span>
                Suggested waiting period:{" "}
                <b>{result.days} days</b>
              </span>
            )}
          </div>
        </div>
      )}

    </section>
  );
}

function FinancialAssistant({
  transactions = [],
  recurringPayments = [],
  goals = [],
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi! I'm your CashFlowX financial assistant. Ask me about your spending, savings, upcoming payments, or goals.",
    },
  ]);

  const sendMessage = async (e) => {
    if (loading) {
  return;
}
    e.preventDefault();

    if (!question.trim() || loading) {
  return;
}

    const userMessage = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("https://cashflowx-backend.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          financialData: {
            transactions,
            recurringPayments,
            goals,
          },
        }),
      });

      const data = await response.json();
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("AI Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I couldn't connect to the AI assistant right now.",
        },
      ]);
    }
  };
const clearChat = () => {
  setMessages([
    {
      type: "ai",
      text: "Hi! I'm your CashFlowX financial assistant. Ask me about your spending, savings, upcoming payments, or goals.",
    },
  ]);
};
const askSuggestion = async (text) => {
  if (loading) {
    return;
  }

  setQuestion(text);

  const userMessage = text;

  setMessages((prev) => [
    ...prev,
    {
      type: "user",
      text: userMessage,
    },
  ]);

  setLoading(true);

  try {
    const response = await fetch("https://cashflowx-backend.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        financialData: {
          transactions,
          recurringPayments,
          goals,
        },
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: data.reply,
      },
    ]);
  } catch (error) {
    console.error("AI Assistant Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: "Sorry, I couldn't connect to the AI assistant right now.",
      },
    ]);
  }

  setLoading(false);
  setQuestion("");
};

  return (
    <div className="assistant-page">

      <div className="page-header">

  <div>
    <h1>AI Assistant</h1>

    <p>
      Ask questions about your personal cash flow.
    </p>
  </div>

  <div className="assistant-status">
    <span />
    CashFlowX Intelligence

    <button
      onClick={clearChat}
      className="clear-chat-button"
    >
      Clear Chat
    </button>
  </div>

</div>

      <div className="assistant-layout">

        <div className="panel chat-panel">

          <div className="chat-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.type}`}
              >

                {message.type === "ai" && (
                  <div className="assistant-avatar">
                    <Bot size={16} />
                  </div>
                )}

                <div className="message-bubble">
                  {message.text.split("\n").map((line, i) => (
    <div key={i}>
      {line}
    </div>
  ))}
                </div>
{loading && (
  <div className="chat-message ai">
    <div className="assistant-avatar">
      <Bot size={16} />
    </div>

    <div className="message-bubble">
      Thinking...
    </div>
  </div>
)}
              </div>
            ))}

          </div>

          <form
            className="chat-input"
            onSubmit={sendMessage}
          >

            <input
              type="text"
              placeholder="Ask: Can I afford ₹5000?"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
            />

           <button type="submit" disabled={loading}>
  {loading ? "..." : <ArrowLeftRight size={17} />}
</button>

          </form>

        </div>

        <div className="panel suggestion-panel">

          <h3>Try asking</h3>

          <button
  onClick={() =>
    askSuggestion("Can I afford ₹5000?")
  }
>
  Can I afford ₹5,000?
</button>

          <button
  onClick={() =>
    askSuggestion("How much have I spent?")
  }
>
  How much have I spent?
</button>

<button
  onClick={() =>
    askSuggestion("What are my upcoming payments?")
  }
>
  What are my upcoming payments?
</button>

<button
  onClick={() =>
    askSuggestion("How much can I save?")
  }
>
  How much can I save?
</button>

<button
  onClick={() =>
    askSuggestion("How is my savings goal?")
  }
>
  How is my savings goal?
</button>

        </div>

      </div>

    </div>
  );
}

function UpcomingPaymentImpact({
  recurringPayments = [],
}) {
  const totalUpcoming = recurringPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const sortedPayments = [...recurringPayments]
    .sort(
      (a, b) =>
        new Date(a.nextDate) -
        new Date(b.nextDate)
    )
    .slice(0, 5);

  return (
    <section className="panel upcoming-impact">

      <div className="panel-header">

        <div>
          <h3>Upcoming Payment Impact</h3>

          <p>
            Payments that may affect your
            future cash flow.
          </p>
        </div>

        <div className="recommendation-icon">
          <Receipt size={20} />
        </div>

      </div>

      <div className="upcoming-total">
        <span>Total upcoming commitments</span>

        <strong>
          {formatCurrency(totalUpcoming)}
        </strong>
      </div>

      <div className="payment-list">

        {sortedPayments.length === 0 ? (
          <p className="no-payments">
            No upcoming payments found.
          </p>
        ) : (
          sortedPayments.map((payment) => (
            <div
              className="payment-row"
              key={payment.id}
            >

              <div className="payment-date">
                {new Date(
                  payment.nextDate
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </div>

              <div className="payment-info">
                <strong>{payment.name}</strong>

                <span>
                  {payment.frequency}
                </span>
              </div>

              <strong className="payment-amount">
                {formatCurrency(Number(payment.amount))}
              </strong>

            </div>
          ))
        )}

      </div>

    </section>
  );
}

function CashFlowHealth({
  transactions = [],
  recurringPayments = [],
}) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const balance = income - expenses;

  // Spending score
  let spendingScore = 50;

  if (income > 0) {
    const expenseRatio = expenses / income;

    if (expenseRatio <= 0.4) {
      spendingScore = 95;
    } else if (expenseRatio <= 0.6) {
      spendingScore = 85;
    } else if (expenseRatio <= 0.75) {
      spendingScore = 70;
    } else if (expenseRatio <= 0.9) {
      spendingScore = 55;
    } else {
      spendingScore = 35;
    }
  }

  // Savings score
  let savingsScore = 50;

  if (income > 0) {
    const savingsRatio = balance / income;

    if (savingsRatio >= 0.3) {
      savingsScore = 95;
    } else if (savingsRatio >= 0.2) {
      savingsScore = 85;
    } else if (savingsRatio >= 0.1) {
      savingsScore = 70;
    } else if (savingsRatio > 0) {
      savingsScore = 55;
    } else {
      savingsScore = 30;
    }
  }

  // Upcoming payment score
  const upcomingPayments = recurringPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  let paymentScore = 80;

  if (balance <= 0) {
    paymentScore = 25;
  } else if (upcomingPayments > balance * 0.5) {
    paymentScore = 45;
  } else if (upcomingPayments > balance * 0.3) {
    paymentScore = 65;
  } else {
    paymentScore = 90;
  }

  const healthScore = Math.round(
    spendingScore * 0.4 +
    savingsScore * 0.35 +
    paymentScore * 0.25
  );

  let healthLabel = "Needs Attention";

  if (healthScore >= 80) {
    healthLabel = "Excellent";
  } else if (healthScore >= 65) {
    healthLabel = "Healthy";
  } else if (healthScore >= 50) {
    healthLabel = "Moderate";
  }

  return (
    <section className="panel health-card">

      <div className="panel-header">

        <div>
          <h3>CashFlow Health</h3>

          <p>
            A quick view of your financial
            position.
          </p>
        </div>

        <div className="health-badge">
          {healthLabel}
        </div>

      </div>

      <div className="health-score">

        <div className="score-circle">
          <strong>{healthScore}</strong>
          <span>/100</span>
        </div>

        <div className="health-summary">

          <h4>
            Your cash flow is {healthLabel.toLowerCase()}
          </h4>

          <p>
            CashFlowX analyzes your spending,
            savings and upcoming commitments.
          </p>

        </div>

      </div>

      <div className="health-breakdown">

        <div className="health-item">

          <div>
            <span>Spending Control</span>
            <strong>{spendingScore}/100</strong>
          </div>

          <div className="health-bar">
            <div
              style={{
                width: `${spendingScore}%`,
              }}
            />
          </div>

        </div>

        <div className="health-item">

          <div>
            <span>Savings Potential</span>
            <strong>{savingsScore}/100</strong>
          </div>

          <div className="health-bar">
            <div
              style={{
                width: `${savingsScore}%`,
              }}
            />
          </div>

        </div>

        <div className="health-item">

          <div>
            <span>Payment Safety</span>
            <strong>{paymentScore}/100</strong>
          </div>

          <div className="health-bar">
            <div
              style={{
                width: `${paymentScore}%`,
              }}
            />
          </div>

        </div>

      </div>

    </section>
  );
}

function SavingsGoals({
  goals = [],
  setGoals,
  transactions = [],
}) {
  const [showGoalForm, setShowGoalForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
    deadline: "",
  });
  const totalIncome = transactions
  .filter((item) => item.type === "income")
  .reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

const totalExpenses = transactions
  .filter((item) => item.type === "expense")
  .reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

const monthlySurplus = Math.max(
  totalIncome - totalExpenses,
  0
);

  const addGoal = (e) => {
    e.preventDefault();

    if (!form.name || !form.target) {
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: form.name,
      target: Number(form.target),
      saved: Number(form.saved || 0),
      deadline: form.deadline,
    };

    setGoals([...goals, newGoal]);

    setForm({
      name: "",
      target: "",
      saved: "",
      deadline: "",
    });

    setShowGoalForm(false);
  };

  const calculateProgress = (saved, target) => {
    if (!target) return 0;

    return Math.min(
      Math.round((saved / target) * 100),
      100
    );
  };

  return (
    <div className="goals-page">

      <div className="page-header">

        <div>
          <h1>Savings Goals</h1>

          <p>
            Turn your financial plans into achievable goals.
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowGoalForm(true)}
        >
          <Plus size={17} />
          Add Goal
        </button>

      </div>

      {goals.length === 0 ? (
        <div className="panel empty-goals">
          <Target size={30} />

          <h3>No savings goals yet</h3>

          <p>
            Create a goal for something you want
            to save for.
          </p>
        </div>
      ) : (
        <div className="goals-grid">

          {goals.map((goal) => {
            const progress = calculateProgress(
              goal.saved,
              goal.target
            );

            const remaining = Math.max(
              goal.target - goal.saved,
              0
            );
const monthsToGoal =
  remaining > 0 && monthlySurplus > 0
    ? Math.ceil(
        remaining / monthlySurplus
      )
    : 0;
    const today = new Date();
const deadlineDate = goal.deadline
  ? new Date(goal.deadline)
  : null;

const monthsAvailable =
  deadlineDate
    ? Math.max(
        Math.ceil(
          (deadlineDate - today) /
            (1000 * 60 * 60 * 24 * 30)
        ),
        0
      )
    : null;

const goalStatus =
  remaining <= 0
    ? "Completed"
    : !goal.deadline
    ? "No deadline"
    : monthsToGoal <= monthsAvailable
    ? "On track"
    : "Behind";
            return (
              <div
                className="panel goal-card"
                key={goal.id}
              >

                <div className="goal-top">

                  <div className="goal-icon">
                    <Target size={20} />
                  </div>

                  <button
                    className="delete-goal"
                    onClick={() =>
                      setGoals(
                        goals.filter(
                          (item) =>
                            item.id !== goal.id
                        )
                      )
                    }
                  >
                    <X size={16} />
                  </button>

                </div>

                <h3>{goal.name}</h3>

                <div className="goal-amounts">

                  <div>
                    <span>Saved</span>

                    <strong>
                      {formatCurrency(goal.saved)}
                    </strong>
                  </div>

                  <div>
                    <span>Target</span>

                    <strong>
                      {formatCurrency(goal.target)}
                    </strong>
                  </div>

                </div>

                <div className="goal-progress">

                  <div className="goal-progress-header">
                    <span>Progress</span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className="goal-bar">
                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                  {remaining > 0 && monthlySurplus > 0 ? (
  <p className="goal-insight">
    💡 Your current surplus is around {formatCurrency(monthlySurplus)} per month.
  </p>
) : remaining > 0 ? (
  <p className="goal-insight">
    ⚠️ Add some income or reduce expenses
    to start progressing toward this goal.
  </p>
) : (
  <p className="goal-insight completed">
    🎉 Goal completed!
  </p>
)}
<p className="goal-insight">
  {goalStatus === "Completed"
    ? "✅ You reached this goal."
    : goalStatus === "On track"
    ? "🟢 You are on track to reach this goal."
    : goalStatus === "Behind"
    ? "🔴 Your current savings rate may not reach the goal by the deadline."
    : "ℹ️ Set a deadline to track your progress."}
</p>

                </div>

                <div className="goal-footer">

                  <span>
                    {formatCurrency(remaining)}{" "}
                    remaining
                  </span>
                  {remaining > 0 && (
  <span>
    📈 ~{monthsToGoal} month
    {monthsToGoal !== 1 ? "s" : ""} to goal
  </span>
)}

                  {goal.deadline && (
                    <span>
                      <CalendarDays size={12} />
                      {new Date(
                        goal.deadline
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {showGoalForm && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Create Savings Goal</h2>

                <p>
                  What are you saving for?
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowGoalForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={addGoal}>

              <label>Goal Name</label>

              <input
                className="normal-input"
                type="text"
                placeholder="e.g. New Laptop"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <label>Target Amount</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  placeholder="60000"
                  value={form.target}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target: e.target.value,
                    })
                  }
                />
              </div>

              <label>Already Saved</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  placeholder="0"
                  value={form.saved}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      saved: e.target.value,
                    })
                  }
                />
              </div>

              <label>Target Date</label>

              <div className="input-wrapper">

                <CalendarDays size={17} />

                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      deadline: e.target.value,
                    })
                  }
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowGoalForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-button"
                >
                  <Target size={17} />
                  Create Goal
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

function Forecast({ transactions, recurringPayments }) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const currentBalance = income - expenses;

  const expenseTransactions = transactions.filter(
    (item) => item.type === "expense"
  );

  const averageDailySpending =
  expenseTransactions.length > 0
    ? expenses / 30
    : 0;

const dailySpending = averageDailySpending;

  const monthlyRecurring = recurringPayments
    .filter((item) => item.frequency === "Monthly")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const weeklyRecurring = recurringPayments
    .filter((item) => item.frequency === "Weekly")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const yearlyRecurring = recurringPayments
    .filter((item) => item.frequency === "Yearly")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const recurring30DayCost =
  recurringPayments.reduce((total, payment) => {
    const today = new Date();
    const paymentDate = new Date(payment.nextDate);

    if (payment.frequency === "Monthly") {
      while (paymentDate < today) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
    }

    if (payment.frequency === "Weekly") {
      while (paymentDate < today) {
        paymentDate.setDate(paymentDate.getDate() + 7);
      }
    }

    if (payment.frequency === "Yearly") {
      while (paymentDate < today) {
        paymentDate.setFullYear(paymentDate.getFullYear() + 1);
      }
    }

    const daysUntilPayment = Math.ceil(
      (paymentDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (daysUntilPayment > 30) {
      return total;
    }

    return total + Number(payment.amount);
  }, 0);

  const projectedSpending30Days =
  dailySpending * 30;

const projected30DayExpenses =
  projectedSpending30Days + recurring30DayCost;

const projectedBalance =
  currentBalance - projected30DayExpenses;
  let forecastInsight = "";

if (projectedBalance < 0) {
  forecastInsight =
    "⚠️ Your projected balance may become negative within the next 30 days. Consider reducing expenses.";
} else if (projectedBalance < 10000) {
  forecastInsight =
    "⚠️ Your projected balance is getting low. Try to control non-essential spending.";
} else {
  forecastInsight =
    "✅ Your projected balance looks healthy for the next 30 days.";
}

  const safetyThreshold = 10000;

  let risk = "Healthy";

  if (projectedBalance < 0) {
    risk = "Critical";
  } else if (projectedBalance < safetyThreshold) {
    risk = "Warning";
  }

  const riskClass =
    risk === "Critical"
      ? "high-risk"
      : risk === "Warning"
      ? "medium-risk"
      : "healthy-risk";

  let daysUntilRisk = null;

  if (
  dailySpending > 0 &&
  currentBalance > safetyThreshold
) {
  daysUntilRisk = Math.floor(
    (currentBalance - safetyThreshold) / dailySpending
  );
} else if (currentBalance <= safetyThreshold) {
  daysUntilRisk = 0;
}
const categorySpending = transactions
  .filter((item) => item.type === "expense")
  .reduce((categories, item) => {
    const category = item.category || "Other";

    categories[category] =
      (categories[category] || 0) + Number(item.amount || 0);

    return categories;
  }, {});
  const totalCategorySpending =
  Object.values(categorySpending).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const forecastData = [
  {
    day: "Today",
    balance: currentBalance,
  },
  {
    day: "7 Days",
    balance: Math.max(
      currentBalance - dailySpending * 7,
      0
    ),
  },
  {
    day: "15 Days",
    balance: Math.max(
      currentBalance - dailySpending * 15,
      0
    ),
  },
  {
    day: "22 Days",
    balance: Math.max(
      currentBalance - dailySpending * 22,
      0
    ),
  },
  {
    day: "30 Days",
    balance: Math.max(
      currentBalance -
        dailySpending * 30 -
        recurring30DayCost,
      0
    ),
  },
];

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Cash Flow Forecast</h1>
          <p>See where your money could be heading.</p>
        </div>

        <div className={`risk-badge ${riskClass}`}>
          {risk === "Healthy" ? "✓" : "⚠"} {risk}
        </div>
      </header>

      <section className="forecast-stats">

        <div className="forecast-stat">
          <span>Current Balance</span>

          <strong>
            {formatCurrency(currentBalance)}
          </strong>
        </div>

        <div className="forecast-stat">
          <span>Daily Spending</span>

          <strong>
            {formatCurrency(Math.round(dailySpending))}
          </strong>
        </div>

        <div className="forecast-stat">
          <span>Upcoming Commitments</span>

          <strong className="expense-text">
            {formatCurrency(
              Math.round(
                recurring30DayCost
              )
            )}
          </strong>
        </div>

        <div className="forecast-stat">
          <span>30-Day Balance</span>

          <strong
            className={
              projectedBalance >= safetyThreshold
                ? "positive"
                : "expense-text"
            }
          >
            {formatCurrency(
              Math.round(
                projectedBalance
              )
            )}
          </strong>
        </div>

      </section>

      <section className="panel forecast-large">

        <div className="panel-header">
          <div>
            <h3>30-Day Balance Projection</h3>

            <p>
              Estimated balance based on your spending
              pattern and recurring payments.
            </p>
          </div>
        </div>

        <div className="forecast-chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={forecastData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#242b38"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                stroke="#687386"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#687386"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`
}
              />

              <Tooltip
                contentStyle={{
                  background: "#151a23",
                  border: "1px solid #293140",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                formatter={(value) => [
  formatCurrency(Math.round(value)),
  "Projected Balance",
]}
              />

              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </section>

      <CashFlowHealth
        transactions={transactions}
        recurringPayments={recurringPayments}
      />
      <AffordabilityChecker
        currentBalance={currentBalance}
        projectedBalance={projectedBalance}
        safetyThreshold={safetyThreshold}
      />
      <PurchaseTiming
        transactions={transactions}
        recurringPayments={recurringPayments}
      />
      <UpcomingPaymentImpact
        recurringPayments={recurringPayments}
      />
      <SmartRecommendations
        transactions={transactions}
      />
      <section className="forecast-grid">

        <div className="panel forecast-explanation">

          <div className="forecast-heading">

            <div className="forecast-ai-icon">
              <Bot size={22} />
            </div>

            <div>
              <h3>CashFlowX Intelligence</h3>

              <span>
                Personalized prediction from your
                financial activity
              </span>
            </div>

          </div>

          <p>
            Based on your current spending pattern and
            upcoming recurring payments, CashFlowX
            estimates that your balance could be{" "}
            <strong>
              {formatCurrency(
                Math.round(
                  projectedBalance
                )
              )}
            </strong>{" "}
            after 30 days.
          </p>

          {risk === "Critical" && (
            <div className="forecast-warning">
              🚨 Your projected balance may become
              negative. Consider reducing
              non-essential spending.
            </div>
          )}

          {risk === "Warning" && (
            <div className="forecast-warning">
              ⚠ Your projected balance may fall below
              your ₹10,000 safety threshold.
            </div>
          )}

          {risk === "Healthy" && (
            <div className="forecast-success">
              ✓ Your projected balance remains above
              your safety threshold.
            </div>
          )}

          {daysUntilRisk !== null &&
  daysUntilRisk >= 0 && (
    <div className="risk-timeline">

      <Clock size={16} />

      {daysUntilRisk === 0 ? (
        <span>
          Your balance is already at or below the
          ₹10,000 safety threshold.
        </span>
      ) : (
        <span>
          At your current spending rate, your balance
          could reach ₹10,000 in approximately{" "}
          <strong>{daysUntilRisk} days</strong>.
        </span>
      )}

    </div>
)}
        </div>

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>Forecast Factors</h3>

              <p>
                What affects your prediction
              </p>
            </div>

          </div>

          <div className="factor-list">

            <div>
              <span>Current balance</span>

              <strong>
                {formatCurrency(currentBalance)}
              </strong>
            </div>

            <div>
              <span>Daily spending</span>

              <strong>
                {formatCurrency(
                  Math.round(
                    dailySpending
                  )
                )}
              </strong>
            </div>

            <div>
              <span>Recurring commitments</span>

              <strong>
                {formatCurrency(
                  Math.round(
                    recurring30DayCost
                  )
                )}
              </strong>
            </div>

            <div>
              <span>30-day expenses</span>

              <strong>
                {formatCurrency(
                  Math.round(
                    projected30DayExpenses
                  )
                )}
              </strong>
            </div>

          </div>

                </div>

      </section>

      <section className="panel forecast-categories">

        <div className="panel-header">
          <div>
            <h3>Spending by Category</h3>
            <p>Where your recorded expenses are going.</p>
          </div>
        </div>

        {Object.keys(categorySpending).length === 0 ? (
          <p>No expense data available yet.</p>
        ) : (
          Object.entries(categorySpending).map(
            ([category, amount]) => (
              <div
                className="forecast-category"
                key={category}
              >
                <span>{category}</span>

                <div>
  <strong>
    {formatCurrency(amount)}
  </strong>

  <span className="category-percentage">
    {totalCategorySpending > 0
      ? Math.round(
          (amount / totalCategorySpending) * 100
        )
      : 0}%
  </span>
</div>
                <div className="category-bar">
  <div
    style={{
      width: `${
        totalCategorySpending > 0
          ? (amount / totalCategorySpending) * 100
          : 0
      }%`,
    }}
  />
</div>
              </div>
            )
          )
        )}

      </section>
    </>
  );
}

function RecurringPayments({
  recurringPayments,
  setRecurringPayments,
}) {


  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Bills",
    amount: "",
    frequency: "Monthly",
    nextDate: "2026-09-01",
  });

  const addPayment = (e) => {
    e.preventDefault();

    if (!form.name || !form.amount || !form.nextDate) {
      return;
    }

    setRecurringPayments([
      ...recurringPayments,
      {
        id: Date.now(),
        name: form.name,
        category: form.category,
        amount: Number(form.amount),
        frequency: form.frequency,
        nextDate: form.nextDate,
      },
    ]);

    setForm({
      name: "",
      category: "Bills",
      amount: "",
      frequency: "Monthly",
      nextDate: "2026-09-01",
    });

    setShowForm(false);
  };

  const deletePayment = (id) => {
  setRecurringPayments(
    recurringPayments.filter(
      (payment) => payment.id !== id
    )
  );
};

  const totalMonthly = recurringPayments
  .filter((payment) => payment.frequency === "Monthly")
  .reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Upcoming Payments</h1>
          <p>Never get surprised by a recurring expense.</p>
        </div>

        <button
          className="add-transaction-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Payment
        </button>
      </header>

      <section className="payment-summary">
        <div className="payment-summary-card">
          <span>Recurring Payments</span>
          <strong>{recurringPayments.length}</strong>
        </div>

        <div className="payment-summary-card">
          <span>Monthly Commitment</span>
          <strong>
            {formatCurrency(totalMonthly)}
          </strong>
        </div>

        <div className="payment-summary-card">
          <span>Next Payment</span>
          <strong>
            {recurringPayments.length > 0
              ? new Date(
                  recurringPayments
                    .map((p) => p.nextDate)
                    .sort()[0]
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "None"}
          </strong>
        </div>
      </section>

      <section className="payment-panel">
        <div className="payment-panel-header">
          <div>
            <h3>Recurring Payments</h3>
            <p>Payments that CashFlowX will consider in your forecast.</p>
          </div>
        </div>

        <div className="payment-list">
          {recurringPayments.map((payment) => (
            <div className="payment-item" key={payment.id}>
              <div className="payment-main">
                <div className="payment-icon">
                  <Receipt size={19} />
                </div>

                <div>
                  <strong>{payment.name}</strong>

                  <span>
                    {payment.category} • {payment.frequency}
                  </span>
                </div>
              </div>

              <div className="payment-date">
                <span>Next payment</span>

                <strong>
                  {new Date(
                    payment.nextDate
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>

              <strong className="payment-amount">
                {formatCurrency(payment.amount)}
              </strong>

              <button
                className="delete-payment"
                onClick={() => deletePayment(payment.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="payment-insight">
        <div className="payment-insight-icon">
          <Bot size={22} />
        </div>

        <div>
          <h3>CashFlowX Reminder</h3>

          <p>
            You have{" "}
            <strong>
              {formatCurrency(totalMonthly)}
            </strong>{" "}
            in recurring monthly commitments. These will be
            considered when calculating your future cash flow.
          </p>
        </div>
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add Recurring Payment</h2>
                <p>Add an expense that happens regularly.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addPayment}>
              <label>Payment Name</label>

              <input
                className="normal-input"
                type="text"
                placeholder="e.g. Hostel Fee"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <label>Category</label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              >
                <option>Housing</option>
                <option>Bills</option>
                <option>Subscription</option>
                <option>Education</option>
                <option>Insurance</option>
                <option>EMI</option>
                <option>Other</option>
              </select>

              <label>Amount</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                />
              </div>

              <label>Frequency</label>

              <select
                value={form.frequency}
                onChange={(e) =>
                  setForm({
                    ...form,
                    frequency: e.target.value,
                  })
                }
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>

              <label>Next Payment Date</label>

              <input
                className="normal-input"
                type="date"
                value={form.nextDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nextDate: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-button">
                  <Plus size={17} />
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !password.trim()) {
      setError("Please enter your name and password.");
      return;
    }

    onLogin(name, password);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>CashFlowX</h1>
        <p>Manage your money smarter.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
  localStorage.getItem("cashflowx_logged_in") === "true"
);

const [userName, setUserName] = useState(() =>
  localStorage.getItem("cashflowx_user_name") || ""
);
const handleLogin = (name, password) => {
  if (!name.trim() || !password.trim()) {
    return false;
  }

  localStorage.setItem("cashflowx_logged_in", "true");
  localStorage.setItem("cashflowx_user_name", name.trim());

  setUserName(name.trim());
  setIsLoggedIn(true);

  return true;
};
const handleLogout = () => {
  localStorage.removeItem("cashflowx_logged_in");
  localStorage.removeItem("cashflowx_user_name");

  setIsLoggedIn(false);
  setUserName("");
};
  const [recurringPayments, setRecurringPayments] = useState(() =>
  loadFromLocalStorage(`cashflowx_payments_${userName}`, [])
);
  const [activePage, setActivePage] = useState("Dashboard");
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState(() => 
  loadFromLocalStorage(
    `cashflowx_transactions_${userName}`,
    initialTransactions
  ) 
);

  const [goals, setGoals] = useState(() =>
  loadFromLocalStorage(
    `cashflowx_goals_${userName}`,
    []
  )
);
// Save to localStorage
useEffect(() => {
  if (!userName) return;

  saveToLocalStorage(
    `cashflowx_transactions_${userName}`,
    transactions
  );
}, [transactions, userName]);

useEffect(() => {
  if (!userName) return;

  saveToLocalStorage(
    `cashflowx_goals_${userName}`,
    goals
  );
}, [goals, userName]);

useEffect(() => {
  if (!userName) return;

  saveToLocalStorage(
    `cashflowx_payments_${userName}`,
    recurringPayments
  );
}, [recurringPayments, userName]);

// Load data whenever the logged-in account changes
useEffect(() => {
  if (!isLoggedIn || !userName) return;

  setTransactions(
    loadFromLocalStorage(
      `cashflowx_transactions_${userName}`,
      initialTransactions
    )
  );

  setGoals(
    loadFromLocalStorage(
      `cashflowx_goals_${userName}`,
      []
    )
  );

  setRecurringPayments(
    loadFromLocalStorage(
      `cashflowx_payments_${userName}`,
      []
    )
  );
}, [isLoggedIn, userName]);
useEffect(() => {
  if (!isLoggedIn || !userName) return;

  const savedTransactions = loadFromLocalStorage(
    `cashflowx_transactions_${userName}`,
    initialTransactions
  );

  const savedGoals = loadFromLocalStorage(
    `cashflowx_goals_${userName}`,
    []
  );

  const savedPayments = loadFromLocalStorage(
    `cashflowx_payments_${userName}`,
    []
  );

  setTransactions(savedTransactions);
  setGoals(savedGoals);
  setRecurringPayments(savedPayments);
}, [isLoggedIn, userName]);
useEffect(() => {
  if (!isLoggedIn || !userName) return;

  saveToLocalStorage(
    `cashflowx_transactions_${userName}`,
    transactions
  );
}, [transactions, isLoggedIn, userName]);

useEffect(() => {
  if (!isLoggedIn || !userName) return;

  saveToLocalStorage(
    `cashflowx_goals_${userName}`,
    goals
  );
}, [goals, isLoggedIn, userName]);

useEffect(() => {
  if (!isLoggedIn || !userName) return;

  saveToLocalStorage(
    `cashflowx_payments_${userName}`,
    recurringPayments
  );
}, [recurringPayments, isLoggedIn, userName]);


  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    date: "2026-08-30",
    description: "",
  });

  const [errors, setErrors] = useState({});


  const validateTransaction = () => {
    const newErrors = {};
    if (!form.amount || form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!form.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const deleteTransaction = (id) => {
  setTransactions(
    transactions.filter(
      (transaction) => transaction.id !== id
    )
  );

  showNotification(
    "✓ Transaction deleted successfully!",
    "success"
  );
};
  const addTransaction = (e) => {
    e.preventDefault();

    if (!validateTransaction()) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: form.description,
      category: form.category,
      amount: Number(form.amount),
      date: new Date(form.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      type: form.type,
    };

    setTransactions([newTransaction, ...transactions]);

    setForm({
      type: "expense",
      amount: "",
      category: "Food",
      date: "2026-08-30",
      description: "",
    });

    setShowModal(false);
    showNotification("✓ Transaction added successfully!", "success");
  };
if (!isLoggedIn) {
  return (
    <Login onLogin={handleLogin} />
  );
}
  return (
    <div className="app">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Wallet size={22} />
          </div>

          <span>
            CashFlow<span className="logo-x">X</span>
          </span>
        </div>

        <nav>
          <p className="menu-title">MAIN</p>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Transactions" ? "active" : ""
            }`}
            onClick={() => setActivePage("Transactions")}
          >
            <ArrowLeftRight size={19} />
            Transactions
          </button>

          <button
            className={`nav-item ${
              activePage === "Analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("Analytics")}
          >
            <BarChart3 size={19} />
            Analytics
          </button>

          <button
            className={`nav-item ${
              activePage === "Budgets" ? "active" : ""
            }`}
            onClick={() => setActivePage("Budgets")}
          >
            <WalletCards size={19} />
            Budgets
          </button>

          <button
            className={`nav-item ${
              activePage === "Payments" ? "active" : ""
            }`}
            onClick={() => setActivePage("Payments")}
          >
            <Receipt size={19} />
            Upcoming Payments
          </button>

          <button
            className={`nav-item ${
              activePage === "Goals" ? "active" : ""
            }`}
            onClick={() => setActivePage("Goals")}
          >
            <Target size={19} />
            Savings Goals
          </button>

          <p className="menu-title second">TOOLS</p>

          <button
            className={`nav-item ${
              activePage === "Assistant" ? "active" : ""
            }`}
            onClick={() => setActivePage("Assistant")}
          >
            <Bot size={19} />
            AI Assistant
          </button>

          <button
            className={`nav-item ${
              activePage === "Forecast" ? "active" : ""
            }`}
            onClick={() => setActivePage("Forecast")}
          >
            <TrendingUp size={19} />
            Cash Flow Forecast
          </button>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("Settings")}
          >
            <SettingsIcon size={19} />
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <TrendingUp size={18} />
            </div>

            <strong>Smart Finance</strong>
            <p>Take control of your cash flow.</p>
          </div>

          <div className="profile">
  <div className="avatar">
    {userName.charAt(0).toUpperCase()}
  </div>

  <div>
    <strong>{userName}</strong>
    <p>Personal Account</p>
  </div>
</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {activePage === "Dashboard" ? (
          <Dashboard
  transactions={transactions}
  userName={userName}
/>
        ) : activePage === "Transactions" ? (
          <Transactions
  transactions={transactions}
  onAdd={() => setShowModal(true)}
  onDelete={deleteTransaction}
/>
        ) : activePage === "Analytics" ? (
          <Analytics transactions={transactions} />
        ) : activePage === "Budgets" ? (
          <Budgets transactions={transactions} />
        ) : activePage === "Goals" ? (
          <SavingsGoals
            goals={goals}
            setGoals={setGoals}
            transactions={transactions}
          />
        ) : activePage === "Payments" ? (
          <RecurringPayments
            recurringPayments={recurringPayments}
            setRecurringPayments={setRecurringPayments}
          />
        ) : activePage === "Assistant" ? (
          <FinancialAssistant
            transactions={transactions}
            recurringPayments={recurringPayments}
            goals={goals}
          />
        ) : activePage === "Forecast" ? (
          <Forecast
            transactions={transactions}
            recurringPayments={recurringPayments}
          />
        ) : activePage === "Settings" ? ( 
  <Settings onLogout={handleLogout}
  userName={userName} /> 
) : null}
      </main>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add Transaction</h2>
                <p>Record your income or expense.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addTransaction}>
              <label>Transaction Type</label>

              <div className="type-buttons">
                <button
                  type="button"
                  className={form.type === "expense" ? "selected" : ""}
                  onClick={() =>
                    setForm({ ...form, type: "expense" })
                  }
                >
                  <TrendingDown size={17} />
                  Expense
                </button>

                <button
                  type="button"
                  className={form.type === "income" ? "selected income" : ""}
                  onClick={() =>
                    setForm({ ...form, type: "income" })
                  }
                >
                  <TrendingUp size={17} />
                  Income
                </button>
              </div>

              <label>Amount</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                />
              </div>
              {errors.amount && <p className="error-message">{errors.amount}</p>}

              <label>Category</label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Food</option>
                <option>Shopping</option>
                <option>Transport</option>
                <option>Bills</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Income</option>
                <option>Other</option>
              </select>

              <label>Date</label>

              <div className="input-wrapper">
                <CalendarDays size={17} />

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>
              {errors.date && <p className="error-message">{errors.date}</p>}

              <label>Description</label>

              <input
                className="normal-input"
                type="text"
                placeholder="e.g. Dinner at restaurant"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && <p className="error-message">{errors.description}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-button">
                  <Plus size={17} />
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

function Dashboard({ transactions = [], userName }) {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const totalBalance = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? Math.round(
          ((totalIncome - totalExpenses) /
            totalIncome) *
            100
        )
      : 0;

  const categoryTotals = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      const category = item.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(item.amount || 0);
    });

  const dynamicSpendingData = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <>
      {transactions.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "100px" }}>
          <div className="empty-icon">📊</div>
          <h2>Welcome to CashFlowX</h2>
          <p>Start by adding your income and expenses to see financial insights</p>
        </div>
      ) : (
        <>
          <header className="topbar">
            <div>
              <h1>Good evening, {userName} 👋</h1>
              <p>Here's your financial overview.</p>
            </div>

            <button className="notification">
              <Bell size={20} />
              <span></span>
            </button>
          </header>

          <section className="summary-grid">
            <div className="summary-card">
              <div className="card-top">
                <span>Total Balance</span>

                <div className="card-icon balance">
                  <Wallet size={20} />
                </div>
              </div>

              <h2>
                {formatCurrency(totalBalance)}
              </h2>

              <div className="card-change positive">
                <TrendingUp size={15} />
                8.4% this month
              </div>
            </div>

            <div className="summary-card">
              <div className="card-top">
                <span>Total Income</span>

                <div className="card-icon income">
                  <TrendingUp size={20} />
                </div>
              </div>

              <h2>
                {formatCurrency(totalIncome)}
              </h2>

              <div className="card-change positive">
                <TrendingUp size={15} />
                12.2% this month
              </div>
            </div>

            <div className="summary-card">
              <div className="card-top">
                <span>Total Expenses</span>

                <div className="card-icon expense">
                  <TrendingDown size={20} />
                </div>
              </div>

              <h2>
                {formatCurrency(totalExpenses)}
              </h2>

              <div className="card-change negative">
                <TrendingUp size={15} />
                5.6% this month
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="panel forecast-panel">
              <div className="panel-header">
                <div>
                  <h3>Cash Flow Forecast</h3>
                  <p>Projected balance for the next 30 days</p>
                </div>

                <span className="forecast-badge">
                  <TrendingUp size={14} />
                  Stable
                </span>
              </div>

              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#242b38"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      stroke="#687386"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#687386"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#151a23",
                        border: "1px solid #293140",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                      formatter={(value) => [formatCurrency(value), "Balance"]}
                    />

                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Spending Breakdown</h3>
                  <p>This month's expenses</p>
                </div>

                <BarChart3 size={20} className="panel-icon" />
              </div>

              <div className="spending-list">
                {dynamicSpendingData.map((item) => {
                  const Icon =
                    item.name === "Food"
                      ? Utensils
                      : item.name === "Shopping"
                      ? ShoppingBag
                      : item.name === "Transport"
                      ? Car
                      : Receipt;

                  return (
                    <div className="spending-item" key={item.name}>
                      <div className="spending-left">
                        <div className="spending-icon">
                          <Icon size={17} />
                        </div>

                        <span>{item.name}</span>
                      </div>

                      <strong>
                        {formatCurrency(item.amount)}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="total-spending">
                <span>Total spending</span>
                <strong>{formatCurrency(totalExpenses)}</strong>
              </div>
            </div>
          </section>

          <section className="insight">
            <div className="insight-icon">
              <Bot size={24} />
            </div>

            <div className="insight-content">
              <div className="insight-title">
                <h3>CashFlowX Insight</h3>
                <span>AI Powered</span>
              </div>

              <p>
                {savingsRate >= 30
                  ? `Your finances are looking healthy. You're currently saving around ${savingsRate}% of your recorded income.`
                  : savingsRate > 0
                  ? `You currently have a ${savingsRate}% savings rate. Consider reducing unnecessary expenses to improve your cash flow.`
                  : "Your expenses are currently equal to or higher than your recorded income. Consider reviewing your spending."}
              </p>
            </div>

            <button className="view-insight">View Details →</button>
          </section>
        </>
      )}
    </>
  );
}

function Transactions({ transactions, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      return matchesSearch && matchesType;
    });

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Transactions</h1>
          <p>Track every rupee coming in and going out.</p>
        </div>

        <button 
          className="add-transaction-button"
          onClick={() => exportTransactionsAsCSV(transactions)}
          style={{ marginRight: "10px" }}
        >
          <Download size={18} />
          Export CSV
        </button>

        <button className="add-transaction-button" onClick={onAdd}>
          <Plus size={18} />
          Add Transaction
        </button>
      </header>

      <section className="transaction-summary">
        <div className="transaction-stat">
          <span>Total Income</span>
          <strong className="income-text">
            {formatCurrency(totalIncome)}
          </strong>
        </div>

        <div className="transaction-stat">
          <span>Total Expenses</span>
          <strong className="expense-text">
            {formatCurrency(totalExpense)}
          </strong>
        </div>

        <div className="transaction-stat">
          <span>Net Cash Flow</span>
          <strong>
            {formatCurrency(totalIncome - totalExpense)}
          </strong>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <section className="transaction-controls">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={filterType === "all" ? "active" : ""}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button 
            className={filterType === "income" ? "active" : ""}
            onClick={() => setFilterType("income")}
          >
            💰 Income
          </button>
          <button 
            className={filterType === "expense" ? "active" : ""}
            onClick={() => setFilterType("expense")}
          >
            💸 Expense
          </button>
        </div>
      </section>

      <section className="transaction-panel">
        <div className="transaction-panel-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Your latest financial activity</p>
          </div>

          <button className="search-button">
            <Search size={17} />
          </button>
        </div>

        <div className="transaction-table">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <Search size={30} />
              <h2>No transactions found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="table-header">
                <span>TRANSACTION</span>
                <span>CATEGORY</span>
                <span>DATE</span>
                <span>AMOUNT</span>
              </div>

              {filteredTransactions.map((transaction) => (
                <div className="table-row" key={transaction.id}>
                  <div className="transaction-name">
                    <div
                      className={`transaction-icon ${
                        transaction.type === "income"
                          ? "income-bg"
                          : "expense-bg"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp size={17} />
                      ) : (
                        <TrendingDown size={17} />
                      )}
                    </div>

                    <strong>{transaction.name}</strong>
                  </div>

                  <span className="category-badge">
                    {transaction.category}
                  </span>

                  <span className="transaction-date">
                    {transaction.date}
                  </span>

                  <strong
                    className={
                      transaction.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </strong>
                  <button
  className="delete-transaction"
  onClick={() => onDelete(transaction.id)}
>
  <X size={16} />
</button>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default App;