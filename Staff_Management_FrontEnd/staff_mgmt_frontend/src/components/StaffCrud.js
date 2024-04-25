import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CSVLink } from 'react-csv';

function StaffCrud(){
  const [searchID, setSearchID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchGender, setSearchGender] = useState("");
  const [staffID, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [pdfGenerated, setPdfGenerated] = useState(false); 

  useEffect(() => {
    (async () => await Load())();
  }, []);

  function exportToPDF() {
    const doc = (
      <Document>
        <Page size="A4">
        <View>
          <Text style={styles.header}>Staff Data</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cell}>Staff ID</Text>
              <Text style={styles.cell}>Name</Text>
              <Text style={styles.cell}>Birthday</Text>
              <Text style={styles.cell}>Gender</Text>
            </View>
            {staff.map(staff => (
              <View key={staff.staffID} style={styles.row}>
                <Text style={styles.cell}>{staff.staffID}</Text>
                <Text style={styles.cell}>{staff.fullName}</Text>
                <Text style={styles.cell}>{formatDate(staff.birthday)}</Text>
                <Text style={styles.cell}>{formatGender(staff.gender)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
    return (
      <PDFDownloadLink document={doc} fileName="staff_data.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Export to PDF'
        }
      </PDFDownloadLink>
    );
  }

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
    } catch (err) {
      console.error("Error loading staff data:", err);
    }
  }

  async function search() {
    // Filter staff based on search criteria
    let filtered = staff;
  
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
    // Reset search criteria and results
    setSearchID("");
    setSearchGender("");
    setStartDate(null);
    setEndDate(null);
    setFilteredStaff([]);
    Load();
  }

  async function save(event) {
    event.preventDefault();
    try {
      // Calculate the autoincrement staffID to default 
      let nextStaffID = '00000001'; 
      // If there are existing staff, find the maximum staffID and increment it by 1
      if (staff.length > 0) {
        // If there are existing staff, find the maximum staffID and increment it by 1
        const maxStaffID = Math.max(...staff.map(staff => parseInt(staff.staffID, 10)));
        nextStaffID = maxStaffID + 1;
      }
      // Format the next staffID to ensure it has leading zeros and is 8 digits long
      const formattedStaffID = nextStaffID.toString().padStart(8, '0');
      // Format the Birthday to date format
      const date = new Date(birthday);
      const formattedBirthday = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const data = {
          staffID: formattedStaffID,
          fullName: fullName,
          birthday: formattedBirthday,
          gender: gender
        };
  
        const response = await axios.post("https://localhost:7061/api/Staff/AddStaffData", data);
  
        if (response.status === 200) {
          alert("Staff Registration Successful");
          setId("");
          setFullName("");
          setBirthday("");
          setGender("");
          Load(); // Assuming this function reloads or refreshes data
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
      setBirthday(staff.birthday);
      setGender(staff.gender);
      setId(staff.staffID);
    }
     
    async function DeleteStaff(staffID) {
      try {
        await axios.delete(`https://localhost:7061/api/Staff/DeleteStaffData/${staffID}`);
        alert("Staff deleted Successfully");
        setId("");
        setFullName("");
        setBirthday("");
        setGender("");
        Load();
      } catch (err) {
        alert(err);
      }
    }
    
    async function update(event) {
      event.preventDefault();
      try {
    
        const staffIDToUpdate = staff.find((u) => u.staffID === staffID)?.staffID || staffID;
        await axios.patch(`https://localhost:7061/api/Staff/UpdateStaffData/${staffIDToUpdate}`,  {
            staffID: staffID,
            fullName: fullName,
            birthday: birthday,
            gender: gender,
            }
          );
          alert("Registation Updated");
          setId("");
          setFullName("");
          setBirthday("");
          setGender("");
          Load();
        } catch (err) {
          alert(err);
        }
    }
    const exportToCSV = () => {
      // Extracting only necessary fields for export
      const csvData = filteredStaff.map(staff => ({
        staffID: staff.staffID,
        fullName: staff.fullName,
        birthday: formatDate(staff.birthday),
        gender: formatGender(staff.gender)
      }));
  
      return (
        <CSVLink
          data={csvData}
          filename={"staff_data.csv"}
          className="btn btn-success"
          target="_blank"
        >
          Export to CSV
        </CSVLink>
      );
    };
    return (
      <div>
        <div class="container mt-4">
          <h1>Staff Data</h1> 
          <form>
            <div class="form-group">
              <label for="fullName">Staff Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(event) => {
                        setFullName(event.target.value);
                    }}
                />
            </div>
            <div class="form-group">
                <label for="birthday">Birthday</label>
                <br/>
                <DatePicker
                    selected={birthday}
                    onChange={(date) => setBirthday(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    id="birthday"
                />
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select
                    class="form-control"
                    id="gender"
                    value={gender}
                    onChange={(event) => {
                        setGender(event.target.value);
                    }}
                >
                    <option value="0">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                </select>
            </div>
            <div>
                <button class="btn btn-primary mt-4" onClick={save}>Register</button>
                <button class="btn btn-warning mt-4" onClick={update}>Update</button>
            </div>
          </form>
        </div>
      <br/>
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
    <table class="table table-dark table-striped">
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
                  <button type="button" class="btn btn-warning" onClick={() => editStaff(staff)}>Edit</button>
                  <button type="button" class="btn btn-danger" onClick={() => DeleteStaff(staff.staffID)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br/>
      {staff.length > 0 ? (
      exportToPDF()
        ) : (
          <p>No data available for PDF export</p>
        )}
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
    width: '100%',
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