// Array to store patients' data
const patients = [];

// Register Patient
app.post('/register-patient', (req, res) => {
    const { name, age, contact } = req.body;
    const patient = { name, age, contact };
    patients.push(patient);
    res.status(201).json({ message: 'Patient registered successfully' });
});

// View All Patients (Admin only)
app.get('/patients', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin
        if (decoded.role === 'admin') {
            return res.json(patients); // Send list of patients
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});
