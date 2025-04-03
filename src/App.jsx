import { useState } from 'react';

export default function App() {
  // 股权稀释模块
  const [oldOwnership, setOldOwnership] = useState('');
  const [preMoney, setPreMoney] = useState('');
  const [investment, setInvestment] = useState('');

  const postMoney = Number(preMoney) + Number(investment);
  const newOwnership = (
    (oldOwnership * preMoney) /
    postMoney
  ).toFixed(2);
  const dilution = (oldOwnership - newOwnership).toFixed(2);
  const equityValue = ((postMoney * newOwnership) / 100).toFixed(2);

  // 股权增值模块
  const [initialValuation, setInitialValuation] = useState('');
  const [currentValuation, setCurrentValuation] = useState('');
  const [initialHoldPct, setInitialHoldPct] = useState('');

  const initialValue = (
    (initialValuation * initialHoldPct) /
    100
  ).toFixed(2);

  const currentValue = (
    (currentValuation * newOwnership) /
    100
  ).toFixed(2);

  const gainAmount = (currentValue - initialValue).toFixed(2);
  const gainPct = (
    ((currentValue - initialValue) / initialValue) *
    100
  ).toFixed(2);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>📊 Quick Valuation Tool</h1>

      {/* 折叠模块 1 */}
      <details open style={accordionStyle}>
        <summary style={summaryStyle}>📉 股权稀释计算器</summary>
        <div style={panelStyle}>
          <Input label="老股东初始持股比例（%）" value={oldOwnership} onChange={setOldOwnership} />
          <Input label="投资前估值（万元）" value={preMoney} onChange={setPreMoney} />
          <Input label="本轮新增投资金额（万元）" value={investment} onChange={setInvestment} />

          <ResultBox>
            <p>👉 投资后公司估值：<strong>{postMoney || 0} 万元</strong></p>
            <p>📉 老股东新持股比例：<strong>{newOwnership || 0} %</strong></p>
            <p>📉 股权被稀释比例：<strong>{dilution || 0} %</strong></p>
            <p>💰 当前股权价值：<strong>{equityValue || 0} 万元</strong></p>
          </ResultBox>
        </div>
      </details>

      {/* 折叠模块 2 */}
      <details style={accordionStyle}>
        <summary style={summaryStyle}>📈 股权增值计算器</summary>
        <div style={panelStyle}>
          <Input label="投资时企业估值（万元）" value={initialValuation} onChange={setInitialValuation} />
          <Input label="当前企业估值（万元）" value={currentValuation} onChange={setCurrentValuation} />
          <Input label="初始持股比例（%）" value={initialHoldPct} onChange={setInitialHoldPct} />

          <ResultBox>
            <p>📉 当前持股比例（自动带入）：<strong>{newOwnership || 0} %</strong></p>
            <p>💼 初始股权价值：<strong>{initialValue || 0} 万元</strong></p>
            <p>📊 当前股权价值：<strong>{currentValue || 0} 万元</strong></p>
            <p>💹 股权增值金额：<strong>{gainAmount || 0} 万元</strong></p>
            <p>📈 股权增值比例：<strong>{isNaN(gainPct) ? 0 : gainPct} %</strong></p>
          </ResultBox>
        </div>
      </details>
    </div>
  );
}

// 可复用组件：输入框
function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label>{label}</label><br />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}

// 可复用组件：结果展示框
function ResultBox({ children }) {
  return (
    <div style={{
      background: '#f1f5f9',
      padding: '16px',
      borderRadius: '10px',
      lineHeight: '1.6',
    }}>
      {children}
    </div>
  );
}

// 样式
const accordionStyle = {
  marginBottom: '24px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
};

const summaryStyle = {
  background: '#e2e8f0',
  padding: '12px 16px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
};

const panelStyle = {
  padding: '16px',
  background: '#ffffff',
};
