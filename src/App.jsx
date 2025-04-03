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
    baseShares = 100;
    pricePerShare = Number(preMoney) / baseShares;
    const adjustedHoldPct = Number(initialHoldPct) * (1 - esopRatio);
    initialShares = (adjustedHoldPct / 100) * baseShares;
    followOnShares = followOn / pricePerShare;
    newShares = totalInvestment / pricePerShare;
    totalShares = baseShares + newShares;
  } else {
    baseShares = 100;
    pricePerShare = Number(preMoney) / baseShares;
    newShares = totalInvestment / pricePerShare;
    const postInvestmentShares = baseShares + newShares;
    totalShares = postInvestmentShares / (1 - esopRatio);
    initialShares = (Number(initialHoldPct) / 100) * baseShares;
    followOnShares = followOn / pricePerShare;
  }

  const newOwnership = ((initialShares + followOnShares) / totalShares) * 100;
  const initialValue = ((Number(historyValuation) * Number(initialHoldPct)) / 100).toFixed(2);
  const currentValue = ((postMoney * newOwnership) / 100).toFixed(2);
  const gainAmount = (currentValue - initialValue).toFixed(2);
  const gainPct = (((currentValue - initialValue) / initialValue) * 100).toFixed(2);

  const investorShares = newShares - followOnShares;
  const investorOwnership = (investorShares / totalShares) * 100;

  return (
    <div
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f9fafb',
        color: '#1f2937',
        minHeight: '100vh',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#1f2937' }}
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
              style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#f0f0f0', color: '#1f2937', cursor: 'pointer' }}
            >
              {showDetails ? '隐藏计算明细' : '显示计算明细'}
            </button>

            {showDetails && (
              <div style={{ marginTop: '16px', fontSize: '14px', color: '#374151' }}>
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
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', color: '#1f2937' }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#1f2937' }}
      />
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{ padding: '20px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {children}
    </div>
  );
}

function ResultBox({ children }) {
  return (
    <div style={{ marginTop: '20px', padding: '16px', background: '#f1f5f9', borderRadius: '10px', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: '#1f2937' }}>
      {children}
    </div>
  );
}
