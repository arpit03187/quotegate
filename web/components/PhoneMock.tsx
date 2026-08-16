export default function PhoneMock() {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-bar">
        <span />
      </div>
      <div className="phone-card">
        <div className="kind">Quote · HVAC</div>
        <h3>A. Rivera</h3>
        <div className="addr">14 Palm Dr, Phoenix</div>
        <div className="price">$4,540</div>
        <div className="phone-lines">
          <div>
            <span>2-ton condenser replacement</span>
            <span>$4,200</span>
          </div>
          <div>
            <span>Wi-Fi thermostat</span>
            <span>$340</span>
          </div>
        </div>
        <div className="swipe">Approve & send</div>
      </div>
    </div>
  );
}
