import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";

interface TimePickerProps {
  onChange: (selectedTime: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  onChange,
  isOpen,
  onClose,
}) => {
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const [warningMsg, setWarningMsg] = useState(false);

  const hours: string[] = Array.from({ length: 24 }, (_, index) =>
    index.toString().padStart(2, "0")
  );
  const minutes: string[] = Array.from({ length: 60 }, (_, index) =>
    index.toString().padStart(2, "0")
  );

  const handleHourChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(event.target.value);

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    // Update the endTime state only if the selected time is not before the current time
    if (`${event.target.value}:${selectedMinute}` >= currentTime) {
      setWarningMsg(false);
    } else {
      // You can optionally provide feedback to the user (e.g., show an error message)
      setWarningMsg(true);
    }
  };

  const handleMinuteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(event.target.value);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    // Update the endTime state only if the selected time is not before the current time
    if (`${selectedHour}:${event.target.value}` >= currentTime) {
      setWarningMsg(false);
    } else {
      // You can optionally provide feedback to the user (e.g., show an error message)
      setWarningMsg(true);
    }
  };

  const handleConfirm = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    // Update the endTime state only if the selected time is not before the current time
    if (`${selectedHour}:${selectedMinute}` >= currentTime) {
      onChange(`${selectedHour}:${selectedMinute}`);
      onClose();
    } else {
      // You can optionally provide feedback to the user (e.g., show an error message)
      Swal.fire({
        text: "마감 시간은 현재 시간 이후의 시간만 선택 가능합니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded max-w-md w-full text-center border-2 border-gray-300">
          <p className="font-bold text-lg">시간 설정</p>
          <div>
            <select
              className="text-black bg-white focus:outline-none text-2xl mx-2 mt-2 mb-4 appearance-none cursor-pointer"
              value={selectedHour}
              onChange={handleHourChange}
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="text-black bg-white focus:outline-none text-2xl my-2">
              :
            </span>
            <select
              className="text-black bg-white focus:outline-none text-2xl mx-2 mt-2 mb-4 appearance-none cursor-pointer"
              value={selectedMinute}
              onChange={handleMinuteChange}
            >
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
          {warningMsg ? (
            <p className="text-red-600 text-md leading-4 pb-4 justify-items-center justify-center text-center">
              마감 시간은 현재 시간 이후의 시간만 선택 가능합니다.
            </p>
          ) : (
            <p className="hidden text-red-600 text-md leading-4 pb-4 justify-items-center justify-center text-center">
              마감 시간은 현재 시간 이후의 시간만 선택 가능합니다.
            </p>
          )}
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

export default TimePicker;
