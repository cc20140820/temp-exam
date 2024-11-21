import React, { useState } from "react";
import { Button } from "antd";
import { RangeModal } from "./components/RangeModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <RangeModal visible={true || isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
