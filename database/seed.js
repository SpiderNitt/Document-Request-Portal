const database = require('./database')




async function create_entries() {
    await database.test_conn();
    await database.CertificateType.create({ name: 'Bonafide', created_by: '106117063' });
    await database.CertificateType.create({ name: "Transcript", created_by: '106117063' });
    await database.CertificateType.create({ name: 'Course De-Registration', created_by: '106117063' })
    await database.CertificateType.create({ name: 'Course Re-registration', created_by: '106117063' })
    await database.CertificateType.create({ name: 'Rank Card', created_by: '106117063' })
    await database.CertificateType.create({ name: 'Grade Card', created_by: '106117063' })
    console.log("Types added successfully")

};

create_entries();


