// controllers/limit.controller.js
const axios = require('axios');

const BASE_URL =
  process.env.BaseURL;


/**
 * 1) GET /limit/credit-limit
 * Proxies -> GET {BASE}/api/master/GetGlobalCredit
 * Returns upstream body as-is:
 * { resCode, resData: [ { id, creditLimitInUSD, transactionLimitInUSD, transactionLimitInUSD_Bank, wallet } ], resMessage }
 */
exports.getCreditLimit = async (req, res) => {
  try {
   const token = req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ message: 'Missing API token' });
    }

    const { data } = await axios.get(`${BASE_URL}/api/master/GetGlobalCredit`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      timeout: 10000
    });

    return res.status(200).json(data);
  } catch (error) {
    if (error.response) return res.status(error.response.status || 400).json(error.response.data);
    return res.status(500).json({ message: 'Error fetching credit limit', detail: error.message });
  }
};

/**
 * 2) POST /limit/credit-limit
 * Body: { creditLimit:number, enteredBy:string }
 * Proxies -> POST {BASE}/api/master/Global/Creditlimit/update
 */
exports.updateCreditLimit = async (req, res) => {
  try {
    const token = req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ message: 'Missing API token' });
    }


    const { creditLimit, enteredBy } = req.body || {};
    if (creditLimit == null || !enteredBy) {
      return res.status(400).json({ message: 'creditLimit and enteredBy are required' });
    }

    const payload = { creditLimit: Number(creditLimit), enteredBy: String(enteredBy) };

    const { data, status } = await axios.post(
      `${BASE_URL}/api/master/Global/Creditlimit/update`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        timeout: 15000
      }
    );

    return res.status(status || 200).json(data);
  } catch (error) {
    if (error.response) return res.status(error.response.status || 400).json(error.response.data);
    return res.status(500).json({ message: 'Error updating credit limit', detail: error.message });
  }
};

/**
 * 3) POST /limit/transaction-limit  (transactions-only)
 * Body: { cash:number, bank:number, enteredBy:string }
 *        (also accepts { cashLimit, bankLimit } and maps)
 * Proxies -> POST {BASE}/api/master/Global/Transactionlimit/update
 */
exports.globalTransactionLimit = async (req, res) => {
  try {
    const token = req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ message: 'Missing API token' });
    }


    const cash = req.body.cash ?? req.body.cashLimit;
    const bank = req.body.bank ?? req.body.bankLimit;
    const enteredBy = req.body.enteredBy;

    if (cash == null || bank == null || !enteredBy) {
      return res.status(400).json({ message: 'cash, bank, and enteredBy are required' });
    }

    const payload = {
      cash: Number(cash),
      bank: Number(bank),
      enteredBy: String(enteredBy)
    };

    const { data, status } = await axios.post(
      `${BASE_URL}/api/master/Global/Transactionlimit/update`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        timeout: 15000
      }
    );

    return res.status(status || 200).json(data);
  } catch (error) {
    if (error.response) return res.status(error.response.status || 400).json(error.response.data);
    return res.status(500).json({ message: 'Error updating transaction limit', detail: error.message });
  }
};

/**
 * 4) PUT /limit/transaction-limit  (combined update-all)
 * Body: { id, creditLimitInUSD, transactionLimitInUSD, transactionLimitInUSD_Bank, wallet }
 * Proxies -> POST {BASE}/api/master/UpdateGlobalLimit
 */
exports.updateTransactionLimit = async (req, res) => {
  try {
     const token = req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ message: 'Missing API token' });
    }


    const {
      id,
      creditLimitInUSD,
      transactionLimitInUSD,
      transactionLimitInUSD_Bank,
      wallet
    } = req.body || {};

    if (
      id == null ||
      creditLimitInUSD == null ||
      transactionLimitInUSD == null ||
      transactionLimitInUSD_Bank == null ||
      wallet == null
    ) {
      return res.status(400).json({
        message:
          'id, creditLimitInUSD, transactionLimitInUSD, transactionLimitInUSD_Bank, wallet are required'
      });
    }

    const payload = {
      id: Number(id),
      creditLimitInUSD: Number(creditLimitInUSD),
      transactionLimitInUSD: Number(transactionLimitInUSD),
      transactionLimitInUSD_Bank: Number(transactionLimitInUSD_Bank),
      wallet: Number(wallet)
    };
console.log(payload)
    const { data, status } = await axios.patch(
      `${BASE_URL}/api/master/UpdateGlobalLimit`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        timeout: 15000
      }
    );
    console.log(data)

    return res.status(status || 200).json(data);
  } catch (error) {
    if (error.response) return res.status(error.response.status || 400).json(error.response.data);
    return res.status(500).json({ message: 'Error updating global limit', detail: error.message });
  }
};
