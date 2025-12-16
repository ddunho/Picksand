import DaumPostcode from "react-daum-postcode";

function AddressSearchModal({ onClose, onComplete }) {
    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
                <div className="custom-modal-header">
                    <span>주소 검색</span>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <DaumPostcode
                    onComplete={onComplete}
                    autoClose={false}
                    style={{ width: "100%", height: "420px" }}
                />
            </div>
        </div>
    );
}

export default AddressSearchModal;
