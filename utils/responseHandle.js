const response_messages = {
  DEFAULT_400: "Bad Request",
  UPLOAD_ONLY_REQUIRED: "Upload only required number of files",
  FILE_NOT_FOUND: "Upload both the files",
  SINGLE_FILE_NOT_FOUND: "Please upload a file",
  VALIDATION_ERROR: "Only PDF and DOC/DOCX files are allowed",
  REQUIRED_FIELD: "Fill all required fields",
  INVALID_MAILID: "Provide valid NITT mail ids. (ends with @nitt.edu)",
  INVALID_DATA: "One or more fields are invalid.",
  ID: "ID required",
  CERTIFICATE_TYPE_EXIST: "Document type already exists.",

  DEFAULT_401: "Unauthorized",
  INVALID_CREDENTIALS: "Invalid username/password Combination",
  EMAIL_NULL: "There is no from specified for the email. Contact applicant",

  DEFAULT_403: "Forbidden",
  ACCESS_DENIED: "You do not have rights to this resource",
  CANNOT_APPROVE_DECLINE:
    "Admin before you have declined (or) Admin after you have approved.",

  DEFAULT_500: "Some problem with the server. Try again later",
  FILE_UPLOAD: "Error in uploading file.Try again later.",
  FILE_DECLINE: "There was some error declining the file. Try again later",
  POSTAL_STATUS_UPLOAD:
    "There was some error uploading the message. Try again later",
  MAIL_NOT_SENT: "Unable to send mail. Try again later",
  UPSTREAM_FAILURE:
    "The webmail servers are not working. Please try again later",

  CERTIFICATE_REQUEST: "Document requested successfully",
  CREATE_CERTIFICATE: "Document created successfully",
  CERTIFICATE_APPROVE: "Document approved successfully",
  CERTIFICATE_DECLINE: "Document declined successfully",
  POSTAL_STATUS_UPDATE: "Postal status updated successfully",
  MAIL_SENT: "Mail sent successfully",

  EMAIL_ALREADY_REGISTERED: "Email already registered. Try logging in.",
  ROLLNO_ALREADY_REGISTERED: "Roll No already registered. Try logging in.",
  ALUMNI_REGISTERED: "Registered successfully, OTP sent to registered mail.",
  ALUMNI_EMAIL_NOT_EXIST: "Email does not exist. Register first.",
  OTP_SENT: "OTP sent to registered mail.",
  INVALID_OTP: "Invalid OTP",
  OTP_RETRY_1: "OTP can be resent only after ",
  OTP_RETRY_2: " seconds",
  FILE_SIZE_EXCESS:"File size must be less than 50kb",
};

module.exports = response_messages;
