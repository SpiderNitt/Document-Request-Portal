const response_messages = {
    'DEFAULT_400':'Bad Request',
    'FILE_NOT_FOUND':'Upload both the files',
    'SINGLE_FILE_NOT_FOUND': 'Please upload a file',
    'VALIDATION_ERROR':'Only PDF and DOC/DOCX files are allowed',
    'REQUIRED_FIELD':'Fill all required fields',
    'INVALID_MAILID':'Provide valid NITT mail ids. (ends with @nitt.edu)',
    'INVALID_DATA':'One or more fields are invalid.',
    'ID':'ID required',
    'CERTIFICATE_TYPE_EXIST':'Document type already exists.',

    'DEFAULT_401':'Unauthorized',
    'INVALID_CREDENTIALS':'Invalid username/password Combination',

    'DEFAULT_403':'Forbidden',
    'ACCESS_DENIED':'You do not have rights to this resource',

    'DEFAULT_500':'Server error. Try again later',
    'FILE_UPLOAD':'Error in uploading file.Try again later.',
    'FILE_DECLINE':'There was some error declining the file. Try again later',
    'POSTAL_STATUS_UPLOAD':'There was some error uploading the message. Try again later',
    'MAIL_NOT_SENT':'Unable to send mail. Try again later', 
    
    'CERTIFICATE_REQUEST':'Document requested successfully',
    'CREATE_CERTIFICATE':'Document created successfully',
    'CERTIFICATE_APPROVE':'Document approved successfully',
    'CERTIFICATE_DECLINE':'Document declined successfully',
    'POSTAL_STATUS_UPDATE':'Postal status updated successfully',
    'MAIL_SENT':'Mail sent successfully',
}


module.exports = response_messages