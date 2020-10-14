require('dotenv').config({ path: '../env/.env' })


const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    define: {
        freezeTableName: true
    },
    host: process.env.DB_HOST,
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    logging: process.env.ENV === 'DEV' ? console.log : false
});


const CertificateType = sequelize.define('certificate_types', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        freezeTableName: true

    });

const Certificate = sequelize.define('certificates', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.INTEGER,
        references: {
            model: 'certificate_types',
            key: 'id'
        }
    },
    applier_roll: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_address : {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_status:{
        type: DataTypes.STRING,
        allowNull: true
    },
    postal_status:{
        type: DataTypes.STRING,
        allowNull: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true
    },
    receipt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact : {
        type: DataTypes.STRING,
        allowNull: false
    },
    purpose: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    id_file : {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_code :{
        type: DataTypes.STRING,
        allowNull: true
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    no_copies : {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true
});


const History = sequelize.define('history', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    certificate_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'certificates',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const CertificatePaths = sequelize.define('certificate_paths', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    certificate_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'certificates',
            key: 'id'
        }
    },
    path_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    path_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(['PENDING', 'APPROVED', 'DECLINED']),
        allowNull: false
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
})



async function test_conn() {

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
}


 //Certificate.hasMany(CertificateType, { foreignKey: 'id' })
 //History.hasMany(Certificate, {foreignKey: 'id'})
 //CertificatePaths.hasMany(Certificate, {foreignKey: 'id'})

// test_conn();
module.exports = {
    Certificate, History, CertificatePaths, CertificateType, test_conn
}