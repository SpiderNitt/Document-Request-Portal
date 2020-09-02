const database = require('./database')




async function create_entries() {
    await database.test_conn();
    await database.CertificateType.create({ name: 'Bonafide' });
    await database.CertificateType.create({ name: "Transcript" });
    console.log("Types added successfully")

};

create_entries();


