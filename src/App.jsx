import { useState } from 'react';

export default function App() {
  const [historyValuation, setHistoryValuation] = useState('');
  const [initialHoldPct, setInitialHoldPct] = useState('');
  const [preMoney, setPreMoney] = useState('');
  const [investment, setInvestment] = useState('');
  const [followOnInvestment, setFollowOnInvestment] = useState('');
  const [esopPct, setEsopPct] = useState('');
  const [esopTiming, setEsopTiming] = useState('post'); // 'pre' or 'post'
  const [showDetails, setShowDetails] = useState(false);

  const followOn = Number(followOnInvestment);
  const totalInvestment = Number(investment);
  const esopRatio = Number(esopPct) / 100;
  const postMoney = Number(preMoney) + totalInvestment;

  let baseShares = 0;
  let newShares = totalInvestment;
  let totalShares = 0;
  let initialShares = 0;
  let pricePerShare = 0;
  let followOnShares = 0;

  if (esopTiming === 'pre') {
    // 投前增发：ESOP 完全由老股东稀释，投资人不被稀释
    baseShares = 100;
    pricePerShare = Number(preMoney) / baseShares;

    // 老股东股份整体乘以 (1 - esopRatio)
    const adjustedHoldPct = Number(initialHoldPct) * (1 - esopRatio);
    initialShares = (adjustedHoldPct / 100) * baseShares;

    followOnShares = followOn / pricePerShare;
    newShares = totalInvestment / pricePerShare;
    totalShares = baseShares + newShares;
  } else {
    // 投后增发：融资后 cap table 引入 ESOP，所有人一起稀释
    baseShares = 100;
    pricePerShare = Number(preMoney) / baseShares;
    newShares = totalInvestment / pricePerShare;

    const postInvestmentShares = baseShares + newShares;
    totalShares = postInvestmentShares / (1 - esopRatio);

    // 股份数不变，比例稀释由 totalShares 增加体现
    initialShares = (Number(initialHoldPct) / 100) * baseShares;
    followOnShares = followOn / pricePerShare;
    // 投后增发：融资完成后再增发 → cap table 先扩大
    
  }

  const newOwnership = ((initialShares + followOnShares) / totalShares) * 100;
  const initialValue = ((Number(historyValuation) * Number(initialHoldPct)) / 100).toFixed(2);
  const currentValue = ((postMoney * newOwnership) / 100).toFixed(2);
  const gainAmount = (currentValue - initialValue).toFixed(2);
  const gainPct = (((currentValue - initialValue) / initialValue) * 100).toFixed(2);

  const investorShares = newShares - followOnShares;
  const investorOwnership = (investorShares / totalShares) * 100;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>📊 股权稀释 & 增值计算器（含 ESOP + 跟投）</h1>

      <Card>
        <Input label="历史轮估值（万元）" value={historyValuation} onChange={setHistoryValuation} />
        <Input label="初始持股比例（%）" value={initialHoldPct} onChange={setInitialHoldPct} />
        <Input label="本轮 Pre-money 估值（万元）" value={preMoney} onChange={setPreMoney} />
        <Input label="本轮投资总金额（万元）" value={investment} onChange={setInvestment} />
        <Input label="其中老股东跟投金额（万元）" value={followOnInvestment} onChange={setFollowOnInvestment} />
        <Input label="ESOP 占比（%）" value={esopPct} onChange={setEsopPct} />

        <div style={{ marginBottom: '16px' }}>
          <label>ESOP 增发时点：</label><br />
          <select
            value={esopTiming}
            onChange={(e) => setEsopTiming(e.target.value)}
            style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="pre">投前增发</option>
            <option value="post">投后增发</option>
          </select>
        </div>

        <ResultBox>
          <p>💰 投资后估值（Post-money）：<strong>{postMoney || 0} 万元</strong></p>
          <p>📉 稀释后持股比例（含ESOP）：<strong>{newOwnership.toFixed(2)}%</strong></p>
          <p>🏦 新投资人持股比例：<strong>{investorOwnership.toFixed(2)}%</strong></p>
          <hr />
          <p>💼 初始股权价值：<strong>{initialValue} 万元</strong></p>
          <p>📊 当前股权价值：<strong>{currentValue} 万元</strong></p>
          <p>📈 增值金额：<strong>{gainAmount} 万元</strong></p>
          <p>📈 增值比例：<strong>{isNaN(gainPct) ? 0 : gainPct} %</strong></p>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#f0f0f0', cursor: 'pointer' }}
          >
            {showDetails ? '隐藏计算明细' : '显示计算明细'}
          </button>

          {showDetails && (
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#444' }}>
              <p>🧮 每股价格：<strong>{pricePerShare.toFixed(2)} 元</strong></p>
              <p>📦 初始股份数：<strong>{initialShares.toFixed(2)} 份</strong></p>
              <p>➕ 老股东跟投股份数：<strong>{followOnShares.toFixed(2)} 份</strong></p>
              <p>🆕 新增股份总数：<strong>{newShares.toFixed(2)} 份</strong></p>
              <p>📈 总股份数：<strong>{totalShares.toFixed(2)} 份</strong></p>
            </div>
          )}
        </ResultBox>
      </Card>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label>{label}</label><br />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
      />
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
      {children}
    </div>
  );
}

function ResultBox({ children }) {
  return (
    <div style={{ marginTop: '20px', padding: '16px', background: '#ffffff', borderRadius: '10px', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {children}
    </div>
  );
}
