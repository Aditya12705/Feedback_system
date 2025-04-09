function renderFacultyPanels(faculties) {
    return faculties.map(faculty => (
        <div key={faculty.id} className="faculty-panel">
            <h3>{faculty.name}</h3>
            {faculty.isElective ? (
                <div className="elective-container">
                    <label>Select Elective Faculty:</label>
                    <select>
                        <option value="">Select Faculty</option>
                        <option value={faculty.name}>{faculty.name}</option>
                    </select>
                </div>
            ) : (
                <div className="non-elective-container">
                    <p>Non-Elective Faculty</p>
                </div>
            )}
        </div>
    ));
}

// Example usage
const faculties = [
    { id: 1, name: "Dr. Raksha", isElective: true },
    { id: 2, name: "Dr. Shreya", isElective: true },
    { id: 3, name: "Dr. Mishbah Hasan", isElective: true },
    { id: 4, name: "Dr. John Doe", isElective: false },
];

function FacultyDropdown() {
    return (
        <div>
            {renderFacultyPanels(faculties)}
        </div>
    );
}

export default FacultyDropdown;
