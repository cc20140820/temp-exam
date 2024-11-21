import React, { useState } from "react";
import { InputNumber, Modal, Table, Button, message } from "antd";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

interface IProps {
  visible: boolean;
  onClose: () => void;
}

function RangeModal(props: IProps) {
  const { visible, onClose } = props;
  const [list, updateList] = useImmer([
    { id: "first", minWeight: 0, maxWeight: 1, price: 0 },
    { id: "last", minWeight: 888, maxWeight: 9999, price: 0 },
  ]);

  const handleOk = () => {
    // console.log("final:", list);
    message.info(JSON.stringify(list));
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // 编辑结束重量
  const handleMaxWeightChange = (id: string, value: number | null) => {
    if (value === null) return;
    updateList((draft) => {
      const currentIndex = draft.findIndex((item) => item.id === id);
      if (currentIndex === -1) return;

      const current = draft[currentIndex];
      const next = draft[currentIndex + 1];

      // 结束重量不能小于起始重量，且不能大于下一行的结束重量
      if (value <= current.minWeight || (next && value >= next.maxWeight)) {
        return;
      }

      current.maxWeight = value;
      if (next) {
        next.minWeight = value;
      }
    });
  };

  // 新增行
  const handleAddRow = () => {
    updateList((draft) => {
      const secondLastIndex = draft.length - 2;
      const secondLast = draft[secondLastIndex];
      const last = draft[secondLastIndex + 1];

      console.log("xxx", last.maxWeight, secondLast.maxWeight);

      // 倒数第二行的结束重量与倒数第一行的结束重量差值仅为 1，则无法插入新行
      if ((last.maxWeight || 0) - (secondLast.maxWeight || 0) <= 1) {
        return;
      }

      const newRow: any = {
        id: uuidv4(),
        minWeight: secondLast.maxWeight,
        maxWeight: last.minWeight,
        price: 0,
      };
      draft.splice(secondLastIndex + 1, 0, newRow);
    });
  };

  // 删除行
  const handleDeleteRow = (id: string) => {
    updateList((draft) => {
      const currentIndex = draft.findIndex((item) => item.id === id);
      if (
        currentIndex === -1 ||
        currentIndex === 0 ||
        currentIndex === draft.length - 1
      )
        return;

      // 保证区间连续
      const prev = draft[currentIndex - 1];
      const next = draft[currentIndex + 1];
      if (prev && next) {
        next.minWeight = prev.maxWeight;
      }
      draft.splice(currentIndex, 1);
    });
  };

  console.log("final:", list);

  const columns = [
    {
      title: "重量区间(kg)",
      dataIndex: "id",
      width: "45%",
      render: (text: any, record: any) => {
        return (
          <div className="weight-row">
            <div className="prefix">
              {record.minWeight} {"< 重量 <="}
            </div>
            <InputNumber
              max={9999}
              value={record.maxWeight}
              disabled={record.id === "last"}
              onChange={(value) => handleMaxWeightChange(record.id, value)}
            />
          </div>
        );
      },
    },
    {
      title: "价格(Yuan)",
      dataIndex: "price",
      width: "35%",
      render: (text: any, record: any) => {
        return (
          <InputNumber
            value={record.price}
            onChange={(value) => {
              updateList((draft) => {
                const current = draft.find((item) => item.id === record.id);
                if (current) current.price = value ?? 0;
              });
            }}
          />
        );
      },
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => {
        if (["first", "last"].includes(record.id)) return null;
        return (
          <Button type="link" onClick={() => handleDeleteRow(record.id)}>
            删除
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title="新增价格配置"
      width={900}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Table
        rowKey={"id"}
        columns={columns}
        dataSource={list}
        pagination={false}
        footer={() => (
          <Button block onClick={handleAddRow}>
            新增
          </Button>
        )}
      />
    </Modal>
  );
}

export { RangeModal };
