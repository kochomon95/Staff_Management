import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

function StaffCrud() {
  const [searchID, setSearchID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchGender, setSearchGender] = useState("");
  const [staffID, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState("");
  const [staff, setStaff] = useState([]);
  const [originalStaff, setOriginalStaff] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    (async () => await Load())();
  }, []);

  function formatDate(birthday) {
    const date = new Date(birthday);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  function formatGender(gender) {
    if (gender === 1) return "Male";
    if (gender === 2) return "Female";
    return "Other";
  }

  async function Load() {
    try {
      const result = await axios.get("https://localhost:7061/api/Staff/GetStaffData");
      setStaff(result.data);
      setOriginalStaff(result.data);
    } catch (err) {
      console.error("Error loading staff data:", err);
    }
  }

  async function search() {
    let filtered = originalStaff;

    if (searchID) {
      const idToSearch = parseInt(searchID);
      filtered = filtered.filter(staff => parseInt(staff.staffID) === idToSearch);
    }
    if (searchGender) {
      filtered = filtered.filter(staff => staff.gender === parseInt(searchGender));
    }
    if (startDate && endDate) {
      filtered = filtered.filter(staff => {
        const staffBirthday = new Date(staff.birthday);
        return staffBirthday >= startDate && staffBirthday <= endDate;
      });
    }
    setStaff(filtered);
  }

  function clearSearch() {
    setSearchID("");
    setSearchGender("");
    setStartDate(null);
    setEndDate(null);
    setStaff(originalStaff);
  }

  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
    table: {
      display: 'flex',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      borderCollapse: 'collapse',
      marginBottom: 10,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    cell: {
      flex: 1,
      padding: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      textAlign: 'center',
    },
    columnHeader: {
      fontWeight: 'bold',
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Staff Data</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.columnHeader}>Staff Id</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.columnHeader}>Staff Full Name</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.columnHeader}>Staff Birthday</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.columnHeader}>Staff Gender</Text>
              </View>
            </View>
            {staff.map(staff => (
              <View style={styles.row} key={staff.staffID}>
                <View style={styles.cell}>
                  <Text>{staff.staffID}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{staff.fullName}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{formatDate(staff.birthday)}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{formatGender(staff.gender)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  function toggleSearch() {
    setShowSearch(!showSearch);
  }

  async function save(event) {
    event.preventDefault();
    try {
      let nextStaffID = '00000001';
      if (staff.length > 0) {
        const maxStaffID = Math.max(...staff.map(staff => parseInt(staff.staffID, 10)));
        nextStaffID = maxStaffID + 1;
      }
      const formattedStaffID = nextStaffID.toString().padStart(8, '0');
      const formattedBirthday = formatDate(birthday);

      const data = {
        staffID: formattedStaffID,
        fullName: fullName,
        birthday: formattedBirthday,
        gender: parseInt(gender),
      };

      const response = await axios.post("https://localhost:7061/api/Staff/AddStaffData", data);

      if (response.status === 200) {
        alert("Staff Registration Successful");
        setId("");
        setFullName("");
        setBirthday(null);
        setGender("");
        Load();
      } else {
        console.error("Failed to register staff:", response.statusText);
        alert("Failed to register staff. Please try again later.");
      }
    } catch (err) {
      console.error("Error registering staff:", err);
      alert("Failed to register staff. Please try again later.");
    }
  }

  async function editStaff(staff) {
    setFullName(staff.fullName);
    setBirthday(new Date(staff.birthday));
    setGender(staff.gender.toString());
    setId(staff.staffID);
  }

  async function DeleteStaff(staffID) {
    try {
      await axios.delete(`https://localhost:7061/api/Staff/DeleteStaffData/${staffID}`);
      alert("Staff deleted Successfully");
      setId("");
      setFullName("");
      setBirthday(null);
      setGender("");
      Load();
    } catch (err) {
      alert(err);
    }
  }

  async function update(event) {
    event.preventDefault();
    try {
      const formattedBirthday = formatDate(birthday);
      const staffIDToUpdate = staff.find((u) => u.staffID === staffID)?.staffID || staffID;
      await axios.patch(`https://localhost:7061/api/Staff/UpdateStaffData/${staffIDToUpdate}`, {
        staffID: staffID,
        fullName: fullName,
        birthday: formattedBirthday,
        gender: parseInt(gender),
      });
      alert("Registration Updated");
      setId("");
      setFullName("");
      setBirthday(null);
      setGender("");
      Load();
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div>
      <div className="container mt-4">
        <h1>Staff Data</h1>
        <form>
          <div className="form-group">
            <label htmlFor="fullName">Staff Name</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthday">Birthday</label>
            <br />
            <DatePicker
              selected={birthday}
              onChange={(date) => setBirthday(date)}
              dateFormat="MM/dd/yyyy"
              className="form-control"
              id="birthday"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              className="form-control"
              id="gender"
              value={gender}
              onChange={(event) => {
                setGender(event.target.value);
              }}
            >
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary mt-4" onClick={save}>Register</button>
            <button className="btn btn-warning mt-4" onClick={update}>Update</button>
          </div>
        </form>
      </div>
      <br />
      <div className="container mt-4">
        <button className="btn btn-primary mb-2" onClick={toggleSearch}>
          {showSearch ? "Hide Search" : "Show Search"}
        </button>
        {showSearch && (
          <div className="form-group-row">
            <div className="search-fields">
              <label htmlFor="searchID">Search by ID:</label>
              <input
                type="text"
                className="form-control"
                id="searchID"
                value={searchID}
                onChange={(event) => setSearchID(event.target.value)}
              />
              <label htmlFor="searchGender">Search by Gender:</label>
              <select
                className="form-control"
                id="searchGender"
                value={searchGender}
                onChange={(event) => setSearchGender(event.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
              <label>Search by Birthday (From - To):</label>
              <div className="date-pickers">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MM/dd/yyyy"
                  className="form-control mr-2"
                  placeholderText="From Date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="MM/dd/yyyy"
                  className="form-control"
                  placeholderText="To Date"
                />
              </div>
            </div>
            <div className="buttons">
              <button className="btn btn-primary" onClick={search}>Search</button>
              <button className="btn btn-danger" onClick={clearSearch}>Clear</button>
            </div>
          </div>
        )}
      </div>
      <div className="container mt-4">
        <h5>Total Staff Count: {staff.length}</h5>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Staff Id</th>
            <th scope="col">Staff Full Name</th>
            <th scope="col">Staff Birthday</th>
            <th scope="col">Staff Gender</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(function fn(staff) {
            return (
              <tr key={staff.staffID}>
                <td>{staff.staffID}</td>
                <td>{staff.fullName}</td>
                <td>{formatDate(staff.birthday)}</td>
                <td>{formatGender(staff.gender)}</td>
                <td>
                  <button type="button" className="btn btn-warning" onClick={() => editStaff(staff)}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => DeleteStaff(staff.staffID)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="buttons">
        <PDFDownloadLink
          document={<MyDocument />}
          fileName="staff_data.pdf"
          className="btn btn-primary"
        >
          Export PDF
        </PDFDownloadLink>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '90%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderCollapse: 'collapse',
    marginBottom: 10,
  },
  row: {
    display: 'table-row',
  },
  cell: {
    display: 'table-cell',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
});

export default StaffCrud;
