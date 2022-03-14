import { useEffect, useState } from "react";
import { Table, Radio, Divider, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;

export const Admin = () => {
  let [data, setData] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");

  //   const [selectionType, setSelectionType] = useState("checkbox");

  //   const rowSelection = {
  //     onChange: (selectedRowKeys, selectedRows) => {
  //       console.log(
  //         `selectedRowKeys: ${selectedRowKeys}`,
  //         "selectedRows: ",
  //         selectedRows
  //       );
  //     },
  //     getCheckboxProps: (record) => ({
  //       disabled: record.name === "Disabled User", // Column configuration not to be checked
  //       name: record.name,
  //     }),
  //   };

  useEffect(() => {
    getData();
  }, []);

  //got the data fron the server
  const head = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) =>
        data.length >= 1 ? (
          <div title="Sure to delete?" onClick={() => handleDelete(record.id)}>
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </div>
        ) : null,
    },
  ];

  const getData = () => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((d) => d.json())
      .then((res) => {
        setData(res);
      });
  };

  const searchRes = (value) => {
    if (value) {
      const searchData = data;
      setData(
        searchData.filter(
          (ele) =>
            ele.name.toLowerCase().includes(value) ||
            ele.role === value ||
            ele.email === value
        )
      );
    } else {
      getData();
    }
  };
  const handleDelete = (id) => {
    const dataSource = data;
    setData(dataSource.filter((item) => item.id !== id));
  };

  return (
    <div>
      <Search
        style={{ width: "80%", padding: "30px" }}
        onSearch={searchRes}
        placeholder="Search By Name,Mail or Role"
        enterButton
        allowClear
      />

      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      >
        <Radio value="checkbox">Checkbox</Radio>
        <Radio value="radio">radio</Radio>
      </Radio.Group>

      <Divider />

      <Table
        style={{ width: "80%", marginLeft: "10%" }}
        rowSelection={{
          type: "checkbox",
          onSelect: (record) => {
            console.log(record);
          },
        }}
        columns={head}
        dataSource={data}
      />
    </div>
  );
};
