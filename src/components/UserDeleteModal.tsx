import { useState } from "react";

const PasswordPromptModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded max-w-md w-full text-center">
          <p className="mb-4">
            본인 확인을 위한 비밀번호를 입력해주세요.
            <br />
            확인 버튼을 눌러주시면 탈퇴 절차가 완료됩니다.
          </p>
          <label className="block mb-2">
            비밀번호:
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
          </label>
          <div>
            <button
              onClick={handleConfirm}
              className="bg-main-color text-white px-4 py-2 mr-2 rounded"
            >
              확인
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default PasswordPromptModal;
