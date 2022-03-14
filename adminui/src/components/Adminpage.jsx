import { useEffect, useState } from "react";

export const Admin = () => {
  let [data, setData] = useState([]);
  let [page, setPage] = useState(1);
  const [users, setusers] = useState([]);
  const [search, setSearch] = useState("");
  const [totalres, setTotalres] = useState();
  const [userid, setUserid] = useState(null);

  useEffect(() => {
    getData();
  }, [page]);

  const getData = () => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((d) => d.json())
      .then((res) => {
        setData(res);
        paginate(page, res);
        setTotalres(res.length);
      });
  };

  const paginate = (value, users) => {
    let arr = [];
    value = Math.abs(Number(value - 1 + "1"));
    for (let i = value - 1; i < value - 1 + 10; i++) {
      arr.push(users[i]);
    }
    arr = arr.filter((e) => e.id !== userid);
    setusers(arr);
  };

  const Deleteuser = (id) => {
    setUserid(id);
    getData();
  };

  if (users.length === 0) {
    return <h1>Loading...........</h1>;
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchbtn = () => {
    let dat = data;
    dat = dat.filter(
      (ele) =>
        ele.role === search ||
        ele.name.toLowerCase().includes(search) ||
        ele.email === search
    );
    setData(dat);
    setusers(dat);
    setTotalres(dat.length);
    paginate(page, dat);
    setSearch(() => "");
  };

  let pagination = [];
  for (let i = 1; i < totalres / 10; i++) {
    pagination.push(i);
  }
  //console.log(data);
  return (
    <>
      {
        <div>
          <input
            style={{ width: "75%", height: "30px" }}
            type="text"
            value={search}
            placeholder="search by name, email or role"
            onChange={(val) => {
              handleSearch(val);
            }}
          />
          <button
            style={{ height: "34px" }}
            onClick={() => {
              handleSearchbtn();
            }}
          >
            search
          </button>
        </div>
      }
      {
        <div
          style={{
            margin: "20px",
            paddingLeft: "40px",
            width: "85%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <input type="checkbox" />
          <strong>Name</strong>
          <strong>Email</strong>
          <strong>Role</strong>
          <strong>Action</strong>
        </div>
      }
      {users.map((e) => (
        <div key={e.id}>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <input type="checkbox" />
            {/* <p>{e.id}</p> */}
            <p>{e.name}</p>
            <p>{e.email}</p>
            <p>{e.role}</p>
            <button
              onClick={() => Deleteuser(e.id)}
              style={{ cursor: "pointer", width: "60px", height: "35px" }}
            >
              Delete
            </button>
          </div>
          <hr style={{ width: "70%" }} />
        </div>
      ))}
      {
        <button
          disabled={page === 1}
          onClick={() => {
            {
              let prev = page;
              setPage(prev - 1);
            }
          }}
        >
          {"<"}
        </button>
      }
      {pagination.map((ele, i) => (
        <button
          onClick={() => {
            setPage(ele);
          }}
          key={i}
        >
          {ele}
        </button>
      ))}
      {
        <button
          disabled={page === totalres / 10}
          onClick={() => {
            let inc = page;
            setPage(inc + 1);
          }}
        >
          {">"}
        </button>
      }
    </>
  );
};
