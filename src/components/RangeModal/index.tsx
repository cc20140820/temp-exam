import React, { useState } from "react";
import { InputNumber, Modal, Table, Button } from "antd";
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
    { id: "first", minWeight: 0, maxWeight: undefined, price: 0 },
    { id: "last", minWeight: undefined, maxWeight: 9999, price: 0 },
  ]);

  const handleOk = () => {
    console.log("final:", list);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const columns = [
    {
      title: "重量区间(kg)",
      dataIndex: "id",
      key: "id",
      width: "45%",
      render: (text: any, record: any) => {
        return (
          <div className="weight-row">
            <div className="prefix">
              {record.minWeight} {"< 重量 <="}
            </div>
            <InputNumber
              value={record.maxWeight}
              disabled={record.id === "last"}
            />
          </div>
        );
      },
    },
    {
      title: "价格(Yuan)",
      dataIndex: "price",
      key: "price",
      width: "35%",
      render: (text: any) => {
        return <InputNumber />;
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text: any, record: any) => {
        if (["first", "last"].includes(record.id)) return null;
        return <Button type="link">删除</Button>;
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
        columns={columns}
        dataSource={list}
        pagination={false}
        footer={() => <Button block>新增</Button>}
      />
    </Modal>
  );
}

export { RangeModal };
